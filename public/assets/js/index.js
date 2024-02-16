window.addEventListener('load', function () {
  loadNotes();
});

document.getElementById('saveButton').addEventListener('click', function () {
  saveNote();
});

document.getElementById('deleteButton').addEventListener('click', function () {
  deleteNote();
});

function saveNote() {
  var title = document.querySelector('.note-title').value;
  var text = document.querySelector('.note-textarea').value;

  if (title.trim() !== '' && text.trim() !== '') {
      var listItem = document.createElement('li');
      listItem.classList.add('list-group-item');

      var deleteButton = document.createElement('button');
      deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
      deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'float-end', 'delete-button');

      deleteButton.addEventListener('click', function (event) {
          event.stopPropagation();
          deleteNote(listItem);
      });

      listItem.addEventListener('click', function () {
          displayNoteContent(title, text);
      });

      listItem.appendChild(deleteButton);
      listItem.appendChild(document.createTextNode(title));

      document.getElementById('list-group').appendChild(listItem);

      saveToLocalStorage();

      document.querySelector('.note-title').value = '';
      document.querySelector('.note-textarea').value = '';
  } else {
      alert('Title and text cannot be empty!');
  }
}

function deleteNote(listItem) {
  listItem.remove();

  saveToLocalStorage();

  document.querySelector('.note-title').value = '';
  document.querySelector('.note-textarea').value = '';
}

function displayNoteContent(title, text) {
  document.querySelector('.note-title').value = title;
  document.querySelector('.note-textarea').value = text;
}

function saveToLocalStorage() {
  var notes = [];
  var listItems = document.querySelectorAll('.list-group-item');
  listItems.forEach(function (item) {
      notes.push(item.textContent.trim());
  });

  localStorage.setItem('notes', JSON.stringify(notes));
}

function loadNotes() {
  var storedNotes = localStorage.getItem('notes');

  if (storedNotes) {
      var notes = JSON.parse(storedNotes);

      notes.forEach(function (note) {
          var listItem = document.createElement('li');
          listItem.classList.add('list-group-item');

          var deleteButton = document.createElement('button');
          deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
          deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'float-end', 'delete-button');

          deleteButton.addEventListener('click', function (event) {
              event.stopPropagation();
              deleteNote(listItem);
          });

          listItem.addEventListener('click', function () {
              displayNoteContent(note, '');
          });

          listItem.appendChild(deleteButton);
          listItem.appendChild(document.createTextNode(note));

          document.getElementById('list-group').appendChild(listItem);
      });
  }
}
