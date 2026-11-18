<script lang="ts">
export default {
  data() {
    return {
      compteur: 0
    }
  }
}
</script>

<template>
  <div class="container">
    <h1>Compteur</h1>

    <button @click="compteur--">-</button>

    <span>{{ compteur }}</span>

    <button @click="compteur++">+</button>
  </div>
</template>

<style>
.container {
  text-align: center;
  margin-top: 100px;
}

button {
  width: 50px;
  height: 50px;
  font-size: 25px;
  margin: 10px;
}

span {
  font-size: 30px;
}
</style>
