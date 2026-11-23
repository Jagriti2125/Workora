// Initialize the note module
export function initNoteModule({
  notes,
  notesGrid,
  notesEmptyState,
  noteModal,
  noteModalTitle,
  noteForm,
  addNoteButton,
  cancelNoteButton,
  noteTitleInput,
  noteEditor,
  editorToolbar,
  getActiveWorkspaceId,
  saveNotes,
  updateWorkspaceActivity,
  showToast
}) {
    let editingNoteId = null;

    // Open note modal
// Open note modal
addNoteButton.addEventListener("click", function () {
  editingNoteId = null;

  noteForm.reset();
  noteEditor.innerHTML = "";

  noteModalTitle.textContent = "Add Note";
  noteModal.querySelector('button[type="submit"]').textContent = "Save Note";

  noteModal.hidden = false;
});

// Close note modal
cancelNoteButton.addEventListener("click", function () {
  noteModal.hidden = true;
  noteForm.reset();
});

// Rich text editor toolbar
editorToolbar.addEventListener("click", function (event) {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  const command = button.dataset.command;
  const value = button.dataset.value || null;

  noteEditor.focus();

  document.execCommand(command, false, value);

  updateToolbarState();
});

// Update toolbar active states
function updateToolbarState() {
  const buttons = editorToolbar.querySelectorAll("button");

  buttons.forEach(function (button) {
    const command = button.dataset.command;

    if (
      command === "bold" ||
      command === "italic" ||
      command === "underline"
    ) {
      button.classList.toggle(
        "active",
        document.queryCommandState(command)
      );
    }
  });
}

// Create a new note
noteForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = noteTitleInput.value.trim();
  const content = noteEditor.innerHTML.trim();

  if (!title) {
    alert("Please enter a note title.");
    return;
  }

  if (!noteEditor.textContent.trim()) {
    alert("Please enter some note content.");
    return;
  }
   const isEditingNote = Boolean(editingNoteId);

  if (editingNoteId) {
  const noteToUpdate = notes.find(function (note) {
    return note.id === editingNoteId;
  });

  if (noteToUpdate) {
    noteToUpdate.title = title;
    noteToUpdate.content = content;
    noteToUpdate.updatedAt = new Date().toISOString();
  }

  editingNoteId = null;

} else {
  const note = {
    id: crypto.randomUUID(),
    workspaceId: getActiveWorkspaceId(),
    title: title,
    content: content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  notes.push(note);
}

  saveNotes();
updateWorkspaceActivity(getActiveWorkspaceId());
renderNotes();
  showToast(
  isEditingNote
    ? "Note updated successfully!"
    : "Note created successfully!"
);

  noteModal.hidden = true;
  noteForm.reset();
  noteEditor.innerHTML = "";
});

function renderNotes() {
  // Get notes belonging to the active workspace
  const workspaceNotes = notes.filter(function (note) {
    return note.workspaceId === getActiveWorkspaceId();
  });

  // Clear previously displayed note cards
  notesGrid.innerHTML = "";

  // Show empty state if there are no notes
  if (workspaceNotes.length === 0) {
    notesEmptyState.hidden = false;
    return;
  }

  notesEmptyState.hidden = true;

  // Display each note
  workspaceNotes.forEach(function (note) {
    const noteCard = document.createElement("div");
    noteCard.classList.add("note-card");

    const title = document.createElement("h3");
    title.textContent = note.title;

    const content = document.createElement("div");
    content.classList.add("note-card-content");
    content.textContent = note.content.replace(/<[^>]*>/g, " ");

    // Create action buttons
const actions = document.createElement("div");
actions.classList.add("note-actions");

const editButton = document.createElement("button");
editButton.textContent = "Edit";
editButton.classList.add("edit-note-button");

const deleteButton = document.createElement("button");
deleteButton.textContent = "Delete";
deleteButton.classList.add("delete-note-button");
// Delete note
deleteButton.addEventListener("click", function () {
  const shouldDelete = confirm(
    "Are you sure you want to delete this note?"
  );

  if (!shouldDelete) {
    return;
  }

  const noteIndex = notes.findIndex(function (item) {
    return item.id === note.id;
  });

  if (noteIndex !== -1) {
    notes.splice(noteIndex, 1);
    saveNotes();

    updateWorkspaceActivity(getActiveWorkspaceId());
  }
  showToast("Note deleted successfully!");

  renderNotes();
});

// Edit note
editButton.addEventListener("click", function () {
  editingNoteId = note.id;

  noteTitleInput.value = note.title;
  noteEditor.innerHTML = note.content;

  noteModalTitle.textContent = "Edit Note";
  noteModal.querySelector('button[type="submit"]').textContent = "Update Note";

  noteModal.hidden = false;
});

// Add buttons to card
actions.append(editButton, deleteButton);

noteCard.append(title, content, actions);
notesGrid.appendChild(noteCard);
  });
}

return {
  renderNotes
};
}