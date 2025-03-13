import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.json(); 
  const email = data.email as string;
  const nickname = data.nickname as string;

  const supabase = createClient();

  const { data: existEmail, error: existEmailError } = await supabase
    .from('users')
    .select()
    .eq('email', email);

  if (existEmailError) {
    return NextResponse.json({ error: existEmailError.message }, { status: 500 });
  }

  if (existEmail.length > 0) {
    return NextResponse.json({ error: '이미 있는 이메일입니다' }, { status: 400 });
  }

  const { data: existNickname, error: existNicknameError } = await supabase
  .from('users')
  .select()
  .eq('nickname', nickname);

  if (existNicknameError) {
    return NextResponse.json({ error: existNicknameError.message }, { status: 500 });
  }

  if (existNickname.length > 0) {
    return NextResponse.json({ error: '이미 있는 별명입니다' }, { status: 400 });
  }

  return NextResponse.json({ message: '가입된 유저입니다.' }, { status: 200 });
}