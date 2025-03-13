import { toast } from '@/components/ui/use-toast';
import { useDeleteProduct } from '@/hooks/localFood/useDeleteProduct';

interface ButtonProps {
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
}

export const DeleteButton = ({
  selectedItems,
  setSelectedItems
}: ButtonProps) => {
  const mutation = useDeleteProduct();

  const handleSelectedDelete = () => {
    if (selectedItems.length === 0) {
      toast({
        variant: 'destructive',
        description: '삭제할 상품을 선택해주세요.'
      });
      return;
    }
    selectedItems.forEach((productId) => {
      mutation.mutate(productId);
    });

    setSelectedItems([]);
  };

  return (
    <button
      onClick={handleSelectedDelete}
      className="text-base text-label-alternative font-normal md:bg-[#F2F2F2] md:text-sm md:rounded-[6px] md:px-[10px] md:py-[5px]"
    >
      선택 삭제
    </button>
  );
};
