//결제 관련 api (포트원)
//환불, 내역 단건 조회

//update : 24.8.20

import { NextRequest, NextResponse } from "next/server";

//환불
export const POST =async(request: NextRequest)=>{
  try {
    const {paymentId} = await request.json();
  
    const response = await fetch(`https://api.portone.io/payments/${paymentId}/cancel`,{
      method: 'POST',
      headers: {'Content-Type': 'application/json',
        Authorization:`PortOne ${process.env.PORTONE_API_KEY}`
      },
      body: JSON.stringify({
        storeId: process.env.NEXT_PUBLIC_STORE_ID,
        reason: "테스트 결제입니다.",
      })
  })

  const data = await response.json()

  return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({message: 'Internal Server Error'}, { status: 500});
  }
}

//내역조회
export const GET =async(request: NextRequest)=>{
  try {
    const url = new URL(request.url)
    const paymentId = url.searchParams.get('paymentId')

    const response = await fetch(`https://api.portone.io/payments/${paymentId}`,{
      method: 'GET',
      headers:{
        'Content-Type': 'application/json',
        Authorization:`PortOne ${process.env.PORTONE_API_KEY}`
      },
    })
    const data = await response.json()

  return  NextResponse.json(data,{status:200})

  } catch (error) {
    console.error('Error fetching data:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }

}