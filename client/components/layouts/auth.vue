<script setup lang="ts"></script>

<template>
  <div class="App">
    <div
      class="Container min-h-screen flex flex-col items-center justify-center"
    >
      <div class="z-10 text-center text-white mb-8">
        <img
          src="/logo-muni.png"
          alt="Logo"
          class="mx-auto w-32 h-32 mb-[-15px]"
        />
        <p class="text-xl2 font-semibold">SGB - MDG</p>
        <h1 class="mb-[-15px] font-medium">
          SISTEMA DE GESTION DE LA BIBIBLIOTECA DE LA MUNICIPALIDAD DE GUADALUPE
        </h1>
      </div>
      <div class="z-10 bg-white p-4 rounded-2xl shadow-lg w-full mb-8">
        <h2 class="text-2xl font-extrabold text-center mb-3 text-black">
          <slot name="header-title" />
        </h2>
        <p class="text-sm text-center text-gray-600 mb-4">
          <slot name="header-description" />
        </p>

        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.App
  background-color: black !important
  position: relative
  z-index: 1

  .Container
    position: relative
    z-index: 1
    padding: 0 1rem
    max-width: 500px
    margin: 0 auto

  &::before
    content: ""
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-image: url("/background.jpg")
    background-repeat: no-repeat
    background-size: cover
    opacity: 0.3
    z-index: -1
</style>
