import { Tables } from "@/types/supabase";
import supabase from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (request:NextRequest) => {
    const {reporterId, reportedUserId, reportedContent, reportedDetailContent}: Tables<'reports'> = await request.json();

    if (!reporterId || !reportedUserId || !reportedContent || !reportedDetailContent) {
        return NextResponse.json(
            { error: '전부 다 입력하기!' },
            { status: 400 }
        );
    }

    const {data:reportData, error:reportError} = await supabase
    .from('reports')
    .insert([{reporterId, reportedUserId, reportedContent, reportedDetailContent}])
    .select();
    
    if (reportError) {
        console.log("Supabase Error:", reportError);
        return NextResponse.json({ error: reportError.message || '신고 처리 중 오류 발생' }, { status: 400 });
    }
    
    return NextResponse.json({data:reportData}, {status:200});
}

//유저 테이블에 넣기
export const PUT = async (request: NextRequest) => {
    try {
        const { id, reportedUserId }: { id: string; reportedUserId: string } = await request.json();
  
        const { data, error } = await supabase
          .from('users')
          .select('reportedUserId')
          .eq('id', id)
          .single();
  
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
  
        const currentReportedUsers = data.reportedUserId || [];
        const updatedReportedUsers = [...currentReportedUsers, reportedUserId];
  
        const { error: updateError } = await supabase
          .from('users')
          .update({ reportedUserId: updatedReportedUsers })
          .eq('id', id);
  
        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 400 });
        }
  
        return NextResponse.json({ message: "사용자가 성공적으로 업데이트되었습니다." }, { status: 200 });
  
    } catch (error) {
        console.error("서버 에러:", error);
        return NextResponse.json({ error: "서버 에러가 발생했습니다." }, { status: 500 });
    }
  };