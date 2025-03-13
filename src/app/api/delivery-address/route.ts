import { PatchResponse } from "@/types/deliveryAddress";
import supabase from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

const errorHandling = (error :any) => {
  console.error(error);
  return NextResponse.json({
    status: error.code, 
    message: error.message
  })
}

export const GET = async (request : NextRequest) => {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  if(!userId){
    return NextResponse.json({ message: '유저 정보를 찾을 수 없습니다' }, { status: 400 });
  }

  const { data: userData, error } = await supabase
  .from("users")
  .select("defaultAddress, addresses")
  .eq("id", userId)
  .single();

  if (error) {
    return errorHandling(error);
  }

  return NextResponse.json({
    defaultAddress: userData?.defaultAddress || null,
    addresses: userData?.addresses || null,
  });
}

export const PATCH = async(request : NextRequest)=>{
  //배송지 추가

  //  response {
  //     id: string;
  //     addressName: string; // 배송지명
  //     receiverName: string; // 수령인 이름
  //     phoneNumber: string; // 휴대폰 번호
  //     baseAddress: string; // 기본 주소
  //     detailAddress: string; // 상세 주소
  //     isDefaultAddress: boolean; // 기본 배송지 설정 여부
  //     userId: string; //유저 id
  //   };
  const response : PatchResponse = await request.json();
  const {userId, isDefaultAddress, ...rest} = response;

  if(userId === undefined){
    return NextResponse.json(
      { message: "유저 정보를 가져오는데 실패했습니다" },
      { status: 400 }
    );
  }

  //기존 값 가져오기
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("addresses, defaultAddress")
    .eq("id", userId)
    .single();

  if (userError) {
    return errorHandling(userError);
  }

  const prevAddresses: Array<{ [key: string]: any }> = Array.isArray(userData?.addresses)
  ? userData.addresses
  : [];
  const prevDefaultAddress = userData?.defaultAddress || null;


  //기본 배송지로 설정
  if(isDefaultAddress){
    // 기존 기본 배송지가 없으면 추가
    if (!prevDefaultAddress) {
      const { error } = await supabase
        .from("users")
        .update({ defaultAddress: rest })
        .eq("id", userId);

      if (error) {
        return errorHandling(error);
      }
    }

    if(prevDefaultAddress){
      // 기존 기본 배송지를 addresses 배열로 옮기고, 새 기본 배송지 설정
      const updatedAddresses = [...prevAddresses, prevDefaultAddress];

      const { error } = await supabase
        .from("users")
        .update({
          addresses: updatedAddresses,
          defaultAddress: rest,
        })
        .eq("id", userId);

        if (error) {
          return errorHandling(error);
        }
    }
  }

  if(!isDefaultAddress){
    // 기본 배송지가 아닌 경우 addresses 배열에 추가
    const updatedAddresses = [...prevAddresses, rest];

    const { error } = await supabase
      .from("users")
      .update({ addresses: updatedAddresses })
      .eq("id", userId);

    if (error) {
      return errorHandling(error);
    }
  }

  return NextResponse.json({status: 200})
}

