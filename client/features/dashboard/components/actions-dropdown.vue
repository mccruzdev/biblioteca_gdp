<script setup lang="ts">
interface Props {
  items: (
    el: any
  ) => {
    label: string;
    icon: string;
    click: () => void;
  }[][];
  row: any;
}
defineProps<Props>();
</script>

<template>
  <UDropdown :items="items(row)">
    <UButton
      color="gray"
      variant="ghost"
      icon="i-heroicons-ellipsis-horizontal-20-solid"
    />

    <template #item="{ item }">
      <span class="truncate text-black">{{ item.label }}</span>

      <UIcon
        :name="item.icon"
        class="flex-shrink-0 h-4 w-4 text-black dark:text-gray-500 ms-auto"
      />
    </template>
  </UDropdown>
</template>

<style scoped lang="sass"></style>
