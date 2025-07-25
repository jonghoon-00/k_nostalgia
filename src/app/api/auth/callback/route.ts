import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    const user = data.user; 
    if (!error) {
      if(user){
        const {error} = await supabase.from('users').upsert({
          id: user.id,
          email: user.email,
          name: user.user_metadata.full_name,
          nickname: user.user_metadata.user_name || user.user_metadata.name, 
          avatar: user.user_metadata.avatar_url, 
          coupons: ['WELCOME01']
        })
        if (error) {
          console.error(error.message, '유저 정보 저장 실패');
          return NextResponse.json({ error: error.message }, { status: 400 });
        }
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}