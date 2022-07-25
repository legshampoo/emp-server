import 'dotenv/config';
import clientPromise from "../lib/mongodb.js";
import { DateTime } from 'luxon';
import { resolveProperties } from "ethers/lib/utils.js";

const database = process.env.DATABASE;
// const collection = process.env.COLLECTION;
const collection = 'twap-history-test';  //twap-history


//convert dates for comparison when we filter the data
const convertDate = (obj) => {
  const { date } = obj;
  const iso = date.toISOString();
  const dt = DateTime.fromISO(iso);
  const isoDt = dt.toISODate();
  return isoDt
}

const getTwapHistory = async (req, res) => {
  console.log('GET: ', req.url);
  let { days, samples } = req.query;  //days = number of days to go back, samples = number of data points to return
  days = parseInt(days);
  samples = parseInt(samples);

  try {
    const client = await clientPromise;
    const db = client.db(database);

    const to = DateTime.now();
    const from = to.minus({ days: days });

    const twapHistory = await db.collection(collection)
      .find({
        'date': {
          $gte: from,
          $lte: to
        }
      })
      .toArray()

    let tempArray = [];
    const filteredHistory = twapHistory.filter((el, i) => {
      const currentDate = convertDate(el);
      if(i === 0){
        tempArray.push(currentDate);
        return el
      }

      const alreadySaved = tempArray.includes(currentDate);
      
      if(alreadySaved){
        return
      }else{
        tempArray.push(currentDate);
        return el
      }
    })
      
    const sortedHistory = filteredHistory.sort((obj1, obj2) => {
      const dt1 = new Date(obj1.date);
      const dt2 = new Date(obj2.date);
      return dt1 - dt2;
    })

    const downSampledHistory = sortedHistory.filter((el, i) => {
      let n = (sortedHistory.length + 1) / samples;
      const result = (i + 1) % n;

      if(i === 0){
        return el
      }
      if(i === sortedHistory.length - 1){
        return el
      }

      if(result){
        return
      }else{
        return el
      }

      return
    })

    const data = {
      message: 'TWAP history',
      data: downSampledHistory
    }
    
    res.send(data);
    
  } catch (e) {

    const failMessage = {
      message: 'fetch twap history failed'
    }

    res.send(failMessage);
  }
}

export default getTwapHistory;