import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const guestCookie = request.cookies.get('guest');
  const isGuest = guestCookie?.value === 'true';

  const publicRoutes = ['/sign-up', '/log-in', '/api']; // 누구나 접근 가능 
  const protectedRoutes = ['/my-page']; // 비회원 접근 불가능 

  const url = request.nextUrl.clone();
  const path = request.nextUrl.pathname;
  // 비회원이 불가능 경로에 접근하려고 할 때 리다이렉트
  if (!user && isGuest && protectedRoutes.includes(request.nextUrl.pathname)) {
    url.pathname = '/log-in'; 
    return NextResponse.redirect(url);
  }

  if(!user && !isGuest && !publicRoutes.some((route) => path.startsWith(route))){
    url.pathname = '/log-in';
    return NextResponse.redirect(url);
  }

  //some은 순회 method 포함하는거 찾을때 일치하는거 찾으면 true 반환 

  // 비회원 접근 허용 페이지 또는 인증되지 않은 사용자 허용 페이지 접근 허용
  if (user && publicRoutes.includes(request.nextUrl.pathname)) {
    url.pathname = '/my-page'; 
    
    return NextResponse.redirect(url);
  }


  // 로그인한 사용자에게는 모든 페이지 접근 허용
  if (user) {
    // 로그인 성공 시 비회원 쿠키 삭제
    supabaseResponse.cookies.delete('guest');
    return supabaseResponse;
}

  return supabaseResponse;
}
