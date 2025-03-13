import api from '@/service/service';
import { createClient } from '@/utils/supabase/server';

export const getAddressesInServerComponent = async () => {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return console.error('유저 정보 가져오기 실패');
  }
  const userId = data.user.id;

  return await api.address.getAddresses(userId);
};