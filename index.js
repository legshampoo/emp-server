import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import init from './lib/initFetchTwap.js';
import getTwapHistory from './api/getTwapHistory.js';

const app = express();
app.use(cors());

app.get('/api/twap-history', getTwapHistory);

app.listen(process.env.PORT || 3000, () => {
  console.log(`EMP server is running....`)
  const envVars = {
    port: process.env.PORT,
    mongodbUri: process.env.MONGODB_URI,
    oracle: process.env.ORACLE,
    provider: process.env.PROVIDER,
    emp_address: process.env.EMP_ADDRESS,
    database: process.env.DATABASE,
    twapFetchInterval: process.env.TWAP_FETCH_INTERVAL
  }
  
  console.log(envVars);
  init();
})
