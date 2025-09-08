'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import 'swiper/css';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import useDeviceSize from '@/hooks/useDeviceSize';
import { MARKET_VIDEOS } from '../data/videoInfo';

export const SectionVideo = () => {
  const { isMobile } = useDeviceSize();

  return (
    <div
      className={clsx(
        'flex flex-col justify-center items-center',
        'h-auto min-h-[405px]',
        'text-center',
        'p-4',
        'md:flex-row md:items-start md:gap-6 md:mx-auto',
        'md:rounded-[12px] md:p-8 md:border md:border-[#C8C8C8]'
      )}
    >
      {isMobile ? <MobileSwiper /> : <DesktopSwiper />}

      <style jsx global>{`
        .marquee-swiper .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </div>
  );
};

/* ----------- 데스크탑 ----------- */
function DesktopSwiper() {
  const swiperRef = useRef<any>(null);

  // 호버 시 수동 멈춤/재시작
  useEffect(() => {
    const el: HTMLElement | null =
      swiperRef.current?.el || swiperRef.current?.$el?.[0] || null;
    if (!el) return;

    const stop = () => swiperRef.current?.autoplay?.stop?.();
    const start = () => swiperRef.current?.autoplay?.start?.();

    el.addEventListener('mouseenter', stop);
    el.addEventListener('mouseleave', start);
    return () => {
      el.removeEventListener('mouseenter', stop);
      el.removeEventListener('mouseleave', start);
    };
  }, []);

  return (
    <Swiper
      key="desktop"
      className="marquee-swiper !h-auto"
      modules={[Autoplay]}
      onSwiper={(sw) => (swiperRef.current = sw)}
      slidesPerView="auto"
      spaceBetween={16}
      grabCursor
      allowTouchMove
      loop
      loopAdditionalSlides={Math.max(24, MARKET_VIDEOS.length * 4)}
      speed={10000}
      autoplay={{
        delay: 0, // 연속 흐름
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      }}
    >
      {MARKET_VIDEOS.map((item) => (
        <SwiperSlide key={item.id} className="!w-[311px]">
          <article className="flex flex-col gap-3">
            <div>
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={260}
                height={260}
                className="w-[260px] h-[260px] object-cover rounded-[12px] md:h-[260px]"
              />
            </div>
            <div>
              <h3>{item.title}</h3>
              <ul>
                {item.contents.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
              <button type="button" aria-label={`${item.title} 영상 보러가기`}>
                영상 보러가기
              </button>
            </div>
          </article>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

/* ---------- 모바일 ---------- */
function MobileSwiper() {
  const swiperRef = useRef<any>(null);

  // 가드 (드래그 후 재시작 방지)
  const hardStop = (sw?: any) => {
    const s = sw ?? swiperRef.current;
    s?.autoplay?.stop?.();
    if (s?.params) s.params.autoplay = false as any;
  };

  return (
    <>
      <Swiper
        key="mobile"
        className="mobile-swiper"
        modules={[Pagination]}
        onSwiper={(sw) => {
          swiperRef.current = sw;
          hardStop(sw);
        }}
        slidesPerView="auto"
        spaceBetween={16}
        loop
        autoplay={false}
        centeredSlides
        onInit={hardStop}
        onTouchStart={hardStop}
        onTouchEnd={hardStop}
        onBreakpoint={hardStop}
      >
        {MARKET_VIDEOS.map((item) => (
          <SwiperSlide key={item.id} className="">
            <article className={clsx('flex flex-col gap-3', '')}>
              <div>
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={238}
                  height={144}
                  className=" rounded-[12px]"
                />
              </div>
              <div>
                <h3 className="text-label-strong font-semibold text-lg">
                  {item.title}
                </h3>
                <ul>
                  {item.contents.map((line, idx) => (
                    <li key={idx} className="text-label-alternative text-sm">
                      {line}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  aria-label={`${item.title} 영상 보러가기`}
                >
                  영상 보러가기
                </button>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>

      {/*  잘림 방지 & 활성 슬라이드 확대 */}
      <style jsx global>{`
        .mobile-swiper {
          overflow: visible !important;
          padding-inline: 12px;
        }
        .mobile-swiper .swiper-wrapper {
          overflow: visible !important;
        }

        /* 슬라이드 기본 상태 */
        .mobile-swiper .swiper-slide {
          position: relative;
          transform: scale(1);
          transition: transform 0.3s ease;
          will-change: transform;
          z-index: 0;
        }

        /* 활성 슬라이드만 확대 + 위로 올리기 */
        .mobile-swiper .swiper-slide-active {
          transform: scale(1.1);
          z-index: 10;
        }
      `}</style>
    </>
  );
}
