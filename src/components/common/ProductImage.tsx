import React, { useState } from 'react';
import { Package } from 'lucide-react';

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  category?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  category,
}) => {
  const [hasError, setHasError] = useState(false);

  // Category specific pastel accent colors
  const getCategoryBg = (cat?: string) => {
    switch (cat?.toLowerCase()) {
      case 'grains & staples':
        return 'from-amber-100 to-orange-50 text-amber-700';
      case 'oils & ghee':
        return 'from-yellow-100 to-amber-50 text-yellow-700';
      case 'pulses & lentils':
        return 'from-emerald-100 to-teal-50 text-emerald-700';
      case 'dairy & eggs':
        return 'from-sky-100 to-blue-50 text-sky-700';
      case 'pantry & essentials':
        return 'from-purple-100 to-indigo-50 text-purple-700';
      default:
        return 'from-violet-100 to-purple-50 text-violet-700';
    }
  };

  if (!src || hasError) {
    return (
      <div
        className={`bg-gradient-to-br ${getCategoryBg(
          category
        )} flex flex-col items-center justify-center p-3 text-center transition-transform`}
      >
        <Package className="w-8 h-8 opacity-70 mb-1" />
        <span className="text-[11px] font-medium leading-tight line-clamp-2 px-1 opacity-90">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`${className} transition-opacity duration-300`}
      loading="lazy"
    />
  );
};
