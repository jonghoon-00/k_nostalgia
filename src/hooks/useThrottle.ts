import { useCallback, useEffect, useRef, useState } from 'react';

type AnyFunction = (...args: any[]) => void;
type ButtonThrottleProps = {
  fn: AnyFunction
  delay: number
}

/**
 * Provides a throttled version of a function, ensuring it can only be called once per specified delay interval.
 *
 * @param fn - The function to throttle.
 * @param delay - The minimum time interval in milliseconds between allowed function calls.
 * @returns An object containing the throttled function as `throttleButtonClick` and a boolean `isDelay` indicating if the throttle delay is active.
 *
 * @remark The throttled function preserves the latest arguments passed to it, but will only execute once per delay interval.
 */
function useThrottle ({fn, delay} : ButtonThrottleProps) {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [isDelay, setIsDelay] = useState(false);

  //버튼 쓰로틀링
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





