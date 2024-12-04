"use client";

import { useState, useEffect, useCallback } from "react";
import { useTransition, animated } from "react-spring";

// Define types for testimonial and event
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
  const [direction, setDirection] = useState<number>(1); // 1 for next, -1 for previous

  // React Spring Transition
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

  // Function to go to the next testimonial
  const nextTestimonial = useCallback(() => {
    setDirection(1); // Set the direction for the transition to right
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }, [testimonials.length]);

  // Function to go to the previous testimonial
  const prevTestimonial = useCallback(() => {
    setDirection(-1); // Set the direction for the transition to left
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  }, [testimonials.length]);

  // Handle wheel scrolling
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (e.deltaY > 0) {
        // Scroll down (next testimonial)
        nextTestimonial();
      } else {
        // Scroll up (previous testimonial)
        prevTestimonial();
      }
    },
    [nextTestimonial, prevTestimonial] // Dependencies to ensure these functions are stable
  );

  // Add event listener for wheel scroll
  useEffect(() => {
    const handleWheelEvent = (e: WheelEvent) => handleWheel(e);
    window.addEventListener("wheel", handleWheelEvent, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheelEvent);
    };
  }, [handleWheel]); // Dependency array to re-add listener when handleWheel changes

  return (
    <section className="py-16 bg-gradient-to-b from-lightBeige to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-darkGray mb-12 text-center tracking-tight">
          What Our Customers Are Saying
        </h2>

        {/* Testimonial Carousel */}
        <div className="relative h-80">
          {/* Fix the height of the container */}
          <div className="swiper-container relative">
            {transitions((style, item) => (
              <animated.div
                style={style}
                className="swiper-wrapper flex gap-8 justify-center absolute w-full"
                key={item}
              >
                <div className="swiper-slide bg-white p-8 rounded-lg shadow-xl max-w-md transform transition-all hover:-translate-y-3 hover:shadow-2xl">
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
          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 text-2xl text-gray-700 hover:text-teal-500"
          >
            &#10094;
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-2xl text-gray-700 hover:text-teal-500"
          >
            &#10095;
          </button>
        </div>
      </div>
    </section>
  );
}
