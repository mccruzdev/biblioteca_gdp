<script setup lang="ts">
import axios from "axios";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BACKEND_SERVER } from "~/config/api";
import Searchbar from "~/features/dashboard/components/searchbar.vue";
import { MIN_WIDTH_SCREEN_FOR_TABLE } from "~/features/dashboard/constants";
import DashboardContainer from "~/features/dashboard/dashboard-container.vue";
import type { Expanded } from "~/features/dashboard/interface";
import { transformCondition } from "~/transforms/copy-condition";
import { type PaginatedI, type DonationsI } from "~/types";

const { data } = useAuthStore();
const { width } = useWindowSize()
const paginatedDonations = ref<PaginatedI<DonationsI>>();
const isNotAuthorized = ref(false);
const url = ref(`${BACKEND_SERVER}/donation`);

const fetchDonations = async (page: number, limit: number) => {
  try {
    const response = await axios.get(
      `${url.value}?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${data}` },
      }
    );

    if (response.status === 200) paginatedDonations.value = response.data;
  } catch {
    isNotAuthorized.value = true;
  }
};

const columns = [
  { key: "id", label: "ID" },
  { key: "date", label: "Fecha" },
  { key: "description", label: "Descripción" },
  { key: "donorName", label: "Nombre del donador" },
  { key: "donorEmail", label: "Correo del donador" },
];

const expand = ref<Expanded<DonationsI>>({
  openedRows: [],
  row: null,
});

const toggleExpand = (row: DonationsI) => {
  if (expand.value.row?.id === row.id)
    expand.value.row = null;
  else
    expand.value.row = row;
}

// Pagination

const currentPage = ref(1);
const limitPerPage = ref<string>("10");

onMounted(async () => {
  await fetchDonations(currentPage.value, Number(limitPerPage.value));
});

watch(currentPage, async (newCurrentPage) => {
  await fetchDonations(newCurrentPage, Number(limitPerPage.value));
});

watch(limitPerPage, async () => {
  if (currentPage.value !== 1) currentPage.value = 1;
  else await fetchDonations(currentPage.value, Number(limitPerPage.value));
});

// Filter

const selectedFilter = ref<string>("Todo");
const filters = [
  "Todo",
  "Descripción",
  "Donador",
  "Código de copia",
  "Título de libro",
];

const searchInput = ref("");

const handleFilter = async () => {
  if (selectedFilter.value === "Todo") {
    url.value = `${BACKEND_SERVER}/donation`;
  } else if (selectedFilter.value === "Descripción") {
    url.value = `${BACKEND_SERVER}/search/donation-by-description/${searchInput.value}`;
  } else if (selectedFilter.value === "Donador") {
    url.value = `${BACKEND_SERVER}/search/donation-by-donor/${searchInput.value}`;
  } else if (selectedFilter.value === "Código de copia") {
    url.value = `${BACKEND_SERVER}/search/donation-by-copycode/${searchInput.value}`;
  } else if (selectedFilter.value === "Título de libro") {
    url.value = `${BACKEND_SERVER}/search/donation-by-book/${searchInput.value}`;
  }

  if (currentPage.value !== 1) currentPage.value = 1;
  else await fetchDonations(currentPage.value, Number(limitPerPage.value));
};
</script>

<template>
  <NotAuthorized v-if="isNotAuthorized" path="/dashboard" />
  <DashboardContainer v-else>
    <template #title>Donaciones</template>
    <template #description> Administra las donaciones </template>
    <template #title-table>Lista de donaciones</template>

    <template #search>
      <Searchbar
        v-model:input="searchInput"
        v-model:filter="selectedFilter"
        :filters="filters"
        @handle-filter="handleFilter"
      />
    </template>

    <template v-if="width < MIN_WIDTH_SCREEN_FOR_TABLE">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="row in paginatedDonations?.data"
          :key="row.id"
          class="bg-gray-800 rounded-lg p-4 shadow"
        >
          <div class="text-white text-lg font-bold">
            {{ row.description }}
          </div>
          <div class="text-white text-sm">
            <p><strong>ID:</strong> {{ row.id }}</p>
            <p>
              <strong>Fecha:</strong>
              {{ format(new Date(row.date), "dd-MM-yyyy", { locale: es }) }}
            </p>
            <p><strong>Donante:</strong> {{ row.donor?.name }}</p>
            <p><strong>Email:</strong> {{ row.donor?.email }}</p>
          </div>

          <div
            class="mt-4 p-4 bg-gray-700 rounded-lg cursor-pointer"
            @click="toggleExpand(row)"
          >
            <span class="text-white font-semibold">Ver detalles</span>
          </div>

          <div v-if="expand.row?.id === row.id" class="mt-4 p-4 bg-gray-700 rounded-lg">
            <div
              class="flex flex-col space-y-4 w-full"
              v-for="copy in row.copies"
              :key="copy.id"
            >
              <div class="p-4 border rounded-lg shadow" style="border-color: #ffffff">
                <h3 class="text-lg font-semibold text-white">Código: {{ copy.code }}</h3>
                <p class="text-sm text-gray-300">
                  Condición: {{ transformCondition(copy.condition) }}
                </p>

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

                <div class="mt-2" v-if="copy.publisher">
                  <h4 class="text-md font-medium text-gray-200">Editorial</h4>
                  <p class="text-sm text-gray-300">Nombre: {{ copy.publisher.name }}</p>
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

                <div class="mt-2">
                  <h4 class="text-md font-medium text-gray-200">Libro</h4>
                  <p class="text-sm text-gray-300">Título: {{ copy.book.title }}</p>
                  <p class="text-sm text-gray-300">Páginas: {{ copy.book.pages }}</p>
                  <p class="text-sm text-gray-300" v-if="copy.book.category">
                    Categoría: {{ copy.book.category }}
                  </p>
                  <p class="text-sm text-gray-300" v-if="copy.book.subcategory">
                    Subcategoría: {{ copy.book.subcategory }}
                  </p>

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
        </div>
      </div>

      <div
        v-if="!paginatedDonations || !paginatedDonations.data"
        class="text-center py-6"
      >
        <UIcon name="i-heroicons-circle-stack-20-solid" class="w-8 h-8 mx-auto" />
        <span class="text-white">No hay resultados</span>
      </div>
    </template>

    <UTable
      :loading="paginatedDonations === undefined || !paginatedDonations.data"
      :columns="columns"
      :rows="paginatedDonations?.data"
      v-model:expand="expand"
      :multiple-expand="false"
      v-else
    >
      <template #id-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #date-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #description-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #donorName-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #donorEmail-header="{ column }">
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
      <template #date-data="{ row }">
        <span class="text-white text-left">
          {{ format(new Date(row.date), "dd-MM-yyyy", { locale: es }) }}
        </span>
      </template>
      <template #description-data="{ row }">
        <span class="text-white text-left">{{ row.description }}</span>
      </template>
      <template #donorName-data="{ row }">
        <span class="text-white text-left">{{ row.donor?.name }}</span>
      </template>
      <template #donorEmail-data="{ row }">
        <span class="text-white text-left">{{ row.donor?.email }}</span>
      </template>

      <template #expand="{ row }">
        <div class="p-4 flex flex-col gap-2">
          <div
            class="flex flex-col space-y-4 w-full"
            v-for="copy in row.copies"
            :key="copy.id"
          >
            <!-- Información del ejemplar -->
            <div class="p-4 border rounded-lg shadow" style="border-color: #ffffff">
              <h3 class="text-lg font-semibold text-white">Código: {{ copy.code }}</h3>
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
                <p class="text-sm text-gray-300">Nombre: {{ copy.publisher.name }}</p>
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
                <p class="text-sm text-gray-300">Título: {{ copy.book.title }}</p>
                <p class="text-sm text-gray-300">Páginas: {{ copy.book.pages }}</p>
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
    <template #total-pages>{{ paginatedDonations?.lastPage }}</template>

    <template #pagination v-if="paginatedDonations">
      <UPagination
        v-model="currentPage"
        :page-count="Number(limitPerPage)"
        :total="paginatedDonations.total"
        :size="width <= 360 ? '2xs' : width <= 450 ? 'xs' : 'sm'"
      >
      </UPagination>
    </template>
    <template #select-limit-per-page>
      <USelect
        v-model="limitPerPage"
        :options="[
          { value: 10, label: 'Mostrar 10' },
          { value: 20, label: 'Mostrar 20' },
          { value: 30, label: 'Mostrar 30' },
          { value: 40, label: 'Mostrar 40' },
          { value: 50, label: 'Mostrar 50' },
        ]"
      ></USelect>
    </template>
  </DashboardContainer>
</template>

<style scoped lang="sass"></style>
