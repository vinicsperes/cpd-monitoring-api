import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// const corsOptions = {
//   origin: 'https://cpd-monitoring-dashboard.vercel.app', // Substitua pelo domínio real do seu frontend
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
//   optionsSuccessStatus: 204,
// };

// app.use(cors(corsOptions));

app.use(bodyParser.json());

app.post('/setStatus', async (req, res) => {
  try {
    const { temperature, humidity, mq2 } = req.body;

    // Save data to the database using Prisma Client
    const status = await prisma.status.create({
      data: {
        temperature: String(temperature),
        humidity: String(humidity),
        mq2: String(mq2),
        timestamp: new Date(),
      },
    });

    console.log('Dados recebidos e salvos no banco de dados:', { temperature, humidity, mq2 });

    res.status(200).send('Dados recebidos e salvos com sucesso.');
  } catch (error) {
    console.error('Erro ao salvar dados no banco de dados:', error);
    res.status(500).send('Erro interno ao salvar dados.');
  }
});

app.get('/lastStatus', async (req, res) => {
  try {
    // Retrieve the last status from the database using Prisma Client
    const lastStatusFromDB = await prisma.status.findFirst({
      orderBy: {
        timestamp: 'desc', // Order by timestamp in descending order
      },
    });

    if (lastStatusFromDB) {
      res.status(200).json(lastStatusFromDB);
    } else {
      res.status(404).send('Nenhum dado encontrado.');
    }
  } catch (error) {
    console.error('Erro ao recuperar o último status do banco de dados:', error);
    res.status(500).send('Erro interno ao recuperar o último status.');
  }
});

app.get('/allStatus', async (req, res) => {
  try {
    // Retrieve all status data from the database using Prisma Client
    const allStatusData = await prisma.status.findMany();

    if (allStatusData && allStatusData.length > 0) {
      res.status(200).json(allStatusData);
    } else {
      res.status(404).send('Nenhum dado encontrado.');
    }
  } catch (error) {
    console.error('Erro ao recuperar todos os dados do banco de dados:', error);
    res.status(500).send('Erro interno ao recuperar todos os dados.');
  }
});

// Close Prisma connection on application shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});

export default app