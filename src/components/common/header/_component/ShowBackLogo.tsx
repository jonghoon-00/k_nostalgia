'use client';

import { BackButton } from '@/components/icons/BackButton';
import TitleLogo from '@/components/icons/TitleLogo';
import { useRouter } from 'next/navigation';

interface ShowBackLogoProps {
  showBackButton: boolean;
  showLogo: boolean;
}

const ShowBackLogo = ({ showBackButton, showLogo }: ShowBackLogoProps) => {
  const router = useRouter();

  // 뒤로가기 = true, showLogo = false 뒤로가기 보여주고 (기본 상태) / 뒤로가기가 false + showLogo True면 로고 보여주고 / 둘 다 false 하면 아무것도 안 보여주기
  if (showBackButton && !showLogo) {
    return (
      <div
        onClick={() => router.back()}
        className="flex cursor-pointer items-center w-[76px]"
      >
        <BackButton />
      </div>
    );
  } else if (!showBackButton && showLogo) {
    return (
      <div onClick={() => router.push('/')} className="cursor-pointer pl-1">
        <TitleLogo />
      </div>
    );
  } else if (!showBackButton && !showLogo) {
    return <div className="invisible w-[76px] h-7" />;
  }
};

export default ShowBackLogo;
