import type { Copy } from "~/types";

export const useShoppingCardStore = defineStore("shopping-card-store", () => {
  const copies = ref<Copy[]>([]);

  const addCopy = (id: Copy) => {
    copies.value.push(id);
  };

  const removeCopy = (id: Copy) => {
    copies.value = copies.value.filter((item) => item !== id);
  };

  const clearShoppingCard = () => {
    copies.value = [];
  };

  return {
    copies,
    addCopy,
    clearShoppingCard,
    removeCopy,
  };
});
