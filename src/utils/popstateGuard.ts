
type Options = {
  onBack?: () => void;
};

/**
 * 
 * 뒤로가기를 임시 차단하는 유틸
 * @param options 브라우저 뒤로가기 클릭 시 실행할 콜백 함수
 * @returns release 함수
 */
export function startBackGuard(options?: Options) {
  if (typeof window === 'undefined') {
    // SSR 방어
    return () => {};
  }

  const MARKER = '__GUARD_ACTIVE__';
  let active = true;

  // 히스토리 스택 위에 더미 상태 쌓기
  history.pushState({ [MARKER]: true }, '', location.href);

  const onPopState = (event: PopStateEvent) => {
    if (!active) return;

    event.preventDefault?.();
    options?.onBack?.();

    // 다시 현재 url로 더미 상태를 올려 뒤로가기를 계속 흡수
    history.pushState({ [MARKER]: true }, '', location.href);
  };

  window.addEventListener('popstate', onPopState);

  // release 함수
  const release = () => {
    if (!active) return;
    active = false;
    window.removeEventListener('popstate', onPopState);

    //이벤트를 한 번 흡수하기 위한 더미 함수
    const noopOnce = () => {/* iOS Safari 등에서의 안전장치. */};
    window.addEventListener('popstate', noopOnce, { once: true });
    history.back();
  };

  return release;
}
