<template>
  <div class="weapons-view">
    <h1>Estadísticas de Armas</h1>
    <p>Esta página está en construcción</p>

    <router-link to="/" class="back-link">Volver al dashboard</router-link>
  </div>
</template>

<script>
export default {
  name: "WeaponsView",
};
</script>

<style scoped>
.weapons-view {
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