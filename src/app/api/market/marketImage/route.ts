// 시장 이미지 가져오는 API(시장 메인, 시장 디테일에서 사용)
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    const display = searchParams.get('display')
    // console.log('이것은 query', query);
    // console.log('이것은 searchParams', searchParams);
    if (!query) {
        return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        console.error('네이버 API의 ID 또는 비밀번호가 틀림');
        return NextResponse.json({ error: '네이버 API의 ID 또는 비밀번호가 틀림' }, { status: 500 });
    }

    try {
        
        const response = await fetch(`https://openapi.naver.com/v1/search/image?query=${encodeURIComponent(query)}&display=${display}`, {
            headers: {
                'X-Naver-Client-Id': clientId,
                'X-Naver-Client-Secret': clientSecret,
                'Content-type': 'application/json',
            },
        });

        if (!response.ok) {
            
            const errorText = await response.text();
            console.error('네이버 API의 이미지 찾기를 실패함:', errorText);
            throw new Error(`네이버 API의 이미지 찾기를 실패함: ${response.statusText}`);
        }

        const data = await response.json();
        // console.log('이것은 data', data)
        if (data.items && data.items.length > 0) {            
            // console.log('여기야 여기', data.items)
            return NextResponse.json(data.items)
        } else {
            
            return NextResponse.json({ error: '네이버 API의 이미지를 찾을 수 없음' }, { status: 404 });
        }
    } catch (error: any) {
        
        console.error('네이버 API의 이미지를 찾을 수 없음:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};
