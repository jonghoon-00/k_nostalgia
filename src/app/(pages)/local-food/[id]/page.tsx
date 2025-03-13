import SITE_URL from '@/constant';
import { LocalDetailView } from './_components/LocalDetailView';

export async function generateMetadata({
  params: { id }
}: {
  params: { id: string };
}) {
  try {
    const response = await fetch(`${SITE_URL}/api/localfood/${id}`);

    const data = await response.json();

    console.log(data);
    return {
      title: `향그리움 ${data.food_name}`,
      description: `${data.food_name}의 정보이다`
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: '특산물',
      description:
        '전통이 있는, 그리운 곳으로 향하다(向). 향그리움에서 전국 각지에 위치한 시장 그리고 각 업체에서 올린 특산물을 확인해보세요.'
    };
  }
}

const LocalDetailPage = async ({
  params: { id }
}: {
  params: { id: string };
}) => {
  return <LocalDetailView id={id} />;
};

export default LocalDetailPage;
