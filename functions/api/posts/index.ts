import type { PagesFunction } from '@cloudflare/workers-types';
import { Store } from '../../_shared/kv';

export const onRequestGet: PagesFunction = async (context) => {
  const store = new Store(context.env);
  const posts = await store.getAllPosts();
  return new Response(JSON.stringify({ posts }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
