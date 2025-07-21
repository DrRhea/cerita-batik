"use client";
import React, { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const slides = [
  "/images/banners/banner-1.png",
  "/images/banners/banner-2.png",
  "/images/banners/banner-3.png",
];

const animation = { duration: 10000, easing: (t: number) => t };

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    mode: "snap",
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created(s) {
      s.moveToIdx(1, true, animation);
      setLoaded(true);
    },
    updated(s) {
      s.moveToIdx(s.track.details.abs + 1, true, animation);
    },
    dragged(s) {
      s.moveToIdx(s.track.details.abs + 1, true, animation);
    },
  }, [
    (slider) => {
      let timeout: ReturnType<typeof setTimeout>;
      let mouseOver = false;
      function clearNextTimeout() {
        clearTimeout(timeout);
      }
      function nextTimeout() {
        clearTimeout(timeout);
        if (mouseOver) return;
        timeout = setTimeout(() => {
          slider.next();
        }, 5000);
      }
      slider.on("created", () => {
        slider.container.addEventListener("mouseover", () => {
          mouseOver = true;
          clearNextTimeout();
        });
        slider.container.addEventListener("mouseout", () => {
          mouseOver = false;
          nextTimeout();
        });
        nextTimeout();
      });
      slider.on("dragStarted", clearNextTimeout);
      slider.on("animationEnded", nextTimeout);
      slider.on("updated", nextTimeout);
    },
  ]);

  return (
    <div className="relative w-full max-w-7xl">
      <div ref={sliderRef} className="keen-slider aspect-[2/1] rounded-2xl overflow-hidden">
        {slides.map((img, idx) => (
          <div
            key={idx}
            className="keen-slider__slide w-full h-full bg-center bg-contain"
            style={{ backgroundImage: `url('${img}')` }}
          />
        ))}
      </div>
      {loaded && instanceRef.current && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {[
            ...Array(instanceRef.current.track.details.slides.length).keys(),
          ].map((idx) => {
            return (
              <button
                key={idx}
                onClick={() => {
                  instanceRef.current?.moveToIdx(idx);
                }}
                className={"w-3 h-3 rounded-full " + (currentSlide === idx ? "bg-primary" : "bg-white/50")}
              ></button>
            );
          })}
        </div>
      )}
    </div>
  );
} 