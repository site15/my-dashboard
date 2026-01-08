/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Yahoo Finance API Service
 * Provides real-time currency and cryptocurrency data fetching
 */

export interface YahooFinanceResponse {
  chart: {
    result: Array<{
      meta: {
        currency: string;
        symbol: string;
        exchangeName: string;
        instrumentType: string;
        firstTradeDate: number;
        regularMarketTime: number;
        gmtoffset: number;
        timezone: string;
        exchangeTimezoneName: string;
        regularMarketPrice: number;
        chartPreviousClose: number;
        previousClose: number;
        scale: number;
        priceHint: number;
        currentTradingPeriod: any;
        tradingPeriods: any;
        dataGranularity: string;
        range: string;
        validRanges: string[];
      };
      timestamp: number[];
      indicators: {
        quote: Array<{
          high: number[];
          low: number[];
          open: number[];
          close: number[];
          volume: number[];
        }>;
      };
    }>;
    error: any;
  };
}

export interface ChartDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ProcessedChartData {
  symbol: string;
  displayName: string;
  data: ChartDataPoint[];
  latestPrice: number;
  previousClose: number;
  changePercent: number;
  isPositive: boolean;
  lastUpdated: string;
}

/**
 * Convert currency pair symbol to Yahoo Finance format
 * BTC/USD -> BTC-USD
 * EUR/USD -> EURUSD=X
 */
export function convertSymbolToYahooFormat(symbol: string): string {
  // Handle crypto pairs (BTC/USD -> BTC-USD)
  if (symbol.includes('/')) {
    const parts = symbol.split('/');
    if (parts[1] === 'USD') {
      return `${parts[0]}-USD`;
    }
    return symbol.replace('/', '-');
  }
  
  // Handle forex pairs (EURUSD -> EURUSD=X)
  if (symbol.length === 6 && !symbol.includes('=')) {
    return `${symbol}=X`;
  }
  
  return symbol;
}

/**
 * Fetch chart data from Yahoo Finance API
 */
export async function fetchYahooFinanceData(
  symbol: string,
  range: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' | '10y' | 'ytd' | 'max' = '1mo',
  interval: '1m' | '2m' | '5m' | '15m' | '30m' | '60m' | '90m' | '1h' | '1d' | '5d' | '1wk' | '1mo' | '3mo' = '1d'
): Promise<ProcessedChartData | null> {
  try {
    const yahooSymbol = convertSymbolToYahooFormat(symbol);
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?range=${range}&interval=${interval}`;
    
    console.log(`[YahooFinanceAPI] Fetching data for ${yahooSymbol} from ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://finance.yahoo.com/',
        'Origin': 'https://finance.yahoo.com'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: YahooFinanceResponse = await response.json();
    
    if (data.chart.error) {
      throw new Error(`API Error: ${JSON.stringify(data.chart.error)}`);
    }

    const result = data.chart.result[0];
    if (!result) {
      throw new Error('No data returned from API');
    }

    const { meta, timestamp, indicators } = result;
    const quote = indicators.quote[0];

    // Process chart data points
    const chartData: ChartDataPoint[] = [];
    
    for (let i = 0; i < timestamp.length; i++) {
      chartData.push({
        timestamp: timestamp[i],
        open: quote.open[i],
        high: quote.high[i],
        low: quote.low[i],
        close: quote.close[i],
        volume: quote.volume[i] || 0
      });
    }

    // Calculate price change
    const latestPrice = meta.regularMarketPrice;
    const previousClose = meta.previousClose || meta.chartPreviousClose;
    const changePercent = previousClose 
      ? ((latestPrice - previousClose) / previousClose) * 100 
      : 0;
    const isPositive = changePercent >= 0;

    const processedData: ProcessedChartData = {
      symbol,
      displayName: symbol,
      data: chartData,
      latestPrice,
      previousClose,
      changePercent,
      isPositive,
      lastUpdated: new Date().toISOString()
    };

    console.log(`[YahooFinanceAPI] Successfully fetched data for ${symbol}`, {
      latestPrice,
      changePercent: changePercent.toFixed(2) + '%',
      dataPoints: chartData.length
    });

    return processedData;

  } catch (error) {
    console.error(`[YahooFinanceAPI] Error fetching data for ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetch multiple currency pairs concurrently
 */
export async function fetchMultipleCurrencyData(
  symbols: string[],
  range: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' | '10y' | 'ytd' | 'max' = '1mo',
  interval: '1m' | '2m' | '5m' | '15m' | '30m' | '60m' | '90m' | '1h' | '1d' | '5d' | '1wk' | '1mo' | '3mo' = '1d'
): Promise<ProcessedChartData[]> {
  console.log(`[YahooFinanceAPI] Fetching data for ${symbols.length} symbols:`, symbols);
  
  const promises = symbols.map(symbol => 
    fetchYahooFinanceData(symbol, range, interval)
  );

  const results = await Promise.allSettled(promises);
  
  const successfulResults: ProcessedChartData[] = [];
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      successfulResults.push(result.value);
    } else {
      console.warn(`[YahooFinanceAPI] Failed to fetch data for ${symbols[index]}:`, result);
    }
  });

  console.log(`[YahooFinanceAPI] Successfully fetched ${successfulResults.length}/${symbols.length} currency pairs`);
  
  return successfulResults;
}

/**
 * Map Yahoo Finance period to our widget period format
 */
export function mapYahooPeriod(period: string): '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' | '10y' | 'ytd' | 'max' {
  const mapping: Record<string, any> = {
    '1h': '1d',
    '4h': '5d',
    '1d': '1mo',
    '1w': '3mo',
    '1m': '1y'
  };
  
  return mapping[period] || '1mo';
}

/**
 * Map Yahoo Finance interval to our widget needs
 */
export function mapYahooInterval(interval: string): '1m' | '5m' | '15m' | '30m' | '60m' | '1d' {
  const mapping: Record<string, any> = {
    '1h': '5m',
    '4h': '15m',
    '1d': '1d',
    '1w': '1d',
    '1m': '1d'
  };
  
  return mapping[interval] || '1d';
}