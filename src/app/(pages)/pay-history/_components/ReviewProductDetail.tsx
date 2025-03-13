//작성 리뷰 확인 모달
//작성 리뷰 존재 시 리뷰 수정 , 없을 시 리뷰 작성 버튼 활성화

//update : 24.9.30

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { productImgObject } from '@/hooks/payment/getProductImage';
import { Order, Product } from '@/types/payHistory';
import supabase from '@/utils/supabase/client';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { StarRating } from '../../local-food/[id]/_components/StarRating';
import ReviewForm from './ReviewForm';

interface Props {
  order: Order;
}

const ReviewProductDetail = ({ order }: Props) => {
  //selectedProduct : 리뷰 수정에 사용되는 state
  //186번줄 이벤트 - selectedProduct가 존재할 경우 reviewForm으로 컴포넌트 전환
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  //리뷰 렌더링에 사용되는 state
  const [productsWithReviewStatus, setProductsWithReviewStatus] = useState<any>(
    []
  );

  const [reviewIsOpen, setReviewIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { user_id, payment_date, payment_id } = order;

  useEffect(() => {
    const fetchReview = async () => {
      if (order.products) {
        const updatedProducts = await Promise.all(
          order.products.map(async (product) => {
            const { data, error } = await supabase
              .from('reviews')
              .select('*')
              .eq('product_id', product.id)
              .eq('user_id', user_id as string)
              .eq('payment_id', payment_id)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();
            if (error) {
              console.error(error);
            }
            return {
              ...product,
              hasReview: !!data, //작성 리뷰 존재 여부를 위한 boolean 값
              ...data,
              payment_id: payment_id //해당 주문건의 리뷰만 불러오기 위해 필요
            };
          })
        );
        setProductsWithReviewStatus(updatedProducts);
      }
    };

    fetchReview();
  }, [order.products, user_id, isEditing]);

  const handleOpenChange = async (open: boolean) => {
    if (!open && isEditing) {
      setReviewIsOpen(false);

      setTimeout(async () => {
        const result = await Swal.fire({
          title: '리뷰 작성을 중단하시겠어요?',
          html: `
          <div id="swal2-html-container" class="swal2-html-container" style=" padding:0 !important; margin:-1rem; font-size:16px;">작성 중인 리뷰는 저장되지 않아요.</div>
        `,
          showCancelButton: true,
          cancelButtonColor: '#9C6D2E',
          confirmButtonColor: '#f2f2f2',
          cancelButtonText: '계속 작성하기',
          confirmButtonText: '중단하기',
          customClass: {
            title: 'text-xl mt-10 md:mb-[8px]',
            popup: 'rounded-[16px]',
            actions: 'flex gap-3 mb-6 mt-9 md:mt-[40px] md:mb-[28px]',
            confirmButton:
              'text-status-negative py-3 px-4 rounded-[12px] w-[138px] m-0',
            cancelButton: 'text-white py-3 px-4 rounded-[12px] w-[138px] m-0'
          }
        });

        if (result.isConfirmed) {
          setIsEditing(false);
          setSelectedProduct(null);
        } else {
          setReviewIsOpen(true);
        }
      }, 100);
    } else {
      setReviewIsOpen(open);
    }
  };

  const isDisabled = order.status === 'CANCELLED';

  return (
    <>
      <Dialog open={reviewIsOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger
          onClick={(e) => {
            if (isDisabled) {
              e.preventDefault();
            }
          }}
          className={`flex gap-2 w-[100%] h-[40px] justify-center items-center px-[10px] py-[16px]   text-[14px] text-[#F6F5F3] font-semibold leading-[140%] rounded-[10px] ${
            isDisabled ? 'bg-[#E0DDD9]' : 'bg-[#9C6D2E]'
          }`}
        >
          리뷰 작성하기
        </DialogTrigger>
        <div className="overflow-hidden">
          <DialogContent className="bg-[#FAF8F5] min-w-[330px] w-[80%] h-[627px] rounded-2xl md:max-w-[608px] md:h-[840px] md:overflow-y-auto">
            {selectedProduct ? (
              <ReviewForm
                product={selectedProduct} //상품 정보
                onBack={() => setSelectedProduct(null)} //작성 완료 시, selectedProduct를 비워서 해당 컴포넌트로 복귀
                hasReview={selectedProduct.hasReview} //<boolean>
                payment_date={payment_date}
                setIsEditing={setIsEditing}
                isEditing={isEditing}
              />
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle className="w-full flex justify-center text-center text-[18px] font-semibold leading-[160%]">
                    <p className="text-[18px] font-semibold flex justify-center pt-[12px] pb-[8px]">
                      리뷰 작성 가능 상품
                    </p>
                  </DialogTitle>
                  <div className="flex flex-col">
                    <div className="flex-shrink-0">
                      {productsWithReviewStatus.map((product: Product) => {
                        const { name, id, amount, quantity, hasReview } =
                          product;
                        const date = dayjs(order.payment_date)
                          .locale('ko')
                          .format('YYYY. MM. DD');

                        return (
                          <div key={id} className="py-4 flex gap-3 border-b-2">
                            <div>
                              <img
                                className="rounded-[8px] w-[64px] h-[64px] md:w-[88px] md:h-[88px]"
                                src={productImgObject[name]}
                                alt={name}
                              />
                            </div>
                            <div className="flex flex-col flex-1 items-start">
                              <div className="mb-2">
                                <p className="flex font-medium md:text-[20px]">
                                  {name}
                                </p>
                                <div className="flex gap-[4px] items-center text-[#79746D]">
                                  <p>{amount}원</p>
                                  <p>·</p>
                                  <p>{quantity}개</p>
                                </div>
                                <p className="text-[14px] text-[#AFACA7]">
                                  작성 가능 기한 : {date}
                                </p>
                                <div>
                                  {product.rating ? (
                                    <StarRating
                                      rating={product.rating}
                                      size={24}
                                    />
                                  ) : null}
                                </div>
                              </div>
                              {/* 작성 리뷰가 있을 경우, selectedProduct에 담아서 reviewForm으로 전환 */}
                              <button
                                onClick={() =>
                                  setSelectedProduct({
                                    ...product,
                                    user_id: user_id as string
                                  })
                                }
                                className="flex flex-col g-[33px] px-3 py-2 justify-center self-stretch items-center text-[12px] font-semibold leading-[140%] text-[#9C6D2E] border-[1px] border-[#9C6D2E] rounded-[8px]"
                              >
                                {hasReview
                                  ? '리뷰 수정하기'
                                  : '상세 리뷰 작성하기'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
              </>
            )}
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
};

export default ReviewProductDetail;
