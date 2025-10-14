'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel';
import useDeviceSize from '@/hooks/useDeviceSize';
import { banners, webBanners } from '@/lib/banners';
import Autoplay from 'embla-carousel-autoplay';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const SectionBanner = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const { isDesktop } = useDeviceSize();
  const guestCookie = Cookies.get('guest') === 'true';

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className={`w-full mx-auto mt-16`}>
      <Carousel
        setApi={setApi}
        plugins={[
          Autoplay({
            delay: 4000
          })
        ]}
      >
        <CarouselContent>
          {(isDesktop ? webBanners : banners).map((img, index) => (
            <CarouselItem
              key={index}
              className="flex justify-center items-center relative w-full"
            >
              <Link
                href={
                  !guestCookie && index === 1 ? '/my-page/coupon-page' : '#'
                }
                className="flex-1"
              >
                <Image
                  src={img}
                  width={isDesktop ? 1280 : 375}
                  height={isDesktop ? 280 : 335}
                  priority
                  alt={`메인 배너 이미지 ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',

                    objectFit: 'cover'
                  }}
                />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div
          className={`absolute right-4 translate-x-[-10%] bottom-[1rem] translate-y-0 `}
        >
          {isDesktop ? (
            <div className="flex gap-2 px-3 py-2 bg-[rgba(0,0,0,.24)] rounded-[12px] text-center text-label-light text-xs font-medium">
              <CarouselPrevious />
              {`${current} / ${count}`}
              <CarouselNext />
            </div>
          ) : (
            <div className="px-[10px] py-[2px] bg-[rgba(0,0,0,.24)] rounded-[12px] text-center text-label-light text-xs font-medium">{`${current} / ${count}`}</div>
          )}
        </div>
      </Carousel>
    </div>
  );
};
