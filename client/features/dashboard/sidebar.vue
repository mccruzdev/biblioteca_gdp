<script setup lang="ts">
interface Props {
  isCollapsed: boolean;
}
defineProps<Props>();

const { user } = useAuthStore();
const { width } = useWindowSize();

const links = [
  [
    {
      label: "Catálogo de libros",
      to: "/dashboard",
      icon: "i-mdi-library-shelves",
      exact: true,
    },
  ],
  [
    {
      label: "Mis Reservas",
      to: "/dashboard/reservation",
      icon: "i-mdi-book-clock",
      exact: true,
    },
    {
      label: "Mis Préstamos",
      to: "/dashboard/loan",
      icon: "i-mdi-book",
      exact: true,
    },
  ],
  user?.role !== "READER" && [
    {
      label: "Libros",
      to: "/dashboard/books",
      icon: "i-mdi-bookshelf",
      exact: true,
    },
  ],
  user?.role !== "READER" && [
    {
      label: "Donaciones",
      to: "/dashboard/donations",
      icon: "i-mdi-gift",
      exact: true,
    },
    {
      label: "Donadores",
      to: "/dashboard/donors",
      icon: "i-material-symbols-light-person-raised-hand-rounded",
      exact: true,
    },
  ],
  user?.role !== "READER" && [
    {
      label: "Todas las reservas",
      to: "/dashboard/all-reservations",
      icon: "i-mdi-book-clock",
      exact: true,
    },
    {
      label: "Todas los préstamos",
      to: "/dashboard/all-loans",
      icon: "i-mdi-book",
      exact: true,
    },
  ],
  user?.role === "ADMIN" && [
    {
      label: "Usuarios",
      to: "/dashboard/users",
      icon: "i-mdi-account",
      exact: true,
    },
  ],
];

const filteredLinks = links.filter((link) => link !== false);
</script>

<template>
  <aside
    :class="`Sidebar${
      isCollapsed ? ' Sidebar--collapsed' : ' Sidebar--not-collapsed'
    }${width >= 770 ? ' Sidebar--desktop' : ' Sidebar--mobile'}`"
  >
    <div className="Sidebar-logo">
      <img
        :src="isCollapsed || width < 770 ? '/logo-muni.png' : '/logo-muni2.png'"
        alt="Logo Municipalidad de Guadalupe"
      />
    </div>
    <UVerticalNavigation :links="filteredLinks" class="Sidebar-nav" />
  </aside>
</template>

<style scoped lang="sass">
.Sidebar
  display: flex
  align-items: start
  flex-direction: column
  gap: 1rem
  padding: 1rem .3rem
  position: fixed
  top: 56px
  left: 0
  width: 200px
  z-index: 99999
  height: calc(100vh - 56px)
  background-color: #010101
  border-right: 2px solid #FFFFFF

  .Sidebar-logo
    display: flex
    align-items: center
    justify-content: center
    width: 100%
    img
      width: 120px

  .Sidebar-nav
    display: flex
    flex-direction: column
    width: 100%

.Sidebar--desktop.Sidebar--collapsed
  width: 3.2rem

  .Sidebar-logo
    width: 100%

.Sidebar--mobile.Sidebar--collapsed
  left: -9999px

.Sidebar--mobile.Sidebar--not-collapsed
  left: 0
  width: 200px
</style>
