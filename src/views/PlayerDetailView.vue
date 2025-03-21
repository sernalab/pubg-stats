<template>
  <div class="player-detail">
    <h1>Perfil del jugador: {{ $route.params.name }}</h1>
    <p>Esta página está en construcción</p>

    <router-link to="/" class="back-link">Volver al dashboard</router-link>
  </div>
</template>

<script>
export default {
  name: "PlayerDetailView",
};
</script>

<style scoped>
.player-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.back-link {
  display: inline-block;
  margin-top: 20px;
  color: #f1c40f;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}
</style>