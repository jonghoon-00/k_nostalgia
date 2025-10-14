'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useMemo } from 'react';
import 'swiper/css';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import ChevronRightIcon from '@/components/icons/ChevronRightIcon';
import { toast } from '@/components/ui/use-toast';
import useDeviceSize from '@/hooks/useDeviceSize';
import { MARKET_VIDEOS } from '../data/videoInfo';

export const SectionVideo = () => {
  const { isMobile } = useDeviceSize();

  return (
    <div className="my-20 bg-normal">
      <h2
        className={clsx(
          'text-[26px] text-secondary-10 font-custom',
          'flex justify-center',
          'mb-20 md:mb-10'
        )}
      >
        향그리움 추천 영상
      </h2>
      <div
        className={clsx(
          'flex flex-col justify-center items-center',
          'h-auto w-full',
          'text-center',
          'md:flex-row md:items-start md:gap-6 md:mx-auto',
          'md:rounded-[12px]'
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
          .mobile-swiper {
            overflow: visible !important;
          }
          .mobile-swiper .swiper-wrapper {
            overflow: visible !important;
          }
          .mobile-swiper .swiper-slide {
            overflow: visible;
          }
          /* 겹침 순서 보정 */
          .mobile-swiper .swiper-slide {
            z-index: 0;
          }
          .mobile-swiper .swiper-slide-active {
            z-index: 10;
          }
        `}</style>
      </div>
    </div>
  );
};

//style
const cardCls = clsx(
  'flex flex-col justify-center items-center gap-2',
  'border border-secondary-50 rounded-[12px]',
  'p-4 mx-auto',
  'bg-white',
  'md:w-[292px]'
);
const titleText = clsx(
  'text-label-strong font-semibold text-base truncate w-[250px]'
);
const contentText = clsx('text-label-alternative text-xs');
const buttonCls = clsx('text-xs text-label-normal', 'flex gap-1 items-center');

/* ---------- 데스크탑 ---------- */
function DesktopSwiper() {
  const BASE = MARKET_VIDEOS;
  const EXT = useMemo(() => [...BASE, ...BASE, ...BASE], [BASE]);

  return (
    <Swiper
      key="desktop"
      className="marquee-swiper !h-auto"
      modules={[Autoplay]}
      slidesPerView="auto"
      grabCursor
      allowTouchMove
      loop={true}
      watchSlidesProgress
      normalizeSlideIndex={false}
      speed={10000}
      autoplay={{
        delay: 1,
        disableOnInteraction: true,
        pauseOnMouseEnter: true
      }}
    >
      {EXT.map((item, index) => (
        <SwiperSlide
          key={`${item.id}-${index}`}
          className="!w-[312px] select-none"
        >
          <article
            className={cardCls}
            onClick={() => {
              toast({
                description: '데모용 영상 카드입니다.'
              });
              setTimeout(() => {
                toast({
                  description: '실제 영상은 제공되지 않습니다.'
                });
              }, 800);
            }}
          >
            <div>
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={260}
                height={260}
                className="!w-[260px] h-[260px] rounded-[12px] md:!h-[148px] overflow-hidden"
                draggable={false}
              />
            </div>
            <div>
              <h3 className={titleText}>{item.title}</h3>
              <ul className="h-24">
                {item.contents.map((line, i) => (
                  <li key={i} className={contentText}>
                    {line}
                  </li>
                ))}
              </ul>
              <div className="flex justify-end">
                <button
                  type="button"
                  aria-label={`${item.title} 영상 보러가기`}
                  className={buttonCls}
                >
                  <span className="underline">영상 보러가기</span>
                  <ChevronRightIcon width={12} height={12} />
                </button>
              </div>
            </div>
          </article>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

/* ---------- 모바일 ---------- */
function MobileSwiper() {
  const handleSwiperInit = (swiper: any) => {
    const slides = swiper.slides;
    // 첫 번째 슬라이드에 scale(1.1) 적용
    if (slides.length > 0) {
      slides[0].style.transform = 'scale(1.1)';
    }
  };

  return (
    <Swiper
      key="mobile"
      modules={[Pagination]}
      onSlideChange={(swiper) => {
        const slides = swiper.slides;
        slides.forEach((slide) => {
          slide.style.transform = 'scale(1)';
          slide.style.transition = 'transform 0.3s ease';
        });
        slides[swiper.activeIndex].style.transform = 'scale(1.22)';
      }}
      slidesPerView="auto"
      spaceBetween={46}
      loop
      centeredSlides={true}
      onInit={handleSwiperInit}
      className="mobile-swiper"
    >
      {MARKET_VIDEOS.map((item) => (
        <SwiperSlide key={item.id} className="!w-[264px]">
          <article className={cardCls}>
            <div>
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={238}
                height={144}
                style={{
                  borderRadius: '12px',
                  width: '238px',
                  height: '144px'
                }}
              />
            </div>
            <div>
              <h3 className={titleText}>{item.title}</h3>
              <ul className="h-24">
                {item.contents.map((line, index) => (
                  <li key={index} className={contentText}>
                    {line}
                  </li>
                ))}
              </ul>
              <div className="flex justify-end">
                <button
                  type="button"
                  aria-label={`${item.title} 영상 보러가기`}
                  className={buttonCls}
                >
                  <span className="underline">영상 보러가기</span>
                  <ChevronRightIcon width={12} height={12} />
                </button>
              </div>
            </div>
          </article>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
