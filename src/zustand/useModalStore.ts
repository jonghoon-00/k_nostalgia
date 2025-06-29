// stores/modalStore.ts
import { ModalId } from '@/components/ui/Modal';
import create from 'zustand';

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
