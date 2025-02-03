"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ProductCardAddToCart from "./product-card-add-to-cart";
import { getAllFeaturedActiveProducts } from "@/app/data/products-data";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProductCardProps {
  product: Awaited<ReturnType<typeof getAllFeaturedActiveProducts>>[0];
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  let discountedPercentage = 0;
  let hasDiscount = false;
  if (product.discount) {
    hasDiscount = product.price != product.discount;
    discountedPercentage =
      ((product.price - product.discount) / product.price) * 100;
  }
  return (
    <Card
      // onClick={() => router.push(`/product/${product.slug}`)}
      className="group   overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg h-full flex flex-col"
    >
      <CardContent className="p-0 flex-grow flex flex-col">
        <div className="aspect-square m-4 relative overflow-hidden flex items-center justify-center">
          <Link href={`/product/${product.slug}`} passHref>
        <Image
          src={product?.images?.length > 0 ? product?.images[0]?.url : ""}
          alt={product.name}
          width={250}
          height={250}
          quality={60}
          className="object-contain transition-transform group-hover:scale-105"
        />
          </Link>
          <ProductCardAddToCart product={product} />
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <Link href={`/product/${product.slug}`} passHref>
            <h3 className="font-medium line-clamp-2 mb-2 text-lg text-gray-800 min-h-[3rem]">
              {product.name}
            </h3>
          </Link>

          {!hasDiscount && (
            <div className="flex items-baseline gap-2 mt-auto">
              <span className="text-2xl font-bold text-primary">
                {product.price.toFixed(0)} DZD
              </span>
              {product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  {product.price.toFixed(2)} DZD
                </span>
              )}
            </div>
          )}
          {hasDiscount && (
            <div className="flex items-baseline gap-2 mt-auto">
              <span className="text-2xl font-bold text-primary">
                {product.price.toFixed(2)} DZD
              </span>
              {product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  {product.price.toFixed(2)} DZD
                </span>
              )}
            </div>
          )}
          {hasDiscount && (
            <p className="text-sm text-primary mt-1">
              {discountedPercentage.toFixed(0)}% Off
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Link
          onClick={(e) => {
            e.stopPropagation();
            router.push("/confirm-order?productId=" + product.id);
          }}
          className="block w-full"
          href={`/confirm-order?productId=${product.id}`}
          passHref
        >
          <Button
            className={cn(
              "w-full flex items-center justify-center gap-2 transition-colors duration-300"
            )}
          >
            Acheter Maintenant
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
