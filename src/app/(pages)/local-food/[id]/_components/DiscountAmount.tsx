import { Tables } from '@/types/supabase';

interface AmountProps {
  food: Tables<'local_food'>;
  totalSize: string;
}

export const DiscountAmount = ({ food, totalSize }: AmountProps) => {
  return (
    <>
      <div className="text-sm">
        {`${food.discountRate}%`}
        <span className="inline-block text-base ml-1 text-label-assistive line-through">
          {food.price?.toLocaleString()} 원
        </span>
      </div>
      <p className={`text-${totalSize} text-primary-20 font-semibold`}>
        {(
          (food.price ?? 0) -
          (food.price ?? 0) * ((food.discountRate ?? 0) / 100)
        )?.toLocaleString()}
        원
      </p>
    </>
  );
};
