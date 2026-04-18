"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface OptimizedImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  fallbackSrc?: string;
  containerClassName?: string;
}

export const OptimizedImage = ({
  src,
  alt,
  className,
  containerClassName,
  fallbackSrc = "/images/placeholder.png",
  ...props
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(src);
  const [isError, setIsError] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-slate-100", containerClassName)}>
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse z-10"
          />
        )}
      </AnimatePresence>
      
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        className={cn(
          "transition-all duration-700 ease-out",
          isLoading ? "scale-105 blur-sm grayscale" : "scale-100 blur-0 grayscale-0",
          className
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImgSrc(fallbackSrc);
          setIsError(true);
          setIsLoading(false);
        }}
      />
      
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-slate-300">
          <span className="text-[10px] font-black uppercase tracking-tighter">Görsel Seçilemedi</span>
        </div>
      )}
    </div>
  );
};
