import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  // For development, use mock mode - no real backend needed
  if (__DEV__) {
    return 'mock://localhost';
  }

  throw new Error(
    "No base url found, please set EXPO_PUBLIC_RORK_API_BASE_URL"
  );
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      fetch: async (url, options) => {
        const baseUrl = getBaseUrl();
        
        // Mock mode for development
        if (baseUrl.startsWith('mock://')) {
          console.log('Mock mode: handling request for', url);
          
          // Parse the tRPC request to understand what's being called
          const urlObj = new URL(url);
          const pathParts = urlObj.pathname.split('/');
          const procedure = pathParts[pathParts.length - 1];
          
          // Mock health check response
          if (procedure === 'health' || url.includes('example.health')) {
            return new Response(
              JSON.stringify({
                result: {
                  data: {
                    status: 'ok',
                    timestamp: new Date().toISOString(),
                    message: 'Mock backend response (development mode)'
                  }
                }
              }),
              { 
                status: 200, 
                headers: { 'Content-Type': 'application/json' } 
              }
            );
          }
          
          // Mock hi mutation response
          if (procedure === 'hi' || url.includes('example.hi')) {
            let input = 'User';
            try {
              if (options?.body) {
                const body = JSON.parse(options.body as string);
                input = body?.json?.name || body?.name || 'User';
              }
            } catch {
              console.log('Could not parse request body, using default');
            }
            
            return new Response(
              JSON.stringify({
                result: {
                  data: {
                    hello: input,
                    date: new Date().toISOString()
                  }
                }
              }),
              { 
                status: 200, 
                headers: { 'Content-Type': 'application/json' } 
              }
            );
          }
          
          // Default mock response for unknown endpoints
          return new Response(
            JSON.stringify({
              result: {
                data: {
                  message: `Mock response for ${procedure}`,
                  timestamp: new Date().toISOString()
                }
              }
            }),
            { 
              status: 200, 
              headers: { 'Content-Type': 'application/json' } 
            }
          );
        }
        
        // Real backend mode
        try {
          console.log('Real backend: making request to', url);
          const response = await fetch(url, options);
          
          if (!response.ok) {
            console.warn('Backend response not ok:', response.status, response.statusText);
            const text = await response.text();
            console.warn('Response body:', text.substring(0, 200));
            
            // If we get HTML instead of JSON, the backend isn't running properly
            if (text.includes('<!DOCTYPE') || text.includes('<html>')) {
              console.error('Backend returned HTML instead of JSON');
              throw new Error('Backend connection failed: ' + response.status);
            }
            
            // Try to parse as JSON for proper error handling
            try {
              JSON.parse(text);
              return new Response(text, {
                status: response.status,
                headers: response.headers
              });
            } catch {
              throw new Error(`Backend connection failed: ${response.status}`);
            }
          }
          
          return response;
        } catch (error) {
          console.error('Backend connection failed:', error);
          throw new Error('Backend connection failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
      },
    }),
  ],
});