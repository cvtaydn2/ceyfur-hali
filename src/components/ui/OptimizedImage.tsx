"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  priority?: boolean;
  fallbackSrc?: string;
  containerClassName?: string;
}

export const OptimizedImage = ({
  src,
  alt,
  className,
  containerClassName,
  fallbackSrc,
  priority = false,
  fill,
  ...props
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
    setHasError(true);
    setIsLoading(false);
  };

  return (
    <div
      className={cn(
        "overflow-hidden bg-slate-100",
        fill ? "absolute inset-0" : "relative",
        containerClassName
      )}
    >
      {/* Skeleton — sadece CSS, Framer Motion yok */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse z-10 transition-opacity duration-300" />
      )}

      <Image
        {...props}
        fill={fill}
        priority={priority}
        src={imgSrc}
        alt={alt}
        className={cn(
          "transition-all duration-700 ease-out",
          isLoading ? "scale-105 blur-sm grayscale" : "scale-100 blur-0 grayscale-0",
          className
        )}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
      />

      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-slate-300">
          <span className="text-[10px] font-black uppercase tracking-tighter">Görsel Yüklenemedi</span>
        </div>
      )}
    </div>
  );
};
