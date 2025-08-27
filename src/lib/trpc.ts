import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "../backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (import.meta.env.VITE_RORK_API_BASE_URL) {
    return import.meta.env.VITE_RORK_API_BASE_URL;
  }

  // For development, use mock mode
  if (import.meta.env.DEV) {
    return 'mock://localhost';
  }

  throw new Error(
    "No base url found, please set VITE_RORK_API_BASE_URL"
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
          
          // Default mock response
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
        return fetch(url, options);
      },
    }),
  ],
});