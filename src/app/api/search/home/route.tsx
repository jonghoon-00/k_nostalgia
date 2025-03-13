import supabase from '@/utils/supabase/client';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const { searchValue }: { searchValue: string } = await request.json();

  if (!searchValue) {
    return NextResponse.json({ error: '검색어가 없다어흥' }, { status: 400 });
  }

  const [marketHomeData, localHomeData] = await Promise.all([
    supabase
      .from('markets')
      .select('*')
      .ilike('시장명', `%${searchValue}%`)
      .limit(8),
    supabase
      .from('local_food')
      .select('*')
      .ilike('food_name', `%${searchValue}%`)
      .limit(5)
  ]);

  if (marketHomeData.error || localHomeData.error) {
    return NextResponse.json(
      { error: marketHomeData.error || localHomeData.error },
      { status: 400 }
    );
  }

  const homeSearchData = [...marketHomeData.data, ...localHomeData.data];

  if (!homeSearchData || homeSearchData.length === 0) {
    return NextResponse.json([], { status: 200 });
  }

  return NextResponse.json(homeSearchData, { status: 200 });
};
