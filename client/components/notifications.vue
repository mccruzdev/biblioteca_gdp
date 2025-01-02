<script setup lang="ts"></script>

<template>
  <UNotifications class="Notifications" v-bind="$attrs" />
</template>

<style scoped lang="sass">
.Notifications
  // Base styling
  background-color: #eab308 !important
  color: black !important
  border: 2px solid #eab308 !important
  border-radius: 8px !important
  padding: 1rem !important
  transition: all 0.3s ease 0s !important

  // Hover effect
  &:hover
    background-color: #d6a007 !important
    border-color: #d6a007 !important

  // Focus effect (tab focus outline)
  &:focus
    outline: 2px solid #d6a007 !important
    outline-offset: 2px !important

  // SVG or icon styling
  svg, i
    fill: black !important
    color: black !important
</style>
