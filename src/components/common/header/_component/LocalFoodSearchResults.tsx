import { Tables } from '@/types/supabase';
import Link from 'next/link';

type LocalFood = Tables<'local_food'>;

interface LocalFoodSearchResultProps {
  response: LocalFood[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeIndex: number;
}

const LocalFoodSearchResult = ({
  response,
  setIsOpen,
  activeIndex
}: LocalFoodSearchResultProps) => {
  return (
    <div className="border-t border-label-assistive">
      {response.map((item, index) => (
        <Link href={`/local-food/${item.product_id}`} key={item.product_id}>
          <div
            onClick={() => setIsOpen(false)}
            className={`cursor-pointer px-3 py-[6px] text-base hover:bg-[#F2F2F2] ${
              index === activeIndex ? '!bg-[#F2F2F2]' : 'bg-[#FEFEFE]'
            }`}
            tabIndex={0}
          >
            {item.food_name}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default LocalFoodSearchResult;
