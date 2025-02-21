"use client";

import Image from "next/image";
import Link from "next/link";

interface CarouselCardProps {
  title: string;
  price: number;
  images: string[];
  slug: string;
  colors?: string[];
}

const CarouselCard = ({ title, price, images, slug, colors = [] }: CarouselCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(price);
  };

  return (
    <Link href={`/product/${slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-gray-100 mb-4">
        <Image
          src={images[0]}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={false}
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-900 font-medium">{formatPrice(price)}</p>
        
        {colors.length > 0 && (
          <div className="flex gap-1">
            {colors.map((color, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-full border border-gray-300"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default CarouselCard;