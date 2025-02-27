<template>
  <aside class="sidenav">
    <h2>Menú</h2>
    <ul>
      <li><a href="#">Dashboard</a></li>
      <li><a href="#">Reportes</a></li>
      <li><a href="#">Configuración</a></li>
    </ul>
  </aside>
</template>

<style scoped>
.sidenav {
  width: 250px;
  height: 100vh;
  background: #2c3e50;
  color: white;
  padding: 20px;
  position: fixed;
  left: 0;
  top: 0;
}

.sidenav h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.sidenav ul {
  list-style: none;
  padding: 0;
}

.sidenav ul li {
  margin: 15px 0;
}

.sidenav ul li a {
  color: white;
  text-decoration: none;
}
</style>