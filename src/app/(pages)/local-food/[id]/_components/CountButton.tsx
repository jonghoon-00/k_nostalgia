import { toast } from '@/components/ui/use-toast';
import { CgMathPlus } from 'react-icons/cg';
import { CgMathMinus } from 'react-icons/cg';

interface CountProps {
  count: number | 0;
  onCountChange: (count: number) => void;
}

export const CountButton = ({ count, onCountChange }: CountProps) => {
  const onAddCount = () => {
    onCountChange(count + 1);
  };

  const onSubCount = () => {
    if (count <= 1) {
      toast({
        variant: 'destructive',
        description: '최소 주문 수량은 1개 입니다.'
      });
    } else {
      onCountChange(count - 1);
    }
  };

  return (
    <div className="flex gap-x-4 items-center justify-center border border-label-assistive p-[6px] lg:m-0 rounded-[4px] w-24 mt-2">
      <button onClick={onSubCount} className="rounded-sm">
        <CgMathMinus color="#959595" />
      </button>
      <span>{count}</span>
      <button onClick={onAddCount} className="rounded-sm">
        <CgMathPlus />
      </button>
    </div>
  );
};
