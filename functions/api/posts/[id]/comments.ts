import type { PagesFunction } from '@cloudflare/workers-types';
import { Store } from '../../../_shared/kv';

export const onRequestGet: PagesFunction = async (context) => {
  const store = new Store(context.env);
  const { id } = context.params;
  const comments = await store.getCommentsByPost(id as string);
  return new Response(JSON.stringify({ comments }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
