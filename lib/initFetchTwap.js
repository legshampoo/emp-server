import 'dotenv/config';
import { ethers, BigNumber } from 'ethers';
import clientPromise from "../lib/mongodb.js";

import { abi } from '../abi/oracle.js';
import saveToDatabase from './saveToDatabase.js';
import fetchTwap from './fetchTwap.js'

const empAddress = process.env.EMP_ADDRESS;
const database = process.env.DATABASE;

const oneHour = 1000 * 60 * 60;
const interval = 12 * oneHour;

const init = async () => {
  console.log('Init Fetch TWAP');
  console.log(`Fetch Interval: ${interval / oneHour} hours`)

  const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);
  const contract = new ethers.Contract(process.env.ORACLE, abi, provider);
  
  let client, db;

  try { 
    client = await clientPromise;
    db = client.db(database);
  } catch (e) {
    console.log(e);
  }

  await fetchTwapOnce(contract, provider, db);

  setInterval(async () => {
    const twapValue = await fetchTwap(contract, provider);
    await saveToDatabase(twapValue, db);
  }, interval);
}

const fetchTwapOnce = async (contract, provider, db) => {
  const twapValue = await fetchTwap(contract, provider);
  await saveToDatabase(twapValue, db);
}

export default init;