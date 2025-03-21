<script setup>
import SideNav from "./components/SideNav.vue";
import DashboardView from "./views/DashboardView.vue";
</script>

<template>
  <div class="app">
    <SideNav />
    <main class="content">
      <DashboardView />
    </main>
  </div>
</template>

<style scoped>
</style>