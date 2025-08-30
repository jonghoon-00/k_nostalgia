//리뷰 작성 폼 (모달)
//feat : 리뷰 작성, 수정, 삭제

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { DialogHeader } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { productImgObject } from '@/hooks/payment/getProductImage';
import supabase from '@/utils/supabase/client';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import dayjs from 'dayjs';
import { ChevronLeft } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  product: any;
  onBack: () => void; //리뷰 작성 및 수정 완료 시, selectedProduct state를 비워 컴포넌트 전환하는 함수
  hasReview?: boolean;
  payment_date: string | null;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  isEditing: boolean;
};

const ReviewForm = ({
  product,
  onBack,
  hasReview,
  payment_date,
  isEditing,
  setIsEditing
}: Props) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');

  const date = dayjs(payment_date).locale('ko').format('YYYY. MM. DD');
  const { name, amount, quantity, id, user_id, review_id } = product;

  const [reviewInputCount, setReviewInputCount] = useState(0);

  //리뷰 textarea onchange 핸들러
  const onReviewInputHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setContent(e.target.value);
    setReviewInputCount(e.target.value.length);
  };

  useEffect(() => {
    setIsEditing(true);
    return () => setIsEditing(false);
  }, []);

  //작성 리뷰가 존재할 경우 불러와서 띄우기(별점, 내용)
  useEffect(() => {
    if (hasReview) {
      const fetchReview = async () => {
        const { data } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', product.id)
          .eq('user_id', user_id as string)
          .eq('review_id', review_id)
          .order('created_at', { ascending: false })
          .single();

        if (data) {
          setRating(data.rating as number);
          setContent(data.content as string);
        }
      };
      fetchReview();
    }
  }, [hasReview, product.id, product.user_id, isEditing]);

  //리뷰 작성 및 수정
  const submitReview = async () => {
    if (rating === 0) {
      return toast({
        variant: 'destructive',
        description: '별점은 필수로 입력해주세요.'
      });
    }
    const reviewData = {
      review_id: uuidv4(),
      product_id: product.id,
      user_id: product.user_id,
      rating,
      content,
      payment_id: product.payment_id
    };
    let error;
    if (hasReview) {
      const { error: updateError } = await supabase
        .from('reviews')
        .update(reviewData)
        .eq('product_id', product.id)
        .eq('user_id', product.user_id as string);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('reviews')
        .insert(reviewData);
      error = insertError;
    }

    if (error) {
      console.log(error);
      toast({
        variant: 'destructive',
        description: '리뷰 저장 중 오류가 발생했습니다.'
      });
    } else {
      toast({
        description: hasReview
          ? '리뷰가 수정되었습니다.'
          : '리뷰가 작성되었습니다.'
      });
      setIsEditing(false);
      onBack();
    }
  };

  //리뷰 삭제
  const DeleteHandler = async () => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('product_id', product.id)
        .eq('user_id', product.user_id as string);

      if (error) throw error;
      setIsEditing(false);
      toast({
        description: '리뷰가 삭제되었습니다.'
      });
      onBack();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        variant: 'destructive',
        description: '리뷰 삭제 중 오류가 발생했습니다.'
      });
    }
  };

  return (
    <>
      <div aria-hidden="true">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-between pt-[12px] pb-[8px]">
              <button
                onClick={onBack}
                className="text-gray-500"
                aria-label="뒤로 가기"
              >
                <ChevronLeft size={34} />
              </button>
              <p className="text-[18px] font-semibold flex justify-center leading-[160%]">
                리뷰 작성하기
              </p>
              <div className="invisible">
                <ChevronLeft size={34} />
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>

        <div>
          <div
            key={id}
            className="py-4 flex gap-3 border-b-2 border-[#F2F2F2] mt-[6px]"
          >
            <div>
              <img
                className="w-[64px] h-[64px] rounded-[8px] md:w-[88px] md:h-[88px]"
                src={productImgObject[name]}
                alt={name}
              />
            </div>
            <div className="flex flex-col items-start w-full flex-1">
              {hasReview && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="absolute right-0 mr-4 py-1 px-2 text-[12px] text-[#1F1E1E] font-normal leading-[140%] bg-[#F2F2F2] rounded-[6px] md:text-[14px]">
                      삭제
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[330px] h-[220px] flex flex-col justify-center gap-1">
                    <AlertDialogHeader className="flex flex-col  gap-0 justify-center">
                      <AlertDialogTitle className="flex justify-center ">
                        리뷰를 삭제하시겠어요?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="flex justify-center ">
                        삭제 후에는 복구나 재작성이 불가해요
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className=" pt-6 flex items-end">
                      <AlertDialogAction
                        onClick={DeleteHandler}
                        className="text-[#ED1B18]"
                      >
                        삭제하기
                      </AlertDialogAction>
                      <AlertDialogCancel className="bg-[#9C6D2E] text-white">
                        계속 작성하기
                      </AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <div className="flex flex-col mb-2 md:gap-[6px]">
                <p className="flex font-medium md:text-[20px]">{name}</p>
                <div className="flex gap-[4px] items-center text-[#79746D] font-medium md:text-[16px]">
                  <p>{amount}원</p>
                  <p>·</p>
                  <p>{quantity}개</p>
                </div>
                <p className="font-normal text-[#AFACA7] text-[14px]">
                  작성 가능 기한 : {date}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center py-4 gap-3 -mx-4 border-b-[6px] border-[#F2F2F2]">
            <h2 className="font-semibold">상품의 품질은 어땠나요?</h2>
            <div className="flex items-center mb-2">
              {[1, 2, 3, 4, 5].map((star, index) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    star <= rating ? 'text-[#D6A461]' : 'text-[#E0E0E0]'
                  }`}
                >
                  <FaStar key={index} />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="relative">
          <textarea
            value={content}
            onChange={onReviewInputHandler}
            maxLength={1000}
            placeholder="상품에 대한 솔직한 리뷰를 작성해주세요 :)"
            className="w-full h-[243px] p-4 border-[1px] border-[#959595] rounded-[8px] focus:outline-none focus:ring-1 focus:ring-[#9C6D2E] resize-none md:h-[420px] placeholder:[#AFACA7]"
          />
          <p className="absolute right-2 bottom-2 text-[14px]">
            {reviewInputCount}/1,000
          </p>
        </div>
      </div>
      <div className="flex -mx-4 w-[calc(100%+2rem)] shadow-custom pt-3 pb-6">
        <button
          onClick={submitReview}
          className="my-2 mx-[16px] h-12 bg-[#9C6D2E] text-white px-4 py-2 rounded-[10px] w-full"
        >
          {hasReview ? '리뷰 수정 완료' : '리뷰 작성 완료'}
        </button>
      </div>
    </>
  );
};

export default ReviewForm;
