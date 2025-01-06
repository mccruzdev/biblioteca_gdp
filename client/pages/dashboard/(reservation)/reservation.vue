<script setup lang="ts">
import axios from "axios";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BACKEND_SERVER } from "~/config/api";
import ActionsDropdown from "~/features/dashboard/components/actions-dropdown.vue";
import SearchContainer from "~/features/dashboard/components/search-container.vue";
import { MIN_WIDTH_SCREEN_FOR_TABLE } from "~/features/dashboard/constants";
import DashboardContainer from "~/features/dashboard/dashboard-container.vue";
import type { Expanded, TableRow } from "~/features/dashboard/interface";
import { transformCondition } from "~/transforms/copy-condition";
import {
  ReservationStatusE,
  type PaginatedI,
  type ReservationI,
} from "~/types";

const { data } = useAuthStore();
const { width } = useWindowSize();
const toast = useToast();
const paginatedReservations = ref<PaginatedI<ReservationI>>();
const isNotAuthorized = ref(false);
const url = ref(`${BACKEND_SERVER}/reservation/me`);

const fetchReservations = async (page: number, limit: number) => {
  try {
    const response = await axios.get(
      `${url.value}?page=${page}&limit=${limit}`,
      { headers: { Authorization: `Bearer ${data}` } }
    );

    if (response.status === 200) paginatedReservations.value = response.data;
  } catch {
    isNotAuthorized.value = true;
  }
};

const columns = [
  { key: "id", label: "ID" },
  { key: "created", label: "Fecha de reserva" },
  { key: "dueDate", label: "Fecha de recojo" },
  { key: "status", label: "Estado" },
  { key: "actions", label: "Acciones" },
];

const items = (row: ReservationI) => [
  [
    {
      label: "Cancelar Reserva",
      icon: "i-mdi-cancel",
      click: () => handleCancelReservation(row),
    },
  ],
];

const expand = ref<Expanded<ReservationI>>({
  openedRows: [],
  row: null,
});

const toggleExpand = (row: ReservationI) => {
  if (expand.value.row?.id === row.id)
    expand.value.row = null;
  else
    expand.value.row = row;
}

// Filter

const selectedFilter = ref<string>("Todo");
const filters = ["Todo", "Cancelados", "Pendientes", "Recogidos", "Expirados"];

const handleFilter = async () => {
  if (selectedFilter.value === "Todo") {
    url.value = `${BACKEND_SERVER}/reservation/me`;
  } else if (selectedFilter.value === "Cancelados") {
    url.value = `${BACKEND_SERVER}/search/reservation-me-by-status/${ReservationStatusE.CANCELED}`;
  } else if (selectedFilter.value === "Pendientes") {
    url.value = `${BACKEND_SERVER}/search/reservation-me-by-status/${ReservationStatusE.PENDING}`;
  } else if (selectedFilter.value === "Recogidos") {
    url.value = `${BACKEND_SERVER}/search/reservation-me-by-status/${ReservationStatusE.PICKED_UP}`;
  } else if (selectedFilter.value === "Expirados") {
    url.value = `${BACKEND_SERVER}/search/reservation-me-by-status/${ReservationStatusE.EXPIRED}`;
  }

  if (currentPage.value !== 1) currentPage.value = 1;
  else await fetchReservations(currentPage.value, Number(limitPerPage.value));
};

// Pagination

const currentPage = ref(1);
const limitPerPage = ref<string>("10");

onMounted(async () => {
  await fetchReservations(currentPage.value, Number(limitPerPage.value));
});

watch(currentPage, async (newCurrentPage) => {
  await fetchReservations(newCurrentPage, Number(limitPerPage.value));
});

watch(limitPerPage, async () => {
  if (currentPage.value !== 1) currentPage.value = 1;
  else await fetchReservations(currentPage.value, Number(limitPerPage.value));
});

// Cancel Reservation

const showCancelReservationModal = ref(false);
const selectedReservation = ref<ReservationI>();
const loadingCancelReservationButton = ref(false);

const handleCancelReservation = (row: ReservationI) => {
  showCancelReservationModal.value = true;
  selectedReservation.value = row;
};

const handleAcceptCancelReservation = async () => {
  loadingCancelReservationButton.value = true;

  try {
    const response = await axios.put(
      `${BACKEND_SERVER}/reservation/${selectedReservation.value?.id}`,
      {
        dueDate: selectedReservation.value?.dueDate,
        status: ReservationStatusE.CANCELED,
        copies: selectedReservation.value?.copies.map((copy) => copy.id),
      },
      { headers: { Authorization: `Bearer ${data}` } }
    );

    if (response.status === 200) {
      toast.add({
        title: "Reserva cancelada con éxito",
      });
      if (currentPage.value === paginatedReservations.value?.lastPage)
        await fetchReservations(currentPage.value, Number(limitPerPage.value));
    }
  } catch {
    toast.add({
      title: "Error al cancelar reserva",
    });
  }

  selectedReservation.value = undefined;
  loadingCancelReservationButton.value = false;
  showCancelReservationModal.value = false;
};
</script>

<template>
  <NotAuthorized v-if="isNotAuthorized" path="/dashboard" />
  <DashboardContainer v-else>
    <template #title>Reservas</template>
    <template #description> Administra tus reservas </template>
    <template #title-table>Mis reservas</template>

    <template #search>
      <SearchContainer>
        <template #search-filter>
          <USelectMenu v-model="selectedFilter" :options="filters" />
        </template>
        <template #search-reset-filter>
          <Button
            v-show="selectedFilter !== 'Todo'"
            @click="
              selectedFilter = 'Todo';
              handleFilter();
            "
            icon="i-tabler-circle-x-filled"
          >
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

    <template v-if="width < MIN_WIDTH_SCREEN_FOR_TABLE">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="row in paginatedReservations?.data"
          :key="row.id"
          class="bg-gray-800 rounded-lg p-4 shadow"
        >
          <div class="text-white text-lg font-bold">Reserva ID: {{ row.id }}</div>
          <div class="text-white text-sm">
            <p>
              <strong>Fecha de creación:</strong>
              {{ format(new Date(row.created), "dd-MM-yyyy", { locale: es }) }}
            </p>
            <p>
              <strong>Fecha de vencimiento:</strong>
              {{ format(new Date(row.dueDate), "dd-MM-yyyy", { locale: es }) }}
            </p>
            <p>
              <strong>Estado:</strong>
              {{
                row.status === "PENDING"
                  ? "Pendiente"
                  : row.status === "PICKED_UP"
                  ? "Recogido"
                  : row.status === "CANCELED"
                  ? "Cancelado"
                  : "Expirado"
              }}
            </p>
          </div>
          <div class="mt-4">
            <ActionsDropdown
              v-if="row.status === ReservationStatusE.PENDING"
              :items="items"
              :row="row"
            />
          </div>

          <div
            class="mt-4 p-4 bg-gray-700 rounded-lg cursor-pointer"
            @click="toggleExpand(row)"
          >
            <span class="text-white font-semibold">Ver detalles</span>
          </div>

          <!-- Detalles expandibles -->
          <div v-if="expand.row?.id === row.id" class="mt-4 p-4 bg-gray-700 rounded-lg">
            <div class="text-white font-semibold text-lg">Detalles del ejemplar:</div>
            <div
              v-for="copy in row.copies"
              :key="copy.id"
              class="mt-4 p-4 bg-gray-600 rounded-lg"
            >
              <div class="text-white text-sm">
                <p><strong>Código:</strong> {{ copy.code }}</p>
                <p>
                  <strong>Condición:</strong> {{ transformCondition(copy.condition) }}
                </p>

                <div v-if="copy.location" class="mt-2">
                  <h4 class="font-medium text-gray-200">Ubicación:</h4>
                  <p><strong>Estante:</strong> {{ copy.location.shelf || "N/A" }}</p>
                  <p>
                    <strong>Color del estante:</strong>
                    {{ copy.location.shelfColor || "N/A" }}
                  </p>
                  <p>
                    <strong>Nivel del estante:</strong>
                    {{ copy.location.shelfLevel || "N/A" }}
                  </p>
                </div>

                <div v-if="copy.publisher" class="mt-2">
                  <h4 class="font-medium text-gray-200">Editorial:</h4>
                  <p><strong>Nombre:</strong> {{ copy.publisher.name }}</p>
                  <p><strong>País:</strong> {{ copy.publisher.country || "N/A" }}</p>
                  <p><strong>Dirección:</strong> {{ copy.publisher.address || "N/A" }}</p>
                  <p>
                    <strong>Teléfono:</strong> {{ copy.publisher.phoneNumber || "N/A" }}
                  </p>
                  <p><strong>Sitio Web:</strong> {{ copy.publisher.website || "N/A" }}</p>
                </div>

                <div class="mt-2">
                  <h4 class="font-medium text-gray-200">Libro:</h4>
                  <p><strong>Título:</strong> {{ copy.book.title }}</p>
                  <p><strong>Páginas:</strong> {{ copy.book.pages }}</p>
                  <p v-if="copy.book.category">
                    <strong>Categoría:</strong> {{ copy.book.category }}
                  </p>
                  <p v-if="copy.book.subcategory">
                    <strong>Subcategoría:</strong> {{ copy.book.subcategory }}
                  </p>

                  <div v-if="copy.book.authors.length" class="mt-2">
                    <h5 class="font-medium text-gray-200">Autores:</h5>
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
        v-if="!paginatedReservations || !paginatedReservations.data"
        class="text-center py-6"
      >
        <UIcon name="i-heroicons-circle-stack-20-solid" class="w-8 h-8 mx-auto" />
        <span class="text-white">No hay resultados</span>
      </div>
    </template>

    <UTable
      :loading="paginatedReservations === undefined || !paginatedReservations.data"
      :columns="columns"
      :rows="paginatedReservations?.data"
      v-model:expand="expand"
      :multiple-expand="false"
      v-else
    >
      <template #id-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #created-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #dueDate-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #status-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #actions-header="{ column }">
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
      <template #created-data="{ row }">
        <span class="text-white text-left">
          {{ format(new Date(row.created), "dd-MM-yyyy", { locale: es }) }}
        </span>
      </template>
      <template #dueDate-data="{ row }">
        <span class="text-white text-left">
          {{ format(new Date(row.dueDate), "dd-MM-yyyy", { locale: es }) }}
        </span>
      </template>
      <template #status-data="{ row }">
        <span class="text-white text-left">
          {{
            row.status === "PENDING"
              ? "Pendiente"
              : row.status === "PICKED_UP"
              ? "Recogido"
              : row.status === "CANCELED"
              ? "Cancelado"
              : "Expirado"
          }}
        </span>
      </template>
      <template #actions-data="{ row }">
        <template v-if="row.status === ReservationStatusE.PENDING">
          <ActionsDropdown :items="items" :row="row" />
        </template>
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
    <template #total-pages>{{ paginatedReservations?.lastPage }}</template>

    <template #pagination v-if="paginatedReservations">
      <UPagination
        v-model="currentPage"
        :page-count="Number(limitPerPage)"
        :total="paginatedReservations.total"
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

    <template #modals>
      <Modal
        v-model="showCancelReservationModal"
        @handle-accept="handleAcceptCancelReservation"
      >
        <template #header-title>Cancelar Reserva</template>
        <template #header-description>
          ¿Está seguro de querer cancelar la reserva? Esta acción no se puede deshacer.
        </template>
      </Modal>
    </template>
  </DashboardContainer>
</template>

<style scoped lang="sass"></style>
