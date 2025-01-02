export const useConfigStore = defineStore("config-store", () => {
  const storageCollapsed = useStorage("gdp-bm-collapsed", false);

  return {
    collapsed: storageCollapsed.data,
    toggle: () => {
      storageCollapsed.setValue(!storageCollapsed.data.value);
    },
  };
});
