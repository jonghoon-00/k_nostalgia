import { useCallback, useEffect, useRef, useState } from 'react';

type AnyFunction = (...args: any[]) => void;
type ButtonThrottleProps = {
  fn: AnyFunction
  delay: number
}

function useThrottle ({fn, delay} : ButtonThrottleProps) {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [isDelay, setIsDelay] = useState(false);

  //버튼 쓰로틀링
  //호출해서 사용할 때 {throttleButtonClick : }로 이름 지정해서 쓰셔요
  const throttleButtonClick  = useCallback((...args: Parameters<typeof fn>)=>{
    if(!timer.current){
      fn(...args);
      setIsDelay(true);

      timer.current = setTimeout(()=>{
        timer.current = null;
        setIsDelay(false);
      }, delay)
    }
  },[fn, delay])

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, []);

  return {throttleButtonClick , isDelay}
}
export default useThrottle;





