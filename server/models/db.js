const { Pool } = require('pg');

// Configuration de la connexion à la base de données
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'admin',
  port: 5432,
});

// Tester la connexion à la base de données
(async () => {
  try {
    const client = await pool.connect();
    console.log('Connexion à la base de données réussie');
    client.release(); // Libère le client de la pool
  } catch (err) {
    console.error('Erreur de connexion à la base de données:', err.stack);
    process.exit(1); // Optionnel: quitter le processus si la connexion échoue
  }
})();

// Fonction de requête asynchrone
const query = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    console.error('Erreur lors de l\'exécution de la requête:', err.stack);
    throw err; // Relance l'erreur pour que l'appelant puisse la gérer
  }
};

module.exports = { query };

