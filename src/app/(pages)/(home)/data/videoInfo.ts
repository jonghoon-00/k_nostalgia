export interface MarketVideoItems  {
  id: number;
  imageUrl: string;
  title: string;
  contents: string[];  
}

export const MARKET_VIDEOS: MarketVideoItems[] = [
  {
    id: 1,
    imageUrl: '/image/market_video_1.png',
    title: '안 가면 후회하는 K-관광마켓 4선',
    contents: [
      '한국에서만 만나볼 수 있는 특별한 관광, 전통시장',
      '그 중에서도 제일 인기있는 4개의 시장을 소개합니다!'
    ]
  },
  {
    id: 2,
    imageUrl: '/image/market_video_2.png',
    title: '향그리움 Pick! 먹거리 여행',
    contents: [
      '먹거리 여행하기 딱! 좋은 전통시장은 어디?',
      '향그리움 리포터가 직접 촬영한 영상을 통해 전통시장의 가치와 한국의 따뜻한 정을 느껴보세요.'
    ]
  },
  {
    id: 3,
    imageUrl: '/image/market_video_3.png',
    title: '요즘 HOT한 이색 전통시장｜서울편',
    contents: [
      '전통시장이 재미없다는 편견은 이제 그만!',
      '시식부터 체험까지, 즐길거리로 가득 찬 이색 전통시장으로 특별한 하루를 보내보세요.'
    ]
  },
  {
    id: 4,
    imageUrl: '/image/market_video_4.png',
    title: '쉿! 어른만 보세요! 혼술 맛집 전통시장',
    contents: [
      '요즘 전통시장에서 혼술하는 게 대세라며?',
      '가성비 좋은 음식과 넘치는 레트로 감성을 중앙시장에서 함께 즐겨봐요!'
    ]
  },
  {
    id: 5,
    imageUrl: '/image/market_video_5.png',
    title: '요즘 HOT한 이색 전통시장｜강원도편',
    contents: [
      '전통시장이 재미없다는 편견은 이제 그만!',
      '시식부터 체험까지, 즐길거리로 가득 찬 이색 전통시장으로 특별한 하루를 보내보세요.'
    ]
  },
  {
    id: 6,
    imageUrl: '/image/market_video_6.png',
    title: '제니얼 세대에게 인기 만점, 마음까지 편안해지는 전통시장 추천',
    contents: [
      "'아날로그 감성을 좋아하는데, 요즘 전통시장은 다 힙한 것 같아.' 라고 생각하신 적 있으신 분들,",
      '가심비 넘치는 전통시장은 어떠세요?'
    ]
  },
  {
    id: 7,
    imageUrl: '/image/market_video_7.png',
    title: '외국인들에게 추천할 한국 특색 여행지, 전통시장 3곳을 소개합니다!',
    contents: [
      '외국인 친구에게 전통시장을 소개시켜주고 싶은데, 어딜 가야 잘 갔다는 소문이 날까?',
      '한국 특색 여행 가능한 전통시장 3곳으로 떠나보세요!'
    ]
  }

]