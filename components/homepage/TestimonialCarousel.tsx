"use client";

import { useState, useEffect, useCallback } from "react";
import { useTransition, animated } from "react-spring";

interface Testimonial {
  quote: string;
  name: string;
}

export default function TestimonialCarousel() {
  const testimonials: Testimonial[] = [
    {
      quote: "I love this platform! The beauty products are amazing!",
      name: "Jane Doe",
    },
    {
      quote: "Fast delivery and great customer service. Highly recommend!",
      name: "Sarah Lee",
    },
    {
      quote:
        "The variety and quality of products exceeded my expectations. A loyal customer now!",
      name: "Emily Brown",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);

  const transitions = useTransition(currentIndex, {
    key: currentIndex,
    from: {
      opacity: 0,
      transform: direction === 1 ? "translateX(100%)" : "translateX(-100%)",
    },
    enter: { opacity: 1, transform: "translateX(0)" },
    leave: {
      opacity: 0,
      transform: direction === 1 ? "translateX(-100%)" : "translateX(100%)",
    },
    config: { tension: 200, friction: 20 },
  });

  const nextTestimonial = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevTestimonial = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  }, [testimonials.length]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        // Only handle horizontal scroll
        e.preventDefault();
        if (e.deltaX > 0) {
          nextTestimonial();
        } else {
          prevTestimonial();
        }
      }
    },
    [nextTestimonial, prevTestimonial]
  );

  useEffect(() => {
    const debouncedWheelHandler = (e: WheelEvent) => {
      handleWheel(e);
    };

    const interval = setInterval(nextTestimonial, 5000); // Auto-slide every 5 seconds
    window.addEventListener("wheel", debouncedWheelHandler, { passive: false });

    return () => {
      clearInterval(interval);
      window.removeEventListener("wheel", debouncedWheelHandler);
    };
  }, [handleWheel, nextTestimonial]);

  return (
    <section className="py-16 bg-gradient-to-b from-lightBeige to-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-extrabold text-darkGray mb-12 text-center tracking-tight">
          What Our Customers Are Saying
        </h2>

        <div className="relative h-80">
          <div className="relative w-full h-full">
            {transitions((style, item) => (
              <animated.div
                key={item}
                style={style}
                className="absolute w-full flex justify-center items-center h-full"
              >
                <div className="bg-white p-8 rounded-lg shadow-xl max-w-md transform transition-all hover:-translate-y-2 hover:shadow-2xl">
                  <p className="text-lg text-gray-700">
                    &quot;{testimonials[item].quote}&quot;
                  </p>
                  <p className="text-md font-semibold text-teal-500 mt-4">
                    {testimonials[item].name}
                  </p>
                </div>
              </animated.div>
            ))}
          </div>
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-gray-700 hover:text-teal-500"
            aria-label="Previous Testimonial"
          >
            &#10094;
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl text-gray-700 hover:text-teal-500"
            aria-label="Next Testimonial"
          >
            &#10095;
          </button>
        </div>
      </div>
    </section>
  );
}
