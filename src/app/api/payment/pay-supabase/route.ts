//supabase 'ordered_list' table 추가(post), 불러오기(get), 수정(put)

import { Tables } from "@/types/supabase";
import supabase from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const response :Tables<'ordered_list'>  = await request.json();

  const { error } = await supabase.from('ordered_list').insert(response);

  if (error) {
    console.error(error);
    return NextResponse.json({ status: error.code, message: error.message });
  }
  return NextResponse.json({ status: 200 });
};

export const GET = async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');
    const page =  parseInt(url.searchParams.get('page') || '1',10)

    if (!userId) {
      return NextResponse.json({ message: '유저 정보를 찾을 수 없습니다' }, { status: 400 });
    }
    const PAGE_PER_ITEM = 3;

    const start = (page - 1) * PAGE_PER_ITEM
    const end = start + PAGE_PER_ITEM - 1

    const {data, error} = await supabase
      .from('ordered_list')
      .select('*')
      .order('created_at', { ascending: false })
      .eq('user_id', userId)
      .range(start,end)
      
    if (error) {
      console.error(error);
      return NextResponse.json({status: error.code, message: error.message})
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
  }
};

type OrderRow = Tables<'ordered_list'>;
export const PATCH = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as { payment_id: string } & Partial<OrderRow>;
    const { payment_id, ...patch } = body;

    if (!payment_id) {
      return NextResponse.json({ message: 'payment_id가 필요합니다.' }, { status: 400 });
    }
    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ message: '업데이트할 필드가 없습니다.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('ordered_list')
      .update(patch) 
      .eq('payment_id', payment_id)
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ message: error.message, code: error.code }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
};