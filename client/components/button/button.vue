<script setup lang="ts"></script>

<template>
  <UButton class="Button" v-bind="$attrs">
    <p><slot /></p>
  </UButton>
</template>

<style scoped lang="sass">
.Button
  width: 100% !important
  background-color: #eab308 !important
  color: black !important
  font-weight: bold !important
  padding: 0.25rem !important
  border-radius: 9999px !important
  border: 2px solid #eab308 !important
  transition: all 0.3s ease 0s !important

  &:hover
    background-color: #d6a007 !important
    border-color: #d6a007 !important

  &:focus
    outline: 2px solid #d6a007 !important
    outline-offset: 2px

  p
    width: 100%
    text-align: center

  svg, i
    fill: black !important
    color: black !important
</style>
