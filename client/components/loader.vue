<script setup lang="ts"></script>

<template>
  <main className="Loader-container">
    <div className="Loader"></div>
  </main>
</template>

<style scoped lang="sass">
.Loader-container
  display: flex
  align-items: center
  justify-content: center
  width: 100%
  height: 100vh
  .Loader
    display: inline-grid
    padding: 5px
    background: #0e0e0e
    filter: blur(4px) contrast(12)

  .Loader:before
    content: ""
    height: 40px
    aspect-ratio: 3
    --c: #0000 64%,#fff 66% 98%,#0000 101%
    background: radial-gradient(35% 146% at 50% 159%,var(--c)) 0 0, radial-gradient(35% 146% at 50% -59%,var(--c)) 100% 100%
    background-size: calc(200%/3) 50%
    background-repeat: repeat-x
    -webkit-mask: repeating-linear-gradient(90deg,#fff 0 10%,#0000 0 20%)
    animation: l12 .8s infinite linear

@keyframes l12
  to
    background-position: -200% 0, -100% 100%
</style>
