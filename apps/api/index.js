const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Obtener todos los planes
app.get('/plans', async (req, res) => {
  try {
    const plans = await prisma.plan.findMany();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un plan por ID
app.get('/plans/:id', async (req, res) => {
  try {
    const plan = await prisma.plan.findUnique({
      where: { id: req.params.id }
    });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un plan
app.post('/plans', async (req, res) => {
  try {
    const plan = await prisma.plan.create({
      data: req.body
    });
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    name: 'PsyPlan Pro API',
    version: '1.0.0',
    endpoints: ['/health', '/plans']
  });
});

app.listen(PORT, () => {
  console.log(\Server running on port \\);
});
