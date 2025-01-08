import axios, { AxiosError } from "axios";
import { BACKEND_SERVER } from "~/config/api";

export function useIndexPage() {
  const authStore = useAuthStore();
  const router = useRouter();
  const toast = useToast();

  const isLogin = ref<boolean>(true);
  const showConfirmModal = ref<boolean>(false);
  const showChangePasswordModal = ref<boolean>(false);
  const buttonLoginLoading = ref<boolean>(false);
  const buttonRegisterLoading = ref<boolean>(false);
  const buttonSearchDNILoading = ref<boolean>(false);
  const buttonChangePasswordLoading = ref<boolean>(false);

  const formData = ref({
    dni: "",
    password: "",
    email: "",
    names: "",
    lastName: "",
    phoneNumber: "",
    dniChange: "",
  });

  const handleLogin = async () => {
    try {
      buttonLoginLoading.value = true;

      const { response, isLogged } = await authStore.login(
        formData.value.dni,
        formData.value.password
      );

      if (isLogged) router.push("/dashboard");
      else {
        toast.add({
          title: "Error",
          description: response.data.message,
        });
      }

      buttonLoginLoading.value = false;
    } catch (reason) {
      buttonLoginLoading.value = false;

      if ((reason as AxiosError).status === 409)
        toast.add({
          title: "Usuario no disponible",
          description: "El usuario está inabilitado",
        });
      else if ((reason as AxiosError).status === 403)
        toast.add({
          title: "Usuario no disponible",
          description: "La cuenta no ha sido confirmada",
        });
      else if ((reason as AxiosError).status === 404)
        toast.add({
          title: "Usuario no disponible",
        });
    }
  };

  const handleRegister = async () => {
    buttonRegisterLoading.value = true;

    try {
      const response = await axios.post(`${BACKEND_SERVER}/auth/create-user`, {
        dni: formData.value.dni,
        names: formData.value.names,
        lastName: formData.value.lastName,
        email: formData.value.email,
        phoneNumber: formData.value.phoneNumber
          ? formData.value.phoneNumber
          : null,
        password: formData.value.password,
      });

      if (response.status === 201)
        toast.add({
          title: "Usuario creado con éxito",
          description:
            "Por favor, verifica tu correo electrónico para completar el proceso de registro.",
        });
      else
        toast.add({
          title: "Error",
          description: response.data.message,
        });
    } catch (reason) {
      const error = reason as AxiosError;

      toast.add({
        title: "Error",
        description: error.response?.data?.message[0] as string,
      });
    }

    buttonRegisterLoading.value = false;
    showConfirmModal.value = false;
    isLogin.value = true;
    formData.value.password = "";
  };

  const handleFindByDNI = async () => {
    buttonSearchDNILoading.value = true;

    if (formData.value.dni.length !== 8) {
      toast.add({
        description: "El DNI debe tener 8 dígitos",
      });
      return;
    }

    const response = await axios.get(
      `${BACKEND_SERVER}/auth/lookup-dni/${formData.value.dni}`
    );

    if (response.status === 200) {
      formData.value.names = response.data.nombres;
      formData.value.lastName = `${response.data.apellido_paterno} ${response.data.apellido_materno}`;
    }

    buttonSearchDNILoading.value = false;
  };

  const handleSubmit = async () => {
    if (isLogin.value) await handleLogin();
    else showConfirmModal.value = true;
  };

  const handleChangePassword = async () => {
    buttonChangePasswordLoading.value = true;

    try {
      const response = await axios.post(
        `${BACKEND_SERVER}/auth/change-password`,
        {
          dni: formData.value.dniChange,
        }
      );

      if (response.status === 200)
        toast.add({
          title: "Exito",
          description: "Solicitud procesada. Revisa tu correo.",
        });
    } catch {}

    buttonChangePasswordLoading.value = false;
    formData.value.dniChange = "";
  };

  return {
    isLogin,
    showConfirmModal,
    showChangePasswordModal,
    formData,
    buttonLoginLoading,
    buttonRegisterLoading,
    buttonSearchDNILoading,
    buttonChangePasswordLoading,
    handleSubmit,
    handleRegister,
    handleFindByDNI,
    handleChangePassword,
  };
}
