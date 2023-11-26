import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

let lastStatus = null;
const statusLog = [];

app.post('/setStatus', (req, res) => {
  const { temperature, humidity, mq2 } = req.body;
  console.log('Dados recebidos:', { temperature, humidity, mq2 });

  // Armazene o último dado
  lastStatus = { temperature, humidity, mq2 };

  // Adicione aos dados históricos
  statusLog.push({ temperature, humidity, mq2 });

  res.status(200).send('Dados recebidos com sucesso.');
});

app.get('/lastStatus', (req, res) => {
  if (lastStatus) {
    res.status(200).json(lastStatus);
  } else {
    res.status(404).send('Nenhum dado encontrado.');
  }
});

app.get('/allStatus', (req, res) => {
  res.status(200).json(statusLog);
});

app.get('/media-temperature', (req, res) => {
  if (statusLog.length === 0) {
    res.status(404).send('Nenhum dado encontrado para calcular a média.');
  } else {
    const mediaTemperatura = statusLog.reduce((acc, data) => acc + data.temperature, 0) / statusLog.length;
    res.status(200).json({ mediaTemperatura });
  }
});

app.get('/estatisticas-humidity', (req, res) => {
  if (statusLog.length === 0) {
    res.status(404).send('Nenhum dado encontrado para calcular estatísticas de humidity.');
  } else {
    const humidityArray = statusLog.map(data => data.humidity);
    const minhumidity = Math.min(...humidityArray);
    const maxhumidity = Math.max(...humidityArray);
    const mediahumidity = humidityArray.reduce((acc, humidity) => acc + humidity, 0) / humidityArray.length;

    res.status(200).json({ minhumidity, maxhumidity, mediahumidity });
  }
});

export default app;
