import type { PagesFunction } from '@cloudflare/workers-types';
import { Store } from '../../_shared/kv';

export const onRequestGet: PagesFunction = async (context) => {
  const store = new Store(context.env);
  const logs = await store.getLogs(50);
  return new Response(JSON.stringify({ logs }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
