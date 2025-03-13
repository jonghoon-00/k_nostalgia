import { Tables } from '@/types/supabase';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
  const supabase = createClient();

  const data = await request.json();

  const { nickname, avatar } = data;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '인증 되지 않은 사용자' }, { status: 401 });
  }

  const { data: updateData, error } = await supabase.from('users').update({nickname, avatar}). eq('id', user.id).select().single();

  if (error) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(updateData);
}