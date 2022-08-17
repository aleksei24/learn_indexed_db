let db;

const openRequest = window.indexedDB.open('notes_DB', 1);

openRequest.addEventListener('error', (err) => {
  console.error(err, 'Database is failed to open');
});

openRequest.addEventListener('success', () => {
  console.log('Database opened successfully');
});
