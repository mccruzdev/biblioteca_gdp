<script setup lang="ts">
import axios from "axios";
import { BACKEND_SERVER } from "~/config/api";
import ActionsContainer from "~/features/dashboard/components/actions-container.vue";
import SearchContainer from "~/features/dashboard/components/search-container.vue";
import DashboardContainer from "~/features/dashboard/dashboard-container.vue";
import { type PaginatedI, type BookI } from "~/types";

const { data } = useAuthStore();
const toast = useToast();
const paginatedBooks = ref<PaginatedI<BookI>>();
const isNotAuthorized = ref(false);
const url = ref(`${BACKEND_SERVER}/book`);

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
      label: "Editar",
      icon: "i-mdi-edit",
      click: () => handleEditSelectedRow(row),
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
    url.value = `${BACKEND_SERVER}/book`;
  } else if (selectedFilter.value === "Titulo") {
    url.value = `${BACKEND_SERVER}/search/books-by-title/${searchInput.value}`;
  } else if (selectedFilter.value === "Autor") {
    url.value = `${BACKEND_SERVER}/search/books-by-author/${searchInput.value}`;
  } else if (selectedFilter.value === "Categoría") {
    url.value = `${BACKEND_SERVER}/search/books-by-category/${searchInput.value}`;
  } else if (selectedFilter.value === "Subcategoría") {
    url.value = `${BACKEND_SERVER}/search/books-by-subcategory/${searchInput.value}`;
  }

  if (currentPage.value !== 1) currentPage.value = 1;
  else await fetchBooks(currentPage.value, Number(limitPerPage.value));
};

// Add Book
interface NewBookI {
  title: string;
  pages: string;
  authors: NewAuthorI[];
  category: string;
  subcategory: string;
}

interface NewAuthorI {
  name: string;
  email: string | null;
}

const showAddBookModal = ref<boolean>(false);

const handleAddBookButton = () => {
  showAddBookModal.value = true;
};

const addBookFormData = ref<NewBookI>({
  title: "",
  pages: "",
  authors: [],
  category: "",
  subcategory: "",
});

const disabledAcceptButtonAddBook = computed(() => {
  return !addBookFormData.value.title;
});

const handleAcceptAddBook = async () => {
  const newBook = addBookFormData.value;

  try {
    const response = await axios.post(
      `${BACKEND_SERVER}/book`,
      {
        title: newBook.title,
        pages: newBook.pages ? Number(newBook.pages) : null,
        authors: newBook.authors.length ? newBook.authors : null,
        category: newBook.category ? newBook.category : null,
        subcategory: newBook.subcategory ? newBook.subcategory : null,
      },
      { headers: { Authorization: `Bearer ${data}` } }
    );

    if (response.status === 201) {
      toast.add({
        title: "El libro se a creado con éxito",
      });

      if (currentPage.value === paginatedBooks.value?.lastPage)
        await fetchBooks(currentPage.value, Number(limitPerPage.value));
    }
  } catch {
    toast.add({
      title: "Error",
      description: "Error al agregar libro",
    });
  }

  addBookFormData.value = {
    title: "",
    pages: "",
    authors: [],
    category: "",
    subcategory: "",
  };
  showAddBookModal.value = false;
};

// ----------- Add Author

const showAddAuthorModal = ref(false);
const authorFormData = ref({
  name: "",
  email: "",
});
const disabledAcceptButtonAddAuthor = computed(() => {
  return !authorFormData.value.name;
});

const handleAddNewAuthor = () => {
  showAddAuthorModal.value = true;

  authorFormData.value.name = "";
  authorFormData.value.email = "";
};

const handleRemoveAuthor = (_author: NewAuthorI) => {
  addBookFormData.value.authors = addBookFormData.value.authors.filter(
    (author) => author.name !== _author.name
  );
};

const handleAcceptAddAuthor = () => {
  const author = addBookFormData.value.authors.find(
    (author) => author.name === authorFormData.value.name
  );

  if (!author) {
    showAddAuthorModal.value = false;
    addBookFormData.value.authors.push({
      name: authorFormData.value.name,
      email: authorFormData.value.email ? authorFormData.value.email : null,
    });
  } else {
    toast.add({
      title: "Error",
      description: "El author ya existe",
    });
  }
};

// Edit Book

const showEditBookModal = ref(false);
const selectedEditBook = ref<BookI>();
const loadingAcceptEditButton = ref(false);

const editBookFormData = ref<NewBookI>({
  title: "",
  pages: "",
  authors: [],
  category: "",
  subcategory: "",
});

const handleEditSelectedRow = (row: BookI) => {
  selectedEditBook.value = row;
  showEditBookModal.value = true;

  editBookFormData.value = {
    title: row.title,
    pages: row.pages.toString(),
    authors: row.authors,
    category: row.category || "",
    subcategory: row.subcategory || "",
  };
};

const disabledAcceptButtonEditBook = computed(() => {
  return !editBookFormData.value.title;
});

// ------------- Add Author - Edit

const showEditAuthorModal = ref(false);
const disabledAcceptButtonEditAuthor = computed(() => {
  return !authorFormData.value.name;
});

const handleAddNewAuthorToEditForm = () => {
  showEditAuthorModal.value = true;

  authorFormData.value.name = "";
  authorFormData.value.email = "";
};

const handleRemoveAuthorOfEditBookForm = (_author: NewAuthorI) => {
  editBookFormData.value.authors = editBookFormData.value.authors.filter(
    (author) => author.name !== _author.name
  );
};

const handleAcceptAddAuthorToEditForm = () => {
  const author = editBookFormData.value.authors.find(
    (author) => author.name === authorFormData.value.name
  );

  if (!author) {
    showEditAuthorModal.value = false;
    editBookFormData.value.authors.push({
      name: authorFormData.value.name,
      email: authorFormData.value.email ? authorFormData.value.email : null,
    });
  } else {
    toast.add({
      title: "Error",
      description: "El author ya existe",
    });
  }
};

const handleAcceptEditBook = async () => {
  loadingAcceptEditButton.value = true;
  const editedBook = editBookFormData.value;

  try {
    const response = await axios.put(
      `${BACKEND_SERVER}/book/${selectedEditBook.value?.id}`,
      {
        title: editedBook.title,
        pages: editedBook.pages ? Number(editedBook.pages) : null,
        authors: editedBook.authors.length ? editedBook.authors : null,
        category: editedBook.category ? editedBook.category : null,
        subcategory: editedBook.subcategory ? editedBook.subcategory : null,
      },
      { headers: { Authorization: `Bearer ${data}` } }
    );

    if (response.status === 200) {
      toast.add({
        title: "El libro se a actualizado con éxito",
      });

      if (currentPage.value === paginatedBooks.value?.lastPage)
        await fetchBooks(currentPage.value, Number(limitPerPage.value));
    }
  } catch {
    toast.add({
      title: "Error",
      description: "Error al editar libro",
    });
  }

  editBookFormData.value = {
    title: "",
    pages: "",
    authors: [],
    category: "",
    subcategory: "",
  };
  showEditBookModal.value = false;
  selectedEditBook.value = undefined;
  loadingAcceptEditButton.value = false;
};
</script>

<template>
  <NotAuthorized v-if="isNotAuthorized" path="/dashboard" />
  <DashboardContainer v-else>
    <template #title>Bienvenido</template>
    <template #description>
      ¡Bienvenido! Aquí podras agregar, editar y eliminar libros.
    </template>
    <template #title-table>Catálogo de Libros</template>

    <template #search>
      <SearchContainer>
        <template #search-filter>
          <USelectMenu v-model="selectedFilter" :options="filters" />
        </template>
        <template #search-input>
          <UInput
            v-model="searchInput"
            name="filter"
            placeholder="Buscar"
            :disabled="selectedFilter === 'Todo'"
          />
        </template>
        <template #search-reset-filter>
          <Button
            v-show="selectedFilter !== 'Todo' || searchInput !== ''"
            @click="
              selectedFilter = 'Todo';
              searchInput = '';
              handleFilter();
            "
            icon="i-tabler-circle-x-filled"
          >
            Limpiar filtro
          </Button>
        </template>
        <template #search-button>
          <Button
            @click="handleFilter"
            icon="i-heroicons-magnifying-glass"
            :disabled="!searchInput && selectedFilter !== 'Todo'"
          >
            Filtrar
          </Button>
        </template>
      </SearchContainer>
    </template>

    <template #actions>
      <ActionsContainer>
        <template #left>
          <Button icon="i-mdi-plus" @click="handleAddBookButton">
            Agregar libro
          </Button>
        </template>
      </ActionsContainer>
    </template>

    <UTable
      :loading="paginatedBooks === undefined || !paginatedBooks.data"
      :columns="columns"
      :rows="paginatedBooks?.data"
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
        <UDropdown :items="items(row)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />

          <template #item="{ item }">
            <span class="truncate text-black">{{ item.label }}</span>

            <UIcon
              :name="item.icon"
              class="flex-shrink-0 h-4 w-4 text-black dark:text-gray-500 ms-auto"
            />
          </template>
        </UDropdown>
      </template>
    </UTable>

    <template #current-page>{{ currentPage }}</template>
    <template #total-pages>{{ paginatedBooks?.lastPage }}</template>

    <template #pagination v-if="paginatedBooks">
      <UPagination
        v-model="currentPage"
        :page-count="Number(limitPerPage)"
        :total="paginatedBooks.total"
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
      <!-- Add Book -->
      <Modal
        v-model="showAddBookModal"
        :disabled-accept-button="disabledAcceptButtonAddBook"
        @handle-accept="handleAcceptAddBook"
      >
        <template #header-title>Agrega un Libro</template>
        <template #header-description>
          Agrega un nuevo libro al catálogo
        </template>

        <div class="max-h-60 overflow-y-auto py-4 px-2 flex gap-3 flex-col">
          <FormBaseInput
            v-model="addBookFormData.title"
            name="title"
            label="Título"
            placeholder="Ingrese el título del libro"
            required
          />
          <FormBaseInput
            v-model="addBookFormData.pages"
            name="pages"
            label="Páginas"
            placeholder="Ingrese el número de páginas del libro"
          />
          <FormBaseInput
            v-model="addBookFormData.category"
            name="category"
            label="Categoría"
            placeholder="Ingrese la categoría del libro"
          />
          <FormBaseInput
            v-model="addBookFormData.subcategory"
            name="subcategory"
            label="Subcategoría"
            placeholder="Ingrese la subcategoría del libro"
          />

          <Button icon="i-mdi-plus" @click="handleAddNewAuthor">
            Agregar Autor
          </Button>

          <div class="flex flex-col gap-4">
            <div
              class="flex outline outline-1 outline-white p-2 rounded-md"
              v-for="author in addBookFormData.authors"
            >
              <p class="text-white flex-1">
                {{ author.name }}{{ author.email ? ` - ${author.email}` : "" }}
              </p>
              <UButton
                class="cursor-pointer text-red-600"
                variant="ghost"
                icon="i-mdi-delete-forever"
                @click="handleRemoveAuthor(author)"
              />
            </div>
          </div>
        </div>

        <Modal
          v-model="showAddAuthorModal"
          :disabled-accept-button="disabledAcceptButtonAddAuthor"
          @handle-accept="handleAcceptAddAuthor"
        >
          <template #header-title>Agrega un Autor</template>
          <template #header-description>
            Agrega un autor para el libro
          </template>

          <FormBaseInput
            v-model="authorFormData.name"
            name="author-name"
            label="Nombre"
            placeholder="Ingrese el nombre del autor"
            required
          />
          <FormBaseInput
            v-model="authorFormData.email"
            name="author-email"
            label="Correo"
            placeholder="Ingrese el correo del autor"
            type="email"
          />
        </Modal>
      </Modal>
      <!-- Edit Book -->
      <Modal
        v-model="showEditBookModal"
        :disable-accept-button="disabledAcceptButtonEditBook"
        :loading="loadingAcceptEditButton"
        @handle-accept="handleAcceptEditBook"
      >
        <template #header-title>Edita un Libro</template>
        <template #header-description>
          Edita un nuevo libro del catálogo
        </template>

        <div class="max-h-60 overflow-y-auto py-4 px-2 flex gap-3 flex-col">
          <FormBaseInput
            v-model="editBookFormData.title"
            name="title"
            label="Título"
            placeholder="Ingrese el título del libro"
            required
          />
          <FormBaseInput
            v-model="editBookFormData.pages"
            name="pages"
            label="Páginas"
            placeholder="Ingrese el número de páginas del libro"
          />
          <FormBaseInput
            v-model="editBookFormData.category"
            name="category"
            label="Categoría"
            placeholder="Ingrese la categoría del libro"
          />
          <FormBaseInput
            v-model="editBookFormData.subcategory"
            name="subcategory"
            label="Subcategoría"
            placeholder="Ingrese la subcategoría del libro"
          />

          <Button icon="i-mdi-plus" @click="handleAddNewAuthorToEditForm">
            Agregar Autor
          </Button>

          <div class="flex flex-col gap-4">
            <div
              class="flex outline outline-1 outline-white p-2 rounded-md"
              v-for="author in editBookFormData.authors"
            >
              <p class="text-white flex-1">
                {{ author.name }}{{ author.email ? ` - ${author.email}` : "" }}
              </p>
              <UButton
                class="cursor-pointer text-red-600"
                variant="ghost"
                icon="i-mdi-delete-forever"
                @click="handleRemoveAuthorOfEditBookForm(author)"
              />
            </div>
          </div>
        </div>

        <Modal
          v-model="showEditAuthorModal"
          :disabled-accept-button="disabledAcceptButtonEditAuthor"
          @handle-accept="handleAcceptAddAuthorToEditForm"
        >
          <template #header-title>Agrega un Autor</template>
          <template #header-description>
            Agrega un autor para el libro
          </template>

          <FormBaseInput
            v-model="authorFormData.name"
            name="author-name"
            label="Nombre"
            placeholder="Ingrese el nombre del autor"
            required
          />
          <FormBaseInput
            v-model="authorFormData.email"
            name="author-email"
            label="Correo"
            placeholder="Ingrese el correo del autor"
            type="email"
          />
        </Modal>
      </Modal>
    </template>
  </DashboardContainer>
</template>

<style scoped lang="sass"></style>
