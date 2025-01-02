<script setup lang="ts">
import ButtonTab from "~/components/button/button-tab.vue";
import { useIndexPage } from "~/features/auth/session/composable";
import ConfirmDataModal from "~/features/auth/session/confirm-data-modal.vue";
import RequestChangePassword from "~/features/auth/session/request-change-password.vue";

const {
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
} = useIndexPage();
</script>

<template>
  <LayoutsAuth>
    <template #header-title>
      {{ isLogin ? "Ingresa Aquí" : "Empieza Aquí" }}
    </template>
    <template #header-description> Accede a muchos libros y recursos </template>

    <div class="flex w-full justify-center">
      <div class="ButtonContainer flex mb-6 rounded-full p-0 w-72">
        <ButtonTab
          text="Iniciar Sesión"
          :active="isLogin"
          @click="isLogin = true"
        />
        <ButtonTab
          text="Registrarse"
          :active="!isLogin"
          @click="isLogin = false"
        />
      </div>
    </div>

    <form @submit.prevent="handleSubmit">
      <FormBaseInput
        v-if="isLogin"
        name="dni"
        label="DNI"
        v-model="formData.dni"
        placeholder="Ingresa tu número de DNI"
        light
        required
      />
      <div v-else class="flex gap-4 h-auto">
        <FormBaseInput
          class="flex-1"
          name="dni"
          label="DNI"
          v-model="formData.dni"
          placeholder="Ingresa tu número de DNI"
          light
          required
        />
        <div class="h-7 w-7">
          <UButton
            icon="i-heroicons-magnifying-glass"
            size="sm"
            color="primary"
            square
            variant="solid"
            :loading="buttonSearchDNILoading"
            @click="handleFindByDNI"
          />
        </div>
      </div>
      <template v-if="!isLogin">
        <FormBaseInput
          name="names"
          label="Nombre"
          v-model="formData.names"
          placeholder="Ingresa tus nombres"
          light
          required
        />
        <FormBaseInput
          name="lastName"
          label="Apellidos"
          v-model="formData.lastName"
          placeholder="Ingresa tus apellidos"
          light
          required
        />
        <FormBaseInput
          name="email"
          label="Correo Electrónico"
          v-model="formData.email"
          placeholder="Ingresa tu correo electrónico"
          light
          required
          type="email"
        />
        <FormBaseInput
          name="phoneNumber"
          label="Teléfono"
          v-model="formData.phoneNumber"
          placeholder="Ingresa tu número de teléfono"
          light
          type="tel"
        />
      </template>
      <FormBaseInput
        name="password"
        label="Contraseña"
        v-model="formData.password"
        placeholder="Ingresa tu contraseña"
        light
        type="password"
        required
      />
      <Button type="submit" :loading="buttonLoginLoading" v-show="isLogin">
        Iniciar Sesión
      </Button>
      <Button type="submit" v-show="!isLogin"> Registrarse </Button>
    </form>

    <button
      v-show="isLogin"
      @click="showChangePasswordModal = true"
      class="mt-4 ml-2 text-gray-500 hover:underline"
    >
      ¿Olvidaste tu contraseña?
    </button>

    <ConfirmDataModal
      v-model="showConfirmModal"
      :data="{
        dni: formData.dni,
        names: formData.names,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
      }"
      :buttonLoading="buttonRegisterLoading"
      @handleRegister="handleRegister"
    />

    <RequestChangePassword
      v-model="showChangePasswordModal"
      :dni="formData.dniChange"
      :buttonLoading="buttonChangePasswordLoading"
      @update:dni="formData.dniChange = $event.target.value"
      @change-password="handleChangePassword"
    />
  </LayoutsAuth>
</template>

<style scoped lang="sass">
.ButtonContainer
  outline: 1px solid
  outline-color: #c6c6c6
  overflow: hidden
</style>
