// 시장 데이터 전체 가져오는 API(시장 메인에서 사용)
import { NextRequest, NextResponse } from 'next/server';

const MARKET_URL =
  'https://api.odcloud.kr/api/15052837/v1/uddi:8e90c34b-c086-422f-882a-d3c15efd101f';

export const GET = async (request: NextRequest) => {
  try {
    const {searchParams} = new URL(request.url);
    const page = searchParams.get('page') || '1' 
    const serviceKey = encodeURIComponent('serviceKey');
    const apiKey = process.env.MARKET_API_KEY;
    const response = await fetch(
      `${MARKET_URL}?${serviceKey}=${apiKey}&page=${page}` //불러올 시장 갯수 -> &perPage=1388 /총 시장 갯수:1388
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: '시장 목록 데이터를 가져오지 못했습니다.' },
      { status: 500 }
    );
  }
};