<template>
  <div class="app-shell">
    <header class="topbar">
      <RouterLink class="brand" to="/tickets">
        <span class="brand-mark">H</span>
        <span>HelpDesk <small>Maintenance</small></span>
      </RouterLink>
      <nav>
        <RouterLink to="/tickets" class="nav-link">Tickets</RouterLink>
        <RouterLink to="/tickets/nouveau" class="nav-cta">＋ Nouveau ticket</RouterLink>
      </nav>
    </header>

    <main class="page-wrap">
      <RouterView />
    </main>

    <footer class="footer">TP 2 — Framework côté client · Vue.js 3</footer>
  </div>
</template>
