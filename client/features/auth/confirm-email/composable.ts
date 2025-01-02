import axios from "axios";
import { BACKEND_SERVER } from "~/config/api";

export function usePageConfirmEmail() {
  const confirmButtonLoading = ref<boolean>(false);
  const route = useRoute();
  const router = useRouter();

  const toast = useToast();

  const handleConfirmEmail = async () => {
    confirmButtonLoading.value = true;

    if (!route.query.token) {
      toast.add({
        title: "Error al confirmar cuenta",
        description:
          "No se encontró un token válido para confirmar tu cuenta. Por favor, verifica el enlace en tu correo electrónico e inténtalo nuevamente.",
      });

      confirmButtonLoading.value = false;
      return;
    }

    const response = await axios.get(
      `${BACKEND_SERVER}/auth/confirm-email?token=${route.query.token}`
    );

    if (response.status === 200) {
      router.push("/");
      toast.add({
        title: "Cuenta confirmada con éxito",
      });
    } else {
      toast.add({
        title: "Error al confirmar cuenta",
        description:
          "Ocurrió un error al confirmar tu cuenta. Por favor, verifica el enlace en tu correo electrónico e inténtalo nuevamente.",
      });
    }

    confirmButtonLoading.value = false;
  };

  return {
    confirmButtonLoading,
    handleConfirmEmail,
  };
}
