import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { DefaultImage } from '@/components/common/DefaultImage';
import Image from 'next/image';
import { useState } from 'react';

interface SlideProps {
  images: string[] | null;
}

export const ProductSlide = ({ images }: SlideProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  return (
    <>
      <Swiper
        // install Swiper modules
        spaceBetween={10}
        navigation={false}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        {images?.map((img, index) => (
          <SwiperSlide key={index}>
            {img ? (
              <Image
                src={img}
                width={375}
                height={375}
                priority
                alt={`상세 대표 이미지`}
                style={{
                  objectFit: 'cover',
                  borderTopLeftRadius: '12px',
                  borderBottomLeftRadius: '12px'
                }}
              />
            ) : (
              <DefaultImage text={'이미지가 없습니다.'} />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {images?.map((img, index) => (
          <SwiperSlide key={index}>
            {img ? (
              <>
                <Image
                  src={img}
                  width={375}
                  height={375}
                  priority
                  alt={`상세 대표 이미지`}
                  style={{
                    objectFit: 'cover'
                  }}
                />
              </>
            ) : (
              <DefaultImage text={'이미지가 없습니다.'} />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};
