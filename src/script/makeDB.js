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

function displayData() {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  const objectStore = db.transaction('test_object_store').objectStore('test_object_store');
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

      cursor.continue();
    } else {
      if (!list.firstChild) {
        const listItem = document.createElement('li');
        listItem.textContent = 'No notes stored';
        list.appendChild(listItem);
      }

      console.log('Notes all displayed');
    }
  });
}

function deleteItem(e) {
  const noteId = Number(e.target.parentNode.getAttribute('data-note-id'));
  const transaction = db.transaction(['test_object_store'], 'readwrite');
  const objectStore = transaction.objectStore('test_object_store');
  const deleteRequest = objectStore.delete(noteId);

  transaction.addEventListener('complete', () => {
    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
    console.log(`Note ${noteId} deleted`);

    if (!list.firstChild) {
      const listItem = document.createElement('li');
      listItem.textContent = 'No notes stored';
      list.appendChild(listItem);
    }
  });
}
