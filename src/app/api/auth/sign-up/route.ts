import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.json(); 
  const email = data.email as string;
  const password = data.password as string;
  const nickname = data.nickname as string;
  const name = data.name as string;
  const avatar = data.avatar as string; 
  const coupon = data.coupon as string; 

  const supabase = createClient();

  console.log('Received Data:', { email, password, nickname, name, avatar, coupon});

  const { data: userData, error: userDataError } = await supabase.auth.signUp({
    email,
    password
  });

  if (userDataError ) {
    return NextResponse.json({ error: userDataError.message }, { status: 400 });
  }

  const userId = userData.user?.id;

  if(!userId){
    return;
  }

   // 기본 프로필 이미지 넣기
   const { data: defaultimage} = supabase.storage.from('images').getPublicUrl('default_profile.png');

   if (!defaultimage) {
    console.error('이미지 넣기 에러');
    return NextResponse.json({ error: 'image insert error' }, { status: 500 });
  }


   // 쿠폰
   const { data: couponimage} = supabase.storage.from('images').getPublicUrl('Coupon.png');

   if (!couponimage) {
    console.error('이미지 넣기 에러');
    return NextResponse.json({ error: 'image insert error' }, { status: 500 });
  }


  // user 테이블에 추가
  const { error: insertError } = await supabase
    .from('users')
    .insert({ id: userId, email, password, nickname, name, avatar: defaultimage.publicUrl, coupon: couponimage.publicUrl});

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  return NextResponse.json(userData);
}
