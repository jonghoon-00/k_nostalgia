import Image from 'next/image';
import Link from 'next/link';
import { BsChevronRight } from 'react-icons/bs';

export const SectionVideo = () => {
  return (
    <>
      {/* xs:375 sm:640 md:768 lg:1024 xl:1280 */}
      <div className="flex flex-col md:flex-row md:border md:items-start md:gap-6 md:w-[650px] md:mx-auto md:rounded-[12px] md:p-8 md:border-[#C8C8C8] justify-center items-center text-center my-20">
        <div className="md:py-2 md:flex md:flex-col md:justify-between gap-6 order-1 md:order-2 md:text-left">
          <div>
            <h1 className="text-lg text-label-strong font-semibold">
              안 가면 후회하는 K-관광마켓 4선
            </h1>
            <p className="text-sm font-medium tracking-tight text-label-assistive mt-1">
              한국에서만 만나볼 수 있는 특별한 관광, 전통시장 <br />그 중에서도
              제일 인기있는 4개의 시장을 소개합니다!
            </p>
          </div>
          <Link
            href={'https://www.youtube.com/watch?v=ym2iQ9HCydM'}
            target="_blank"
            className="hidden md:flex items-center gap-1 mt-[20%] translate-y-[-17%]"
          >
            <p className="underline text-label-normal text-sm font-medium">
              영상보러 가기
            </p>
            <BsChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <Link
          href={'https://www.youtube.com/watch?v=ym2iQ9HCydM'}
          target="_blank"
          className="order-2 md:order-1"
        >
          <Image
            src={
              'https://kejbzqdwablccrontqrb.supabase.co/storage/v1/object/public/local-food/youtube.png'
            }
            width={260}
            height={180}
            priority
            alt="시장 유튜브 이미지"
            style={{
              width: 260,
              height: 180,
              objectFit: 'cover',
              borderRadius: '12px'
            }}
            className="md:my-0 my-8"
          />
        </Link>
        <Link
          href={'https://www.youtube.com/watch?v=ym2iQ9HCydM'}
          target="_blank"
          className="flex items-center gap-1 order-3 md:hidden"
        >
          <p className="underline text-label-normal text-sm font-medium">
            영상보러 가기
          </p>
          <BsChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </>
  );
};
