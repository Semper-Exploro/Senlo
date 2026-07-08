import type { PagesFunction } from '@cloudflare/workers-types';
import { aiPersonas } from '../../_shared/personas';

export const onRequestGet: PagesFunction = async () => {
  return new Response(JSON.stringify({ personas: aiPersonas }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
