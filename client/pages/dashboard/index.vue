<script setup lang="ts">
import axios from "axios";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import DatePicker from "~/components/date-picker.vue";
import { BACKEND_SERVER } from "~/config/api";
import ActionsContainer from "~/features/dashboard/components/actions-container.vue";
import ActionsDropdown from "~/features/dashboard/components/actions-dropdown.vue";
import SearchContainer from "~/features/dashboard/components/search-container.vue";
import Searchbar from "~/features/dashboard/components/searchbar.vue";
import { MIN_WIDTH_SCREEN_FOR_TABLE } from "~/features/dashboard/constants";
import DashboardContainer from "~/features/dashboard/dashboard-container.vue";
import { type PaginatedI, type BookI, type Copy } from "~/types";

const { data } = useAuthStore();
const { width } = useWindowSize()
const shoppingCard = useShoppingCardStore();
const toast = useToast();
const paginatedBooks = ref<PaginatedI<BookI>>();
const isNotAuthorized = ref(false);
const url = ref(`${BACKEND_SERVER}/book/catalog`);

const fetchBooks = async (page: number, limit: number) => {
  try {
    const response = await axios.get(
      `${url.value}?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${data}` },
      }
    );

    if (response.status === 200) paginatedBooks.value = response.data;
  } catch {
    isNotAuthorized.value = true;
  }
};

const columns = [
  { key: "id", label: "ID" },
  { key: "title", label: "Título" },
  { key: "pages", label: "Páginas" },
  { key: "author", label: "Autor" },
  { key: "category", label: "Categoría" },
  { key: "subcategory", label: "Subcategoría" },
  { key: "actions", label: "Acciones" },
];

const items = (row: BookI) => [
  [
    {
      label: "Reservar",
      icon: "i-mdi-book-plus",
      click: () => handleAddToCardSelectRow(row),
    },
  ],
];

// Pagination

const currentPage = ref(1);
const limitPerPage = ref<string>("10");

onMounted(async () => {
  await fetchBooks(currentPage.value, Number(limitPerPage.value));
});

watch(currentPage, async (newCurrentPage) => {
  await fetchBooks(newCurrentPage, Number(limitPerPage.value));
});

watch(limitPerPage, async () => {
  if (currentPage.value !== 1) currentPage.value = 1;
  else await fetchBooks(currentPage.value, Number(limitPerPage.value));
});

const selectedFilter = ref<string>("Todo");
const filters = ["Todo", "Titulo", "Autor", "Categoría", "Subcategoría"];

const searchInput = ref("");

const handleFilter = async () => {
  if (selectedFilter.value === "Todo") {
    url.value = `${BACKEND_SERVER}/book/catalog`;
  } else if (selectedFilter.value === "Titulo") {
    url.value = `${BACKEND_SERVER}/search/books-catalog-by-title/${searchInput.value}`;
  } else if (selectedFilter.value === "Autor") {
    url.value = `${BACKEND_SERVER}/search/books-catalog-by-author/${searchInput.value}`;
  } else if (selectedFilter.value === "Categoría") {
    url.value = `${BACKEND_SERVER}/search/books-catalog-by-category/${searchInput.value}`;
  } else if (selectedFilter.value === "Subcategoría") {
    url.value = `${BACKEND_SERVER}/search/books-catalog-by-subcategory/${searchInput.value}`;
  }

  if (currentPage.value !== 1) currentPage.value = 1;
  else await fetchBooks(currentPage.value, Number(limitPerPage.value));
};

// Add to card modal

const showAddToCardModal = ref(false);
const bookToAddToCard = ref<BookI>();

const selectedBookId = ref<string>();
const copiesOfSelectedBook = ref<Copy[]>();
const copiesOfSelectedBookOptions = ref<{ value: string; label: string }[]>([]);

const disabledAcceptButtonAddToCardModal = computed(
  () => !selectedBookId.value
);

const parseCopy = (copy: Copy) => {
  return {
    value: String(copy.id),
    label: `Código: ${copy.code} - Condición: ${copy.condition === "NEW"
      ? "Nuevo"
      : copy.condition === "GOOD"
        ? "Bueno"
        : copy.condition === "FAIR"
          ? "Regular"
          : copy.condition === "DAMAGED"
            ? "Dañado"
            : "Malo"
      }`,
  };
};

const handleAddToCardSelectRow = async (row: BookI) => {
  showAddToCardModal.value = true;
  bookToAddToCard.value = row;
  copiesOfSelectedBook.value = undefined;
  copiesOfSelectedBookOptions.value = [];

  const response = await axios.get<PaginatedI<Copy>>(
    `${BACKEND_SERVER}/copy/${row.id}`,
    { headers: { Authorization: `Bearer ${data}` } }
  );

  if (response.status === 200) {
    copiesOfSelectedBook.value = response.data.data;
    response.data.data.forEach((copy) => {
      if (shoppingCard.copies.filter((_copy) => _copy.id === copy.id).length)
        return;

      copiesOfSelectedBookOptions.value.push(parseCopy(copy));
    });
  }
};

const handleAcceptToAddNewBook = () => {
  if (
    !bookToAddToCard.value &&
    !selectedBookId.value &&
    !copiesOfSelectedBook.value
  )
    return;

  const copy = copiesOfSelectedBook.value?.find(
    (copy) => copy.id === Number(selectedBookId.value)
  );

  if (copy) shoppingCard.addCopy(copy);

  showAddToCardModal.value = false;
  bookToAddToCard.value = undefined;
  selectedBookId.value = undefined;
  copiesOfSelectedBook.value = undefined;
  copiesOfSelectedBookOptions.value = [];
};

// Reservation modal

const showReservationModal = ref(false);
const reservationDate = ref<Date>((() => {
  const peruTimeZone = 'America/Lima';
  const now = new Date();

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  const formattedDate = new Date(
    new Intl.DateTimeFormat('en-US', {
      timeZone: peruTimeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(tomorrow)
  );

  return formattedDate;
})());


const disabledShoppingCardButton = computed(
  () => shoppingCard.copies.length <= 0
);

const handleClickOnShoppingCardButton = () => {
  showReservationModal.value = true;
};

const handleRemoveCopy = (copy: Copy) => {
  shoppingCard.removeCopy(copy);

  if (!shoppingCard.copies.length) showReservationModal.value = false;
};

const handleReservation = async () => {
  if (!shoppingCard.copies.length) return;

  try {
    const response = await axios.post(
      `${BACKEND_SERVER}/reservation`,
      {
        copies: shoppingCard.copies.map((copy) => copy.id),
        dueDate: reservationDate.value.toISOString(),
      },
      { headers: { Authorization: `Bearer ${data}` } }
    );
    if (response.status === 201)
      toast.add({
        title: "Reserva exitosa",
        description: "La reserva se ha realizado con éxito",
      });
  } catch {
    toast.add({
      title: "Error de reserva",
      description: "Ha ocurrido un error al realizar la reserva",
    });
  }

  showReservationModal.value = false;
  shoppingCard.clearShoppingCard();
};
</script>

<template>
  <NotAuthorized v-if="isNotAuthorized" path="/dashboard" />
  <DashboardContainer v-else>
    <template #title>Bienvenido</template>
    <template #description>
      ¡Bienvenido! Explora y reserva tus libros favoritos
    </template>
    <template #title-table>Catálogo de Libros</template>

    <template #search>
      <Searchbar
        v-model:input="searchInput"
        v-model:filter="selectedFilter"
        :filters="filters"
        @handle-filter="handleFilter"
      />
    </template>

    <template #actions>
      <ActionsContainer>
        <template #right>
          <UChip
            :text="shoppingCard.copies.length"
            size="2xl"
            :show="shoppingCard.copies.length > 0"
          >
            <UButton
              icon="i-mdi-plus"
              size="lg"
              color="primary"
              :ui="{ rounded: 'rounded-full' }"
              variant="solid"
              @click="handleClickOnShoppingCardButton"
              :disabled="disabledShoppingCardButton"
            />
          </UChip>
        </template>
      </ActionsContainer>
    </template>

    <template v-if="width < MIN_WIDTH_SCREEN_FOR_TABLE">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="row in paginatedBooks?.data"
          :key="row.id"
          class="bg-gray-800 rounded-lg p-4 shadow"
        >
          <div class="text-white text-lg font-bold">
            {{ row.title }}
          </div>
          <div class="text-white text-sm">
            <p><strong>ID:</strong> {{ row.id }}</p>
            <p><strong>Páginas:</strong> {{ row.pages }}</p>
            <p><strong>Autor:</strong> {{ row.authors[0].name || "Desconocido" }}</p>
            <p><strong>Categoría:</strong> {{ row.category }}</p>
            <p><strong>Subcategoría:</strong> {{ row.subcategory }}</p>
          </div>
          <div class="mt-4">
            <ActionsDropdown :items="items" :row="row" />
          </div>
        </div>
      </div>
      <div v-if="!paginatedBooks || !paginatedBooks.data" class="text-center py-6">
        <UIcon name="i-heroicons-circle-stack-20-solid" class="w-8 h-8 mx-auto" />
        <span class="text-white">No hay resultados</span>
      </div>
    </template>

    <UTable
      :loading="paginatedBooks === undefined || !paginatedBooks.data"
      :columns="columns"
      :rows="paginatedBooks?.data"
      v-else
    >
      <template #id-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #title-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #pages-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #author-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #category-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #subcategory-header="{ column }">
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
      <template #title-data="{ row }">
        <span class="text-white text-left">{{ row.title }}</span>
      </template>
      <template #pages-data="{ row }">
        <span class="text-white text-left">{{ row.pages }}</span>
      </template>
      <template #author-data="{ row }">
        <span class="text-white text-left">
          {{ row.authors[0].name || "Desconocido" }}
        </span>
      </template>
      <template #category-data="{ row }">
        <span class="text-white text-left">{{ row.category }}</span>
      </template>
      <template #subcategory-data="{ row }">
        <span class="text-white text-left">{{ row.subcategory }}</span>
      </template>
      <template #actions-data="{ row }">
        <ActionsDropdown :items="items" :row="row" />
      </template>
    </UTable>

    <template #current-page>{{ currentPage }}</template>
    <template #total-pages>{{ paginatedBooks?.lastPage }}</template>

    <template #pagination v-if="paginatedBooks">
      <UPagination
        v-model="currentPage"
        :page-count="Number(limitPerPage)"
        :total="paginatedBooks.total"
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
        v-model="showAddToCardModal"
        :disabledAcceptButton="disabledAcceptButtonAddToCardModal"
        @handle-accept="handleAcceptToAddNewBook"
      >
        <template #header-title>Agregar copia de libro</template>
        <template #header-description>
          Agrega una copia del libro &quot;{{ bookToAddToCard?.title }}&quot;
        </template>

        <USelect
          v-model="selectedBookId"
          :options="copiesOfSelectedBookOptions"
          placeholder="Selecciona una copia"
        />
      </Modal>
      <Modal
        v-model="showReservationModal"
        :disabledAcceptButton="disabledShoppingCardButton"
        @handle-accept="handleReservation"
      >
        <template #header-title>Confirmar reserva</template>
        <template #header-description>
          Seleccione el día y hora de recojo, y confirme la reserva.
        </template>

        <div
          class="max-h-52 overflow-y-auto p-4 rounded-lg shadow-md outline outline-white outline-2 flex gap-4 flex-col"
        >
          <div
            v-for="copy in shoppingCard.copies"
            :key="copy.id"
            class="flex items-center justify-between p-3 rounded-lg shadow-sm outline outline-yellow-600 outline-1"
          >
            <p class="text-white font-medium">
              {{ parseCopy(copy).label }}
            </p>
            <UButton
              class="cursor-pointer text-red-600"
              variant="ghost"
              icon="i-mdi-delete-forever"
              @click="handleRemoveCopy(copy)"
            />
          </div>
        </div>

        <div class="flex gap-4">
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton
              icon="i-heroicons-calendar-days-20-solid"
              :label="format(reservationDate, 'd MMM, yyy', { locale: es })"
            />

            <template #panel="{ close }">
              <DatePicker
                v-model="reservationDate"
                :min-date="new Date()"
                is-required
                @close="close"
              />
            </template>
          </UPopover>
          <TimePicker v-model="reservationDate" />
        </div>
      </Modal>
    </template>
  </DashboardContainer>
</template>

<style scoped lang="sass"></style>
