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
  init();
})
