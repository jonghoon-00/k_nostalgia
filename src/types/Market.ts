export type MarketType = {
  id: number;
  이미지?: string[];
  시장명: string;
  도로명주소: string;
  시도: string;
  시장전용고객주차장_보유여부: string;
  물품보관함_보유여부: string;
  고객휴게실_보유여부: string;
  대권역: string;
  소권역: string;
  error: any;
  시장유형: string;
};

export type RegionData = {
 [key: string]: string[] 
}