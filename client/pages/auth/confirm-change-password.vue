<script setup lang="ts">
import BaseInput from "~/components/form/base-input.vue";
import { usePageConfirmChangePassword } from "~/features/auth/confirm-change-password/composable";

const { formData, buttonConfirmChangePasswordLoading, handleSubmit } =
  usePageConfirmChangePassword();
</script>

<template>
  <LayoutsAuth>
    <template #header-title> Reestablece tu contraseña </template>

    <form @submit.prevent="handleSubmit">
      <BaseInput
        v-model="formData.password"
        name="newPassword"
        label="Contraseña"
        placeholder="Ingrese su nueva contraseña"
        type="password"
        required
      />
      <BaseInput
        v-model="formData.confirmPassword"
        name="confirPassword"
        label="Confirme su contraseña"
        placeholder="Confirme su nueva contraseña"
        type="password"
        required
      />
      <Button type="submit" :loading="buttonConfirmChangePasswordLoading">
        Confirmar cambio de contraseña
      </Button>
    </form>
  </LayoutsAuth>
</template>

<style scoped lang="sass"></style>
