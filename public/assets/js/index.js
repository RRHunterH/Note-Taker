// Define variables
let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;
let clearBtn;

if (typeof window !== 'undefined') {
  // Wait for the DOM to be ready
  document.addEventListener('DOMContentLoaded', () => {
    // Check window location
    if (window.location.pathname === '/notes') {
      console.log('Inside /notes condition');
      // Select DOM elements
      noteTitle = document.querySelector('.note-title');
      noteText = document.querySelector('.note-textarea');
      saveNoteBtn = document.querySelector('.save-note');
      newNoteBtn = document.querySelector('.new-note');
      noteList = document.querySelector('.list-container .list-group');
      
  
      // Event listeners for interacting with the notes
      $saveNoteBtn.addEventListener('click', handleNoteSave);
      $newNoteBtn.addEventListener('click', handleNewNoteView);
      $noteList.addEventListener('click', handleNoteView);
      $noteList.addEventListener('click', handleNoteDelete);
      $noteTitle.addEventListener('input', handleRenderSaveBtn);
      $noteText.addEventListener('input', handleRenderSaveBtn);

      // Fetch and render notes on page load
      getAndRenderNotes();
    }

    // ... rest of your code ...

    // Function to show an element
    const show = (elem) => {
      elem.style.display = 'inline';
    };

    // Function to hide an element
    const hide = (elem) => {
      elem.style.display = 'none';
    };

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  });

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

const renderActiveNote = () => {
  hide(saveNoteBtn);
  hide(clearBtn);

  if (activeNote.id) {
    show(newNoteBtn);
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    hide(newNoteBtn);
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};
// Function to handle saving a new note
const handleNoteSave = () => {
  const newNote = {
    title: $noteTitle.value,
    text: $noteText.value
  };

  // Send a POST request to save the new note
  fetch("/api/notes", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newNote)
  })
  .then(response => {
    if (response.ok) {
      // If the request was successful, update the UI
      return response.json();
    } else {
      throw new Error('Failed to save note');
    }
  })
  .then(savedNote => {
    // Update the UI to display the saved note
    // For example, you can append it to the list of existing notes
    renderNoteList([savedNote, ...existingNotes]); // Assuming `existingNotes` is an array of existing notes
    renderActiveNote();
  })
  .catch(error => {
    console.error('Error saving note:', error);
  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  e.preventDefault();
  activeNote = {};
  renderActiveNote();
};

// Renders the appropriate buttons based on the state of the form
if (!$noteTitle.value.trim() && !$noteText.value.trim()) {
  hide(clearBtn);
} else if (!$noteTitle.value.trim() || !$noteText.value.trim()) {
  hide(saveNoteBtn);
} else {
  show(saveNoteBtn);
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.innerHTML = ''; // Clear the list before rendering
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList.append(note)); // Append each note to the list
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  clearBtn.addEventListener('click', renderActiveNote);
  noteForm.addEventListener('input', handleRenderBtns);
}

getAndRenderNotes();
});
}