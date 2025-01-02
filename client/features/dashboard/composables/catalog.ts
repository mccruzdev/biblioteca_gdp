import axios from "axios";
import { BACKEND_SERVER } from "~/config/api";
import type { BookI, PaginatedI } from "~/types";

export function useDashboardCatalogPage() {
  const { data } = useAuthStore();
  const loading = ref<boolean>(false);
  const page = ref(1);
  const limit = ref(10);
  const paginatedData = ref<PaginatedI<BookI>>();
  const rows = ref<BookI[]>();

  const fetchData = async (page: number, limit: number) => {
    loading.value = true;

    const response = await axios.get(
      `${BACKEND_SERVER}/book?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${data}` },
      }
    );

    if (response.status === 200) {
      paginatedData.value = response.data;
      rows.value = paginatedData.value?.data;
    }

    loading.value = false;
  };

  callOnce(() => fetchData(page.value, limit.value));

  return { loading, rows };
}
