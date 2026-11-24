"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { L } from "../../components/LanguageProvider";
import { featuredVariant, variants } from "./data";

export default function Jenis() {
  // Gabungkan semua varian (indeks 0 = Batagor Original)
  const allVariants = [featuredVariant, ...variants];
  const [activeIndex, setActiveIndex] = useState(0);

  const topCardRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const activeVariant = allVariants[activeIndex];
  const otherVariants = allVariants
    .map((item, idx) => ({ item, idx }))
    .filter(({ idx }) => idx !== activeIndex);

  // Auto-scroll pelan ke samping (looping mulus)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    let accumulated = 0;
    const speed = 0.6;

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
    hasDraggedRef.current = false;
    setIsDragging(true);
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const distance = x - startXRef.current;
    if (Math.abs(distance) > 5) {
      hasDraggedRef.current = true;
    }
    scrollRef.current.scrollLeft = scrollLeftRef.current - distance * 1.2;
  };

  const stopDragging = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  // Tukar varian saat kartu diklik (bukan saat sedang drag)
  const handleSelectVariant = (idx: number) => {
    if (hasDraggedRef.current) return;
    setActiveIndex(idx);
    topCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Duplikasi daftar varian lainnya supaya looping auto-scroll tidak patah
  const loopVariants = [...otherVariants, ...otherVariants];

  const activeBadge =
    "badge" in activeVariant && activeVariant.badge
      ? activeVariant.badge
      : { id: "Varian Pilihan", en: "Selected Variant" };

  return (
    <section id="jenis" className="page active">
      <div className="section-inner">
        <h2 className="page-title">
          <L id="Jenis-Jenis Batagor" en="Types of Batagor" />
        </h2>

        <div className="jenis-top" ref={topCardRef}>
          <div className="jenis-top-media">
            <Image
              className="jenis-top-photo"
              src={activeVariant.img}
              alt={activeVariant.alt}
              width={activeVariant.w}
              height={activeVariant.h}
              sizes="(max-width: 768px) 100vw, 440px"
              priority
            />
          </div>
          <div className="jenis-top-text">
            <span className="jenis-top-badge">
              <L {...activeBadge} />
            </span>
            <h3>
              <L {...activeVariant.title} />
            </h3>
            <p>
              <L {...activeVariant.detail} />
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
                id="Geser ke samping atau klik kartu untuk melihat detail varian."
                en="Swipe sideways or click a card to view variant details."
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
          {loopVariants.map(({ item: v, idx }, index) => (
            <div
              className="variant-card"
              key={`${v.alt}-${index}`}
              onClick={() => handleSelectVariant(idx)}
              style={{ cursor: "pointer" }}
            >
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