import { Tables } from "@/types/supabase";
import supabase from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request:NextRequest) => {
    const {room_id, user_id, content}: Tables<'chat'> = await request.json();

    const {data:chatData, error:chatError} = await supabase
    .from('chat')
    .insert([{room_id, user_id, content}])
    .select();

    if (chatError) {
        return NextResponse.json({error:chatError.message}, {status:400});
    }
    return NextResponse.json({data:chatData}, {status:200});
}

export const PUT = async (request:NextRequest) => {
    const {room_id, user_id, content}: Tables<'chat'> = await request.json();

    const {data:reportData, error:reportError} = await supabase
    .from('chat')
    .update({isReported : true})
    .match({ room_id, user_id, content })
    .select()

    if(reportError) {
        return NextResponse.json({error:reportError.message}, {status:400});
    }
    return NextResponse.json({data:reportData}, {status:200})
}