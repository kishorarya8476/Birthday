import { gsap } from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import "./Gallery.css";

function Gallery({ isActive }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photosRevealed, setPhotosRevealed] = useState(false);

  const photosRef = useRef([]);
  const lightboxImgRef = useRef(null);

  const mediaItems = [
    { src: "/images/pic2.jpg", alt: "Memory 2", type: 'image' },
    { src: "/images/pic4.jpg", alt: "Memory 4", type: 'image' },
    { src: "/images/pic1.jpg", alt: "Memory 1", type: 'image' },
    { src: "/images/pic3.jpg", alt: "Memory 3", type: 'image' },
    { src: "/images/pic5.jpg", alt: "Memory 5", type: 'image' },
    { src: "/images/pic6.jpg", alt: "Memory 6", type: 'image' },
    { src: "/images/pic7.jpg", alt: "Memory 7", type: 'image' },
    { src: "/images/pic8.jpg", alt: "Memory 8", type: 'image' },
    { src: "/images/vid1.mp4", alt: "Memory 9", type: 'video' },
    // { src: "/images/.mp4", alt: "Memory 8", type: 'video' },
  ];

  // Reveal photos with GSAP when page becomes active
  useEffect(() => {
    if (isActive && !photosRevealed) {
      setTimeout(() => setPhotosRevealed(true), 10);

      // Stagger animation for photos
      gsap.fromTo(
        photosRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "back.out(1.4)",
          delay: 0.2,
        }
      );
    }
  }, [isActive, photosRevealed]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);

    // Animate lightbox appearance
    if (lightboxImgRef.current) {
      gsap.fromTo(
        lightboxImgRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.4)" }
      );
    }
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  // Handle body overflow in effect
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  const showNext = useCallback(() => {
    const newIndex = (currentIndex + 1) % mediaItems.length;
    
    // Pause any currently playing video when changing media
    if (lightboxImgRef.current && lightboxImgRef.current.pause) {
      lightboxImgRef.current.pause();
    }

    // Animate transition
    if (lightboxImgRef.current) {
      gsap.to(lightboxImgRef.current, {
        x: -100,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setCurrentIndex(newIndex);
          gsap.fromTo(
            lightboxImgRef.current,
            { x: 100, opacity: 0 },
            { 
              x: 0, 
              opacity: 1, 
              duration: 0.3, 
              ease: "power2.out",
              onComplete: () => {
                // Auto-play video if the new item is a video
                if (mediaItems[newIndex].type === 'video' && lightboxImgRef.current) {
                  lightboxImgRef.current.play().catch(e => console.log('Autoplay prevented:', e));
                }
              }
            }
          );
        },
      });
    } else {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex, mediaItems]);

  const showPrev = useCallback(() => {
    const newIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
    
    // Pause any currently playing video when changing media
    if (lightboxImgRef.current && lightboxImgRef.current.pause) {
      lightboxImgRef.current.pause();
    }

    // Animate transition
    if (lightboxImgRef.current) {
      gsap.to(lightboxImgRef.current, {
        x: 100,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setCurrentIndex(newIndex);
          gsap.fromTo(
            lightboxImgRef.current,
            { x: -100, opacity: 0 },
            { 
              x: 0, 
              opacity: 1, 
              duration: 0.3, 
              ease: "power2.out",
              onComplete: () => {
                // Auto-play video if the new item is a video
                if (mediaItems[newIndex].type === 'video' && lightboxImgRef.current) {
                  lightboxImgRef.current.play().catch(e => console.log('Autoplay prevented:', e));
                }
              }
            }
          );
        },
      });
    } else {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex, mediaItems]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;

      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        showPrev();
      } else if (e.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, showNext, showPrev, closeLightbox]);

  return (
    <section className="gallery">
      <h2>📸 Our Beautiful Memories</h2>
      <div className="photos">
        {mediaItems.map((item, index) => (
          <div 
            key={index}
            ref={(el) => (photosRef.current[index] = el)}
            className="gallery-item"
            onClick={() => openLightbox(index)}
          >
            {item.type === 'video' ? (
              <video
                src={item.src}
                alt={item.alt}
                poster={item.poster}
                className="gallery-video"
                preload="metadata"
              />
            ) : (
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="gallery-image"
              />
            )}
            {item.type === 'video' && (
              <div className="play-icon">▶</div>
            )}
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          {mediaItems[currentIndex].type === 'video' ? (
            <video
              ref={lightboxImgRef}
              src={mediaItems[currentIndex].src}
              controls
              autoPlay
              className="lightbox-media"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              ref={lightboxImgRef}
              src={mediaItems[currentIndex].src}
              alt={mediaItems[currentIndex].alt}
              className="lightbox-media"
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <button
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            ✖
          </button>
          <button
            className="nav-btn nav-prev"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            className="nav-btn nav-next"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Next photo"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}

export default Gallery;
