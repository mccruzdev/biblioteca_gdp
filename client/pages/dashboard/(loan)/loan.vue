<script setup lang="ts">
import axios from "axios";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BACKEND_SERVER } from "~/config/api";
import SearchContainer from "~/features/dashboard/components/search-container.vue";
import DashboardContainer from "~/features/dashboard/dashboard-container.vue";
import { transformLoanStatus } from "~/transforms/loan-status";
import { transformCondition } from "~/transforms/copy-condition";
import { type PaginatedI, type LoanI, LoanStatus } from "~/types";

const { data } = useAuthStore();
const { width } = useWindowSize();
const paginatedLoans = ref<PaginatedI<LoanI>>();
const isNotAuthorized = ref(false);
const url = ref(`${BACKEND_SERVER}/loan/me`);

const fetchLoans = async (page: number, limit: number) => {
  try {
    const response = await axios.get(
      `${url.value}?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${data}` },
      }
    );

    if (response.status === 200) paginatedLoans.value = response.data;
  } catch {
    isNotAuthorized.value = true;
  }
};

const columns = [
  { key: "id", label: "ID" },
  { key: "loanDate", label: "Fecha de Préstamo" },
  { key: "dueDate", label: "Fecha de devolución" },
  { key: "status", label: "Estado" },
];

const expand = ref({
  openedRows: [],
  row: {},
});

// Pagination

const currentPage = ref(1);
const limitPerPage = ref<string>("10");

onMounted(async () => {
  await fetchLoans(currentPage.value, Number(limitPerPage.value));
});

watch(currentPage, async (newCurrentPage) => {
  await fetchLoans(newCurrentPage, Number(limitPerPage.value));
});

watch(limitPerPage, async () => {
  if (currentPage.value !== 1) currentPage.value = 1;
  else await fetchLoans(currentPage.value, Number(limitPerPage.value));
});

// Filter

const selectedFilter = ref<string>("Todo");
const filters = ["Todo", "Activo", "Devuelto", "Vencido", "Cancelado"];

const handleFilter = async () => {
  if (selectedFilter.value === "Todo") {
    url.value = `${BACKEND_SERVER}/loan/me`;
  } else if (selectedFilter.value === "Activo") {
    url.value = `${BACKEND_SERVER}/search/loan-me-by-status/${LoanStatus.ACTIVE}`;
  } else if (selectedFilter.value === "Devuelto") {
    url.value = `${BACKEND_SERVER}/search/loan-me-by-status/${LoanStatus.RETURNED}`;
  } else if (selectedFilter.value === "Vencido") {
    url.value = `${BACKEND_SERVER}/search/loan-me-by-status/${LoanStatus.OVERDUE}`;
  } else if (selectedFilter.value === "Cancelado") {
    url.value = `${BACKEND_SERVER}/search/loan-me-by-status/${LoanStatus.CANCELLED}`;
  }

  if (currentPage.value !== 1) currentPage.value = 1;
  else await fetchLoans(currentPage.value, Number(limitPerPage.value));
};
</script>

<template>
  <NotAuthorized v-if="isNotAuthorized" path="/dashboard" />
  <DashboardContainer v-else>
    <template #title>Préstamos</template>
    <template #description> Revisa tus préstamos </template>
    <template #title-table>Historial de préstamos</template>

    <template #search>
      <SearchContainer>
        <template #search-filter>
          <USelectMenu v-model="selectedFilter" :options="filters" />
        </template>
        <template #search-reset-filter>
          <Button v-show="selectedFilter !== 'Todo'" @click="
            selectedFilter = 'Todo';
          handleFilter();
          " icon="i-tabler-circle-x-filled">
            Limpiar filtro
          </Button>
        </template>
        <template #search-button>
          <Button @click="handleFilter" icon="i-heroicons-magnifying-glass">
            Filtrar
          </Button>
        </template>
      </SearchContainer>
    </template>

    <UTable :loading="paginatedLoans === undefined || !paginatedLoans.data" :columns="columns"
      :rows="paginatedLoans?.data" v-model:expand="expand" :multiple-expand="false">
      <template #id-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #loanDate-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #dueDate-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #status-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>

      <template #empty-state>
        <div class="flex flex-col items-center justify-center py-6 gap-3">
          <UIcon name="i-heroicons-circle-stack-20-solid" class="w-8 h-8" />
          <span class="text-white">No hay resultados</span>
        </div>
      </template>

      <template #loading-state>
        <div class="flex flex-col items-center justify-center py-6 gap-3">
          <UIcon name="i-mdi-light-refresh" class="w-8 h-8 animate-spin" />
          <span class="text-white">Cargando...</span>
        </div>
      </template>

      <template #id-data="{ row }">
        <span class="text-white text-left">{{ row.id }}</span>
      </template>
      <template #loanDate-data="{ row }">
        <span class="text-white text-left">
          {{ format(new Date(row.loanDate), "dd-MM-yyyy", { locale: es }) }}
        </span>
      </template>
      <template #dueDate-data="{ row }">
        <span class="text-white text-left">
          {{ format(new Date(row.dueDate), "dd-MM-yyyy", { locale: es }) }}
        </span>
      </template>
      <template #status-data="{ row }">
        <span class="text-white text-left">
          {{ transformLoanStatus(row.status) }}
        </span>
      </template>

      <template #expand="{ row }">
        <div class="p-4 flex flex-col gap-2">
          <div class="flex flex-col space-y-4 w-full" v-for="copy in row.copies" :key="copy.id">
            <!-- Información del ejemplar -->
            <div class="p-4 border rounded-lg shadow" style="border-color: #ffffff">
              <h3 class="text-lg font-semibold text-white">
                Código: {{ copy.code }}
              </h3>
              <p class="text-sm text-gray-300">
                Condición: {{ transformCondition(copy.condition) }}
              </p>

              <!-- Ubicación -->
              <div class="mt-2" v-if="copy.location">
                <h4 class="text-md font-medium text-gray-200">Ubicación</h4>
                <p class="text-sm text-gray-300">
                  Estante: {{ copy.location.shelf || "N/A" }}
                </p>
                <p class="text-sm text-gray-300">
                  Color del estante: {{ copy.location.shelfColor || "N/A" }}
                </p>
                <p class="text-sm text-gray-300">
                  Nivel del estante: {{ copy.location.shelfLevel || "N/A" }}
                </p>
              </div>

              <!-- Editorial -->
              <div class="mt-2" v-if="copy.publisher">
                <h4 class="text-md font-medium text-gray-200">Editorial</h4>
                <p class="text-sm text-gray-300">
                  Nombre: {{ copy.publisher.name }}
                </p>
                <p class="text-sm text-gray-300">
                  País: {{ copy.publisher.country || "N/A" }}
                </p>
                <p class="text-sm text-gray-300">
                  Dirección: {{ copy.publisher.address || "N/A" }}
                </p>
                <p class="text-sm text-gray-300">
                  Teléfono: {{ copy.publisher.phoneNumber || "N/A" }}
                </p>
                <p class="text-sm text-gray-300">
                  Sitio Web: {{ copy.publisher.website || "N/A" }}
                </p>
              </div>

              <!-- Información del libro -->
              <div class="mt-2">
                <h4 class="text-md font-medium text-gray-200">Libro</h4>
                <p class="text-sm text-gray-300">
                  Título: {{ copy.book.title }}
                </p>
                <p class="text-sm text-gray-300">
                  Páginas: {{ copy.book.pages }}
                </p>
                <p class="text-sm text-gray-300" v-if="copy.book.category">
                  Categoría: {{ copy.book.category }}
                </p>
                <p class="text-sm text-gray-300" v-if="copy.book.subcategory">
                  Subcategoría: {{ copy.book.subcategory }}
                </p>

                <!-- Autores -->
                <div class="mt-2" v-if="copy.book.authors.length">
                  <h5 class="text-sm font-medium text-gray-200">Autores</h5>
                  <ul class="list-disc list-inside text-sm text-gray-300">
                    <li v-for="author in copy.book.authors" :key="author.id">
                      {{ author.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UTable>

    <template #current-page>{{ currentPage }}</template>
    <template #total-pages>{{ paginatedLoans?.lastPage }}</template>

    <template #pagination v-if="paginatedLoans">
      <UPagination v-model="currentPage" :page-count="Number(limitPerPage)" :total="paginatedLoans.total"
        :size="width <= 360 ? '2xs' : width <= 450 ? 'xs' : 'sm'">
      </UPagination>
    </template>
    <template #select-limit-per-page>
      <USelect v-model="limitPerPage" :options="[
        { value: 10, label: 'Mostrar 10' },
        { value: 20, label: 'Mostrar 20' },
        { value: 30, label: 'Mostrar 30' },
        { value: 40, label: 'Mostrar 40' },
        { value: 50, label: 'Mostrar 50' },
      ]"></USelect>
    </template>
  </DashboardContainer>
</template>

<style scoped lang="sass"></style>
