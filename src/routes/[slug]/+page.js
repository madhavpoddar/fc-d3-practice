// Tell the prerenderer which slugs to crawl.
import { exercises } from '../../exercises/index.js';

export const prerender = true;

export function entries() {
  return exercises.map((e) => ({ slug: e.id }));
}
