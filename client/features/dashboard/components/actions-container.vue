<script setup lang="ts"></script>

<template>
  <div class="flex items-center justify-between">
    <div class="left-section"><slot name="left" /></div>
    <div class="center-section"><slot name="center" /></div>
    <div class="right-section"><slot name="right" /></div>
  </div>
</template>

<style scoped lang="sass">
/* Contenedor principal */
.flex
  display: flex
  align-items: center
  justify-content: space-between
  gap: 10px

/* Sección izquierda */
.left-section
  flex: 1
  text-align: left

/* Sección central */
.center-section
  flex: 2
  text-align: center

/* Sección derecha */
.right-section
  flex: 1
  text-align: right

/* Responsividad */
@media (max-width: 768px)
  .flex
    flex-direction: column
    align-items: stretch

  .center-section
    margin: 10px 0
</style>
