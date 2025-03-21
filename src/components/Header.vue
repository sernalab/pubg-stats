<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo -->
      <div class="logo-section">
        <img src="../assets/pubg-logo.png" alt="PUBG Logo" class="logo" />
      </div>

      <!-- Navegación principal -->
      <nav class="main-nav">
        <router-link to="/" class="nav-link">
          <span class="icon">🏠</span>
          <span class="text">Dashboard</span>
        </router-link>

        <router-link to="/player/Ribbly" class="nav-link">
          <span class="icon">👤</span>
          <span class="text">Perfil de Ribbly</span>
        </router-link>

        <router-link to="/player/sernuxo" class="nav-link">
          <span class="icon">👤</span>
          <span class="text">Perfil de Sernuxo</span>
        </router-link>

        <router-link to="/weapons" class="nav-link">
          <span class="icon">🔫</span>
          <span class="text">Estadísticas de Armas</span>
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style scoped>
.app-header {
  background-color: #1d1f26;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.8rem 1.5rem;
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo {
  height: 40px;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-left: auto;
}

.nav-link {
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;
  padding: 0.5rem 0.8rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.icon {
  font-size: 1.2rem;
  margin-right: 0.5rem;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(241, 196, 15, 0.1);
  color: #f1c40f;
}

.nav-link.router-link-active {
  border-bottom: 2px solid #f1c40f;
}

/* Responsive design */
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    padding: 0.6rem;
  }

  .logo-section {
    margin-bottom: 0.6rem;
  }

  .main-nav {
    width: 100%;
    justify-content: space-between;
    overflow-x: auto;
    padding-bottom: 0.3rem;
  }

  .nav-link {
    padding: 0.4rem 0.6rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 550px) {
  .text {
    display: none;
  }

  .icon {
    margin-right: 0;
    font-size: 1.4rem;
  }

  .main-nav {
    justify-content: space-around;
  }
}
</style>