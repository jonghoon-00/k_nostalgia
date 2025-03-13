import Link from 'next/link';
import { BsCheck2 } from 'react-icons/bs';
import Cookies from 'js-cookie';
import { toast } from '@/components/ui/use-toast';

interface CartModalProps {
  handleCartModalClose: () => void;
}

export const CartModal = ({ handleCartModalClose }: CartModalProps) => {
  const guestCookie = Cookies.get('guest') === 'true';

  const handleGuest = () => {
    if (guestCookie) {
      toast({
        variant: 'destructive',
        description: '로그인 후 이용해주세요'
      });
      return;
    }
  };
  return (
    <div className="flex flex-col justify-center items-center text-center fixed left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] rounded-[16px] z-10 bg-normal w-[330px] h-[358px]">
      <div>
        <BsCheck2
          className="mx-auto w-[60px] h-[60px]"
          style={{ color: '#A87939' }}
        />
        <div className="my-8">
          <h2 className="text-xl font-semibold text-label-strong mb-1">
            상품을 장바구니에 담았어요
          </h2>
          <p className="text-base font-medium text-label-assistive">
            장바구니를 확인하러 갈까요?
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleCartModalClose}
            className="w-[280px] px-4 py-3 text-label-light font-semibold text-base rounded-[12px] bg-primary-20"
          >
            계속 쇼핑하기
          </button>
          <Link href={!guestCookie ? '/cart' : ''}>
            <button
              onClick={handleGuest}
              className="text-base font-medium text-label-assistive underline py-2"
            >
              장바구니로 이동
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
