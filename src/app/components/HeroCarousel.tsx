"use client";
import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const slides = [
  "/images/banners/banner-1.png",
  "/images/banners/banner-2.png",
  "/images/banners/banner-3.png",
];

export default function HeroCarousel() {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    mode: "snap",
  });

  return (
    <div ref={sliderRef} className="keen-slider w-full max-w-7xl aspect-[2/1] rounded-2xl overflow-hidden shadow-lg bg-white">
      {slides.map((img, idx) => (
        <div
          key={idx}
          className="keen-slider__slide w-full h-full bg-center bg-contain"
          style={{ backgroundImage: `url('${img}')` }}
        />
      ))}
    </div>
  );
} 