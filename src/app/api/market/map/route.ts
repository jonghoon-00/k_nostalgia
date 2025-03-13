import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const supabase = createClient()
  try {
    const {searchParams} = new URL(request.url);
    const marketId = searchParams.get('id')

    if(!marketId) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const {data : addressData, error: addressDataError} = await supabase.from('markets').select("도로명주소").eq('id',marketId).single()
    
    if (addressDataError) {
      return NextResponse.json({ error: addressDataError.message },{ status: 400 });
    }
        
    return NextResponse.json({data: addressData});
  } catch (error) {
    return NextResponse.json(
      { error: '주소 데이터를 가져오지 못했습니다.' },
      { status: 500 }
    );
  }
};