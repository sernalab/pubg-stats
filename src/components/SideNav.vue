<template>
  <aside class="sidenav">
    <img class="logo" src="../assets/pubg-logo.png" alt="logo pubg" />
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="#">Más datos Ribbly</a></li>
      <li><a href="#">Más datos sernuxo</a></li>
      <li><a href="#">Configuración</a></li>
    </ul>
  </aside>
</template>

<style scoped>
.sidenav {
  width: 250px;
  height: 100vh;
  background: #1d1f26;
  color: white;
  padding: 20px;
  position: fixed;
  left: 0;
  top: 0;
}

.sidenav img {
  height: 200px;
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