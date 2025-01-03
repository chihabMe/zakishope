import { notFound } from "next/navigation";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/layout/site-header/site-header";
import { ImageGallery } from "./components/ImageGallery";
import { getProductDetailWithSlug } from "@/app/data/products-data";

export default async function ProductDetail({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductDetailWithSlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen container mx-auto max-w-screen-2xl bg-background px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <ImageGallery images={product.images.map((img) => img.url)} />

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-sm text-muted-foreground">
                {product.category.name}
              </p>
              <div className="mt-4 flex items-baseline gap-4">
                <span className="text-3xl font-bold">
                  ${(product.price / 100).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button size="lg" variant="outline" className="flex-1">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" className="flex-1 bg-primary">
                Pay Now
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Description</h2>
              <p>{product.description}</p>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="space-y-8 ">
          <div className="py-2"/>
          <h2 className="text-xl font-semibold">Specifications</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {product.features.map((spec, idx) => (
              <div key={idx} className="flex flex-col">
                <dt className="font-medium">{spec.name}</dt>
                <dd className="text-muted-foreground">{spec.value}</dd>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
