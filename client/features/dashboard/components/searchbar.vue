<script setup lang="ts">
import SearchContainer from "./search-container.vue";

interface Props {
  filters: string[];
}
defineProps<Props>();

const filter = defineModel<string>("filter");
const input = defineModel<string>("input");

defineEmits(["update:filter", "update:input", "handleFilter"]);
</script>

<template>
  <SearchContainer>
    <template #search-filter>
      <USelectMenu v-model="filter" :options="filters" />
    </template>
    <template #search-input>
      <UInput
        v-model="input"
        name="filter"
        placeholder="Buscar"
        :disabled="filter === 'Todo'"
      />
    </template>
    <template #search-reset-filter>
      <Button
        v-show="filter !== 'Todo' || input !== ''"
        @click="
          filter = 'Todo';
          input = '';
          $emit('handleFilter');
        "
        icon="i-tabler-circle-x-filled"
      >
        Limpiar filtro
      </Button>
    </template>
    <template #search-button>
      <Button
        @click="$emit('handleFilter')"
        icon="i-heroicons-magnifying-glass"
        :disabled="!input && filter !== 'Todo'"
      >
        Filtrar
      </Button>
    </template>
  </SearchContainer>
</template>
