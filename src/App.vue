<template>
  <div class="app">
    <Header />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import Header from "./components/Header.vue";

export default {
  name: "App",
  components: {
    Header,
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Roboto", Arial, sans-serif;
  background-color: #15171c;
  color: #ffffff;
  line-height: 1.6;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding-top: 70px; /* Altura del header */
  width: 100%;
}

@media (max-width: 768px) {
  .main-content {
    padding-top: 120px; /* Ajustar para la altura del header responsive */
  }
}
</style>