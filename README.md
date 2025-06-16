# 🐯 WELCOME TO <img width="150" alt="로고 가로형" src="https://github.com/user-attachments/assets/5f4e1f77-58d3-4bbd-8317-b7c5dbd50e2c"> 🐯

<br />

### 🔗 [향그리움 바로가기](https://k-nostalgia-one.vercel.app/)

<br/>

## ⏲️ 개발기간

2024.07.15 ~ 2024.08.21 : MVP 구현 <br/>
2024.08.26 ~ : 추가 구현 및 개선 진행중

<br/>

## 기여한 부분

### 💳 결제 흐름 전체 담당
  - `/payment` → `/check-payment` → `/complete-payment` 페이지 구현
  - 포트원 API 연동 및 결제 결과에 따라 supabase에 주문 내역 저장 및 에러 처리
  - 사용자가 뒤로 가기 눌렀을 때 결제창이 남아있는 문제 해결 (popstate 이벤트 적용)

### 🧾 주문 내역 및 환불 관리
  - `/pay-history` 페이지 제작: 날짜 필터링, 환불, 리뷰 기능 구현
  - 주요 기능 : 날짜 별 가공 후 내역 리스팅, 환불, 리뷰 CRUD
  - 가상 결제 후 실제 환불을 위한 웹 훅 도입

### 📦 배송지 관리 기능 구현
  - 마이페이지 및 결제 페이지에서 배송지 추가/수정/삭제 처리
  - 반응형 대응(모바일/데스크탑): 모달 ↔ 풀화면 전환 구현
 
### 🎟️ 쿠폰 시스템 구현
  - 사용자 쿠폰 보관/리스트 및 적용 기능 구현
  - 초기 MVP의 간단 쿠폰 로직 → DB 쿠폰 테이블 분리 및 로직 구현
  - 클라이언트 쿠폰 계산 → 서버 계산으로 리팩토링 (보안 고려)

<br/>

## 상세

### 공용 컴포넌트 및 훅 제작

- 재사용성 및 유지보수성 향상을 위한 공용 컴포넌트 및 유틸 훅 제작
- 버튼 스타일, 상태에 따른 렌더링 처리 등의 용도인 PayButton, NoList 등 구현
- Modal, Accordion, RadioGroup 등 UI 컴포넌트를 제작하여 디자인 일관성 및 유지보수 효율 확보
- 버튼 연속 클릭 방지용 `useThrottle` 훅으로 UX 및 서버 요청 안정성 개선

### 웹훅 도입

- 포트원 결제 자동 취소건 (가결제) 자동 반영을 위한 웹 훅 연동

### 쿠폰 구조 변경

- 초기에 클라이언트 상태 기반 구현 → 보안상 문제 우려
- 다양한 쿠폰 종류가 생기는 것 고려 → ‘coupons’ 테이블 제작 및 ‘users’ 테이블의 coupons 항목은 쿠폰 코드 저장하는 방식으로 변경
- 쿠폰 테이블 제작 및 서버(route handler) 내에서 계산하는 방식으로 리팩토링 (보안 강화)


<br><br>


<br></br>

## 🌐 Architecture

![아키텍쳐](https://github.com/user-attachments/assets/3f96edd2-8aa6-4014-886e-0924c7a87275)

## 📝 Technologies & Tools 📝

<img src="https://img.shields.io/badge/nextjs-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"/> <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/> <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=Tailwind-CSS&logoColor=white"/>
<img src="https://img.shields.io/badge/reactquery-FF4154?style=for-the-badge&logo=reactquery&logoColor=white"/> <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=Vercel&logoColor=white"/>
<br>
<img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white"/>
<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"/>
<img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white"/>
<img src="https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white"/>
<img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white"/>

<br>

## 👨‍👩‍👧‍👦 Our Team

|                  박채수                  |                  이가현                  |                   최혜미                   |                  양이준                  |                      이종훈                      |       이혜원       |
| :--------------------------------------: | :--------------------------------------: | :----------------------------------------: | :--------------------------------------: | :----------------------------------------------: | :----------------: |
| [@Chasyuss](https://github.com/Chasyuss) | [@Ga-zzang](https://github.com/Ga-zzang) | [@MiMing-00](https://github.com/MiMing-00) | [@ejunyang](https://github.com/ejunyang) | [@jonghoon7431](https://github.com/jonghoon7431) | lhw00214@gmail.com |
|                    FE                    |                    FE                    |                     FE                     |                    FE                    |                        FE                        |         DS         |

<br>

◻ Copyright ©2024 A05 5JOSAMA team all rights reserved.
