import { Registry, collectDefaultMetrics } from 'prom-client';

// Singleton for metrics registry
const register = new Registry();

// Add global labels
register.setDefaultLabels({
  app: 'nextjs-web',
});

// Enable default metrics (CPU, Memory, Event Loop, etc.)
collectDefaultMetrics({ register });

export { register };
