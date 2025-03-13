"use client"

import React, { useEffect, useState } from 'react'

function useDebounce<T> (item:T, time:number) {
    // 초기값 undefined 방지
    const [debounceValue, setDebounceValue] = useState<T>(item)

    useEffect(()=>{
        const debounceTime = setTimeout(()=> {
            setDebounceValue(item);
        }, time);

        return () => {
            clearTimeout(debounceTime);
        };

    }, [item, time])

  return debounceValue;
}

export default useDebounce