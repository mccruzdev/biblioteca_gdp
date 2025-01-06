<script setup lang="ts">
import axios from "axios";
import { BACKEND_SERVER } from "~/config/api";
import ActionsContainer from "~/features/dashboard/components/actions-container.vue";
import ActionsDropdown from "~/features/dashboard/components/actions-dropdown.vue";
import SearchContainer from "~/features/dashboard/components/search-container.vue";
import { MIN_WIDTH_SCREEN_FOR_TABLE } from "~/features/dashboard/constants";
import DashboardContainer from "~/features/dashboard/dashboard-container.vue";
import {
  type PaginatedI,
  type DonorI,
  type BookConditionT,
  BookConditionE,
} from "~/types";

const { data } = useAuthStore();
const { width } = useWindowSize();
const toast = useToast();
const paginatedDonors = ref<PaginatedI<DonorI>>();
const isNotAuthorized = ref(false);
const url = ref(`${BACKEND_SERVER}/donor`);

const fetchDonors = async (page: number, limit: number) => {
  try {
    const response = await axios.get(
      `${url.value}?page=${page}&limit=${limit}`,
      { headers: { Authorization: `Bearer ${data}` } }
    );

    if (response.status === 200) paginatedDonors.value = response.data;
  } catch {
    isNotAuthorized.value = true;
  }
};

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Nombre" },
  { key: "email", label: "Correo" },
  { key: "actions", label: "Acciones" },
];

const items = (row: DonorI) => [
  [
    {
      label: "Editar",
      icon: "i-mdi-edit",
      click: () => handleEditSelectRow(row),
    },
  ],
  [
    {
      label: "Registrar donación",
      icon: "i-mdi-gift-open",
      click: () => handleRegisterDonationSelectRow(row),
    },
  ],
];

// Pagination

const currentPage = ref(1);
const limitPerPage = ref<string>("10");

onMounted(async () => {
  await fetchDonors(currentPage.value, Number(limitPerPage.value));
});

watch(currentPage, async (newCurrentPage) => {
  await fetchDonors(newCurrentPage, Number(limitPerPage.value));
});

watch(limitPerPage, async () => {
  if (currentPage.value !== 1) currentPage.value = 1;
  else await fetchDonors(currentPage.value, Number(limitPerPage.value));
});

// Filter

const selectedFilter = ref<string>("Todo");
const filters = ["Todo", "Nombre", "Correo"];

const searchInput = ref("");

const handleFilter = async () => {
  if (selectedFilter.value === "Todo") {
    url.value = `${BACKEND_SERVER}/donor`;
  } else if (selectedFilter.value === "Nombre") {
    url.value = `${BACKEND_SERVER}/search/donor-by-name/${searchInput.value}`;
  } else if (selectedFilter.value === "Correo") {
    url.value = `${BACKEND_SERVER}/search/donor-by-email/${searchInput.value}`;
  }

  if (currentPage.value !== 1) currentPage.value = 1;
  else await fetchDonors(currentPage.value, Number(limitPerPage.value));
};

// Add Modal

const showAddDonorModal = ref(false);
const loadingAcceptButton = ref(false);

const donorFormData = ref({
  name: "",
  email: "",
});
const disabledAcceptDonorButton = computed(
  () => !donorFormData.value.name || !donorFormData.value.email
);

const handleAddDonorButton = () => {
  showAddDonorModal.value = true;
};

const handleAcceptAddDonorButton = async () => {
  if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      donorFormData.value.email
    )
  ) {
    toast.add({
      title: "Error",
      description: "Correo electrónico no válido",
    });
    return;
  }

  loadingAcceptButton.value = true;

  try {
    const response = await axios.post(
      `${BACKEND_SERVER}/donor`,
      {
        name: donorFormData.value.name,
        email: donorFormData.value.email,
      },
      { headers: { Authorization: `Bearer ${data}` } }
    );

    if (response.status === 201) {
      toast.add({
        title: "Donor agregado con éxito",
      });
    }

    if (currentPage.value === paginatedDonors.value?.lastPage)
      await fetchDonors(currentPage.value, Number(limitPerPage.value));
  } catch {
    toast.add({
      title: "Error",
      description: "Error al agregar el donador",
    });
  }

  donorFormData.value = {
    name: "",
    email: "",
  };
  showAddDonorModal.value = false;
  loadingAcceptButton.value = false;
};

const selectedDonor = ref<DonorI>();

// Edit Modal

const showEditModal = ref(false);

const handleEditSelectRow = (donor: DonorI) => {
  selectedDonor.value = donor;
  showEditModal.value = true;

  donorFormData.value = { name: donor.name, email: donor.email || "" };
};

const handleAcceptEdit = async () => {
  loadingAcceptButton.value = true;

  try {
    const response = await axios.put(
      `${BACKEND_SERVER}/donor/${selectedDonor.value?.id}`,
      {
        name: donorFormData.value.name,
        email: donorFormData.value.email,
      },
      { headers: { Authorization: `Bearer ${data}` } }
    );

    if (response.status === 200) {
      toast.add({
        title: "Donor editado con éxito",
      });
      await fetchDonors(currentPage.value, Number(limitPerPage.value));
    } else {
      toast.add({
        title: "Error",
        description: "Error al editar el donador",
      });
    }
  } catch {
    toast.add({
      title: "Error",
      description: "Error al editar el donador",
    });
  }

  loadingAcceptButton.value = false;
  selectedDonor.value = undefined;
  showEditModal.value = false;
  donorFormData.value = { name: "", email: "" };
};

// Register Donation Modal

interface LocationI {
  shelf: string;
  shelfColor: string;
  shelfLevel: string;
}

interface PublisherI {
  name: string;
  email: string;
  country: string;
  address: string;
  phoneNumber: string;
  website: string;
}

interface NewCopyI {
  code: string;
  condition: BookConditionT;
  location: LocationI;
  publisher: PublisherI;
  bookId: string;
}

const showRegisterDonationModal = ref(false);

const donationFormData = ref<{
  description: string;
  copies: NewCopyI[];
}>({ description: "", copies: [] });

const disabledAcceptButtonDonationButton = computed(() => {
  return !donationFormData.value.copies.length;
});
const loadingAcceptDonationButton = ref(false);

const handleRegisterDonationSelectRow = (donor: DonorI) => {
  selectedDonor.value = donor;
  showRegisterDonationModal.value = true;
  donationFormData.value = { description: "", copies: [] };
};

const handleRegisterDonation = async () => {
  loadingAcceptDonationButton.value = true;

  try {
    const response = await axios.post(
      `${BACKEND_SERVER}/donation`,
      {
        donorId: selectedDonor.value?.id,
        description: donationFormData.value.description,
        copies: donationFormData.value.copies.map((copy) => {
          return {
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
            bookId: Number(copy.bookId),
          };
        }),
      },
      { headers: { Authorization: `Bearer ${data}` } }
    );

    if (response.status === 201) {
      toast.add({
        title: "Donación registrada con éxito",
      });
    }

    selectedDonor.value = undefined;
    showRegisterDonationModal.value = false;
    donationFormData.value = { description: "", copies: [] };
  } catch {
    toast.add({
      title: "Error al registrar la donación",
      description: "Datos invalidos",
    });
  }

  loadingAcceptDonationButton.value = false;
};

// --------- Add Copy ---------

const showAddCopyModal = ref(false);
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
  bookId: "",
});

const disabledAcceptButtonCopyForm = computed(() => {
  return (
    !copyFormData.value.bookId ||
    !copyFormData.value.code ||
    !copyFormData.value.location.shelf ||
    !copyFormData.value.publisher.name
  );
});

const handleAddNewCopyToForm = () => {
  showAddCopyModal.value = true;

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
    bookId: "",
  };
};

const handleAcceptAddNewCopyToForm = () => {
  let isValidCopy = true;

  donationFormData.value.copies.forEach((copy) => {
    if (copy.code === copyFormData.value.code) {
      toast.add({
        title: "El código ya existe",
      });
      isValidCopy = false;
    } else if (!/^\d+$/.test(copy.bookId)) {
      toast.add({
        title: "El ID del libro debe ser un número",
      });
      isValidCopy = false;
    }
  });

  if (!isValidCopy) return;

  const newBook = copyFormData.value;

  donationFormData.value.copies.push({
    code: newBook.code,
    condition: newBook.condition,
    location: {
      shelf: newBook.location.shelf,
      shelfColor: newBook.location.shelfColor,
      shelfLevel: newBook.location.shelfLevel,
    },
    publisher: {
      name: newBook.publisher.name,
      email: newBook.publisher.email,
      country: newBook.publisher.country,
      address: newBook.publisher.address,
      phoneNumber: newBook.publisher.phoneNumber,
      website: newBook.publisher.website,
    },
    bookId: newBook.bookId,
  });

  showAddCopyModal.value = false;
};

const handleRemoveCopyFromDonationForm = (copy: NewCopyI) => {
  donationFormData.value.copies = donationFormData.value.copies.filter(
    (_copy) => _copy.code !== copy.code
  );
};
</script>

<template>
  <NotAuthorized v-if="isNotAuthorized" path="/dashboard" />
  <DashboardContainer v-else>
    <template #title>Donadores</template>
    <template #description> Administra los donadores de la plataforma</template>
    <template #title-table>Donantes</template>

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
          <Button icon="i-mdi-plus" @click="handleAddDonorButton">
            Agregar Donador
          </Button>
        </template>
      </ActionsContainer>
    </template>

    <template v-if="width < MIN_WIDTH_SCREEN_FOR_TABLE">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="row in paginatedDonors?.data"
          :key="row.id"
          class="bg-gray-800 rounded-lg p-4 shadow"
        >
          <div class="text-white text-lg font-bold">
            {{ row.name }}
          </div>
          <div class="text-white text-sm">
            <p><strong>ID:</strong> {{ row.id }}</p>
            <p><strong>Email:</strong> {{ row.email }}</p>
          </div>
          <div class="mt-4">
            <ActionsDropdown :items="items" :row="row" />
          </div>
        </div>
      </div>

      <div v-if="!paginatedDonors || !paginatedDonors.data" class="text-center py-6">
        <UIcon name="i-heroicons-circle-stack-20-solid" class="w-8 h-8 mx-auto" />
        <span class="text-white">No hay resultados</span>
      </div>
    </template>

    <UTable
      :loading="paginatedDonors === undefined || !paginatedDonors.data"
      :columns="columns"
      :rows="paginatedDonors?.data"
      v-else
    >
      <template #id-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #name-header="{ column }">
        <span class="text-white">{{ column.label }}</span>
      </template>
      <template #email-header="{ column }">
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
      <template #name-data="{ row }">
        <span class="text-white text-left">{{ row.name }}</span>
      </template>
      <template #email-data="{ row }">
        <span class="text-white text-left">{{ row.email }}</span>
      </template>
      <template #actions-data="{ row }">
        <ActionsDropdown :items="items" :row="row" />
      </template>
    </UTable>

    <template #current-page>{{ currentPage }}</template>
    <template #total-pages>{{ paginatedDonors?.lastPage }}</template>

    <template #pagination v-if="paginatedDonors">
      <UPagination
        v-model="currentPage"
        :page-count="Number(limitPerPage)"
        :total="paginatedDonors.total"
        :size="width <= 360 ? '2xs' : width <= 450 ? 'xs' : 'sm'"
      />
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
      />
    </template>

    <template #modals>
      <!-- Add Donor -->
      <Modal
        v-model="showAddDonorModal"
        :disabled-accept-button="disabledAcceptDonorButton"
        :loading="loadingAcceptButton"
        @handle-accept="handleAcceptAddDonorButton"
      >
        <template #header-title>Agregar Donador</template>
        <template #header-description> Agrega un nuevo donante </template>

        <FormBaseInput
          v-model="donorFormData.name"
          name="donor-name"
          label="Nombre"
          placeholder="Ingrese el nombre del donante"
          required
        />
        <FormBaseInput
          v-model="donorFormData.email"
          name="donor-email"
          label="Correo"
          placeholder="Ingrese el correo del donante"
          type="email"
          required
        />
      </Modal>
      <!-- Edit Modal -->
      <Modal
        v-model="showEditModal"
        :disabled-accept-button="disabledAcceptDonorButton"
        :loading="loadingAcceptButton"
        @handle-accept="handleAcceptEdit"
      >
        <template #header-title>Editar Donador</template>
        <template #header-description> Edita los datos de un donante </template>

        <FormBaseInput
          v-model="donorFormData.name"
          name="donor-name"
          label="Nombre"
          placeholder="Ingrese el nombre del donante"
          required
        />
        <FormBaseInput
          v-model="donorFormData.email"
          name="donor-email"
          label="Correo"
          placeholder="Ingrese el correo del donante"
          type="email"
          required
        />
      </Modal>
      <!-- Donation Modal -->
      <Modal
        v-model="showRegisterDonationModal"
        :disabled-accept-button="disabledAcceptButtonDonationButton"
        :loading="loadingAcceptDonationButton"
        @handle-accept="handleRegisterDonation"
      >
        <template #header-title>Registrar donación</template>
        <template #header-description> Registra una nueva donación </template>

        <FormBaseInput
          v-model="donationFormData.description"
          name="donation-description"
          label="Descripción"
          placeholder="Descripción de la donación"
        />

        <Button icon="i-mdi-plus" @click="handleAddNewCopyToForm"> Agregar Copia </Button>

        <div class="flex flex-col gap-4">
          <div
            class="flex outline outline-1 outline-white p-2 rounded-md"
            v-for="copy in donationFormData.copies"
          >
            <p class="text-white flex-1">
              Libro: {{ copy.bookId }} - Código: {{ copy.code }}
            </p>
            <UButton
              class="cursor-pointer text-red-600"
              variant="ghost"
              icon="i-mdi-delete-forever"
              @click="handleRemoveCopyFromDonationForm(copy)"
            />
          </div>
        </div>

        <Modal
          v-model="showAddCopyModal"
          :disabled-accept-button="disabledAcceptButtonCopyForm"
          @handle-accept="handleAcceptAddNewCopyToForm"
        >
          <template #header-title>Agrega una copia</template>
          <template #header-description> Agrega una copia a la donación </template>

          <div class="max-h-60 overflow-y-auto py-4 px-2 flex gap-3 flex-col">
            <FormBaseInput
              v-model="copyFormData.bookId"
              name="copy-bookId"
              label="Id del libro"
              placeholder="Ingrese el ID del libro"
              required
            />
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
      </Modal>
    </template>
  </DashboardContainer>
</template>

<style scoped lang="sass"></style>
