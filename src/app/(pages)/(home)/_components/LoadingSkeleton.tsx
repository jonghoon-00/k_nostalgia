import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonProps {
  columns: number;
  count: number;
}

export function SkeletonCard({ columns, count }: SkeletonProps) {
  return (
    <div className={`grid grid-cols-${columns} gap-4 mx-4 md:mx-0`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton
            className={`${
              columns === 1
                ? 'h-[374px] w-[351px] mx-auto'
                : 'h-[120px] md:h-[205px] w-full'
            } rounded-xl bg-label-disable`}
          />
          <div
            className={`${
              columns === 1 ? 'w-[351px]' : 'w-full'
            } space-y-2 mx-auto`}
          >
            <Skeleton className="h-4 w-full rounded-xl bg-label-disable" />
            <Skeleton className="h-4 w-40 rounded-xl bg-label-disable" />
          </div>
        </div>
      ))}
    </div>
  );
}
