import { useLocalStorage } from "@vueuse/core";

export const useStorage = <T>(key: string, defaultValue: T) => {
  const storage = useLocalStorage<T>(key, defaultValue);
  const data = ref(storage.value);

  const setValue = (value: T) => {
    data.value = value;
    storage.value = value;
  };

  const clearValue = () => {
    data.value = null;
    storage.value = null;
  };

  return { clearValue, data, setValue };
};
