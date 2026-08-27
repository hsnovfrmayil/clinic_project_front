export const DELIVERY_OPTIONS = [
  { id: "courier", label: "Курьером по Москве", price: 0, eta: "1–2 дня" },
  { id: "pickup", label: "Самовывоз из клиники", price: 0, eta: "сегодня" },
  { id: "post", label: "Доставка по России", price: 350, eta: "3–5 дней" },
] as const;

export type DeliveryId = (typeof DELIVERY_OPTIONS)[number]["id"];

export function getDeliveryFee(id: DeliveryId) {
  return DELIVERY_OPTIONS.find((d) => d.id === id)?.price ?? 0;
}
