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
