<template>
  <aside class="sidenav">
    <div class="logo-container">
      <img class="logo" src="../assets/pubg-logo.png" alt="logo pubg" />
    </div>

    <div class="nav-section">
      <h3 class="section-title">Navegación</h3>
      <ul class="nav-list">
        <li>
          <router-link to="/" class="nav-link">
            <span class="icon">🏠</span>
            <span class="text">Dashboard</span>
          </router-link>
        </li>
      </ul>
    </div>

    <div class="nav-section">
      <h3 class="section-title">Jugadores</h3>
      <ul class="nav-list">
        <li>
          <router-link to="/player/Ribbly" class="nav-link">
            <span class="icon">👤</span>
            <span class="text">Perfil de Ribbly</span>
          </router-link>
        </li>
        <li>
          <router-link to="/player/sernuxo" class="nav-link">
            <span class="icon">👤</span>
            <span class="text">Perfil de Sernuxo</span>
          </router-link>
        </li>
        <li>
          <router-link to="/weapons" class="nav-link">
            <span class="icon">🔫</span>
            <span class="text">Estadísticas de Armas</span>
          </router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script>
export default {
  name: "SideNav",
};
</script>

<style scoped>
.sidenav {
  width: 250px;
  height: 100vh;
  background: #1d1f26;
  color: white;
  padding: 1.5rem 0;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.sidenav.collapsed {
  width: 70px;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0 1rem 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  height: 60px;
  transition: height 0.3s ease;
}

.sidenav.collapsed .logo {
  height: 40px;
}

.toggle-button {
  position: absolute;
  right: 10px;
  top: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.toggle-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.nav-section {
  margin-bottom: 1.5rem;
  padding: 0 1rem;
}

.section-title {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #8a8d94;
  margin-bottom: 0.8rem;
  padding-left: 1rem;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  margin-bottom: 0.3rem;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(241, 196, 15, 0.1);
  color: #f1c40f;
}

.nav-link.router-link-active {
  border-left: 3px solid #f1c40f;
}

.icon {
  font-size: 1.2rem;
  margin-right: 1rem;
  width: 20px;
  text-align: center;
}

.sidenav.collapsed .icon {
  margin-right: 0;
}

.settings {
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Responsive design */
@media (max-width: 768px) {
  .sidenav {
    width: 100%;
    height: 70px;
    flex-direction: row;
    padding: 0 1rem;
    overflow-x: auto;
  }

  .sidenav.collapsed {
    width: 100%;
  }

  .logo-container {
    width: auto;
    border-bottom: none;
    margin-bottom: 0;
    padding: 0.5rem 0;
  }

  .logo {
    height: 40px;
  }

  .toggle-button {
    display: none;
  }

  .nav-section {
    margin-bottom: 0;
    margin-left: 1.5rem;
    padding: 0;
  }

  .section-title {
    display: none;
  }

  .nav-list {
    display: flex;
  }

  .nav-link {
    padding: 0.5rem;
  }

  .text {
    display: none;
  }

  .settings {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
    margin-left: auto;
  }
}
</style>