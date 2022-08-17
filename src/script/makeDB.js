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

import { form, btn, titleInput, bodyInput } from './variables';

form.addEventListener('submit', addData);

function addData(e) {
  e.preventDefault();

  const newItem = {
    title: titleInput.value,
    body: bodyInput.value,
  };
  const transaction = db.transaction(['notes_store'], 'readwrite');
  const objectStore = transaction.objectStore('notes_store');
  const addRequest = objectStore.add(newItem);

  addRequest.addEventListener('success', () => {
    titleInput.value = '';
    bodyInput.value = '';
  });

  transaction.addEventListener('complete', () => {
    console.log('Transaction completed');
  });

  transaction.addEventListener('error', (err) => {
    console.error('Transaction not opened due to error: ', err);
  });
}
