import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles user registration via a POST request, creating a new user in Supabase authentication and the users table.
 *
 * Extracts user details from the request body, registers the user with Supabase Auth, assigns a default profile image, and adds a welcome coupon code to the user's record.
 *
 * @returns A JSON response containing the registered user data, or an error message with the appropriate HTTP status code.
 */
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

  // user 테이블에 추가
  // WELCOME01 : 회원가입 쿠폰 code
  const { error: insertError } = await supabase
    .from('users')
    .insert({ id: userId, email, password, nickname, name, avatar: defaultimage.publicUrl, coupons: ['WELCOME01']});

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  return NextResponse.json(userData);
}
