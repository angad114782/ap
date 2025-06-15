import { useState, useEffect } from "react";
import Image1 from "@/assets/1.jpg";
import Image2 from "@/assets/2.jpg";
import Image3 from "@/assets/3.jpg";
import Image4 from "@/assets/4.jpg";
import Image5 from "@/assets/5.jpg";

const BannerCarousel = ({ button = true }: { button?: boolean }) => {
  // Sample banner images - you can replace with your own
  const banners = [
    {
      id: 1,
      src: Image1,
      alt: "Banner 1",
    },
    {
      id: 2,
      src: Image2,
      alt: "Banner 2",
    },
    {
      id: 3,
      src: Image3,
      alt: "Banner 3",
    },
    {
      id: 4,
      src: Image4,
      alt: "Banner 4",
    },
    {
      id: 5,
      src: Image5,
      alt: "Banner 5",
    },
  ];

  // Create extended array with duplicates for infinite effect
  const extendedBanners = [
    banners[banners.length - 1], // Last slide duplicate at beginning
    ...banners,
    banners[0], // First slide duplicate at end
  ];

  const [currentSlide, setCurrentSlide] = useState(1); // Start at first real slide
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle infinite loop transitions
  useEffect(() => {
    if (currentSlide === 0) {
      // If we're at the duplicate last slide, jump to real last slide
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(banners.length);
        setTimeout(() => setIsTransitioning(true), 50);
      }, 500);
    } else if (currentSlide === banners.length + 1) {
      // If we're at the duplicate first slide, jump to real first slide
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(1);
        setTimeout(() => setIsTransitioning(true), 50);
      }, 500);
    }
  }, [currentSlide, banners.length]);

  const goToSlide = (index: any) => {
    setCurrentSlide(index + 1); // Adjust for the duplicate slide at beginning
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => prev - 1);
  };

  return (
    <div className="relative w-full  bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
      {/* Carousel Container */}
      <div
        className={`flex h-full ${
          isTransitioning ? "transition-transform duration-500 ease-in-out" : ""
        }`}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {extendedBanners.map((banner, index) => (
          <div
            key={`${banner.id}-${index}`}
            className="w-full h-full flex-shrink-0"
          >
            <img
              src={banner.src}
              alt={banner.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {button && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}
      {/* Dots Navigation */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              currentSlide - 1 === index ||
              (currentSlide === 0 && index === banners.length - 1) ||
              (currentSlide === banners.length + 1 && index === 0)
                ? "bg-white scale-125"
                : "bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
