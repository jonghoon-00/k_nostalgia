# WELCOME TO <img width="150" alt="로고 가로형" src="https://github.com/user-attachments/assets/5f4e1f77-58d3-4bbd-8317-b7c5dbd50e2c"> 🐯

<br/>

<img src='https://github.com/user-attachments/assets/c76663ca-3368-4c04-9b02-d608c41c2039' width=800 />
  
#### 전통시장 정보 탐색부터 특산품 구매까지 한 번에 제공하는 웹 서비스

#### 🔗 [향그리움 바로가기](https://k-nostalgia.vercel.app/)

<br/>

### 개발기간

`MVP` `UX/UI 1 FE 5` 2024.07.15 ~ 2024.08.21
<br/>
`UX/UI 1 FE 1` 2024.08 ~ 2025.09 추가 구현, 개선

<br/>

### 사용 기술 및 도구

<img src="https://img.shields.io/badge/nextjs-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"/> <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
<br/>
<img src="https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white"/>
<img src="https://img.shields.io/badge/React%20Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white"/>
<img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=Tailwind-CSS&logoColor=white"/>
<br>
<img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white"/>
<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white"/>
<br/>
<img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white"/>
<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"/>
<img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white"/>
<img src="https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white"/>
<img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white"/>

<br />

### 설치 및 실행

```bash

$ git clone https://github.com/jonghoon-00/k_nostalgia.git
$ cd k_nostelgia

$ yarn
$ yarn dev

# env 정보는 담지 않습니다.

```

---

<br/>

# Supabase Keep alive

Supabase Free 플랜 프로젝트가 자동 비활성화되는 리크스를 줄이기 위해
별도 private 레포의 GitHub Actions 스케줄러로 주기적인 health endpoint ping을 수행합니다.

## What it does

- `/api/dbHealthCheck/supabase`
  - healthcheck 테이블에 `select id limit 1` 수행 (RLS로 read-only 허용)
- GitHub Actions cron : 3일마다 health endpoint를 호출하여 최소 활동을 유지

<br/>

---

<br/>

## 1. 전체 기능

#### 🛡 Auth (서비스 내 로그인, 카카오/구글 소셜 로그인)

#### 🍚 전통 시장 정보

- 시장 정보 및 댓글 기능

#### 🔍 시장 검색

#### 🍓 특산물 커머스

#### 🛒 장바구니

#### 💬 결제

- 배송지 / 쿠폰 / 소셜 및 일반 결제

#### 👨‍💻 마이페이지

- 프로필 설정
- 최근 본 시장 및 좋아요 한 시장 리스트
- 보유 할인 쿠폰
- 주문 내역 (환불 및 리뷰)

#### 💬 실시간 채팅

<br/>

### 2. 내가 기여한 부분

- 할인 쿠폰
- 배송지 CRUD
- 결제 기능 (PortOne api, 웹훅 연동)
- 주문 내역 & 리뷰
- 고객센터 (공지사항, faq)

<br />

## 주요 개발 내용

- .

<br><br>

<br></br>

<hr /> <br/>

### 폴더 구조

```bash
src
┣ app : Next.js App Router
┃ ┣ (pages) : 페이지
┃ ┣ api : API 라우트
┃ ┣ globals.css
┃ ┣ layout.tsx
┃ ┗ Providers.tsx
┣ components : 공용 컴포넌트
┣ constants : 상수
┣ fonts : 폰트 파일
┣ hooks : 커스텀 훅 모음
┣ lib : 공용 유틸/라이브러리
┣ service : 비즈니스 로직 서비스 계층
┣ types : 전역 타입 정의
┣ utils : 유틸리티 함수
┣ zustand : 전역 상태 관리
┗ middleware.ts : 미들웨어 설정
```

<br>

## 👨‍👩‍👧‍👦 Team

|                  박채수                  |                  이가현                  |                   최혜미                   |                  양이준                  |                      이종훈                      |       이혜원       |
| :--------------------------------------: | :--------------------------------------: | :----------------------------------------: | :--------------------------------------: | :----------------------------------------------: | :----------------: |
| [@Chasyuss](https://github.com/Chasyuss) | [@Ga-zzang](https://github.com/Ga-zzang) | [@MiMing-00](https://github.com/MiMing-00) | [@ejunyang](https://github.com/ejunyang) | [@jonghoon7431](https://github.com/jonghoon7431) | lhw00214@gmail.com |
|                    FE                    |                    FE                    |                     FE                     |                    FE                    |                        FE                        |       UX/UI        |

<br>

◻ Copyright ©2024 A05 5JOSAMA team all rights reserved.
