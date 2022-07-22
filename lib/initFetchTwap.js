import 'dotenv/config';
import { ethers, BigNumber } from 'ethers';
import clientPromise from "../lib/mongodb.js";

import { abi } from '../abi/oracle.js';
import saveToDatabase from './saveToDatabase.js';
import fetchTwap from './fetchTwap.js'

const empAddress = process.env.EMP_ADDRESS;
const database = process.env.DATABASE;

const oneMinute = 1000 * 60;
const interval = process.env.TWAP_FETCH_INTERVAL * oneMinute;  // TWAP_FETCH_INTERVAL in minutes

const init = async () => {
  console.log('Init Fetch TWAP');

  const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);
  const contract = new ethers.Contract(process.env.ORACLE, abi, provider);
  
  let client, db;

  try { 
    client = await clientPromise;
    db = client.db(database);
  } catch (e) {
    console.log(e);
  }

  setInterval(async () => {
    const twapValue = await fetchTwap(contract, provider);
    await saveToDatabase(twapValue, db);
  }, interval);
}

export default init;