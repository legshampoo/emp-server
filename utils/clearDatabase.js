import clientPromise from "../lib/mongodb.js";

const database = 'emp-money';
const collection = 'twap-history';

const clearDatabase = async () => {
  console.log('CLEAR DATABASE');

  try {
    const client = await clientPromise;
    const db = client.db(database);

    const success = await db.collection(collection)
      .deleteMany({})
      .then(res => {
        console.log(res);
        return true
      })
      .catch(err => {
        console.log(err);
        return false
      })

    if(success){
      console.log('Success: All documents deleted');
    } else {
      console.log('Error deleting all documents');
    }

  } catch(e) {
    console.log(e);
  }

  process.exit(0);
}

clearDatabase();
