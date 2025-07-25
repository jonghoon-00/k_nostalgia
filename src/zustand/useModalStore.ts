// stores/modalStore.ts
import { ModalId } from '@/components/ui/Modal';
import { create } from 'zustand';

/**
 * 모달 상태 관리를 위한 인터페이스
 * - `openModalId`: 현재 열려있는 모달의 ID, 없으면 null
 * - `open`: 특정 모달을 여는 함수
 * - `close`: 현재 열려있는 모달을 닫는 함수
 */
interface ModalState {
  openModalId: ModalId | null;
  open: (id: ModalId) => void;
  close: () => void;
}

export const useModalStore = create<ModalState>(set => ({
  openModalId: null,
  open: (id) => set({ openModalId: id }),
  close: () => set({ openModalId: null }),
}));
