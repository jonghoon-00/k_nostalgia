import supabase from '@/utils/supabase/client';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const supabase = createClient();

  try {
    const { searchParams } = new URL(request.url); //상대 경로는 URL 객체에서 직접 설정
    const productId = searchParams.get('product_id'); // 쿼리 파라미터에서 product_id 가져오기
    const page = Number(searchParams.get('page')) || 1; // 페이지 번호
    const limit = Number(searchParams.get('product_id')) || 10; // 리뷰 10개씩

    if (!productId) {
      return NextResponse.json(
        { error: '상품 ID가 없습니다.' },
        { status: 400 }
      );
    }

    const { data: reviewData, error: reviewError } = await supabase
      .from('reviews')
      .select('*,users(avatar, name)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1); // 페이지네이션

    if (reviewError) {
      return NextResponse.json({ error: reviewError.message }, { status: 400 });
    }

    // 총 리뷰 수 가져오기
    const { count: totalReviews, error: countError } = await supabase
      .from('reviews')
      .select('*', { count: 'exact' }) // 총 행 수 계산 => 반환, count 속성에 총 리뷰 수
      .eq('product_id', productId);

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 400 });
    }

    const totalPages = Math.ceil((totalReviews || 0) / limit); // 총 페이지 수 계산

    return NextResponse.json({
      reviews: reviewData,
      totalReviews,
      totalPages
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};
