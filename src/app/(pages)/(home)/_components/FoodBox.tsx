import { DefaultImage } from '@/components/common/DefaultImage';
import { Tables } from '@/types/supabase';
import Image from 'next/image';
import Link from 'next/link';

interface FoodProps {
  item: Tables<'local_food'>;
  index: number;
}

export const FoodBox = ({ item, index }: FoodProps) => {
  const { title_image, food_name, description, price } = item;
  return (
    <>
      {/* xs:375 sm:640 md:768 lg:1024 xl:1280 */}

      <li
        className={`${index === 0 || index === 1 ? 'translate-y-[20%]' : ''}
      ${index === 2 ? 'translate-y-[19%]' : ''}
      `}
      >
        <Link href={`/local-food/${item.product_id}`}>
          {title_image ? (
            <Image
              src={title_image[0]}
              width={160}
              height={index === 1 || index === 2 ? 142 : 194}
              alt={`${food_name}이미지`}
              priority
              style={{
                width: 160,
                height: index === 1 || index === 2 ? 142 : 194,
                objectFit: 'cover',
                borderRadius: '12px',
                border: '1px solid #FFF3E3'
              }}
            />
          ) : (
            <DefaultImage text={'상품이미지가 없습니다'} />
          )}
          <div>
            <h2 className="text-label-strong leading-7 mt-2">{food_name}</h2>
            <p className="text-label-light text-xs leading-4">{description}</p>
            <p className="text-label-light text-sm font-bold mt-2">{`${price?.toLocaleString()}원`}</p>
          </div>
        </Link>
      </li>
    </>
  );
};
