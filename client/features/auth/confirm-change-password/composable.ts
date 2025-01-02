import axios from "axios";
import { BACKEND_SERVER } from "~/config/api";

export function usePageConfirmChangePassword() {
  const buttonConfirmChangePasswordLoading = ref<boolean>(false);

  const formData = ref({
    password: "",
    confirmPassword: "",
  });

  const route = useRoute();
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async () => {
    buttonConfirmChangePasswordLoading.value = true;

    if (formData.value.confirmPassword !== formData.value.password) {
      toast.add({
        title: "Error",
        description: "Las contraseñas no coinciden",
      });

      buttonConfirmChangePasswordLoading.value = false;
      return;
    }

    if (!route.query.token) {
      toast.add({
        title: "Error al confirmar cuenta",
        description:
          "No se encontró un token válido para confirmar tu cuenta. Por favor, verifica el enlace en tu correo electrónico e inténtalo nuevamente.",
      });

      buttonConfirmChangePasswordLoading.value = false;
      return;
    }

    const response = await axios.post(
      `${BACKEND_SERVER}/auth/confirm-change-password`,
      {
        token: route.query.token,
        password: formData.value.password,
      }
    );

    if (response.status === 200) {
      toast.add({
        title: "Contraseña restablecida exitosamente.",
      });
      router.push("/");
    } else {
      toast.add({
        title: "Error al restablecer contraseña",
        description:
          "No se pudo restablecer la contraseña. Por favor, inténtalo nuevo",
      });
    }

    buttonConfirmChangePasswordLoading.value = false;
  };

  return { formData, buttonConfirmChangePasswordLoading, handleSubmit };
}
