import { toast } from '@/components/ui/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GoHeart, GoHeartFill } from 'react-icons/go';

interface MarketLikesPropsType {
  userId?: string;
  marketId: number;
  pixel: number;
}

const MarketLikes = ({ userId, marketId, pixel }: MarketLikesPropsType) => {
  const handleHeart = async () => {
    if (!userId) {
      return toast({
        variant: 'destructive',
        description: '로그인 후 이용할 수 있어요.'
      });
    }
    heartMutate(isLiked);
  };
  const getIsLiked = async () => {
    const response = await fetch(
      `/api/market/likes/${userId}?marketId=${marketId}`
    );
    const data = await response.json();

    return data;
  };

  const toggleHeart = async (isLiked: boolean) => {
    if (!isLiked) {
      const response = await fetch(`/api/market/likes/${userId}`, {
        method: 'POST',
        body: JSON.stringify(marketId)
      });
      console.log('response____', response);
    } else {
      const response = await fetch(`/api/market/likes/${userId}`, {
        method: 'DELETE',
        body: JSON.stringify(marketId)
      });
    }
  };

  const {
    data: isLiked,
    isError,
    isPending
  } = useQuery({
    queryKey: ['likes', userId, marketId],
    queryFn: getIsLiked
  });

  const queryClient = useQueryClient();

  const { mutate: heartMutate } = useMutation({
    mutationFn: toggleHeart,
    onMutate: async (isLiked) => {
      await queryClient.cancelQueries({
        queryKey: ['likes', userId, marketId]
      });
      const previousHeart = queryClient.getQueryData([
        'like',
        userId,
        marketId
      ]);
      queryClient.setQueriesData(
        { queryKey: ['likes', userId, marketId] },
        !isLiked
      );
      return { previousState: previousHeart };
    },
    onError: (err, isLiked, context) => {
      queryClient.setQueriesData(
        { queryKey: ['likes', userId, marketId] },
        context?.previousState
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['likes', userId, marketId] });
    }
  });

  if (isPending) {
    return (
      <div className={`w-${pixel} h-${pixel}`}>
        <GoHeart className={`w-full h-full text-[#545454] md:text-white`} />
      </div>
    );
  }

  if (!userId) {
    return (
      <button onClick={() => handleHeart()} className={`w-${pixel} h-${pixel}`}>
        <GoHeart className={`w-full h-full text-[#545454] md:text-white`} />
      </button>
    );
  }

  return (
    <div className={`w-${pixel} h-${pixel}`}>
      <button onClick={() => handleHeart()} className={`w-full h-full`}>
        {isLiked ? (
          <GoHeartFill className={`w-full h-full text-[#DB3B3B]`} />
        ) : (
          <GoHeart className={`w-full h-full text-[#545454] md:text-white`} />
        )}
      </button>
    </div>
  );
};

export default MarketLikes;
