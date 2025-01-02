<script setup lang="ts">
import { usePageConfirmEmail } from "~/features/auth/confirm-email/composable";

definePageMeta({ layout: "auth-layout" });

const { confirmButtonLoading, handleConfirmEmail } = usePageConfirmEmail();
</script>

<template>
  <LayoutsAuth>
    <template #header-title> Confirma tu correo </template>
    <template #header-description>
      Da click en el siguiente botón para confirmar tu correo.
    </template>

    <div class="flex justify-center">
      <Button @click="handleConfirmEmail" :loading="confirmButtonLoading">
        Confirmar Correo
      </Button>
    </div>
  </LayoutsAuth>
</template>

<style scoped lang="sass"></style>
