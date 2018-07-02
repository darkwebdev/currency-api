const MongoClient = require('mongodb').MongoClient;

module.exports = ({ url, dbName }) => {
  const client = MongoClient.connect(`${url}/${dbName}`);
  let db;

  client
    .then(conn => {
      db = conn.db();
    })
    .catch(console.error);

  return {
    client,
    save,
    close
  };

  function close() {
    client
      .then(conn => conn.close())
      .then(() => process.exit())
  }

  function save(transaction) {
    const collection = db.collection('transactions');

    collection
      .insertOne({ ...transaction, ...{ datetime: Date.now() } })
      .then(() => {
        collection
          .find()
          .sort({ $natural: -1 })
          .limit(10)
          .toArray()
          .then(items => {
            console.log('Transaction saved');
          });
      });
  }
};
