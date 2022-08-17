let db;

const openRequest = window.indexedDB.open('notes_DB', 1);

openRequest.addEventListener('error', (err) => {
  console.error(err, 'Database is failed to open');
});

openRequest.addEventListener('success', () => {
  console.log('Database opened successfully');

  db = openRequest.result;
});

openRequest.addEventListener('upgradeneeded', (e) => {
  db = e.target.result;

  const objectStore = db.createObjectStore('notes_store', {
    keyPath: 'id',
    autoincrement: true,
  });

  objectStore.createIndex('title', 'title', { unique: false });
  objectStore.createIndex('body', 'body', { unique: false });

  console.log('Database setup is complete');
});
