import type { Offer, PortfolioItem, Service } from './types';

const API_BASE = (process.env.NEXT_PUBLIC_CATALYST_API_BASE_URL ?? '').replace(/\/$/, '');

async function readList<T>(path: string): Promise<T[]> {
  if (!API_BASE) return [];
  try {
    const response = await fetch(`${API_BASE}${path}`, { cache: 'no-store' });
    if (!response.ok) return [];
    const body = await response.json();
    if (Array.isArray(body)) return body as T[];
    if (Array.isArray(body?.data)) return body.data as T[];
    if (Array.isArray(body?.data?.items)) return body.data.items as T[];
    if (Array.isArray(body?.items)) return body.items as T[];
    return [];
  } catch {
    return [];
  }
}

export const getServices = () => readList<Service>('/api/services');
export const getOffers = () => readList<Offer>('/api/offers');
export const getPortfolio = () => readList<PortfolioItem>('/api/portfolio');
export const hasApiConfigured = () => Boolean(API_BASE);
