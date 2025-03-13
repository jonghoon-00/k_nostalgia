import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const supabase = createClient()
    const {searchParams} = new URL(request.url)
    const region = searchParams.get('region')!

    const { data, error } = await supabase.rpc('get_random_markets', {
        region: region,
        lim: 4
    });

    if (error) {
        console.error('Error fetching data:', error.message)
        return NextResponse.json({ error: '추천 시장을 불러오는 걸 실패했습니다' }, { status: 400 })
    }
    return NextResponse.json(data)
}
