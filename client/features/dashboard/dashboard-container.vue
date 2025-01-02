<script setup lang="ts"></script>

<template>
  <div class="Dashboard">
    <section class="mb-6">
      <h1 class="text-2xl font-bold text-white mb-2">
        <slot name="title" />
      </h1>
      <p class="text-gray-400">
        <slot name="description" />
      </p>
    </section>
    <div class="Outer-container bg-secondary-bg rounded-lg p-4 md:p-6">
      <slot name="search" />
      <slot name="actions" />
      <div class="Inner-container bg-[#0e0e0e] rounded-lg p-4 md:p-6 mt-4">
        <section class="Dashboard-container">
          <div class="border-b border-gray-100 py-1">
            <h2 class="text-xl font-bold text-white">
              <slot name="title-table" />
            </h2>
          </div>
          <div class="pt-3">
            <slot />
          </div>
        </section>

        <div
          class="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 space-x-0 sm:space-x-2 py-4"
        >
          <div className="flex-1 text-sm text-[#C7C7CC]">
            Página <slot name="current-page" /> de <slot name="total-pages" />
          </div>
          <div className="flex items-center space-x-2">
            <slot name="pagination" />
            <slot name="select-limit-per-page" />
          </div>
        </div>
      </div>
    </div>

    <slot name="modals" />
  </div>
</template>

<style scoped lang="sass">
.Dashboard
  .Outer-container
    background-color: #141414
    border-radius: .5rem
    padding: 1.5rem
    margin-bottom: 1rem

  .Inner-container
    background-color: #0e0e0e
    border-radius: .5rem
    padding: 1.5rem

    .Dashboard-container
      color: #C7C7CC
</style>
