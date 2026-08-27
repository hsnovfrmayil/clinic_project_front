export type Id = string | number;

export interface Upload {
  id: Id;
  file_path: string;
  file_name: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface Discount {
  id: Id;
  name: string;
  discount_percentage: number | string;
  start_date: string;
  end_date: string;
}

export interface Brand {
  id: Id;
  name: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  uploads?: Upload[];
  discounts?: Discount[];
}

export interface Category {
  id: Id;
  name: string;
  parent_id?: Id | null;
  children?: Category[];
  created_at?: string;
  updated_at?: string;
}

export interface Attribute {
  id: Id;
  name: string;
  values?: AttributeValue[];
}

export interface AttributeValue {
  id: Id;
  attribute_id?: Id;
  value: string;
  attribute?: Attribute;
}

export interface ProductVariant {
  id: Id;
  product_id: Id;
  stock: number;
  mrp: number | string;
  price: number | string;
  discounted_price?: number | string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  attributeValues: AttributeValue[];
  uploads: Upload[];
}

export interface Product {
  id: Id;
  name: string;
  description: string | null;
  vat_rate: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  variants: ProductVariant[];
  categories: Category[];
  brands: Brand[];
  bonus_persentages?: string | number | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface UsedAttributeValue {
  id: Id;
  value: string;
}

export interface UsedAttribute {
  id: Id;
  name: string;
  values: UsedAttributeValue[];
}

export interface UsedBrand {
  id: Id;
  name: string;
}

export interface UsedCategory {
  id: Id;
  name: string;
}

export interface ProductFilters {
  attributes: UsedAttribute[];
  brands: UsedBrand[];
  categories: UsedCategory[];
}

export interface Slider {
  id: Id;
  upload_id: Id;
  title: string;
  link_url: string | null;
  start_date: string;
  end_date: string;
  order: number;
  is_active: boolean;
  upload?: Upload | null;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  gender?: "male" | "female";
  birth_date?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface AuthUser {
  id?: number | string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email: string;
  gender?: "male" | "female" | string | null;
  birth_date?: string | null;
  balance?: number | string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface CreateOrderItem {
  product_variant_id: number;
  quantity: number;
}

export interface CreateOrderPayload {
  idempotency_key: string;
  bonus?: boolean;
  items: CreateOrderItem[];
}

export interface OrderItem {
  id: Id;
  order_id: Id;
  product_variant_id: Id;
  quantity: number;
  price_per_item: number | string;
  vat_rate: number;
  vat_amount: number | string;
  allocated_bonus: number;
  final_price: number | string;
  productVariant?: ProductVariant;
}

export interface Order {
  id: Id;
  user_id: Id;
  order_number: string;
  status: "pending" | "paid" | "cancelled" | "completed" | string;
  total_amount: number | string;
  idempotency_key: string;
  total_vat_amount: number | string;
  bonus_amount_used: number | string;
  final_amount: number | string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: Id[];
  brand_id?: Id[];
  attribute_value_ids?: Id[];
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  sortBy?: "id" | "name" | "created_at";
  order?: "ASC" | "DESC";
}
