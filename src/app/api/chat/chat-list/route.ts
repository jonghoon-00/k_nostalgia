import supabase from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request:NextRequest) => {

    try{
        const {data:chatListData, error:chatListError} = await supabase
        .from('rooms')
        .select('*')

        if (chatListError) {
            return NextResponse.json({error:chatListError.message}, {status: 400});
        }
    return NextResponse.json({data: chatListData}, {status: 200});
    } catch(error){
    return NextResponse.json({error: "Server error"}, {status: 500});
    }
}