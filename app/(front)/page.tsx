/* eslint-disable @next/next/no-img-element */
import ProductItem from '@/components/products/ProductItem';
import data from '@/lib/data';
import productService from '@/lib/services/productService';
import { convertDocToObj } from '@/lib/utils';
import { Metadata } from 'next';
import BannerCarousel from '@/components/BannerCarousel'; // Import the new BannerCarousel component

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Next Amazona V2',
  description:
    process.env.NEXT_PUBLIC_APP_DESC ||
    'Nextjs, Server components, Next auth, daisyui, zustand',
};

export default async function Home() {
  const featuredProducts = await productService.getFeatured();
  const latestProducts = await productService.getLatest();

  return (
    <>
      <BannerCarousel /> {/* Use the BannerCarousel component */}
      <h2 className="text-2xl py-2">Latest Products</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {latestProducts.map((product) => (
          <ProductItem key={product.slug} product={convertDocToObj(product)} />
        ))}
      </div>
    </>
  );
}
