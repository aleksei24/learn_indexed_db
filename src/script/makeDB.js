import { form, btn, titleInput, bodyInput, list } from './variables';

let db;

const openRequest = window.indexedDB.open('test_notes_db', 1);

openRequest.addEventListener('error', () => console.error('Database failed to open'));

openRequest.addEventListener('success', () => {
  console.log('Database opened succesfully');

  db = openRequest.result;

  displayData();
});

openRequest.addEventListener('upgradeneeded', (e) => {
  db = e.target.result;

  const objectStore = db.createObjectStore('notes_os', { keyPath: 'id', autoIncrement: true });
  objectStore.createIndex('title', 'title', { unique: false });
  objectStore.createIndex('body', 'body', { unique: false });

  console.log('Database setup complete');
});

form.addEventListener('submit', addData);

function addData(e) {
  e.preventDefault();

  const newItem = { title: titleInput.value, body: bodyInput.value };
  const transaction = db.transaction(['notes_os'], 'readwrite');
  const objectStore = transaction.objectStore('notes_os');
  const addRequest = objectStore.add(newItem);

  addRequest.addEventListener('success', () => {
    titleInput.value = '';
    bodyInput.value = '';
  });

  transaction.addEventListener('complete', () => {
    console.log('Transaction completed: database modification finished.');

    displayData();
  });

  transaction.addEventListener('error', () => console.log('Transaction not opened due to error'));
}

function displayData() {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  const objectStore = db.transaction('notes_os').objectStore('notes_os');
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

      deleteBtn.addEventListener('click', deleteItem);

      cursor.continue();
    } else {
      if (!list.firstChild) {
        const listItem = document.createElement('li');
        listItem.textContent = 'No notes stored.';
        list.appendChild(listItem);
      }
      console.log('Notes all displayed');
    }
  });
}

function deleteItem(e) {
  const noteId = Number(e.target.parentNode.getAttribute('data-note-id'));
  const transaction = db.transaction(['notes_os'], 'readwrite');
  const objectStore = transaction.objectStore('notes_os');
  const deleteRequest = objectStore.delete(noteId);

  transaction.addEventListener('complete', () => {
    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
    console.log(`Note ${noteId} deleted.`);

    if (!list.firstChild) {
      const listItem = document.createElement('li');
      listItem.textContent = 'No notes stored.';
      list.appendChild(listItem);
    }
  });
}
