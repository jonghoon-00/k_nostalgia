import supabase from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

//가져올 때 로직 자체에서 비교할지 고민하기
export const POST = async (request:NextRequest) => {
    const { room_id } = await request.json();

    try{
        const {data:chatData, error:chatError} = await supabase
        .from('chat')
        .select(`*, users(nickname, avatar, reportedUserId)`)
        // 해당 채팅방만 가져오는 로직
        .eq('room_id', room_id)
        // 오늘만 가져오는 로직
        .gte('created_at', new Date().toISOString().split('T')[0])
        .lt('created_at', new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0])
        .order('created_at', { ascending: true })

        if (chatError) {
            return NextResponse.json({error:chatError.message}, {status: 400});
        }
    return NextResponse.json({data: chatData});
    } catch(error){
    return NextResponse.json({error: "Server error"}, {status: 500});
    }
}
