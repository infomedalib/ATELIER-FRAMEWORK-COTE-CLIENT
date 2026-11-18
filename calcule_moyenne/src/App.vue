<script lang="ts">
export default {
  data() {
    return {
      ds: 0,
      tp: 0,
      ex: 0
    }
  },
  computed: {
    moyenne() {
      return ((this.ds + this.tp + this.ex) / 3).toFixed(2)
    },
    mention() {
      const moyenne = Number(this.moyenne)

      if (moyenne < 10) {
        return "Ajourné"
      } else if (moyenne < 12) {
        return "Passable"
      } else if (moyenne < 14) {
        return "Assez Bien"
      } else if (moyenne < 16) {
        return "Bien"
      } else {
        return "Très Bien"
      }
    }
  }
}
</script>

<template>
  <div class="container">
    <h1>Calcul de Moyenne</h1>

    <div>
      <label>DS :</label>
      <input type="number" v-model.number="ds" min="0" max="20">
    </div>

    <div>
      <label>TP :</label>
      <input type="number" v-model.number="tp" min="0" max="20">
    </div>

    <div>
      <label>EX :</label>
      <input type="number" v-model.number="ex" min="0" max="20">
    </div>

    <h2>Moyenne : {{ moyenne }} / 20</h2>

    <h2>Mention : {{ mention }}</h2>
  </div>
</template>

<style>
.container {
  width: 400px;
  margin: 80px auto;
  text-align: center;
  font-family: Arial, sans-serif;
}

h1 {
  color: #42b883;
  margin-bottom: 30px;
}

div > div {
  margin: 15px;
}

label {
  display: inline-block;
  width: 50px;
  font-weight: bold;
}

input {
  width: 100px;
  padding: 8px;
  font-size: 16px;
}

h2 {
  margin-top: 25px;
}
</style>
