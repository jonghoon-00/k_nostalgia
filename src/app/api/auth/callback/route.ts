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
    const { data: couponimage} = supabase.storage.from('images').getPublicUrl('Coupon.png');
    if (!error) {
      if(user){
        const {error} = await supabase.from('users').upsert({
          id: user.id,
          email: user.email,
          name: user.user_metadata.full_name,
          nickname: user.user_metadata.user_name || user.user_metadata.name, 
          avatar: user.user_metadata.avatar_url, 
          coupon: couponimage.publicUrl
        })
       
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}