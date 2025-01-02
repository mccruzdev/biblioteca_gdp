<script setup lang="ts">
interface Props {
  path?: string;
}
defineProps<Props>();
</script>

<template>
  <main className="NotAuthorized">
    <h1>No Authorizado</h1>
    <RouterLink :to="path || '/'">Inicio</RouterLink>
  </main>
</template>

<style scoped lang="sass">
.NotAuthorized
  display: flex
  align-items: center
  justify-content: center
  flex-direction: column
  width: 100%
  height: 100vh
  gap: 1rem

  h1
    font-size: 2.5rem
    color: #C7C7CC

  a
    font-size: 1.5rem
    background-color: #FFBC24
    padding: .5rem 3rem
    border-radius: 1rem
    color: black
    text-decoration: none
</style>
