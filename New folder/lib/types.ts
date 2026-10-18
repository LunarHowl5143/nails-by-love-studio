export type Service = {
  ROWID?: string | number;
  rowid?: string | number;
  name: string;
  slug?: string;
  description?: string;
  category?: string;
  price: number | string;
  duration_minutes?: number | string;
  is_active?: boolean;
  is_featured?: boolean;
  image_url?: string;
};

export type Offer = {
  ROWID?: string | number;
  rowid?: string | number;
  name: string;
  slug?: string;
  description?: string;
  discount_type?: string;
  discount_value?: number | string;
  starts_at?: string;
  ends_at?: string;
  is_active?: boolean;
};

export type PortfolioItem = {
  ROWID?: string | number;
  rowid?: string | number;
  title: string;
  description?: string;
  category?: string;
  image_url?: string;
  image_file_id?: string;
  is_featured?: boolean;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  duration: number;
  kind: 'service' | 'addon';
  quantity: number;
};

export function recordId(record: { ROWID?: string | number; rowid?: string | number }, fallback: string) {
  return String(record.ROWID ?? record.rowid ?? fallback);
}

export function money(value: number | string | undefined) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}
