import Image from 'next/image';

interface ImageProps {
  food: string | null;
}

export const DetailImage = ({ food }: ImageProps) => {
  return (
    <section className="max-w-[860px] mx-auto mb-[5.5rem] md:mb-0 ">
      {food && (
        <Image
          src={food}
          width={375}
          height={2451}
          priority
          style={{ objectFit: 'cover' }}
          alt="상세페이지"
          className="mx-auto w-[100%]"
        />
      )}
    </section>
  );
};
