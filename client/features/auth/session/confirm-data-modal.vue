<script setup lang="ts">
interface Props {
  modelValue: boolean;
  data: {
    dni: string;
    names: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  buttonLoading: boolean;
}
defineProps<Props>();

defineEmits(["update:modelValue", "handle-register"]);
</script>

<template>
  <UModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <UCard class="UModal-card">
      <template #header>
        <h2 class="text-xl font-bold mb-2">Confirma tus datos</h2>
        <div class="-mb-3">
          ¿Estás seguro de que deseas registrarte con los siguientes datos?
        </div>
      </template>

      <strong>DNI:</strong> {{ data.dni }}
      <br />
      <strong>Nombres:</strong> {{ data.names }}
      <br />
      <strong>Apellidos:</strong> {{ data.lastName }}
      <br />
      <strong>Correo Electrónico:</strong> {{ data.email }}
      <br />
      <strong>Teléfono:</strong> {{ data.phoneNumber }}

      <template #footer>
        <div class="flex justify-between flex-col gap-5">
          <Button @click="$emit('update:modelValue', false)"> Volver </Button>
          <Button @click="$emit('handle-register')" :loading="buttonLoading">
            Enviar
          </Button>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped lang="sass"></style>
