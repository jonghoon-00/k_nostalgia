import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { userId: string } }) {
    const supabase = createClient();
    const { userId } = params

    // 사용자가 좋아요한 시장 ID 가져오기
    const { data: likedMarketIds, error: likesError } = await supabase
        .from('likes')
        .select('market_id')
        .eq('user_id', userId);

    if (likesError) {
        return NextResponse.json({ error: likesError.message }, { status: 500 });
    }


    // 좋아요한 시장이 없는 경우
    if (likedMarketIds.length === 0) {
        return NextResponse.json([]);
    }

    // 시장 ID 배열 추출
    const marketIds = likedMarketIds.map(item => item.market_id);
    const resultMakets=[];

    for(const id of marketIds){
        // 좋아요한 시장들의 정보 가져오기
        const { data: likedMarket, error: marketsError } = await supabase
        .from('markets')
        .select('id, 시장명, 도로명주소, 이미지, 시장전용고객주차장_보유여부, 물품보관함_보유여부, 고객휴게실_보유여부')
        .eq('id', id).single();

        if (marketsError) {
            return NextResponse.json({ error: marketsError.message }, { status: 500 });
        }
        resultMakets.push(likedMarket);
    }
    
   

    return NextResponse.json(resultMakets);
}