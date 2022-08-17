let db;

const openRequest = window.indexedDB.open('notes_DB', 1);

openRequest.addEventListener('error', (err) => {
  console.error(err, 'Database is failed to open');
});

openRequest.addEventListener('success', () => {
  console.log('Database opened successfully');

  db = openRequest.result;

  displayData();
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

import { form, btn, titleInput, bodyInput, list } from './variables';

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
    displayData();
  });

  transaction.addEventListener('error', (err) => {
    console.error('Transaction not opened due to error: ', err);
  });
}

function displayData() {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  const objectStore = db.transaction('notes_store').objectStore('notes_store');
  objectStore.openCursor().addEventListener('success', (e) => {
    const cursor = e.target.result;

    if (cursor) {
      const listItem = document.createElement('li');
      const itemTitle = document.createElement('h3');
      const itemText = document.createElement('p');

      listItem.appendChild(itemTitle);
      listItem.appendChild(itemText);
      list.appendChild(listItem);

      itemTitle.textContent = cursor.value.title;
      itemText.textContent = cursor.value.body;

      listItem.setAttribute('data-note-id', cursor.value.id);

      const deleteBtn = document.createElement('button');
      listItem.appendChild(deleteBtn);
      deleteBtn.textContent = 'Delete';

      deleteBtn.addEventListener('click', deleteItem());

      cursor.continue();
    } else {
      if (!list.firstChild) {
        const listItem = document.createElement('li');
        listItem.textContent = 'No notes stored';
        list.appendChild(listItem);
      }

      console.log('All notes displayed');
    }
  });
}

function deleteItem(e) {
  const noteID = Number(e.target.parentNode.getAttribute('data-note-id'));
  const transaction = db.transaction(['notes_store'], 'readwrite');
  const objectStore = transaction.objectStore('notes_store');
  const deleteRequest = objectStore.delete(noteID);

  transaction.addEventListener('complete', () => {
    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
    console.log(`Note ${noteID} deleted`);

    if (!list.firstChild) {
      const listItem = document.createElement('li');
      listItem.textContent = 'No notes stored';
      list.appendChild(listItem);
    }
  });
}
