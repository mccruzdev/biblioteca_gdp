<script setup lang="ts"></script>

<template>
  <div
    class="flex flex-col space-y-2 mb-4 sm:flex-row sm:space-y-0 sm:space-x-2"
  >
    <slot name="search-filter" />
    <div class="relative flex-grow">
      <slot name="search-input" />
    </div>
    <div class="flex space-x-2">
      <slot name="search-reset-filter" />
    </div>
    <div class="flex space-x-2">
      <slot name="search-button" />
    </div>
  </div>
</template>

<style scoped lang="sass"></style>
