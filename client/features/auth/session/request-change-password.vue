<script setup lang="ts">
interface Props {
  modelValue: boolean;
  dni: string;
  buttonLoading: boolean;
}
defineProps<Props>();

defineEmits(["update:modelValue", "update:dni", "change-password"]);
</script>

<template>
  <UModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <UCard class="UModal-card">
      <template #header>
        <h2 class="text-xl font-bold mb-2">Solicita cambiar de contraseña</h2>
      </template>

      <FormBaseInput
        name="dni-change"
        label="DNI"
        :value="dni"
        @input="$emit('update:dni', $event)"
        placeholder="Ingresa tu número de DNI"
        light
        required
      />

      <template #footer>
        <div class="flex justify-between flex-col gap-5">
          <Button @click="$emit('update:modelValue', false)"> Volver </Button>
          <Button @click="$emit('change-password')" :loading="buttonLoading">
            Enviar
          </Button>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped lang="sass"></style>
