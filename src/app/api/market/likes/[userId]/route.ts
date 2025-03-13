import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

type ParamsType = {
    params: { userId: string };
  }

export async function POST(request: Request, {params}: ParamsType) {
    const supabase = createClient()

    const { userId } = params;
    const marketId = await request.json()
    const { data, error} = await supabase.from('likes').insert({
        user_id: userId,
        market_id: marketId
    })
    if (error) {
        return NextResponse.json({error});
    }
    return NextResponse.json(data);
}

export async function GET(request: Request, {params}: ParamsType) {
    const supabase = createClient()

    const { userId } = params
    const { searchParams } = new URL(request.url)
    const marketId = searchParams.get('marketId') 
    const { data, error} = await supabase.from('likes').select('*').match({ user_id: userId, market_id: marketId });
    if (error) {
        return NextResponse.json({error});
    }
    return NextResponse.json(!!data.length);
}

export async function DELETE(request: Request, {params}: ParamsType) {
    const supabase = createClient()

    const { userId } = params
    const marketId = await request.json()
    const { data, error } = await supabase.from('likes').delete().match({ user_id: userId, market_id: marketId })

    if (error) {
        return NextResponse.json({error})
    }
    return NextResponse.json(data)
}