import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getLatestProducts } from '../data/products-data'

export async function NewArrivals() {
  const latestProducts = await getLatestProducts()

  return (
    <section className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Nouveaux Arrivages</h2>
        <Link href="/products" className="text-primary hover:underline">
          Voir tout
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {latestProducts.map((product) => (
          <Card key={product.id} className="group">
            <CardContent className="p-4">
              <div className="relative aspect-square mb-3">
                <Badge className="absolute top-2 right-2 z-10">Nouveau</Badge>
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  className="object-cover rounded-md group-hover:scale-105 transition-transform"
                />
              </div>
              <div className='min-h-[60px]'>

                <h3 className="font-medium">
                {product.name.length > 50 ? `${product.name.substring(0, 50)}...` : product.name}
                </h3>
              </div>
              <p className="text-primary">{product.price}DA</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

