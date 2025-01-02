<script setup lang="ts">
interface Props {
  isCollapsed: boolean;
}
defineProps<Props>();

const { width } = useWindowSize();
</script>

<template>
  <main
    :class="`Content${isCollapsed ? ' Content--collapsed' : ''}${
      width >= 770 ? ' Content--desktop' : ' Content--mobile'
    }`"
  >
    <slot />
  </main>
</template>

<style scoped lang="sass">
.Content
  background-color: black !important
  position: fixed
  top: 56px
  left: 200px
  display: flex
  flex-direction: column
  padding: 1rem
  width: calc( 100% - 200px )
  max-height: calc( 100vh - 56px )
  overflow: auto

.Content--desktop.Content--collapsed
  left: 48px
  width: calc( 100% - 48px )

.Content--mobile
  left: 0
  width: calc( 100% )
</style>
