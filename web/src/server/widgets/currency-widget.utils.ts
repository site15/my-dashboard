/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Client-side utility functions for currency widget
 * These functions are linked to the window object for global access
 */
import Chart from 'chart.js/auto';
import { debug } from 'console';
import { WINDOW } from '../../app/utils/window';

declare global {
  interface Window {
    initializeCurrencyWidget?: (widgetId: string) => void;
    showCurrencyModal?: (modalId: string) => void;
    hideCurrencyModal?: (modalId: string) => void;
    updateCurrencyCharts?: (widgetId: string) => void;
    startPeriodicUpdates?: (widgetId: string, intervalMs?: number) => void;
    stopPeriodicUpdates?: (widgetId: string) => void;
    Chart: any;
  }
}

type GlobalChartConfig = {
  id: string;
  symbol: string;
  displayName: string | undefined;
  labels: string[];
  prices: number[];
  latestPrice: number;
  changePercent: number;
  isPositive: boolean;
  chartData: any[];
};

export const globalChartConfigs: Record<string, GlobalChartConfig[]> = {};

export function addGlobalChartConfigs(
  widgetId: string,
  configs: GlobalChartConfig[]
) {
  globalChartConfigs[widgetId] = configs;
}

/**
 * Link currency widget functions to window object for global access
 */
export function linkCurrencyFunctionsToWindow() {
  if (typeof window !== 'undefined') {
    window.initializeCurrencyWidget = initializeCurrencyWidget;
    window.showCurrencyModal = showCurrencyModal;
    window.hideCurrencyModal = hideCurrencyModal;
    window.updateCurrencyCharts = updateCurrencyCharts;
    window.startPeriodicUpdates = startPeriodicUpdates;
    window.stopPeriodicUpdates = stopPeriodicUpdates;
    window.Chart = Chart;

    console.log('[CurrencyWidget] Functions linked to window object');
  }
}

/**
 * Initialize currency widget functionality
 */
export function initializeCurrencyWidget(widgetId: string): void {
  console.log(`[CurrencyWidget] Initializing widget ${widgetId}`);
  console.log('[CurrencyWidget] Global chart configs', globalChartConfigs);
  console.log('[CurrencyWidget] Widget Id', widgetId);
  const configs = globalChartConfigs[widgetId];
  console.log('[CurrencyWidget] Configs', configs);

  if (configs) {
    console.log('[CurrencyWidget] Configs found', configs);
    configs.forEach(config => {
      console.log('[CurrencyWidget] Configuring chart', config);
      if (typeof document !== 'undefined') {
        // Destroy existing charts if they exist
        const existingModalChart = Chart.getChart(config.id);
        if (existingModalChart) {
          existingModalChart.destroy();
        }

        const existingPreviewChart = Chart.getChart('preview-' + config.id);
        if (existingPreviewChart) {
          existingPreviewChart.destroy();
        }

        // Initialize modal chart
        const modalCanvas = document.getElementById(config.id);
        console.log('[CurrencyWidget] Modal canvas', modalCanvas);
        if (modalCanvas) {
          const modalCtx = (modalCanvas as any).getContext('2d');
          if (modalCtx) {
            new Chart(modalCtx, {
              type: 'line',
              data: {
                labels: config.labels,
                datasets: [
                  {
                    label: config.displayName,
                    data: config.prices,
                    borderColor: config.isPositive ? '#10B981' : '#EF4444',
                    backgroundColor: config.isPositive
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: config.isPositive
                      ? '#10B981'
                      : '#EF4444',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointStyle: 'circle',
                    tension: 0.4,
                    fill: true,
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                      label: function (context) {
                        return '$' + context.parsed.y?.toFixed(2);
                      },
                    },
                  },
                },
                scales: {
                  x: { display: false, grid: { display: false } },
                  y: { display: false, grid: { display: false } },
                },
                interaction: {
                  mode: 'nearest',
                  axis: 'x',
                  intersect: false,
                },
              },
            });
          }
        }

        // Initialize preview chart
        const previewCanvas = document.getElementById('preview-' + config.id);
        console.log('[CurrencyWidget] Preview canvas', previewCanvas);
        if (previewCanvas) {
          const previewCtx = (previewCanvas as any).getContext('2d');
          if (previewCtx) {
            new Chart(previewCtx, {
              type: 'line',
              data: {
                labels: config.labels.slice(-10),
                datasets: [
                  {
                    label: config.displayName,
                    data: config.prices.slice(-10),
                    borderColor: config.isPositive ? '#10B981' : '#EF4444',
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    pointBackgroundColor: config.isPositive
                      ? '#10B981'
                      : '#EF4444',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 1,
                    pointRadius: 2,
                    pointHoverRadius: 3,
                    pointStyle: 'circle',
                    tension: 0.3,
                    fill: false,
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: false },
                },
                scales: {
                  x: { display: false, grid: { display: false } },
                  y: { display: false, grid: { display: false } },
                },
                elements: {
                  point: { hitRadius: 0 },
                },
              },
            });
          }
        }
      }
    });

    // Start periodic updates (30 seconds by default)
    startPeriodicUpdates(widgetId, 30000);
    console.log(
      `[CurrencyWidget] Started periodic updates for widget ${widgetId}`
    );
  }
}

/**
 * Show currency charts modal
 */
function showCurrencyModal(modalId: string): void {
  console.log(`[CurrencyWidget] Showing modal ${modalId}`);

  if (typeof document !== 'undefined') {
    const modal = document.getElementById(modalId);
    if (modal) {
      // Remove hidden classes and add visible classes
      modal.classList.remove('hidden', 'opacity-0');
      modal.classList.add('opacity-100');

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Add escape key listener
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          hideCurrencyModal(modalId);
        }
      };

      document.addEventListener('keydown', handleEscape);
      modal.dataset['escapeListener'] = 'true';

      console.log(`[CurrencyWidget] Modal ${modalId} shown`);
    } else {
      console.warn(`[CurrencyWidget] Modal ${modalId} not found`);
    }
  }
}

/**
 * Hide currency charts modal
 */
function hideCurrencyModal(modalId: string): void {
  console.log(`[CurrencyWidget] Hiding modal ${modalId}`);

  if (typeof document !== 'undefined') {
    const modal = document.getElementById(modalId);
    if (modal) {
      // Add transition classes
      modal.classList.remove('opacity-100');
      modal.classList.add('opacity-0');

      // Remove hidden class after transition
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 300);

      // Restore body scroll
      document.body.style.overflow = '';

      // Remove escape key listener
      if (modal.dataset['escapeListener'] === 'true') {
        document.removeEventListener('keydown', (e: any) => {
          if (e.key === 'Escape') {
            hideCurrencyModal(modalId);
          }
        });
        delete modal.dataset['escapeListener'];
      }

      console.log(`[CurrencyWidget] Modal ${modalId} hidden`);
    }
  }
}

/**
 * Update currency charts data with fresh API data via direct HTTP call to TRPC endpoint
 */
async function updateCurrencyCharts(widgetId: string): Promise<void> {
  console.log(`[CurrencyWidget] Updating charts for widget ${widgetId}`);

  try {
    // Get current chart configurations
    const currentConfigs = globalChartConfigs[widgetId];
    if (!currentConfigs || currentConfigs.length === 0) {
      console.log(
        `[CurrencyWidget] No charts to update for widget ${widgetId}`
      );
      return;
    }

    // Extract symbols from current configs
    const symbols = currentConfigs.map(config => config.symbol);
    console.log(`[CurrencyWidget] Updating data for symbols:`, symbols);

    // Get period from widget config
    const period = '1d'; // Default period - this should ideally come from widget config

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
    console.log({ url });
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

    const newData = result[0]?.result?.data?.json || [];

    console.log(
      `[CurrencyWidget] Received ${newData.length} data sets from TRPC`
    );

    // Update chart configurations with new data
    const updatedConfigs = newData
      .map((item: any, index: number) => {
        const currentConfig = currentConfigs[index];
        if (!currentConfig) return null;

        // Prepare updated data for Chart.js
        const labels = item.data.slice(-20).map((point: any, i: number) => {
          const date = new Date(point.timestamp * 1000);
          return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
        });

        const prices = item.data.slice(-20).map((point: any) => point.close);

        return {
          ...currentConfig,
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
      })
      .filter(Boolean) as GlobalChartConfig[];

    // Update global configs
    globalChartConfigs[widgetId] = updatedConfigs;

    // Re-initialize charts with new data
    initializeCurrencyWidget(widgetId);

    console.log(
      `[CurrencyWidget] Successfully updated ${updatedConfigs.length} charts for widget ${widgetId}`
    );
  } catch (error) {
    console.error(
      `[CurrencyWidget] Error updating charts for widget ${widgetId}:`,
      error
    );
  }
}

/**
 * Set up periodic updates for live data
 */
function setupPeriodicUpdates(
  widgetId: string,
  intervalMs: number = 30000
): void {
  console.log(
    `[CurrencyWidget] Setting up periodic updates for ${widgetId} every ${intervalMs}ms`
  );

  // Clear any existing interval for this widget
  if ((window as any)[`currencyUpdateInterval_${widgetId}`]) {
    clearInterval((window as any)[`currencyUpdateInterval_${widgetId}`]);
  }

  // Set up new interval
  (window as any)[`currencyUpdateInterval_${widgetId}`] = setInterval(() => {
    updateCurrencyCharts(widgetId);
  }, intervalMs);

  // Clean up interval when page unloads
  window.addEventListener('beforeunload', () => {
    if ((window as any)[`currencyUpdateInterval_${widgetId}`]) {
      clearInterval((window as any)[`currencyUpdateInterval_${widgetId}`]);
    }
  });
}

/**
 * Start periodic updates for a widget
 */
export function startPeriodicUpdates(
  widgetId: string,
  intervalMs: number = 30000
): void {
  setupPeriodicUpdates(widgetId, intervalMs);
}

/**
 * Stop periodic updates for a widget
 */
export function stopPeriodicUpdates(widgetId: string): void {
  if ((window as any)[`currencyUpdateInterval_${widgetId}`]) {
    clearInterval((window as any)[`currencyUpdateInterval_${widgetId}`]);
    delete (window as any)[`currencyUpdateInterval_${widgetId}`];
    console.log(
      `[CurrencyWidget] Stopped periodic updates for widget ${widgetId}`
    );
  }
}

/**
 * Format currency value for display
 */
export function formatCurrency(
  value: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format percentage change for display
 */
export function formatPercentage(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

/**
 * Get color class based on value change
 */
export function getChangeColorClass(isPositive: boolean): string {
  return isPositive ? 'text-green-600' : 'text-red-600';
}

/**
 * Get background color based on value change
 */
export function getChangeBgColor(isPositive: boolean): string {
  return isPositive ? 'bg-green-100' : 'bg-red-100';
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Export types for external use
export interface CurrencyDataPoint {
  time: string;
  price: number;
  volume: number;
}

export interface CurrencyChartConfig {
  symbol: string;
  displayName: string;
  data: CurrencyDataPoint[];
  isPositive: boolean;
  changePercent: number;
  latestPrice: number;
}
