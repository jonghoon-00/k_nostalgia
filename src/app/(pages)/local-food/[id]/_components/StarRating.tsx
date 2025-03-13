import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export const StarRating = ({
  rating,
  size
}: {
  rating: number | null;
  size: number;
}) => {
  const stars = Array(5).fill(0);

  return (
    <div className="flex">
      {stars.map((_, index) => {
        if (index < (rating ?? 0) && index + 1 > (rating ?? 0)) {
          return <FaStarHalfAlt key={index} color="#D6A461" size={size} />;
        } else if (index < (rating ?? 0)) {
          return <FaStar key={index} color="#D6A461" size={size} />;
        } else {
          return <FaRegStar key={index} color="#D6A461" size={size} />;
        }
      })}
    </div>
  );
};
