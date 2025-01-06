<script setup lang="ts">
interface Props {
  text: string;
  active: boolean;
}
defineProps<Props>();
defineEmits(["click"]);
</script>

<template>
  <button
    :class="`flex-1 py-1 font-bold rounded-full text-black ${
      active ? 'bg-yellow-500' : ''
    } transition duration-300 rounded-2xl`"
    @click="$emit('click')"
  >
    {{ text }}
  </button>
</template>

<style scoped lang="sass"></style>
