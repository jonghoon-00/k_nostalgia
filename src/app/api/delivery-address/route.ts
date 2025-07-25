import { Address } from "@/types/deliveryAddress";
import supabase from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

const errorHandling = (error :any) => {
  console.error(error);
  return NextResponse.json({
    status: error.code, 
    message: error.message
  })
}

/**
 * 
 * GET /api/addresses?userId={USER_ID}
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ message: "userId가 필요합니다.(유저 정보 가져오지 못함)" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("addresses")
    .eq("id", userId)
    .single();

  if (error) return errorHandling(error);

  // 없으면 빈 배열로
  const addresses = (data.addresses ?? []) as unknown as Address[];

  // 기본(isDefault)인 값을 맨 앞에 정렬
  addresses.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));

  return NextResponse.json({ addresses });
}

/**
 * POST /api/addresses
 * Body: { userId: string; addressName: string; receiverName: string; phoneNumber: string; baseAddress: string; detailAddress: string; isDefault: boolean; }
 * - id는 서버에서 생성 (crypto.randomUUID)
 * - isDefault=true 이면, 기존의 모든 isDefault를 false로 바꿈
 */
export async function POST(request: NextRequest) {
  type NewAddressPayload = Omit<Address, "id"> & { userId: string };

  const payload = await request.json() as NewAddressPayload;
  const { userId, isDefault, ...rest } = payload;

  if (!userId) {
    return NextResponse.json({ message: "userId가 필요합니다.(유저 정보 가져오지 못함)" }, { status: 400 });
  }

  // 1) 기존 주소 불러오기
  const { data, error: fetchError } = await supabase
    .from("users")
    .select("addresses")
    .eq("id", userId)
    .single();
  if (fetchError) return errorHandling(fetchError);

  const prev = Array.isArray(data.addresses) ? data.addresses as unknown as Address[] : [];

  // 2) 새 주소 객체 생성
  const newAddress: Address = {
    id: crypto.randomUUID(),
    ...rest,
    isDefault,
  };

  // 3) isDefault=true 이면 기존 주소들의 isDefault를 false로 설정
  const updated = prev.map(address => ({
    ...address,
    isDefault: isDefault ? false : address.isDefault,
  }));
  updated.push(newAddress);

  // 4) DB에 반영
  const { error: updateError } = await supabase
    .from("users")
    .update({ addresses: updated })
    .eq("id", userId);
  if (updateError) return errorHandling(updateError);

  return NextResponse.json({ status: 200, address: newAddress });
}