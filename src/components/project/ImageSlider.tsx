import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";

interface ImageSliderProps {
  images: string[];
  alt: string;
}

const ImageSlider = ({ images, alt }: ImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToSlide = (index: number) => {
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          setCurrentIndex(index);
          gsap.fromTo(
            imageRef.current,
            { opacity: 0, scale: 1.05 },
            { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
          );
        },
      });
    } else {
      setCurrentIndex(index);
    }
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  };

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div ref={containerRef} className="relative overflow-hidden rounded-lg aspect-video">
        <img
          src={images[0]}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-lg">
      <div className="relative aspect-video">
        <img
          ref={imageRef}
          src={images[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 backdrop-blur-sm"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 backdrop-blur-sm"
          onClick={goToNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-primary scale-110"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>

      {/* Image counter */}
      <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default ImageSlider;
