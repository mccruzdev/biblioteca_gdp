<script setup lang="ts">
import Loader from "~/components/loader.vue";
import Content from "~/features/dashboard/content.vue";
import HeaderDasboard from "~/features/dashboard/header.vue";
import Sidebar from "~/features/dashboard/sidebar.vue";

const config = useConfigStore();
const store = useAuthStore();
const router = useRouter();

await useAsyncData("user-token", () => store.fetchUser());

if (store.isAuth === false) router.push("/");

onUpdated(() => {
  if (store.isAuth === false) router.push("/");
});
</script>

<template>
  <template v-if="store.isAuth">
    <HeaderDasboard @toogle="config.toggle" />
    <Sidebar :isCollapsed="config.collapsed" />
    <Content :isCollapsed="config.collapsed"><slot /></Content>
  </template>
  <Loader v-else-if="store.isAuth === null" />
</template>

<style lang="sass">
body
    background-color: #010101
</style>
