import { apiFetch, toQuery } from "./client";
import type {
  Brand,
  Category,
  CreateOrderPayload,
  Order,
  Paginated,
  Product,
  ProductFilters,
  ProductQuery,
  Slider,
} from "./types";

export async function fetchProducts(query: ProductQuery = {}) {
  return apiFetch<Paginated<Product>>(
    `/products${toQuery({
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      search: query.search,
      category_id: query.category_id,
      brand_id: query.brand_id,
      attribute_value_ids: query.attribute_value_ids,
      min_price: query.min_price,
      max_price: query.max_price,
      in_stock: query.in_stock,
      sortBy: query.sortBy,
      order: query.order,
    })}`,
    { auth: false }
  );
}

export async function fetchProduct(id: string | number) {
  return apiFetch<Product>(`/products/${id}`, { auth: false });
}

export async function fetchProductFilters() {
  return apiFetch<ProductFilters>("/products/filters", { auth: false });
}

export async function fetchBrands(params: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "id" | "name" | "created_at";
  order?: "ASC" | "DESC";
} = {}) {
  return apiFetch<Paginated<Brand>>(
    `/brands${toQuery({
      page: params.page ?? 1,
      limit: params.limit ?? 50,
      search: params.search,
      sortBy: params.sortBy ?? "name",
      order: params.order ?? "ASC",
    })}`,
    { auth: false }
  );
}

export async function fetchBrand(id: string | number) {
  return apiFetch<Brand>(`/brands/${id}`, { auth: false });
}

export async function fetchCategories() {
  return apiFetch<Category[]>("/categories", { auth: false });
}

export async function fetchSliders() {
  return apiFetch<Slider[]>("/sliders", { auth: false });
}

export async function createOrder(payload: CreateOrderPayload, token: string) {
  return apiFetch<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
    token,
  });
}
