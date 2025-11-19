import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { paymentMiddleware } from 'x402-express';

dotenv.config();

// Résoudre __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Servir les fichiers statiques du dossier public
app.use(express.static(path.join(__dirname, 'public')));

// Appliquer le paywall X402 sur la route /truth
app.use(
  paymentMiddleware(
    process.env.X402_PAY_TO,
    {
      'GET /truth': {
        price: `$${process.env.X402_PRICE_USD || '0.01'}`,
        network: process.env.X402_NETWORK || 'base',
      },
    },
    process.env.X402_FACILITATOR_URL
      ? { url: process.env.X402_FACILITATOR_URL }
      : {},
  ),
);

// Route protégée : accessible après paiement
app.get('/truth', (req, res) => {
  res.json({
    message: "Bien joué ! C'est bien VOUS qui avez raison !",
  });
});

// Route racine : renvoie la page HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
