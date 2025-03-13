'use client';

import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import { MainMarket } from './SectionMarket';
import { LikeButton } from './LikeButton';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';

interface marketProps {
  images: MainMarket | null | undefined;
}

export const SlideBanner = ({ images }: marketProps) => {
  const { data: user } = useUser();

  const handleSwiperInit = (swiper: any) => {
    const slides = swiper.slides;
    // 첫 번째 슬라이드에 대해 scale(1.1) 적용
    if (slides.length > 0) {
      slides[0].style.transform = 'scale(1.1)';
    }
  };

  return (
    <Swiper
      // install Swiper modules
      modules={[Pagination]}
      spaceBetween={32}
      slidesPerView={'auto'}
      onInit={handleSwiperInit}
      onSlideChange={(swiper) => {
        const slides = swiper.slides;
        slides.forEach((slide) => {
          slide.style.transform = 'scale(1)';
          slide.style.transition = 'transform 0.3s ease';
        });
        slides[swiper.activeIndex].style.transform = 'scale(1.1)';
      }}
      centeredSlides={true}
      pagination={{ clickable: true }}
      className="!pb-[110px] !pt-10"
    >
      {images?.slice(0, 6).map((item, index) => (
        <SwiperSlide key={index} className="!w-[319px] ">
          <Link href={`/market/${item.id}`}>
            <div>
              {item.이미지 ? (
                <Image
                  src={`${item.이미지[0]?.link}`}
                  width={454}
                  height={340}
                  alt={`Slide ${index + 1}`}
                  priority
                  loading="eager"
                  style={{
                    height: 340,
                    border: '3px solid #9C6D2E',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px'
                  }}
                />
              ) : (
                <>
                  <Image
                    src={'/image/StateSad.png'}
                    width={113}
                    height={96}
                    alt="default"
                    className="mx-auto"
                  />
                  <p className="text-label-assistive text-lg mt-4 font-medium">
                    이미지가 없습니다
                  </p>
                </>
              )}
            </div>
          </Link>
          <div className="bg-primary-20 text-label-light p-4 rounded-br-[12px] rounded-bl-[12px]">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{item.시장명}</h2>
              <LikeButton marketId={item.id} userId={user?.id as string} />
            </div>
            <div className="text-sm mt-2 leading-[22.4px]">
              <p>전통시장</p>
              <p>{item.도로명주소}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
