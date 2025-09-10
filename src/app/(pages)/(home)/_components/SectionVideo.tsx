'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useMemo, useRef } from 'react';
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
        .marquee-swiper,
        .marquee-swiper * {
          user-select: none;
          -webkit-user-drag: none;
        }
      `}</style>
    </div>
  );
};

/* ----------- 데스크탑 ----------- */
function DesktopSwiper() {
  const swiperRef = useRef<any>(null);

  const BASE = MARKET_VIDEOS;
  const N = BASE.length;
  // 리스트 확장
  const EXT = useMemo(() => [...BASE, ...BASE, ...BASE], [BASE]);

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

  // 경계 보정 함수: 가운데 블록(N ~ 2N-1) 안에 머물도록 즉시(s=0) 이동
  const keepInMiddle = (sw: any) => {
    const idx = sw.activeIndex ?? 0;
    if (idx >= 2 * N) {
      sw.slideTo(idx - N, 0); // 오른쪽 끝 넘어가면 왼쪽으로 즉시 보정
    } else if (idx < N) {
      sw.slideTo(idx + N, 0); // 왼쪽 끝 넘어가면 오른쪽으로 즉시 보정
    }
  };

  return (
    <Swiper
      key="desktop"
      className="!h-auto"
      modules={[Autoplay]}
      onSwiper={(sw) => {
        swiperRef.current = sw;
        // 시작을 가운데 블록의 첫 슬라이드로 고정
        sw.slideTo(N, 0);
      }}
      slidesPerView="auto"
      spaceBetween={16}
      grabCursor
      allowTouchMove
      loop={false}
      watchSlidesProgress={true}
      normalizeSlideIndex={false}
      speed={10000}
      autoplay={{
        delay: 0,
        disableOnInteraction: true // 사용자 개입 시 정지
      }}
      // 드래그/자동재생으로 인덱스 변경마다 경계 보정
      onSlideChange={(sw) => keepInMiddle(sw)}
      onTransitionEnd={(sw) => keepInMiddle(sw)}
    >
      {EXT.map((item, index) => (
        <SwiperSlide
          key={`${item.id}-${index}`}
          className="!w-[312px] select-none"
        >
          <article className="flex flex-col gap-3">
            <div>
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={260}
                height={260}
                className="w-[260px] h-[260px] rounded-[12px] md:h-[260px]"
                draggable={false}
              />
            </div>
            <div>
              <h3>{item.title}</h3>
              <ul>
                {item.contents.map((line, index) => (
                  <li key={index}>{line}</li>
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
          const slides = sw.slides;
          if (slides.length > 0) {
            slides[0].style.transform = 'scale(1.1)';
          }
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
                  {item.contents.map((line, index) => (
                    <li key={index} className="text-label-alternative text-sm">
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
