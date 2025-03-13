import supabase from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

export const useGetProduct = ({
  params: { id }
}: {
  params: { id: string };
}) => {
  const {
    data: food,
    isPending,
    error
  } = useQuery({
    queryKey: ['localfood', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('local_food')
        .select('*')
        .eq('product_id', id)
        .single();

      if (error) throw new Error(error.message);

      return data;
    }
  });
  return { food, isPending, error };
};
