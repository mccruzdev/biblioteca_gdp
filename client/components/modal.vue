<script setup lang="ts">
defineProps({
  modelValue: { type: Boolean, required: true },
  disabledAcceptButton: { type: Boolean },
  loading: { type: Boolean },
});

const emit = defineEmits(["update:modelValue", "handleAccept"]);

const closeModal = () => {
  emit("update:modelValue", false);
};
</script>

<template>
  <div v-if="modelValue" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title"><slot name="header-title" /></h3>
        <p class="modal-description"><slot name="header-description" /></p>
      </div>

      <div class="flex flex-col gap-4">
        <slot />
      </div>

      <div class="modal-footer">
        <button @click="closeModal" class="modal-close-btn">Cancelar</button>
        <Button
          @click="$emit('handleAccept')"
          class="modal-accept-btn"
          :disabled="disabledAcceptButton"
          :loading="loading"
        >
          Aceptar
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
/* Superposición */
.modal-overlay
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: rgba(0, 0, 0, 0.7)
  display: flex
  justify-content: center
  align-items: center
  z-index: 1000

/* Contenido del modal */
.modal-content
  background-color: #0e0e0e
  border: 1px solid #e4e4e4
  border-radius: 8px
  padding: 20px
  width: 90%
  max-width: 500px
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3)

.modal-header
  margin-bottom: 20px

.modal-title
  color: #c0c0c0
  font-size: 1.5rem
  font-weight: bold
  margin-bottom: 10px

.modal-description
  color: #c0c0c0
  font-size: 1rem
  margin-bottom: 20px

/* Footer con botones */
.modal-footer
  display: flex
  justify-content: flex-end
  flex-direction: column
  gap: 10px
  margin-top: 20px

.modal-close-btn
  background-color: #f4f4f5
  color: #18181b
  border: none
  border-radius: 4px
  padding: 10px 20px
  cursor: pointer
  transition: background-color 0.3s ease
  width: 100%
  border-radius: 9999px !important

.modal-close-btn:hover
  background-color: #c0c0c0

.modal-accept-btn
  background-color: #ffbc24
  color: #fff4db
  border: none
  border-radius: 4px
  padding: 10px 20px
  cursor: pointer
  transition: opacity 0.3s ease

.modal-accept-btn:hover
  opacity: 0.9

/* Responsive */
@media (max-width: 768px)
  .modal-content
    padding: 15px
    max-width: 90%

  .modal-title
    font-size: 1.2rem

  .modal-description
    font-size: 0.9rem

  .modal-footer
    flex-direction: column
    gap: 15px
    align-items: stretch
</style>
