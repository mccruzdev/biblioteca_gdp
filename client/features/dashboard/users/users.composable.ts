import axios from "axios";
import { BACKEND_SERVER } from "~/config/api";
import {
  UserRoleE,
  type AllDataUserI,
  type PaginatedI,
  type UserRoleT,
} from "~/types";

const columns = [
  { key: "id", label: "ID" },
  { key: "dni", label: "DNI" },
  { key: "names", label: "Nombres" },
  { key: "lastName", label: "Apellidos" },
  { key: "phoneNumber", label: "Celular" },
  { key: "role", label: "Rol" },
  { key: "email", label: "Correo" },
  { key: "emailVerified", label: "Verificado" },
  { key: "isDisabled", label: "Habilitado" },
  { key: "actions", label: "Acciones" },
];

export function useUsersPage() {
  const { data } = useAuthStore();
  const { width } = useWindowSize();
  const toast = useToast();
  const paginatedUsers = ref<PaginatedI<AllDataUserI>>();
  const isNotAuthorized = ref(false);
  const url = ref(`${BACKEND_SERVER}/user/all`);

  const fetchUsers = async (page: number, limit: number) => {
    try {
      const response = await axios.get(
        `${url.value}?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${data}` } }
      );

      if (response.status === 200) paginatedUsers.value = response.data;
    } catch {
      isNotAuthorized.value = true;
    }
  };

  const items = (row: AllDataUserI) => [
    [
      {
        label: "Editar",
        icon: "i-mdi-edit",
        click: () => handleEditSelectRow(row),
      },
    ],
  ];

  // Pagination

  const currentPage = ref(1);
  const limitPerPage = ref<string>("10");

  onMounted(async () => {
    await fetchUsers(currentPage.value, Number(limitPerPage.value));
  });

  watch(currentPage, async (newCurrentPage) => {
    await fetchUsers(newCurrentPage, Number(limitPerPage.value));
  });

  watch(limitPerPage, async () => {
    if (currentPage.value !== 1) currentPage.value = 1;
    else await fetchUsers(currentPage.value, Number(limitPerPage.value));
  });

  // Filter

  const selectedFilter = ref<string>("Todo");
  const filters = ["Todo", "DNI", "Nombres", "Apellidos", "Teléfono", "Correo"];

  const searchInput = ref("");

  const handleFilter = async () => {
    if (selectedFilter.value === "Todo") {
      url.value = `${BACKEND_SERVER}/user/all`;
    } else if (selectedFilter.value === "DNI") {
      if (!searchInput.value || !/^\d+$/.test(searchInput.value)) {
        toast.add({
          title: "Error",
          description: "El DNI solo debe contener caracteres numéricos",
        });
        return;
      }
      url.value = `${BACKEND_SERVER}/search/user-by-dni/${searchInput.value}`;
    } else if (selectedFilter.value === "Nombres") {
      url.value = `${BACKEND_SERVER}/search/user-by-name/${searchInput.value}`;
    } else if (selectedFilter.value === "Apellidos") {
      url.value = `${BACKEND_SERVER}/search/user-by-lastname/${searchInput.value}`;
    } else if (selectedFilter.value === "Teléfono") {
      if (!searchInput.value || !/^\d+$/.test(searchInput.value)) {
        toast.add({
          title: "Error",
          description: "El teléfono solo debe contener caracteres numéricos",
        });
        return;
      }
      url.value = `${BACKEND_SERVER}/search/user-by-phonenumber/${searchInput.value}`;
    } else if (selectedFilter.value === "Rol") {
      url.value = `${BACKEND_SERVER}/search/user-by-role/${searchInput.value}`;
    } else if (selectedFilter.value === "Correo") {
      url.value = `${BACKEND_SERVER}/search/user-by-email/${searchInput.value}`;
    }

    if (currentPage.value !== 1) currentPage.value = 1;
    else await fetchUsers(currentPage.value, Number(limitPerPage.value));
  };

  // Edit Modal

  const showEditModal = ref(false);
  const userToEdit = ref<AllDataUserI>();
  const editFormData = ref<{
    role: UserRoleT;
    isDisabled: "true" | "false";
    email: string;
  }>({
    role: UserRoleE.READER,
    isDisabled: "true",
    email: "",
  });

  const handleEditSelectRow = (row: AllDataUserI) => {
    showEditModal.value = true;
    userToEdit.value = row;

    editFormData.value.role = row.role;
    editFormData.value.isDisabled = row.isDisabled ? "true" : "false";
    editFormData.value.email = row.email;
  };

  const handleAcceptEdit = async () => {
    if (!userToEdit.value) return;

    const response = await axios.put(
      `${BACKEND_SERVER}/user/${userToEdit.value.id}`,
      {
        role: editFormData.value.role,
        isDisabled: editFormData.value.isDisabled === "true",
        email: editFormData.value.email,
      },
      {
        headers: { Authorization: `Bearer ${data}` },
      }
    );

    if (response.status === 200) {
      toast.add({
        title: "Éxito",
        description: "El usuario ha sido editado correctamente",
      });
      await fetchUsers(currentPage.value, Number(limitPerPage.value));
    } else {
      toast.add({
        title: "Error",
        description: "Ha ocurrido un error al editar el usuario",
      });
    }

    showEditModal.value = false;
    userToEdit.value = undefined;
    editFormData.value.role = UserRoleE.READER;
    editFormData.value.isDisabled = "true";
  };

  return {
    isNotAuthorized,
    selectedFilter,
    filters,
    searchInput,
    handleFilter,
    paginatedUsers,
    columns,
    items,
    currentPage,
    limitPerPage,
    width,
    showEditModal,
    editFormData,
    handleAcceptEdit,
  };
}
