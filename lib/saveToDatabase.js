import 'dotenv/config';

// const collection = process.env.COLLECTION;
const collection = 'twap-history';
// const collection = 'twap-history-test';

const saveToDatabase = async (val, db) => {
  console.log('save to db');
  
  const getRandom = (min, max) => {
    return Math.random() * (max- min) + min;
  }
  
  
  const now = new Date();
  val = parseFloat(val);
  
  // const testVal = getRandom(0.8, 1.1).toFixed(4);
  // val = testVal;
  
  const obj = {
    date: now,
    twap: val
  }

  const success = await db.collection(collection)
    .insertOne(obj)
    .then(res => {
      const { acknowledged } = res;
      if (!acknowledged){
        console.log('Failed to save TWAP value to database: ');
        return false
      } 
      return true
    })
    .catch(err => {
      console.log(err);
      return false
    })

  if(success){
    console.log('success: TWAP value saved to database: ')
    console.log(obj);
  }

  return success
}

export default saveToDatabase