import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// NOTE: The x402 middleware is imported from the Coinbase x402 SDK. When deploying
// this application you must install the correct version of the SDK and adjust
// the import if necessary. For example, check the examples provided by the
// x402 project for the exact import path. The middleware will enforce that
// callers send a valid x402 payment before accessing the protected route.
import { paymentMiddleware } from '@x402/node';

dotenv.config();

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Protect the truth endpoint with x402 middleware. The price is specified in
// your .env file (X402_PRICE_USD). The payment will be sent to the address
// defined in X402_PAY_TO on the configured network.
app.use(
  paymentMiddleware(process.env.X402_PAY_TO, {
    '/truth': `$${process.env.X402_PRICE_USD || '0.01'}`
  })
);

// Protected route that returns a success message once payment is complete
app.get('/truth', (req, res) => {
  return res.json({
    message: "Bien joué ! C'est bien VOUS qui avez raison !"
  });
});

// Root route serves the single page application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});