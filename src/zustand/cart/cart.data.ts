import { create } from 'zustand';

type CartData = {
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
};

const useSelectedCartStore = create<CartData>((set) => ({
  selectedItems: [],
  setSelectedItems: (items: any) => set({ selectedItems: items })
}));

export default useSelectedCartStore;
