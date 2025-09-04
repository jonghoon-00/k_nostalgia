import { ROUTES } from '@/constants';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import MailIcon from '../icons/MailIcon';
import TitleLogo from '../icons/TitleLogo';

const Footer = () => {
  const navTitle = clsx('text-lg font-semibold mb-4');
  const ulCls = clsx(
    'space-y-2 w-[120px]',
    'flex flex-col gap-4',
    'text-label-normal'
  );
  return (
    <footer
      className={clsx(
        'bg-normal w- z-50',
        'border-t border-[#C8C8C8]',
        'px-20 py-10',
        'flex-nowrap'
        // 'flex flex-col justify-between'
      )}
    >
      <div>
        {/* 상단: 좌측 정보 + 우측 메뉴 */}
        <div
          className={clsx('flex flex-col md:flex-row justify-between gap-10')}
        >
          {/* 좌측 */}
          <div className={clsx('flex flex-col gap-2')}>
            <Link href={'/'} className="mb-4">
              <TitleLogo />
            </Link>
            <p
              className={clsx(
                'text-sm md:text-base text-label-normal leading-6'
              )}
            >
              평일 09:00–18:00 (주말 및 공휴일 휴무)
              <span className="mx-2">|</span>
              <span className="inline-flex items-center gap-2">
                <span role="img" aria-label="email">
                  <MailIcon />
                </span>
                <a
                  href="mailto:lee.hwonn64@gmail.com"
                  className={clsx('hover:underline')}
                >
                  lee.hwonn64@gmail.com
                </a>
              </span>
            </p>

            <Link
              href="https://k-nostalgia.vercel.app/"
              target="_blank"
              className={clsx(
                'inline-flex items-center gap-2',
                'text-label-normal hover:opacity-80'
              )}
            >
              <Image
                src="/image/GitHub.png"
                alt="GitHub"
                width={20}
                height={20}
                className={clsx('h-5 w-5')}
              />
              <span className="text-base">
                Check out the developer&apos;s GitHub
              </span>
            </Link>
          </div>

          {/* 우측 nav */}
          <nav className={clsx('flex flex-wrap gap-20')}>
            {/* 홈 */}
            <div>
              <h4 className={navTitle}>홈</h4>
              <ul className={ulCls}>
                <li>
                  <Link href={ROUTES.MARKET} className="hover:underline">
                    전통시장
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.LOCAL_FOOD} className="hover:underline">
                    특산물
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.MY_PAGE} className="hover:underline">
                    마이페이지
                  </Link>
                </li>
              </ul>
            </div>

            {/* 전통시장 */}
            <div>
              <h4 className={navTitle}>전통시장</h4>
              <ul className={ulCls}>
                <li>
                  <Link href={ROUTES.CART} className="hover:underline">
                    장바구니
                  </Link>
                </li>
              </ul>
            </div>

            {/* 마이페이지 */}
            <div>
              <h4 className={navTitle}>마이페이지</h4>
              <ul className={ulCls}>
                <li>
                  <Link
                    href={ROUTES.INTERESTED_MARKET_PATH}
                    className="hover:underline"
                  >
                    관심 전통시장
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.COUPON} className="hover:underline">
                    할인 쿠폰
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.PAYMENT_HISTORY}
                    className="hover:underline"
                  >
                    주문 내역
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.MY_PAGE} className="hover:underline">
                    마이페이지
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.ADDRESS} className="hover:underline">
                    배송지 관리
                  </Link>
                </li>
              </ul>
            </div>

            {/* 고객 서비스 */}
            <div>
              <h4 className={navTitle}>고객 서비스</h4>
              <ul className={ulCls}>
                <li>
                  <Link href={ROUTES.NOTICE} className="hover:underline">
                    공지사항
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.FAQ} className="hover:underline">
                    자주 묻는 질문
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.NOTICE} className="hover:underline">
                    대량 주문 문의
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.NOTICE} className="hover:underline">
                    판매자 등록 문의
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* 구분선 */}
        <hr className="mt-10 border-t border-[#E6E2DC]" />

        {/* 하단 바 */}
        <div className="mt-4 flex items-center justify-between text-sm text-label-normal">
          <span>© 2024. Lee Hyewon All Rights Reserved.</span>
          <button
            className="inline-flex items-center gap-1 hover:opacity-80"
            type="button"
            aria-label="언어 선택"
          ></button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
