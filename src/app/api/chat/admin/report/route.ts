import { Tables } from "@/types/supabase";
import supabase from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request:NextRequest) => {

    // report에 내용 넣어놓고 가져오기
    try{
        const { id }: { id: string; } = await request.json();
 
        const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)

        if (error) {
            return NextResponse.json(error, {status: 400});
        }
    return NextResponse.json(data, {status: 200});
    } catch(error){
    return NextResponse.json(error, {status: 500});
    }
}


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