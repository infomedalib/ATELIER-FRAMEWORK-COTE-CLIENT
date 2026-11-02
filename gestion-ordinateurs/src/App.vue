<template>
  <div class="app-shell">
    <header class="app-header">
      <h1>Contacts • Vue.js</h1>
    </header>
    <main class="app-main">
      <router-view :key="$route.fullPath" />
    </main>
  </div>
</template>

<script setup>
// App.vue - point d'entrеe principal
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  margin: 0;
  background: #f4f6f8;
  color: #25324a;
  font-family: 'Segoe UI', Roboto, Arial, sans-serif;
}

.app-shell {
  width: min(530px, calc(100% - 4px));
  min-height: 365px;
  margin: 2px auto;
  overflow: hidden;
  background: #fff;
  border: 1px solid #d6deeb;
  border-radius: 10px;
}

.app-header {
  min-height: 35px;
  background: #3647ad;
  color: white;
  padding: 7px 18px;
}

.app-header h1 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  line-height: 20px;
}

.app-main {
  padding: 14px 22px 2px;
}

@media (min-width: 700px) {
  .app-shell {
    margin-top: 24px;
  }
}
</style>