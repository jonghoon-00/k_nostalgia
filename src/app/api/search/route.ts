import supabase from '@/utils/supabase/client';
import { NextRequest, NextResponse } from 'next/server';

const AllowedTables = ['markets', 'local_food'] as const;
type AllowedTable = (typeof AllowedTables)[number];

const getConditionalSearch = (
  tableValue: AllowedTable,
  searchValue: string
): string => {
  if (tableValue === 'markets') {
    // return `시장명.ilike.%${searchValue}%,도로명주소.ilike.%${searchValue}%`;
    return `시장명.ilike.%${searchValue}%`;
  } else if (tableValue === 'local_food') {
    // return `food_name.ilike.%${searchValue}%,category.ilike.%${searchValue}%`;
    return `food_name.ilike.%${searchValue}%`;
  } else {
    return '';
  }
};

export const POST = async (request: NextRequest) => {
  const {
    tableValue,
    searchValue
  }: { tableValue: AllowedTable; searchValue: string } = await request.json();

  if (!AllowedTables.includes(tableValue)) {
    return NextResponse.json(
      { error: '테이블_잘못된 접근입니다.' },
      { status: 400 }
    );
  }

  if (!searchValue) {
    return NextResponse.json({ error: '검색어가 없다어흥' }, { status: 400 });
  }

  const getSearchData = getConditionalSearch(tableValue, searchValue);

  const { data: searchData, error: searchError } = await supabase
    .from(tableValue)
    .select('*')
    .or(getSearchData)
    .limit(8);

  if (searchError) {
    return NextResponse.json({ error: searchError.message }, { status: 400 });
  }

  if (!searchData || searchData.length === 0) {
    return NextResponse.json([], { status : 200 },);
  }

  return NextResponse.json(searchData, { status: 200 });
};
