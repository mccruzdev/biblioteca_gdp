<script setup lang="ts">
interface Props {
  name: string;
  label: string;
  modelValue?: string;
  required?: boolean;
  light?: boolean;
}
defineProps<Props>();

const isFocused = ref<boolean>(false);
</script>

<template>
  <div class="relative mb-6 flex">
    <input
      :id="name"
      :name="name"
      :class="`w-full px-3 py-1.5 border border-gray-300 rounded-md focus:border-none focus:ring-2 focus:outline-gray-400 bg-transparent ${
        light ? 'text-black' : 'text-white'
      }`"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="isFocused = true"
      @blur="isFocused = false"
      :required="required"
      v-bind="$attrs"
    />
    <label
      :for="name"
      :class="`absolute left-3 top-2 -translate-y-6 scale-90 transition-all duration-300 transform px-1 ${
        light ? 'bg-white text-black' : 'bg-[#0e0e0e] text-white'
      }`"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
  </div>
</template>

<style scoped lang="sass"></style>
