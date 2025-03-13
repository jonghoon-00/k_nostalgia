
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const PAGE_SIZE = 10
export const GET = async (request: NextRequest) => {
    const supabase = createClient()
    const {searchParams} = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10 ) //10진수로 바꿔줌

    const largeRegion = searchParams.get('largeRegion')
    const smallRegion = searchParams.get('smallRegion')
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE - 1
        try {
            let query = supabase.from('markets').select('*', { count: 'exact' });
            // 대권역 필터링
            if (largeRegion) { 
              query = query.eq('대권역', largeRegion);                
             }
             
             // 소권역 필터링
            if (smallRegion) { 
              query = query.eq('소권역', smallRegion); 
            }

            // 페이지네이션 적용 
            const { data: marketData, count, error: marketDataError } = await query.range(start, end);
        if (marketDataError) {
          return NextResponse.json(
            { error: marketDataError.message },
            { status: 400 }
          );
        }
        
        const totalPages = Math.ceil((count || 0) / PAGE_SIZE)
        return NextResponse.json({data: marketData, page, totalPages, totalItems: count});
      } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
      }
  };