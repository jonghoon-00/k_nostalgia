import { Metadata } from 'next';
import LocalFoodView from './_components/LocalFoodView';

export const metadata: Metadata = {
  title: '특산물',
  description:
    '전통이 있는, 그리운 곳으로 향하다(向). 향그리움에서 전국 각지에 위치한 시장 그리고 각 업체에서 올린 특산물을 확인해보세요.',
  keywords: '특산물, 전통 음식, 지역 음식, 복숭아, 한우, 마늘, 단감, 딸기'
};

const LocalFoodPage = () => {
  return (
    <div>
      <LocalFoodView />
    </div>
  );
};

export default LocalFoodPage;
