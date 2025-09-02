// 로직 전용
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FAQS } from "../data/faq";

export function useFaq(initialQuery = "") {
  const router = useRouter();
  const sp = useSearchParams();

  const [query, setQuery] = useState(initialQuery);
  const [openIds, setOpenIds] = useState<Set<number>>(new Set()); // ← 숫자 id 대응

  // 동기화
  useEffect(() => {
    setQuery(sp.get("q") ?? "");
  }, [sp]);

  // 해시 진입 시 특정 항목 자동 오픈 (#1, #2 ...)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.location.hash.slice(1);
    const hashId = Number(raw);
    if (!Number.isNaN(hashId) && FAQS.some((f) => f.id === hashId)) {
      setOpenIds((s) => new Set(s).add(hashId));
    }
  }, []);

  // 필터링 된 리스트
  const filteredList = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter((f) => {
      // const okCat = category === "all" || f.category === category;
      const inQuestion = f.question.toLowerCase().includes(q);
      const inAnswer = Array.isArray(f.answer)
        ? f.answer.some((p) => p.toLowerCase().includes(q))
        : String(f.answer).toLowerCase().includes(q);
      const okText = !q || inQuestion || inAnswer;
      return okText
    });
  }, [query]);

  // 전체 리셋: 검색(q) 제거 + 카테고리 초기화 + 모든 아코디언 닫기
  const resetAll = useCallback(() => {
    setQuery("");
    setOpenIds(new Set());
    router.replace("?"); // q 제거
  }, [router]);

  // 개별 토글 (멀티 오픈)
  const toggle = useCallback((id: number) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  return {
    // state
    filteredList,
    openIds,
    // actions
    resetAll,
    toggle,
  };
}
