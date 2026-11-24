"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { L } from "../../components/LanguageProvider";
import { featuredVariant, variants } from "./data";

export default function Jenis() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  // Auto-scroll pelan ke samping (looping mulus)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    let accumulated = 0;
    const speed = 0.6; // makin kecil makin pelan

    const step = () => {
      if (!isPausedRef.current && !isDraggingRef.current) {
        accumulated += speed;
        if (accumulated >= 1) {
          const move = Math.floor(accumulated);
          el.scrollLeft += move;
          accumulated -= move;

          if (el.scrollLeft >= el.scrollWidth / 2) {
            el.scrollLeft = 0;
          }
        }
      }
      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Geser manual dengan klik-tahan mouse (drag)
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.2;
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const stopDragging = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  // Duplikasi daftar varian supaya looping auto-scroll tidak patah
  const loopVariants = [...variants, ...variants];

  return (
    <section id="jenis" className="page active">
      <div className="section-inner">
        <h2 className="page-title">
          <L id="Jenis-Jenis Batagor" en="Types of Batagor" />
        </h2>

        <div className="jenis-top">
          <div className="jenis-top-media">
            <Image
              className="jenis-top-photo"
              src={featuredVariant.img}
              alt={featuredVariant.alt}
              width={featuredVariant.w}
              height={featuredVariant.h}
              sizes="(max-width: 768px) 100vw, 440px"
              priority
            />
          </div>
          <div className="jenis-top-text">
            <span className="jenis-top-badge">
              <L {...featuredVariant.badge} />
            </span>
            <h3>
              <L {...featuredVariant.title} />
            </h3>
            <p>
              <L {...featuredVariant.text} />
            </p>
          </div>
        </div>

        <div className="variant-header-row">
          <div>
            <h3 className="sub-title">
              <L id="Varian Lainnya" en="Other Variants" />
            </h3>
            <p className="scroll-hint">
              <L
                id="Geser ke samping untuk melihat varian lainnya."
                en="Swipe sideways to see more variants."
              />
            </p>
          </div>
        </div>

        <div
          className="variant-scroll"
          ref={scrollRef}
          style={{
            scrollBehavior: "auto",
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
          }}
          onMouseEnter={() => {
            isPausedRef.current = true;
          }}
          onMouseLeave={() => {
            isPausedRef.current = false;
            stopDragging();
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}
          onTouchStart={() => {
            isPausedRef.current = true;
          }}
          onTouchEnd={() => {
            isPausedRef.current = false;
          }}
        >
          {loopVariants.map((v, index) => (
            <div className="variant-card" key={`${v.alt}-${index}`}>
              <Image
                className="thumb-sm"
                src={v.img}
                alt={v.alt}
                width={v.w}
                height={v.h}
                sizes="260px"
                draggable={false}
              />
              <h4>
                <L {...v.title} />
              </h4>
              <p>
                <L {...v.text} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}