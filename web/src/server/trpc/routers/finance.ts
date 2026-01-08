/* eslint-disable @typescript-eslint/no-explicit-any */
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { 
  fetchMultipleCurrencyData, 
  mapYahooPeriod, 
  mapYahooInterval,
  ProcessedChartData
} from '../../services/yahoo-finance-api';
import { middleware, publicProcedure, router } from '../trpc';

// Rate limiting store for finance API
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Cleanup expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime <= now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Cleanup every minute

// Finance API rate limiting middleware
const financeRateLimitMiddleware = middleware(async ({ ctx, next }) => {
  // Use session ID or IP for rate limiting
  const identifier = ctx.session?.id || 
                     ctx.req?.headers['x-session-id'] as string || 
                     ctx.req?.headers['x-forwarded-for'] as string || 
                     'unknown';
  
  const key = `finance:${identifier}`;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 50;
  
  const entry = rateLimitStore.get(key);
  
  if (!entry || entry.resetTime <= now) {
    // New window or expired window
    rateLimitStore.set(key, { 
      count: 1, 
      resetTime: now + windowMs 
    });
  } else {
    // Same window, increment counter
    entry.count++;
    
    if (entry.count > maxRequests) {
      // Rate limit exceeded
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: `Rate limit exceeded. Maximum ${maxRequests} requests per minute allowed. Try again in ${retryAfter} seconds.`
      });
    }
  }
  
  return next();
});

export const financeRouter = router({
  /**
   * Fetch currency data for multiple symbols
   */
  getCurrencyData: publicProcedure
    .use(financeRateLimitMiddleware)
    .input(z.object({
      symbols: z.array(z.string()).min(1, 'At least one symbol is required'),
      period: z.enum(['1h', '4h', '1d', '1w', '1m']).default('1d'),
      interval: z.enum(['1m', '5m', '15m', '30m', '60m', '1d']).optional(),
    }))
    .output(z.array(z.any())) // Using z.any() for flexibility, can be more specific
    .query(async ({ input }) => {
      try {
        console.log(`[FinanceRouter] Fetching currency data for symbols:`, input.symbols);
        
        const yahooPeriod = mapYahooPeriod(input.period);
        const yahooInterval = input.interval || mapYahooInterval(input.period);
        
        const data = await fetchMultipleCurrencyData(
          input.symbols, 
          yahooPeriod, 
          yahooInterval
        );
        
        console.log(`[FinanceRouter] Successfully fetched data for ${data.length} symbols`);
        
        return data;
      } catch (error) {
        console.error(`[FinanceRouter] Error fetching currency data:`, error);
        throw new Error(`Failed to fetch currency data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  /**
   * Fetch data for a single currency pair
   */
  getSingleCurrencyData: publicProcedure
    .use(financeRateLimitMiddleware)
    .input(z.object({
      symbol: z.string().min(1, 'Symbol is required'),
      period: z.enum(['1h', '4h', '1d', '1w', '1m']).default('1d'),
      interval: z.enum(['1m', '5m', '15m', '30m', '60m', '1d']).optional(),
    }))
    .output(z.any()) // Can be more specific with ProcessedChartData schema
    .query(async ({ input }) => {
      try {
        console.log(`[FinanceRouter] Fetching data for symbol: ${input.symbol}`);
        
        const yahooPeriod = mapYahooPeriod(input.period);
        const yahooInterval = input.interval || mapYahooInterval(input.period);
        
        // Import the single fetch function
        const { fetchYahooFinanceData } = await import('../../services/yahoo-finance-api');
        
        const data = await fetchYahooFinanceData(
          input.symbol, 
          yahooPeriod, 
          yahooInterval
        );
        
        if (!data) {
          throw new Error(`No data returned for symbol: ${input.symbol}`);
        }
        
        console.log(`[FinanceRouter] Successfully fetched data for ${input.symbol}`);
        
        return data;
      } catch (error) {
        console.error(`[FinanceRouter] Error fetching data for ${input.symbol}:`, error);
        throw new Error(`Failed to fetch data for ${input.symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
});