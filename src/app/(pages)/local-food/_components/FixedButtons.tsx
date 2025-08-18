import PayButton from '@/components/ui/PayButton';
import { Tables } from '@/types/supabase';
import { AddCartButton } from './AddCartButton';

interface Props {
  food: Tables<'local_food'>;
  count: number | null;
  onPurchase: () => void;
  isModalOpen: boolean;
  handleCartModalOpen: () => void;
}

const FixedButtons = ({
  food,
  count,
  onPurchase,
  isModalOpen,
  handleCartModalOpen
}: Props) => {
  //할인된 금액
  const discountAmount =
    (food.price ?? 0) - (food.price ?? 0) * ((food.discountRate ?? 0) / 100);

  const product = [
    {
      id: food.product_id,
      name: food.food_name,
      amount: discountAmount * (count ?? 0),
      quantity: count ?? 0
    }
  ];

  return (
    <>
      <div className="bg-normal shadow-custom px-4 pt-3 pb-7 fixed bottom-0 left-0 right-0 z-10 md:hidden">
        <div className="flex gap-3 justify-center">
          <div className="w-1/2">
            <AddCartButton
              food={food}
              count={count}
              handleCartModalOpen={handleCartModalOpen}
            />
          </div>

          <div onClick={onPurchase} className="flex-1 w-1/2">
            {isModalOpen ? (
              <PayButton
                product={product}
                orderNameArr={[food.food_name as string]}
                variant={'buyNow'}
              />
            ) : (
              <button className="min-w-[165px] bg-primary-strong py-3 px-4 rounded-xl text-white w-full text-center text-base leading-7">
                구매하기
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FixedButtons;
