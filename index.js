import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import init from './lib/initFetchTwap.js';
import getTwapHistory from './api/getTwapHistory.js';

const app = express();
app.use(cors());

app.get('/api/twap-history', getTwapHistory);

app.listen(process.env.PORT, () => {
  console.log(`EMP server listining on port ${process.env.PORT}`)
  init();
})
