<script setup lang="ts">
defineEmits(["toogle"]);

const store = useAuthStore();

const isDropdownOpen = ref<boolean>(false);
</script>

<template>
  <header class="Header">
    <button class="Header-button" @click="$emit('toogle')" type="button">
      <UIcon name="i-heroicons-bars-3-16-solid" class="w-5 h-5 text-white" />
    </button>
    <div class="Header-content cursor-pointer">
      <button class="Header-UserInfo" @click="isDropdownOpen = !isDropdownOpen">
        <UIcon name="i-heroicons-user" class="w-5 h-5 text-white" />
        <span> {{ store.user?.names }} {{ store.user?.lastName }} </span>
      </button>
    </div>
    <div class="Header-UserInfo-dropdown" v-show="isDropdownOpen">
      <button @click="store.logout">
        <UIcon name="i-mdi-logout" class="w-5 h-5 text-white" />
        <span>Cerrar Sesión</span>
      </button>
    </div>
  </header>
</template>

<style scoped lang="sass">
.Header
  display: flex
  align-items: center
  justify-content: flex-end
  z-index: 99999
  gap: 1rem
  padding: .5rem 1rem
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 3.5rem
  background-color: #010101
  border-bottom: 2px solid #FFFFFF

  .Header-button
    border: none
    background-color: transparent
    display: flex
    align-items: center
    justify-content: flex-end

  .Header-content
    display: flex
    align-items: center
    justify-content: flex-end
    flex: 1
    position: relative

    .Header-UserInfo
      display: flex
      align-items: center
      justify-content: center
      gap: 1rem
      font-size: 0.875rem
      color: #C7C7CC
      margin-left: 1rem

  .Header-UserInfo-dropdown
    position: absolute
    bottom: -54px
    right: 10px
    width: 12rem
    background-color: #010101
    border-radius: 0.375rem
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1)
    outline: 2px solid #3e3e40
    z-index: 99999

    button
      display: flex
      align-items: center
      width: 100%
      padding: 0.5rem 1rem
      color: #C7C7CC
      gap: 1rem

  .Header-UserInfo-dropdown:hover
    background-color: #010101
</style>
