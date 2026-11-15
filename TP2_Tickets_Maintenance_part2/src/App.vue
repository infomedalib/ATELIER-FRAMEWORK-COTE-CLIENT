<template>
  <div class="conteneur">
    <header class="entete">
      <h1>🎫 Gestion des Tickets de Maintenance</h1>
      <RouterLink to="/tickets">Liste des tickets</RouterLink>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: #f4f6f8;
}
.conteneur {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.entete {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.entete h1 {
  font-size: 22px;
}
a {
  color: #2563eb;
  text-decoration: none;
  font-weight: bold;
}
button {
  cursor: pointer;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 14px;
}
input, select, textarea {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.carte {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.erreur {
  background: #fde2e1;
  color: #b42318;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 12px;
}
.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  color: white;
}
.priorite-Basse { background:#10b981; }
.priorite-Moyenne { background:#f59e0b; }
.priorite-Haute { background:#ef4444; }
.statut-Ouvert { background:#3b82f6; }
.statut-En.cours { background:#f59e0b; }
.statut-Résolu { background:#10b981; }
.statut-Fermé { background:#6b7280; }
</style>
