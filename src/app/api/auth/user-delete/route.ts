import { createRoleClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE() {
  const supabase = createRoleClient();
  
  // 현재 로그인된 사용자 가져오기
  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (getUserError || !user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }


  // 사용자 삭제
  const { error: deleteUserError } = await supabase.auth.admin.deleteUser(user.id);

  if (deleteUserError) {
    return NextResponse.json({ error: deleteUserError.message }, { status: 500 });
  }

  // 사용자 관련 데이터 삭제
  const { data, error: deleteDataError } = await supabase.from('users').delete().eq('id', user.id);

  if (deleteDataError) {
    return NextResponse.json({ error: deleteDataError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'User deleted successfully.' });
}
