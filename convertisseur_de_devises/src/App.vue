<script setup>
import CurrencyConverter from './components/CurrencyConverter.vue'
</script>

<template>
  <main class="page-shell">
    <CurrencyConverter />
    <footer class="page-note">Taux fixes · Exercice pédagogique</footer>
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

:root {
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
  color: #153b4a;
  background: #eff7f5;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-optical-sizing: auto;
}

* {
  box-sizing: border-box;
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
  background-color: #eff7f5;
  background-image: radial-gradient(#c8e2db 0.8px, transparent 0.8px);
  background-size: 19px 19px;
}

button,
select {
  font: inherit;
}

button:focus-visible,
select:focus-visible {
  outline: 3px solid #ed7778;
  outline-offset: 3px;
}

.page-shell {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 28px 16px 18px;
}

.page-note {
  margin-top: 16px;
  color: #55737b;
  font-size: 12px;
  font-weight: 500;
}

@media (max-height: 700px) {
  .page-shell {
    justify-content: flex-start;
  }
}
</style>