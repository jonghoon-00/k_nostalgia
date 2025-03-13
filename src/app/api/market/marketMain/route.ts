import { NextRequest, NextResponse } from 'next/server';

const MARKET_URL =
  'https://api.odcloud.kr/api/15052837/v1/uddi:8e90c34b-c086-422f-882a-d3c15efd101f';

export const GET = async (request: NextRequest) => {
  try {
    const serviceKey = encodeURIComponent('serviceKey');
    const apiKey = process.env.NEXT_PUBLIC_MARKET_API_KEY;
    const response = await fetch(
      `${MARKET_URL}?${serviceKey}=${apiKey}&page=1&perPage=10`
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
