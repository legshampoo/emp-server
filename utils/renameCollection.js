import clientPromise from "../lib/mongodb.js";

const database = 'emp-money';
const collection1 = 'twap-history';
const collection2 = 'twap-history-test';

const renameCollection = async () => {
  console.log('RENAME COLLECTION');

  try {
    const client = await clientPromise;
    const db = client.db(database);

    const success = await db.collection(collection1).rename(collection2)
      .then(res => {
        console.log(res);
        return true
      })
      .catch(err => {
        console.log(err);
        return false
      })

    if(success){
      console.log('Success');
    } else {
      console.log('Error');
    }

  } catch(e) {
    console.log(e);
  }

  process.exit(0);
}

renameCollection();
