import { notFound } from "next/navigation";
import { fetchProduct, fetchProducts } from "@/lib/api/catalog";
import ProductView from "@/components/ProductView";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const product = await fetchProduct(slug);
    const categoryId = product.categories?.[0]?.id;
    const relatedRes = await fetchProducts({
      limit: 5,
      category_id: categoryId ? [categoryId] : undefined,
    });
    const related = (relatedRes.data ?? [])
      .filter((p) => String(p.id) !== String(product.id))
      .slice(0, 4);

    return <ProductView product={product} related={related} />;
  } catch {
    notFound();
  }
}
