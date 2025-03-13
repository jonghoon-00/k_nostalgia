import { Tables } from '@/types/supabase';
import Link from 'next/link';

type Market = Tables<'markets'>;
type LocalFood = Tables<'local_food'>;

interface HomeSearchResultProps {
  response: (Market | LocalFood)[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeIndex: number;
}

const HomeSearchResult = ({
  response,
  setIsOpen,
  activeIndex
}: HomeSearchResultProps) => {
  return (
    <div className="border-t border-label-assistive">
      {response.map((item, index) => {
        if ('시장명' in item) {
          return (
            <Link
              href={`/market/${(item as Market).id}`}
              key={(item as Market).id}
            >
              <div
                onClick={() => setIsOpen(false)}
                className={`cursor-pointer px-3 py-[6px] text-base hover:bg-[#F2F2F2] ${
                  index === activeIndex ? '!bg-[#F2F2F2]' : 'bg-[#FEFEFE]'
                }`}
              >
                {(item as Market).시장명}
              </div>
            </Link>
          );
        }
        // localfood 일 때
        else if ('food_name' in item) {
          return (
            <Link
              href={`/local-food/${(item as LocalFood).product_id}`}
              key={(item as LocalFood).product_id}
            >
              <div
                onClick={() => setIsOpen(false)}
                className={`cursor-pointer px-3 py-[6px] text-base hover:bg-[#F2F2F2]
                  ${index === activeIndex ? 'bg-[#F2F2F2]' : 'bg-[#FEFEFE]'}
                  `}
              >
                {(item as LocalFood).food_name}
              </div>
            </Link>
          );
        }
      })}
    </div>
  );
};

export default HomeSearchResult;
