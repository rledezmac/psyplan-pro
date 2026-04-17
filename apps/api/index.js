const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

let prisma = null;
try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
  console.log('Prisma conectado correctamente');
} catch (e) {
  console.log('Prisma no disponible, endpoints /plans funcionaran en modo simulado');
}

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/plans', async (req, res) => {
  if (!prisma) {
    return res.json({ 
      message: 'API funcionando correctamente. Prisma no configurado.', 
      data: [],
      status: 'demo_mode'
    });
  }
  try {
    const plans = await prisma.plan.findMany();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.json({ 
    name: 'PsyPlan Pro API',
    version: '1.0.0',
    company: 'HexCore Systems',
    endpoints: ['/health', '/plans'],
    database: prisma ? 'connected' : 'disconnected',
    status: 'running'
  });
});

// CAMBIO IMPORTANTE: escuchar en 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
  console.log('PsyPlan Pro API running on port ' + PORT);
});
