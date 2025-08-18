// popstate-guard.ts
type Options = {
  onBack?: () => void;
};

const MARKER = '__POP_GUARD__';

let active = false;                       // 가드 활성화 여부
let added = 0;                            // pushState로 추가한 더미 스택 수
let onPop: ((e: PopStateEvent) => void) | null = null;

/**
 * 뒤로가기를 임시 차단하는 유틸
 *
 * @param options 브라우저 뒤로가기 클릭 시 실행할 콜백 함수
 * @returns release 함수
 */
export function startBackGuard(options?: Options) {
  if (typeof window === 'undefined') {
    // SSR 방어
    return () => {};
  }

  if (active) {
    // 이미 활성화되어 있다면, 해제 함수만 반환
    return releaseBackGuard;
  }

  active = true;

  // 가드 시작 - 더미 스택 1개 추가
  history.pushState({ [MARKER]: true }, '', location.href);
  added += 1;

  // 첫 popstate 타이밍 글리치 방지
  const noopOnce = () => {};
  window.addEventListener('popstate', noopOnce, { once: true });

  onPop = (event: PopStateEvent) => {
    if (!active) return;

    options?.onBack?.();
    // 새 항목을 추가하지 않고 현재 페이지로 복귀(스택 증가 없음)
    history.go(1);
  };

  window.addEventListener('popstate', onPop);

  return releaseBackGuard;
}

/**
 * 가드 해제: 리스너 제거 + 누적 더미 스택 일괄 제거
 */
export function releaseBackGuard() {
  if (typeof window === 'undefined') return;

  if (!active) return;
  active = false;

  if (onPop) {
    window.removeEventListener('popstate', onPop);
    onPop = null;
  }

  const toRemove = added;
  added = 0;

  // 현재 콜스택/라우팅과 충돌 방지 위해 다음 틱에 처리
  if (toRemove > 0) {
    setTimeout(() => {
      history.go(-toRemove);
    }, 0);
  }
}
