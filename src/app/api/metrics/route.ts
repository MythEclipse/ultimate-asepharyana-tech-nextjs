import { register } from '../../../lib/prometheus';

export async function GET() {
  try {
    const metrics = await register.metrics();
    return new Response(metrics, {
      headers: {
        'Content-Type': register.contentType,
      },
    });
  } catch (error) {
    console.error('Metrics collection failed:', error);
    return new Response('Error collecting metrics', { status: 500 });
  }
}
