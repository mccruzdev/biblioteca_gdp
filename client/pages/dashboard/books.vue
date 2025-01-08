<script setup lang="ts">
import axios from "axios";
import { BACKEND_SERVER } from "~/config/api";
import ActionsContainer from "~/features/dashboard/components/actions-container.vue";
import ActionsDropdown from "~/features/dashboard/components/actions-dropdown.vue";
import SearchContainer from "~/features/dashboard/components/search-container.vue";
import Searchbar from "~/features/dashboard/components/searchbar.vue";
import { MIN_WIDTH_SCREEN_FOR_TABLE } from "~/features/dashboard/constants";
import DashboardContainer from "~/features/dashboard/dashboard-container.vue";
import type { Expanded } from "~/features/dashboard/interface";
import { transformCondition } from "~/transforms/copy-condition";
import {
  type PaginatedI,
  type BookI,
  type BookConditionT,
  BookConditionE,
  type CopyI,
  type LocationI,
  type PublisherI,
} from "~/types";

const { data } = useAuthStore();
const { width } = useWindowSize()
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
  [
    {
      label: "Agregar copia",
      icon: "i-mdi-book-cog",
      click: () => handleAddCopySelectedRow(row),
    },
  ],
];

const expand = ref<Expanded<BookI>>({
  openedRows: [],
  row: null,
});

const toggleExpand = (row: BookI) => {
  if (expand.value.row?.id === row.id) {
    expand.value.row = null;
  } else {
    expand.value.row = row;
  }
};

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

// Add Copies

interface NewCopyI {
  code: string;
  condition: BookConditionT;
  location: LocationI;
  publisher: PublisherI;
}

const showAddCopiesModal = ref(false);
const loadingAddCopiesButton = ref(false);
const selectedBookToAddCopies = ref<BookI>();

const copyFormData = ref<NewCopyI>({
  code: "",
  condition: BookConditionE.NEW,
  location: { shelf: "", shelfColor: "", shelfLevel: "" },
  publisher: {
    name: "",
    email: "",
    country: "",
    address: "",
    phoneNumber: "",
    website: "",
  },
});

const handleAddCopySelectedRow = (row: BookI) => {
  showAddCopiesModal.value = true;
  selectedBookToAddCopies.value = row;

  copyFormData.value = {
    code: "",
    condition: BookConditionE.NEW,
    location: { shelf: "", shelfColor: "", shelfLevel: "" },
    publisher: {
      name: "",
      email: "",
      country: "",
      address: "",
      phoneNumber: "",
      website: "",
    },
  };
};

const handleAcceptAddCopies = async () => {
  loadingAddCopiesButton.value = true;

  try {
    const copy = copyFormData.value;

    const response = await axios.post(
      `${BACKEND_SERVER}/copy`,
      {
        code: copy.code,
        condition: copy.condition,
        location: {
          shelf: copy.location.shelf,
          shelfColor: copy.location.shelfColor
            ? copy.location.shelfColor
            : null,
          shelfLevel: copy.location.shelfLevel
            ? copy.location.shelfLevel
            : null,
        },
        publisher: {
          name: copy.publisher.name,
          email: copy.publisher.email ? copy.publisher.email : null,
          country: copy.publisher.country ? copy.publisher.country : null,
          address: copy.publisher.address ? copy.publisher.address : null,
          phoneNumber: copy.publisher.phoneNumber
            ? copy.publisher.phoneNumber
            : null,
          website: copy.publisher.website ? copy.publisher.website : null,
        },
        bookId: selectedBookToAddCopies.value?.id,
      },
      { headers: { Authorization: `Bearer ${data}` } }
    );

    if (response.status === 201) {
      toast.add({
        title: "Copia registrada con éxito",
      });
      await fetchBooks(currentPage.value, Number(limitPerPage.value));
    } else
      toast.add({
        title: "Error",
        description: "Error creando la copia",
      });
  } catch {
    toast.add({
      title: "Error",
      description: "Error creando la copia",
    });
    return;
  }

  loadingAddCopiesButton.value = false;
  selectedBookToAddCopies.value = undefined;
  showAddCopiesModal.value = false;
};

// Edit Copy

interface EditCopyI {
  id: number;
  code: string;
  condition: BookConditionT;
  location: LocationI;
  publisher: PublisherI;
}

const showEditCopyModal = ref(false);
const loadingEditCopyAcceptButton = ref(false);
const selectedEditCopy = ref<CopyI>();

const editCopyFormData = ref<EditCopyI>();

const handleEditCopy = (row: CopyI) => {
  selectedEditCopy.value = row;
  showEditCopyModal.value = true;

  editCopyFormData.value = {
    id: row.id,
    code: row.code,
    condition: row.condition || "NEW",
    location: {
      shelf: row.location?.shelf || "",
      shelfColor: row.location?.shelfColor || "",
      shelfLevel: row.location?.shelfLevel || "",
    },
    publisher: {
      name: row.publisher?.name || "",
      email: row.publisher?.email || "",
      country: row.publisher?.country || "",
      address: row.publisher?.address || "",
      phoneNumber: row.publisher?.phoneNumber || "",
      website: row.publisher?.website || "",
    },
  };
};

const handleAcceptEditCopy = async () => {
  loadingEditCopyAcceptButton.value = true;

  try {
    const copy = editCopyFormData.value;
    if (!copy) return;

    const response = await axios.put(
      `${BACKEND_SERVER}/copy/${editCopyFormData.value?.id}`,
      {
        code: copy.code,
        condition: copy.condition,
        location: {
          shelf: copy.location.shelf,
          shelfColor: copy.location.shelfColor
            ? copy.location.shelfColor
            : null,
          shelfLevel: copy.location.shelfLevel
            ? copy.location.shelfLevel
            : null,
        },
        publisher: {
          name: copy.publisher.name,
          email: copy.publisher.email ? copy.publisher.email : null,
          country: copy.publisher.country ? copy.publisher.country : null,
          address: copy.publisher.address ? copy.publisher.address : null,
          phoneNumber: copy.publisher.phoneNumber
            ? copy.publisher.phoneNumber
            : null,
          website: copy.publisher.website ? copy.publisher.website : null,
        },
        bookId: selectedEditCopy.value?.book.id,
      },
      { headers: { Authorization: `Bearer ${data}` } }
    );

    if (response.status === 200) {
      toast.add({
        title: "Copia editada con éxito",
      });
      await fetchBooks(currentPage.value, Number(limitPerPage.value));
    } else
      toast.add({
        title: "Error",
        description: "Error editando la copia",
      });
  } catch {
    toast.add({
      title: "Error",
      description: "Error editando la copia",
    });
  }

  showEditCopyModal.value = false;
  loadingEditCopyAcceptButton.value = false;
  selectedEditCopy.value = undefined;
};

// Delete Copy

const showDeleteCopyModal = ref(false)
const selectedCopy = ref<CopyI>()
const loadingAcceptDeleteCopy = ref(false)

const handleDeleteCopyButton = (copy: CopyI) => {
  showDeleteCopyModal.value = true
  selectedCopy.value = copy
}

const handleAcceptDeleteCopy = async () => {
  loadingAcceptDeleteCopy.value = true

  try {
    const response = await axios.delete(`${BACKEND_SERVER}/copy/${selectedCopy.value?.id}`, {
      headers: {Authorization: `Bearer ${data}`}
    })

    if (response.status === 200) {
      toast.add({
        title: "Copia eliminada con éxito",
      })

      await fetchBooks(currentPage.value, Number(limitPerPage.value));
    } else {
      toast.add({
        title: "Error",
        description: "Error eliminando la copia",
      });
    }
  } catch {
    toast.add({
      title: "Error",
      description: "Error eliminando la copia",
    });
  }

  loadingAcceptDeleteCopy.value = false
  showDeleteCopyModal.value = false
  selectedCopy.value = undefined
}
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
      <Searchbar
        v-model:input="searchInput"
        v-model:filter="selectedFilter"
        :filters="filters"
        @handle-filter="handleFilter"
      />
    </template>

    <template #actions>
      <ActionsContainer>
        <template #left>
          <Button icon="i-mdi-plus" @click="handleAddBookButton"> Agregar libro </Button>
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
          <!-- Título del libro -->
          <div class="text-white text-lg font-bold">
            {{ row.title }}
          </div>
          <!-- Información del libro -->
          <div class="text-white text-sm">
            <p><strong>ID:</strong> {{ row.id }}</p>
            <p><strong>Páginas:</strong> {{ row.pages }}</p>
            <p><strong>Autor:</strong> {{ row.authors[0]?.name || "Desconocido" }}</p>
            <p><strong>Categoría:</strong> {{ row.category }}</p>
            <p><strong>Subcategoría:</strong> {{ row.subcategory }}</p>
          </div>
          <!-- Acciones -->
          <div class="mt-4">
            <ActionsDropdown :items="items" :row="row" />
          </div>

          <!-- Expansión -->
          <div
            class="mt-4 p-4 bg-gray-700 rounded-lg cursor-pointer"
            @click="toggleExpand(row)"
          >
            <span class="text-white font-semibold">Ver detalles</span>
          </div>

          <!-- Expandir detalles -->
          <div v-if="expand.row?.id === row.id" class="mt-4 p-4 bg-gray-700 rounded-lg">
            <div
              v-for="copy in row.copies"
              :key="copy.id"
              class="mb-4 p-4 border rounded-lg shadow bg-gray-600"
            >
              <h3 class="text-white text-lg font-semibold">Código: {{ copy.code }}</h3>
              <p class="text-sm text-gray-300">
                Condición: {{ transformCondition(copy.condition) }}
              </p>

              <div v-if="copy.location" class="mt-2">
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

              <div v-if="copy.publisher" class="mt-2">
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
            </div>
          </div>
        </div>
      </div>

      <!-- Estado de carga o vacío -->
      <div v-if="!paginatedBooks || !paginatedBooks.data" class="text-center py-6">
        <UIcon name="i-heroicons-circle-stack-20-solid" class="w-8 h-8 mx-auto" />
        <span class="text-white">No hay resultados</span>
      </div>
    </template>

    <UTable
      :loading="paginatedBooks === undefined || !paginatedBooks.data"
      :columns="columns"
      :rows="paginatedBooks?.data"
      v-model:expand="expand"
      :multiple-expand="false"
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

      <template #expand="{ row }">
        <div class="p-4 flex flex-col gap-2">
          <div
            class="flex flex-col space-y-4 w-full"
            v-for="copy in row.copies"
            :key="copy.id"
          >
            <!-- Información del ejemplar -->
            <div class="p-4 border rounded-lg shadow" style="border-color: #ffffff">
              <div class="flex gap-2">
                <div class="flex w-40">
                  <Button
                    icon="i-mdi-edit"
                    @click="() => handleEditCopy(copy)"
                    class="mb-4"
                  >
                    Editar
                  </Button>
                </div>
                <div class="flex w-40">
                  <Button
                    icon="i-mdi-delete"
                    @click="() => handleDeleteCopyButton(copy)"
                    class="mb-4"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
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
      <!-- Add Book -->
      <Modal
        v-model="showAddBookModal"
        :disabled-accept-button="disabledAcceptButtonAddBook"
        @handle-accept="handleAcceptAddBook"
      >
        <template #header-title>Agrega un Libro</template>
        <template #header-description> Agrega un nuevo libro al catálogo </template>

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

          <Button icon="i-mdi-plus" @click="handleAddNewAuthor"> Agregar Autor </Button>

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
          <template #header-description> Agrega un autor para el libro </template>

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
        <template #header-description> Edita un nuevo libro del catálogo </template>

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
          <template #header-description> Agrega un autor para el libro </template>

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
      <!-- Add copy -->
      <Modal
        v-model="showAddCopiesModal"
        :loading="loadingAddCopiesButton"
        @handle-accept="handleAcceptAddCopies"
      >
        <template #header-title>Agrega una copia</template>
        <template #header-description>
          Agrega una copia del libro &quot;
          {{ selectedBookToAddCopies?.title }}
          &quot;
        </template>

        <div class="max-h-60 overflow-y-auto py-4 px-2 flex gap-3 flex-col">
          <FormBaseInput
            v-model="copyFormData.code"
            name="copy-code"
            label="Código del libro"
            placeholder="Ingrese el código del libro"
            required
          />
          <USelect
            v-model="copyFormData.condition"
            :options="[
              { value: BookConditionE.NEW, label: 'Nuevo' },
              { value: BookConditionE.GOOD, label: 'Bueno' },
              { value: BookConditionE.FAIR, label: 'Regular' },
              { value: BookConditionE.DAMAGED, label: 'Dañado' },
              { value: BookConditionE.BAD, label: 'Malo' },
            ]"
          />

          <p class="w-full text-center text-white font-bold">Ubicación</p>

          <FormBaseInput
            v-model="copyFormData.location.shelf"
            name="copy-location-shelf"
            label="Estante"
            placeholder="Estante donde se encuentra"
            required
          />
          <FormBaseInput
            v-model="copyFormData.location.shelfColor"
            name="copy-location-shelfcolor"
            label="Color del estante"
            placeholder="Color del estante donde se encuentra"
          />
          <FormBaseInput
            v-model="copyFormData.location.shelfLevel"
            name="copy-location-shelflevel"
            label="Nivel del estante"
            placeholder="Nivel del estante donde se encuentra"
          />

          <p class="w-full text-center text-white font-bold">Editorial</p>

          <FormBaseInput
            v-model="copyFormData.publisher.name"
            name="copy-publisher-name"
            label="Nombre de la editorial"
            placeholder="Nombre de la editorial"
            required
          />
          <FormBaseInput
            v-model="copyFormData.publisher.email"
            name="copy-publisher-email"
            label="Correo de la editorial"
            placeholder="Correo de la editorial"
            type="email"
          />
          <FormBaseInput
            v-model="copyFormData.publisher.country"
            name="copy-publisher-country"
            label="País de la editorial"
            placeholder="País de la editorial"
          />
          <FormBaseInput
            v-model="copyFormData.publisher.address"
            name="copy-publisher-address"
            label="Dirección de la editorial"
            placeholder="Dirección de la editorial"
          />
          <FormBaseInput
            v-model="copyFormData.publisher.phoneNumber"
            name="copy-publisher-phonenumber"
            label="Teléfono de la editorial"
            placeholder="Número de teléfono de la editorial"
            type="tel"
          />
          <FormBaseInput
            v-model="copyFormData.publisher.website"
            name="copy-publisher-website"
            label="Sitio web de la editorial"
            placeholder="Sitio Web de la editorial"
          />
        </div>
      </Modal>
      <!-- Edit Copy -->
      <Modal
        v-model="showEditCopyModal"
        :loading="loadingEditCopyAcceptButton"
        @handle-accept="handleAcceptEditCopy"
      >
        <template #header-title>Edita una copia</template>
        <template #header-description>
          Edita una copia del libro &quot;
          {{ editCopyFormData?.code }}
          &quot;
        </template>

        <div
          class="max-h-60 overflow-y-auto py-4 px-2 flex gap-3 flex-col"
          v-if="editCopyFormData"
        >
          <USelect
            v-model="editCopyFormData.condition"
            :options="[
              { value: BookConditionE.NEW, label: 'Nuevo' },
              { value: BookConditionE.GOOD, label: 'Bueno' },
              { value: BookConditionE.FAIR, label: 'Regular' },
              { value: BookConditionE.DAMAGED, label: 'Dañado' },
              { value: BookConditionE.BAD, label: 'Malo' },
            ]"
          />

          <p class="w-full text-center text-white font-bold">Ubicación</p>

          <FormBaseInput
            v-model="editCopyFormData.location.shelf"
            name="copy-location-shelf"
            label="Estante"
            placeholder="Estante donde se encuentra"
            required
          />
          <FormBaseInput
            v-model="editCopyFormData.location.shelfColor"
            name="copy-location-shelfcolor"
            label="Color del estante"
            placeholder="Color del estante donde se encuentra"
          />
          <FormBaseInput
            v-model="editCopyFormData.location.shelfLevel"
            name="copy-location-shelflevel"
            label="Nivel del estante"
            placeholder="Nivel del estante donde se encuentra"
          />

          <p class="w-full text-center text-white font-bold">Editorial</p>

          <FormBaseInput
            v-model="editCopyFormData.publisher.name"
            name="copy-publisher-name"
            label="Nombre de la editorial"
            placeholder="Nombre de la editorial"
            required
          />
          <FormBaseInput
            v-model="editCopyFormData.publisher.email"
            name="copy-publisher-email"
            label="Correo de la editorial"
            placeholder="Correo de la editorial"
            type="email"
          />
          <FormBaseInput
            v-model="editCopyFormData.publisher.country"
            name="copy-publisher-country"
            label="País de la editorial"
            placeholder="País de la editorial"
          />
          <FormBaseInput
            v-model="editCopyFormData.publisher.address"
            name="copy-publisher-address"
            label="Dirección de la editorial"
            placeholder="Dirección de la editorial"
          />
          <FormBaseInput
            v-model="editCopyFormData.publisher.phoneNumber"
            name="copy-publisher-phonenumber"
            label="Teléfono de la editorial"
            placeholder="Número de teléfono de la editorial"
            type="tel"
          />
          <FormBaseInput
            v-model="editCopyFormData.publisher.website"
            name="copy-publisher-website"
            label="Sitio web de la editorial"
            placeholder="Sitio Web de la editorial"
          />
        </div>
      </Modal>
      <!-- Delete Copy -->
      <Modal
        v-model="showDeleteCopyModal"
        :loading="loadingAcceptDeleteCopy"
        @handle-accept="handleAcceptDeleteCopy"
      >
        <template #header-title>Eliminar copia</template>
        <template #header-description>
          Elimina la copia con el código {{ selectedCopy?.code }}
        </template>
      </Modal>
    </template>
  </DashboardContainer>
</template>

<style scoped lang="sass"></style>
