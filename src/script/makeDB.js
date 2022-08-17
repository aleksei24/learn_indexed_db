import { form, btn, titleInput, bodyInput, list } from './variables';

let db;

const openRequest = window.indexedDB.open('test_DB', 1);

openRequest.addEventListener('error', () => {
  console.error('Database failed to open');
});

openRequest.addEventListener('success', () => {
  console.log('Database opened successfully');
  db = openRequest.result;
});

openRequest.addEventListener('upgradeneeded', (e) => {
  db = e.target.result;

  const objectStore = db.createObjectStore('test_object_store', {
    keyPath: 'id',
    autoIncrement: true,
  });
  objectStore.createIndex('title', 'title', { unique: false });
  objectStore.createIndex('body', 'body', { unique: false });

  console.log('Database setup complete');
});

function addData(e) {
  e.preventDefault();

  const newItem = { title: titleInput.value, body: bodyInput.value };
  const transaction = db.transaction(['test-object_store'], 'readwrite');
  const objectStore = transaction.objectStore('test_object_store');
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
