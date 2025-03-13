'use client';

import { useEffect, useRef, useState } from 'react';
import { Review, ReviewType } from './Review';
import useDeviceSize from '@/hooks/useDeviceSize';
import { useQuery } from '@tanstack/react-query';
import supabase from '@/utils/supabase/client';
import Loading from '@/components/common/Loading';
import { ProductSlide } from './web/ProductSlide';
import { ProductDetail } from './web/ProductDetail';
import { DetailSlide } from './DetailSlide';
import { DiscountAmount } from './DiscountAmount';
import { DeliveryInfo } from './DeliveryInfo';
import { DetailImage } from './DetailImage';
import FixedButtons from '../../_components/FixedButtons';
import { OrderDetail } from './OrderDetail';
import { CartModal } from './CartModal';

type ReviewDataType = {
  reviews: ReviewType[];
  totalPages: number;
  totalReviews: number;
};

interface Props {
  id: string;
}

export const LocalDetailView = ({ id }: Props) => {
  const [openModal, setOpenModal] = useState(false); //바텀시트
  const [openCartModal, setOpenCartModal] = useState(false); //카트 담기 완료 모달
  const [activeTab, setActiveTab] = useState('상세 정보');
  const [review, setReview] = useState<ReviewDataType | null>(null);
  const { isDesktop } = useDeviceSize();

  // pc : 섹션 이동
  const reviewRef = useRef<HTMLDivElement | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);

  // pc : 섹션 이동
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === '리뷰' && reviewRef.current) {
      reviewRef.current.scrollIntoView();
    } else if (tab === '상세 정보' && detailRef.current) {
      detailRef.current.scrollIntoView();
    }
  };

  useEffect(() => {
    const fetchReview = async () => {
      const response = await fetch(`/api/review?product_id=${id}`);
      const data = await response.json();
      setReview(data);
      return data;
    };
    fetchReview();
  }, [id]);

  // top 버튼 눌렀을 때 스크롤 값에 따른 tab활성화
  useEffect(() => {
    const handleScroll = () => {
      if (reviewRef.current && detailRef.current) {
        // getBoundingClientRect : 엘리먼트의 상대좌표를 알려주는 객체를 반환
        const reviewTop = reviewRef.current.getBoundingClientRect().top;
        const detailTop = detailRef.current.getBoundingClientRect().top;

        if (detailTop < window.innerHeight) {
          setActiveTab('상세 정보');
        } else if (reviewTop < window.innerHeight) {
          setActiveTab('리뷰');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const {
    data: food,
    isPending,
    error
  } = useQuery({
    queryKey: ['localfood', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('local_food')
        .select('*')
        .eq('product_id', id)
        .single();

      if (error) throw new Error(error.message);

      return data;
    }
  });

  if (isPending) return <Loading />;
  if (error) return <div>오류 {error.message}</div>;

  return (
    <div className="max-w-screen-xl mx-auto">
      {/* 슬라이드 - pc / mo */}
      {isDesktop ? (
        <div className="mt-20 w-[1080px] h-[730px] mx-auto flex justify-center">
          <div className="float-left !w-[540px] h-[730px] z-0">
            <ProductSlide images={food.title_image} />
          </div>
          <div className="float-right">
            <ProductDetail
              id={food.product_id}
              handleCartModalOpen={() => setOpenCartModal(true)}
            />
          </div>
        </div>
      ) : (
        <DetailSlide images={food.title_image} />
      )}

      {/* 상품 정보 */}
      <div className="m-4 md:hidden">
        <h2 className="text-xl font-semibold">
          {`[${food.location}] `}
          {food?.food_name}
        </h2>
        <p className="text-[#AFACA7] text-sm mb-2">{food.description}</p>
        <DiscountAmount food={food} totalSize={'xl'} />
      </div>
      <div className="border-t-4 border-b-4 border-[#F2F2F2] w-full mt-4 p-4 lg:hidden">
        <DeliveryInfo />
      </div>

      {/* 탭 */}
      <div className="border-b-[2px] border-[#F2F2F2] md:mb-6 md:clear-both md:mt-10 md:border-t-8">
        <ul className="flex text-center pt-4 font-semibold md:justify-center md:gap-6">
          <li
            className="flex-1 md:flex-none cursor-pointer"
            onClick={() => handleTabClick('상세 정보')}
          >
            <p
              className={`pb-2 w-[140px] mx-auto ${
                activeTab === '상세 정보'
                  ? 'text-primary-20 border-b-4 border-primary-20'
                  : 'text-label-assistive'
              }`}
            >
              상세 정보
            </p>
          </li>
          <li
            className="flex-1 md:flex-none cursor-pointer"
            onClick={() => handleTabClick('리뷰')}
          >
            <p
              className={`pb-2 w-[140px] mx-auto ${
                activeTab === '리뷰'
                  ? 'text-primary-20 border-b-4 border-primary-20'
                  : 'text-label-assistive'
              }`}
            >
              {`리뷰 (${review?.totalReviews || 0})`}
            </p>
          </li>
        </ul>
      </div>

      {/* 섹션 이동 - pc / mo */}
      {isDesktop ? (
        <>
          <div ref={detailRef}>
            <DetailImage food={food.food_image} />
          </div>
          <div ref={reviewRef} className="border-t-8 border-[#F2F2F2] mt-8">
            <Review productId={food.product_id} />
          </div>
        </>
      ) : (
        <>
          {/* 상세 정보 */}
          {activeTab === '상세 정보' && <DetailImage food={food.food_image} />}
          {/* 리뷰 */}
          {activeTab === '리뷰' && <Review productId={food.product_id} />}
        </>
      )}

      {/* 장바구니 담기, 구매하기 */}
      <FixedButtons
        food={food}
        count={food.count}
        onPurchase={() => setOpenModal(true)}
        isModalOpen={openModal}
        handleCartModalOpen={() => setOpenCartModal(true)}
      />
      {openModal && (
        <div
          className="fixed inset-0 z-[999] bg-[rgba(0,0,0,.24)]"
          onClick={() => setOpenModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()} // 이벤트 버블링 방지
          >
            <OrderDetail
              params={{ id }}
              isModalOpen={openModal}
              onPurchase={() => setOpenModal(true)}
              handleCartModalOpen={() => setOpenCartModal(true)}
            />
          </div>
        </div>
      )}
      {openCartModal && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,.24)] z-[9999]"
          onClick={() => setOpenCartModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()} // 이벤트 버블링 방지
          >
            <CartModal handleCartModalClose={() => setOpenCartModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
