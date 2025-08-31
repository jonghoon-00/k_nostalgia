import clsx from 'clsx';
import Image from 'next/image';
import LoginForm from './LoginForm';

const DesktopLoginLayout = () => {
  const rootCls = clsx(
    'hidden md:flex justify-center items-center',
    'min-h-screen',
    'bg-primary-20'
  );

  const cardCls = clsx(
    'overflow-hidden bg-normal',
    ' border rounded-[20px]',
    'h-[870px] w-full',
    'flex'
  );

  const leftPaneCls = clsx(
    'w-1/2 bg-normal p-8',
    'flex flex-col items-center justify-center'
  );

  const bannerImgCls = clsx('h-[888px] w-auto object-cover');

  const rightPaneCls = clsx(
    'w-1/2 p-12',
    'flex flex-col items-center justify-center'
  );

  const logoImgCls = clsx('mx-auto mb-12', 'h-[98px] w-[353px]');

  return (
    <div className={rootCls}>
      <div className={cardCls}>
        <div className={leftPaneCls}>
          <Image
            src="/image/Banner2.png"
            alt="Login illustration"
            width={556}
            height={888}
            className={bannerImgCls}
            priority
          />
        </div>

        <div className={rightPaneCls}>
          <Image
            src="/image/TitleLogo.png"
            alt="title logo"
            width={353}
            height={100}
            className={logoImgCls}
            priority
          />
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default DesktopLoginLayout;
