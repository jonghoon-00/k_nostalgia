//admin 페이지 - 전체 유저의 전체 주문 내역 리스트 (미환불 건 팀원들 확인용)
//update : 24.7.31

import supabase from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const response = await supabase
      .from('orderd_list')
      .select('*')
      .order('created_at', { ascending: false })
      .eq('status','PAID')
      
    const { data, error } = response;
    if (error) {
      console.error(error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '예기치 않은 오류가 발생했습니다' }, { status: 500 });
  }
};