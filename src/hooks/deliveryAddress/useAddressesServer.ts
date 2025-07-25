import api from '@/service/service';
import { createClient } from '@/utils/supabase/server';

const getUserId = async() => {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return console.error('유저 정보 가져오기 실패');
  }

  return data.user.id;
}

export const getAddressesInServerComponent = async () => {
  const userId = await getUserId();

  if (!userId) {
    return console.error('유저 ID가 없습니다. 주소를 가져올 수 없습니다.');
  }
  return await api.address.getAddresses(userId);
};
