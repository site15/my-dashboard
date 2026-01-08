/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormlyFieldConfig } from '@ngx-formly/core';
import { concatMap, of, tap } from 'rxjs';
import { z } from 'zod';

import {
  addGlobalChartConfigs,
  globalChartConfigs,
  linkCurrencyFunctionsToWindow,
} from './currency-widget.utils';
import { WINDOW } from '../../app/utils/window';
import {
  WidgetRender,
  WidgetRenderInitFunctionOptions,
  WidgetRenderRenderFunctionOptions,
  WidgetRenderType,
} from '../types/WidgetSchema';
import {
  fetchMultipleCurrencyData,
  mapYahooPeriod,
  mapYahooInterval,
  ProcessedChartData,
} from '../services/yahoo-finance-api';

// =============================================================================
// DATA STRUCTURES AND SCHEMAS
// =============================================================================

// Available currency pairs for selection
export const AVAILABLE_CURRENCY_PAIRS = [
  // Cryptocurrency pairs
  { symbol: 'BTC/USD', name: 'Bitcoin to US Dollar', type: 'crypto' as const },
  { symbol: 'ETH/USD', name: 'Ethereum to US Dollar', type: 'crypto' as const },
  {
    symbol: 'BNB/USD',
    name: 'Binance Coin to US Dollar',
    type: 'crypto' as const,
  },
  { symbol: 'ADA/USD', name: 'Cardano to US Dollar', type: 'crypto' as const },
  { symbol: 'SOL/USD', name: 'Solana to US Dollar', type: 'crypto' as const },
  { symbol: 'XRP/USD', name: 'Ripple to US Dollar', type: 'crypto' as const },
  { symbol: 'DOT/USD', name: 'Polkadot to US Dollar', type: 'crypto' as const },
  {
    symbol: 'DOGE/USD',
    name: 'Dogecoin to US Dollar',
    type: 'crypto' as const,
  },
  {
    symbol: 'AVAX/USD',
    name: 'Avalanche to US Dollar',
    type: 'crypto' as const,
  },
  {
    symbol: 'MATIC/USD',
    name: 'Polygon to US Dollar',
    type: 'crypto' as const,
  },

  // Forex pairs
  { symbol: 'EUR/USD', name: 'Euro to US Dollar', type: 'forex' as const },
  {
    symbol: 'GBP/USD',
    name: 'British Pound to US Dollar',
    type: 'forex' as const,
  },
  {
    symbol: 'USD/JPY',
    name: 'US Dollar to Japanese Yen',
    type: 'forex' as const,
  },
  {
    symbol: 'USD/CAD',
    name: 'US Dollar to Canadian Dollar',
    type: 'forex' as const,
  },
  {
    symbol: 'AUD/USD',
    name: 'Australian Dollar to US Dollar',
    type: 'forex' as const,
  },
  {
    symbol: 'USD/CHF',
    name: 'US Dollar to Swiss Franc',
    type: 'forex' as const,
  },
  {
    symbol: 'NZD/USD',
    name: 'New Zealand Dollar to US Dollar',
    type: 'forex' as const,
  },
  {
    symbol: 'USD/SGD',
    name: 'US Dollar to Singapore Dollar',
    type: 'forex' as const,
  },
];

// Individual currency pair configuration
export const CurrencyPairSchema = z.object({
  displayName: z.string().optional(), // Custom display name
  symbol: z.string(),
});

// Main widget configuration schema
export const CurrencyWidgetSchema = z.object({
  type: z.literal('currency'),
  name: z.string().min(1, { message: 'Widget name cannot be empty' }),
  currencyPairs: z
    .array(CurrencyPairSchema)
    .min(1, { message: 'At least one currency pair is required' }),
  chartPeriod: z.enum(['1h', '4h', '1d', '1w', '1m']).default('1d'),
  maxDashboardCharts: z.number().min(1).max(6).default(3), // Configurable dashboard limit
});

// Widget state schema
export const CurrencyWidgetStateSchema = z.object({
  type: z.literal('currency'),
  lastUpdated: z.string().optional(),
  activePairs: z.array(z.string()).optional(),
});

// Type definitions
export type CurrencyPairType = z.infer<typeof CurrencyPairSchema>;
export type CurrencyWidgetType = z.infer<typeof CurrencyWidgetSchema>;

// =============================================================================
// FORM CONFIGURATION
// =============================================================================

export const CURRENCY_FORMLY_FIELDS: FormlyFieldConfig[] = [
  {
    key: 'name',
    type: 'input',
    wrappers: ['flat-input-wrapper'],
    className: 'block text-lg font-medium text-gray-700 mb-2',
    props: {
      label: 'Widget Name',
      placeholder: 'Enter widget name',
      attributes: {
        'aria-label': 'Enter widget name',
        class: 'flat-input',
      },
    },
  },
  {
    key: 'chartPeriod',
    type: 'select',
    wrappers: ['flat-input-wrapper'],
    className: 'block text-lg font-medium text-gray-700 mb-2',
    props: {
      label: 'Chart Time Period',
      options: [
        { value: '1h', label: '1 Hour' },
        { value: '4h', label: '4 Hours' },
        { value: '1d', label: '1 Day' },
        { value: '1w', label: '1 Week' },
        { value: '1m', label: '1 Month' },
      ],
      placeholder: 'Select chart period',
      attributes: {
        'aria-label': 'Select chart period',
        class: 'flat-input',
      },
    },
  },
  {
    key: 'maxDashboardCharts',
    type: 'input',
    wrappers: ['flat-input-wrapper'],
    className: 'block text-lg font-medium text-gray-700 mb-2',
    props: {
      label: 'Dashboard Charts Limit',
      type: 'number',
      min: 1,
      max: 6,
      placeholder: '3',
      description: 'Number of charts to show in dashboard panel (1-6)',
      attributes: {
        'aria-label': 'Enter dashboard charts limit',
        class: 'flat-input',
      },
    },
  },
  {
    key: 'currencyPairs',
    type: 'repeat',
    props: {
      addText: 'Add Currency Pair',
      label: 'Currency Pairs',
    },
    fieldArray: {
      fieldGroupClassName: 'grid grid-cols-1 md:grid-cols-2 gap-4',
      fieldGroup: [
        {
          key: 'symbol',
          type: 'select',
          wrappers: ['flat-input-wrapper'],
          className: 'block text-lg font-medium text-gray-700 mb-2',
          props: {
            label: 'Currency Pair',
            options: AVAILABLE_CURRENCY_PAIRS.map(pair => ({
              value: pair.symbol,
              label: `${pair.symbol} - ${pair.name}`,
            })),
            placeholder: 'Select currency pair',
            attributes: {
              'aria-label': 'Select currency pair',
              class: 'flat-input',
            },
          },
        },
        {
          key: 'displayName',
          type: 'input',
          wrappers: ['flat-input-wrapper'],
          className: 'block text-lg font-medium text-gray-700 mb-2',
          props: {
            label: 'Custom Display Name (Optional)',
            placeholder: 'e.g., Bitcoin Price',
            description: 'Leave empty to use default name',
            attributes: {
              'aria-label': 'Enter custom display name',
              class: 'flat-input',
            },
          },
        },
      ],
    },
  },
];

// =============================================================================
// API DATA FETCHING
// =============================================================================

/**
 * Fetch real currency data from backend TRPC endpoint
 */
async function fetchRealCurrencyData(
  symbols: string[],
  period: string
): Promise<any[]> {
  console.log(`[CurrencyWidget] Fetching real data for symbols:`, symbols);

  try {
    // Make direct HTTP call to TRPC finance endpoint using proper TRPC format
    const input = JSON.stringify({
      '0': {
        json: { symbols, period },
      },
    });

    const encodedInput = encodeURIComponent(input);
    const apiUrl = WINDOW.apiUrl || '';
    const url =
      apiUrl +
      `/api/trpc/finance.getCurrencyData?batch=1&input=${encodedInput}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.error) {
      throw new Error(`TRPC Error: ${result.error.message}`);
    }
    
    const apiData = result[0]?.result?.data?.json || [];

    // Transform API data to widget format
    const transformedData = apiData.map((item: any) => {
      // Prepare data for Chart.js
      const labels = item.data.slice(-20).map((point: any, i: number) => {
        const date = new Date(point.timestamp * 1000);
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      });

      const prices = item.data.slice(-20).map((point: any) => point.close);

      return {
        symbol: item.symbol,
        displayName: item.symbol,
        labels,
        prices,
        latestPrice: item.latestPrice,
        changePercent: item.changePercent,
        isPositive: item.isPositive,
        chartData: item.data.map((point: any) => ({
          time: new Date(point.timestamp * 1000).toISOString(),
          price: point.close,
          volume: point.volume,
        })),
        lastUpdated: item.lastUpdated,
      };
    });

    console.log(
      `[CurrencyWidget] Successfully transformed ${transformedData.length} data sets`
    );
    return transformedData;
  } catch (error) {
    console.error('[CurrencyWidget] Error fetching real data:', error);
    // Fallback to mock data if API fails
    return symbols.map(symbol => generateFallbackData(symbol, period));
  }
}

/**
 * Generate fallback mock data when API fails
 */
function generateFallbackData(symbol: string, period: string): any {
  const points =
    period === '1h'
      ? 60
      : period === '4h'
        ? 24
        : period === '1d'
          ? 24
          : period === '1w'
            ? 7
            : 30;

  const data: any[] = [];
  let basePrice = Math.random() * 10000 + 1000;

  for (let i = 0; i < points; i++) {
    const variation = (Math.random() - 0.5) * 0.02;
    basePrice = basePrice * (1 + variation);

    const timeInterval =
      period === '1h'
        ? 60000
        : period === '4h'
          ? 600000
          : period === '1d'
            ? 3600000
            : period === '1w'
              ? 86400000
              : 86400000;

    const timestamp = Date.now() - (points - i) * timeInterval;

    data.push({
      time: new Date(timestamp).toISOString(),
      price: parseFloat(basePrice.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000),
    });
  }

  const latestPrice = data[data.length - 1]?.price || 0;
  const firstPrice = data[0]?.price || 0;
  const changePercent = firstPrice
    ? ((latestPrice - firstPrice) / firstPrice) * 100
    : 0;
  const isPositive = changePercent >= 0;

  const labels = data.slice(-20).map((_, i) => `Point ${i + 1}`);
  const prices = data.slice(-20).map(point => point.price);

  return {
    symbol,
    displayName: symbol,
    labels,
    prices,
    latestPrice,
    changePercent,
    isPositive,
    chartData: data,
    lastUpdated: new Date().toISOString(),
  };
}

// =============================================================================
// WIDGET RENDERER CLASS
// =============================================================================

export class CurrencyWidgetRender implements WidgetRender<CurrencyWidgetType> {
  private inited: Record<string, boolean> = {};

  destroy(widget: WidgetRenderType<CurrencyWidgetType>): void {
    this.inited[widget.id] = false;

    // Clean up periodic updates
    if (typeof window !== 'undefined' && (window as any).stopPeriodicUpdates) {
      (window as any).stopPeriodicUpdates(widget.id);
    }

    // Clean up chart instances
    if (typeof window !== 'undefined' && window.Chart) {
      const configs = (globalChartConfigs as any)[widget.id] || [];
      configs.forEach((config: any) => {
        const modalChart = window.Chart.getChart(config.id);
        if (modalChart) {
          modalChart.destroy();
        }

        const previewChart = window.Chart.getChart('preview-' + config.id);
        if (previewChart) {
          previewChart.destroy();
        }
      });
    }

    // Remove from global configs
    delete (globalChartConfigs as any)[widget.id];

    console.log(`[CurrencyWidget] Destroyed widget ${widget.id}`);
  }

  /**
   * Initialize widget - called once per widget instance
   */
  init(
    widget: WidgetRenderType<CurrencyWidgetType>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: WidgetRenderInitFunctionOptions
  ) {
    console.log(`[CurrencyWidget] Initializing widget ${widget.id}`);
    linkCurrencyFunctionsToWindow();

    if (this.inited[widget.id]) {
      console.log(`[CurrencyWidget] Widget ${widget.id} already initialized`);
      return;
    }

    this.inited[widget.id] = true;

    // Initialize client-side functionality
    WINDOW?.initializeCurrencyWidget?.(widget.id);

    console.log(`[CurrencyWidget] Initialized widget ${widget.id}`);
  }

  /**
   * Render widget - generates HTML markup
   */
  render(
    widget: WidgetRenderType<CurrencyWidgetType>,
    options?: WidgetRenderRenderFunctionOptions
  ) {
    if (!options) {
      options = {};
    }
    if (options.init === undefined) {
      options.init = true;
    }

    const renderAsync = async () => {
      console.log(`[CurrencyWidget] Rendering widget ${widget.id}`);

      // Get widget configuration
      const allPairs = widget.options?.currencyPairs || [];
      const maxDashboardCharts = widget.options?.maxDashboardCharts || 3;
      const mainPairs = allPairs.slice(0, maxDashboardCharts);
      const modalId = `currency-modal-${widget.id}`;
      const symbols = allPairs.map(pair => pair.symbol);

      // Fetch real data from Yahoo Finance API
      let chartConfigs: any[] = [];

      if (symbols.length > 0) {
        chartConfigs = await fetchRealCurrencyData(
          symbols,
          widget.options?.chartPeriod || '1d'
        );

        // Add IDs to chart configs for proper identification
        chartConfigs = chartConfigs.map((config, index) => ({
          ...config,
          id: `chart-${widget.id}-${index}`,
        }));
      }

      addGlobalChartConfigs(widget.id, chartConfigs);

      return this.generateWidgetMarkup(
        widget,
        chartConfigs,
        modalId,
        mainPairs,
        allPairs
      );
    };

    return of(null).pipe(
      concatMap(async () => {
        const html = await renderAsync();
        // We'll inject the HTML into the DOM manually since we're dealing with async data
        setTimeout(() => this.init(widget, options), 0);
        return html;
      })
    );
  }

  /**
   * Generate complete widget HTML markup
   */
  private generateWidgetMarkup(
    widget: WidgetRenderType<CurrencyWidgetType>,
    chartConfigs: any[],
    modalId: string,
    mainPairs: CurrencyPairType[],
    allPairs: CurrencyPairType[]
  ): string {
    return `
<!-- Currency Charts Modal -->
<div id="${modalId}" class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 hidden opacity-0">
    <div class="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-6xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center border-b border-gray-200 pb-4 mb-6 sticky top-0 bg-white z-50">
            <h2 class="text-2xl font-bold text-gray-800 flex items-center">
                <i data-lucide="trending-up" class="w-6 h-6 mr-2 text-blue-500"></i>
                ${widget.options?.name || 'Currency Charts'} (${allPairs.length} pairs)
            </h2>
            <button onclick="hideCurrencyModal('${modalId}')" class="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>
        </div>
        
        <p class="text-sm text-gray-600 mb-6">
          Showing detailed charts for all ${allPairs.length} configured currency pairs.
          Time period: ${widget.options?.chartPeriod || '1d'}
        </p>

        <!-- Full Charts Grid -->
        <div id="${modalId}-charts-grid" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${chartConfigs.map(config => this.generateChartCard(config, true)).join('')}
        </div>
    </div>
</div>

<!-- Dashboard Widget Preview -->
<div class="bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 relative overflow-hidden border-l-4 border-blue-500">
    <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-800">${widget.options?.name || 'Currency Charts'}</h3>
        <button onclick="showCurrencyModal('${modalId}')" class="text-blue-500 hover:text-blue-600 transition-colors">
            <i data-lucide="maximize-2" class="w-5 h-5"></i>
        </button>
    </div>
    
    ${
      mainPairs.length > 0
        ? `
    <!-- Dashboard Charts Grid -->
    <div class="grid grid-cols-1 ${mainPairs.length > 1 ? 'sm:grid-cols-2' : ''} ${mainPairs.length > 2 ? 'lg:grid-cols-3' : ''} gap-4">
        ${chartConfigs
          .slice(0, mainPairs.length)
          .map(config => this.generateChartCard(config, false))
          .join('')}
    </div>
    
    ${
      allPairs.length > mainPairs.length
        ? `
    <div class="mt-4 pt-3 border-t border-gray-100">
        <p class="text-sm text-gray-600 text-center">
            Showing ${mainPairs.length} of ${allPairs.length} currency pairs
        </p>
    </div>
    `
        : ''
    }
    `
        : `
    <div class="text-center py-8 text-gray-500">
        <i data-lucide="trending-up" class="w-12 h-12 mx-auto mb-3 text-gray-300"></i>
        <p class="font-medium">No currency pairs configured</p>
        <p class="text-sm">Add currency pairs to see live charts</p>
    </div>
    `
    }
</div>
`;
  }

  /**
   * Generate individual chart card markup
   */
  private generateChartCard(config: any, isModal: boolean): string {
    const heightClass = isModal ? 'h-64' : 'h-32';
    const canvasId = isModal ? config.id : `preview-${config.id}`;

    return `
<div class="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
    <div class="flex justify-between items-center mb-3">
        <h4 class="font-bold text-gray-800 truncate">${config.displayName}</h4>
        <span class="text-sm font-medium ${config.isPositive ? 'text-green-600' : 'text-red-600'}">
            ${config.isPositive ? '↑' : '↓'} ${Math.abs(config.changePercent).toFixed(2)}%
        </span>
    </div>
    
    <div class="${heightClass} mb-3 bg-white rounded-lg p-2 flex items-center justify-center">
        <canvas id="${canvasId}" class="w-full h-full"></canvas>
    </div>
    
    <div class="text-center">
        <p class="text-lg font-bold text-gray-800">$${config.latestPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p class="text-xs text-gray-500">${config.symbol}</p>
    </div>
</div>
`;
  }
}
