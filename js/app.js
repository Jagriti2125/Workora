console.log("Workora initialized!");
// Store all workspaces
// Load previously saved workspaces
const savedWorkspaces = localStorage.getItem("workora-workspaces");

const workspaces = savedWorkspaces
  ? JSON.parse(savedWorkspaces)
  : [];

// Save workspaces to localStorage
function saveWorkspaces() {
  localStorage.setItem("workora-workspaces", JSON.stringify(workspaces));
}

let editingWorkspaceId = null;
let activeWorkspaceId = null;
let editingResourceId = null;
let editingNoteId = null;

// Load saved resources
const savedResources = localStorage.getItem("workora-resources");
const resources = savedResources ? JSON.parse(savedResources) : [];

// Save resources to localStorage
function saveResources() {
  localStorage.setItem("workora-resources", JSON.stringify(resources));
}
// Load saved notes
const savedNotes = localStorage.getItem("workora-notes");
const notes = savedNotes ? JSON.parse(savedNotes) : [];

// Save notes to localStorage
function saveNotes() {
  localStorage.setItem("workora-notes", JSON.stringify(notes));
}
// Select page elements
const dashboardPage = document.querySelector("#dashboard-page");
const workspacesPage = document.querySelector("#workspaces-page");
const workspaceDetailPage = document.querySelector(
  "#workspace-detail-page"
);
const detailWorkspaceName = document.querySelector(
  "#detail-workspace-name"
);

const detailWorkspaceDescription = document.querySelector(
  "#detail-workspace-description"
);

const backToWorkspacesButton = document.querySelector(
  "#back-to-workspaces"
);
const pageTitle = document.querySelector("#page-title");
const greeting = document.querySelector("#greeting");
const currentDate = document.querySelector("#current-date");
const pageSubtitle = document.querySelector("#page-subtitle");
const exploreWorkspacesButton = document.querySelector(".resume-button");
const continueTitle = document.querySelector("#continue-title");
const continueDescription = document.querySelector("#continue-description");
const workspaceGrid = document.querySelector("#workspace-grid");
const workspaceEmptyState = document.querySelector("#workspace-empty-state");
const continueUpdated = document.querySelector("#continue-updated");
const resourceGrid = document.querySelector("#resource-grid");
const resourceEmptyState = document.querySelector("#resource-empty-state");

// Select modal elements
const workspaceModal = document.querySelector("#workspace-modal");
const createWorkspaceButton = document.querySelector(".page-heading .primary-button");
const cancelWorkspaceButton = document.querySelector("#cancel-workspace");
const workspaceForm = document.querySelector("#workspace-form");

// Note modal elements
const noteModal = document.querySelector("#note-modal");
const addNoteButton = document.querySelector("#add-note-button");
const cancelNoteButton = document.querySelector("#cancel-note");
const noteForm = document.querySelector("#note-form");
const noteModalTitle = document.querySelector("#note-modal-title");

const notesGrid = document.querySelector("#notes-grid");
const notesEmptyState = document.querySelector("#notes-empty-state");
const noteTitleInput = document.querySelector("#note-title");
const noteEditor = document.querySelector("#note-editor");
const editorToolbar = document.querySelector(".editor-toolbar");

const workspaceSubmitButton = workspaceForm.querySelector(
  'button[type="submit"]'
);
const workspaceModalTitle = document.querySelector(
  "#workspace-modal-title"
);
const workspaceNameInput = document.querySelector("#workspace-name");
const workspaceDescriptionInput = document.querySelector("#workspace-description");
// Select resource modal elements
const resourceModal = document.querySelector("#resource-modal");
const resourceModalTitle = document.querySelector("#resource-modal-title");
const addResourceButton = document.querySelector("#add-resource-button");
const cancelResourceButton = document.querySelector("#cancel-resource");
const resourceForm = document.querySelector("#resource-form");
const resourceTitleInput = document.querySelector("#resource-title");
const resourceUrlInput = document.querySelector("#resource-url");
const resourceDescriptionInput = document.querySelector("#resource-description");

// Select navigation links
const navLinks = document.querySelectorAll(".sidebar nav a");

function updateGreeting() {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    greeting.textContent = "Good morning!";
  } else if (currentHour < 17) {
    greeting.textContent = "Good afternoon!";
  } else {
    greeting.textContent = "Good evening!";
  }
}

function updateDate() {
  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  currentDate.textContent = formattedDate;
}
// Function to show a page
function showPage(pageName) {
  const isDashboard = pageName === "dashboard";
  const isWorkspaces = pageName === "workspaces";
  const isDetail = pageName === "detail";

  dashboardPage.hidden = !isDashboard;
  workspacesPage.hidden = !isWorkspaces;
  workspaceDetailPage.hidden = !isDetail;

  // Update header
  pageTitle.textContent = isDashboard
    ? "Dashboard"
    : isWorkspaces
    ? "Workspaces"
    : "Workspace";

  pageSubtitle.textContent = isDashboard
    ? "A little progress every day."
    : isWorkspaces
    ? "Everything has its own place."
    : "Your dedicated space for getting things done.";

  // Update active navigation
  navLinks.forEach(function (link, index) {
    if (index === 0 && isDashboard) {
      link.classList.add("active");
    } else if (index === 1 && isWorkspaces) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}
// Connect navigation links
navLinks[0].addEventListener("click", function (event) {
  event.preventDefault();
  showPage("dashboard");
});

navLinks[1].addEventListener("click", function (event) {
  event.preventDefault();
  showPage("workspaces");
});
backToWorkspacesButton.addEventListener("click", function () {
  showPage("workspaces");
});

// Open workspace modal
createWorkspaceButton.addEventListener("click", function () {
  workspaceModalTitle.textContent = "Create Workspace";
  workspaceSubmitButton.textContent = "Create Workspace";
  workspaceForm.reset();
  editingWorkspaceId = null;

  workspaceModal.hidden = false;
});
// Close workspace modal
cancelWorkspaceButton.addEventListener("click", function () {
  workspaceModal.hidden = true;
  workspaceForm.reset();
  editingWorkspaceId = null;
workspaceSubmitButton.textContent = "Create Workspace";
});

// Rich text editor toolbar
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
// Open resource modal
addResourceButton.addEventListener("click", function () {
  editingResourceId = null;
  resourceForm.reset();

  resourceModalTitle.textContent = "Add Resource";
  resourceModal.querySelector('button[type="submit"]').textContent = "Save Resource";

  resourceModal.hidden = false;
});

// Open note modal
addNoteButton.addEventListener("click", function () {
  noteForm.reset();
  noteModal.hidden = false;
});
// Close resource modal
cancelResourceButton.addEventListener("click", function () {
  resourceModal.hidden = true;
  resourceForm.reset();
});
// Close note modal
cancelNoteButton.addEventListener("click", function () {
  noteModal.hidden = true;
  noteForm.reset();
});
// Add a new resource
resourceForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = resourceTitleInput.value.trim();
  const url = resourceUrlInput.value.trim();
  const description = resourceDescriptionInput.value.trim();
  if (!title) {
  alert("Please enter a resource title.");
  return;
}
let parsedUrl;

try {
  parsedUrl = new URL(url);
} catch {
  alert("Please enter a valid URL.");
  return;
}

if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
  alert("Only HTTP and HTTPS links are allowed.");
  return;
}

  if (editingResourceId) {
  const resourceToUpdate = resources.find(function (resource) {
    return resource.id === editingResourceId;
  });

  if (resourceToUpdate) {
    resourceToUpdate.title = title;
    resourceToUpdate.url = url;
    resourceToUpdate.description = description;
    resourceToUpdate.updatedAt = new Date().toISOString();
    saveResources();
  }

  editingResourceId = null;

} else {
  const resource = {
    id: crypto.randomUUID(),
    workspaceId: activeWorkspaceId,
    title: title,
    url: url,
    description: description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  resources.push(resource);
  saveResources();
}

  renderResources();

  resourceModal.hidden = true;
  resourceForm.reset();
});

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
    workspaceId: activeWorkspaceId,
    title: title,
    content: content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  notes.push(note);
}

  saveNotes();
  renderNotes();

  noteModal.hidden = true;
  noteForm.reset();
  noteEditor.innerHTML = "";
});

exploreWorkspacesButton.addEventListener("click", function () {
  const latestWorkspace = getLatestWorkspace();

  if (latestWorkspace) {
    openWorkspace(latestWorkspace);
  } else {
    showPage("workspaces");
  }
});

// Show dashboard when Workora starts
showPage("dashboard");
updateGreeting();
updateDate();


function getLatestWorkspace() {
  if (workspaces.length === 0) {
    return null;
  }

  const sortedWorkspaces = [...workspaces].sort(function (a, b) {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  return sortedWorkspaces[0];
}
function openWorkspace(workspace) {
  activeWorkspaceId = workspace.id;
  detailWorkspaceName.textContent = workspace.name;

  detailWorkspaceDescription.textContent =
    workspace.description || "No description provided.";

  showPage("detail");
  renderResources();
  renderNotes();
}
function renderResources() {
  // Get resources belonging to the active workspace
  const workspaceResources = resources.filter(function (resource) {
    return resource.workspaceId === activeWorkspaceId;
  });

  // Clear previously displayed resource cards
  resourceGrid.innerHTML = "";

  // Show empty state if there are no resources
  if (workspaceResources.length === 0) {
    resourceEmptyState.hidden = false;
    return;
  }

  resourceEmptyState.hidden = true;

  // Display each resource
  workspaceResources.forEach(function (resource) {
    const resourceCard = document.createElement("div");
    resourceCard.classList.add("resource-card");

    const title = document.createElement("h3");
    title.textContent = resource.title;

    const description = document.createElement("p");
    description.textContent = resource.description || "No description added.";

    const link = document.createElement("a");
    link.href = resource.url;
    link.textContent = "Open Resource ↗";
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const actions = document.createElement("div");
actions.classList.add("resource-actions");

const editButton = document.createElement("button");
editButton.textContent = "Edit";
editButton.classList.add("edit-resource-button");
editButton.dataset.id = resource.id;
editButton.addEventListener("click", function () {
  editingResourceId = resource.id;

  resourceTitleInput.value = resource.title;
  resourceUrlInput.value = resource.url;
  resourceDescriptionInput.value = resource.description;

  resourceModalTitle.textContent = "Edit Resource";
  resourceModal.querySelector('button[type="submit"]').textContent = "Update Resource";
  resourceModal.hidden = false;
});

const deleteButton = document.createElement("button");
deleteButton.textContent = "Delete";
deleteButton.classList.add("delete-resource-button");
deleteButton.dataset.id = resource.id;

deleteButton.addEventListener("click", function () {
  const shouldDelete = confirm(
    "Are you sure you want to delete this resource?"
  );

  if (!shouldDelete) {
    return;
  }

  const resourceIndex = resources.findIndex(function (item) {
    return item.id === resource.id;
  });

  if (resourceIndex !== -1) {
    resources.splice(resourceIndex, 1);
    saveResources();
  }

  renderResources();
});

actions.append(editButton, deleteButton);

resourceCard.append(title, description, link, actions);
resourceGrid.appendChild(resourceCard);
  });
}
function renderNotes() {
  // Get notes belonging to the active workspace
  const workspaceNotes = notes.filter(function (note) {
    return note.workspaceId === activeWorkspaceId;
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
  }

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

function renderContinueWorking() {
  const latestWorkspace = getLatestWorkspace();

  if (!latestWorkspace) {
    continueUpdated.textContent = "Your workspace awaits";
    continueTitle.textContent = "Pick up where you left off";
    continueDescription.textContent =
      "Your next productive session is just one click away.";
    return;
  }

  continueTitle.textContent = latestWorkspace.name;
  continueDescription.textContent =
    latestWorkspace.description || "Your workspace is ready to continue.";

    continueUpdated.textContent = `Last updated ${new Date(
    latestWorkspace.updatedAt
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  })}`;
}


// Display workspace cards
function renderWorkspaces() {

  // Clear previous cards
  workspaceGrid.innerHTML = "";

  // Check if workspace array is empty
  if (workspaces.length === 0) {
    workspaceEmptyState.hidden = false;
    return;
  }

  // Hide empty state
  workspaceEmptyState.hidden = true;

  // Create a card for each workspace
  workspaces.forEach(function (workspace) {

    const card = document.createElement("div");

    card.classList.add("workspace-card");
    card.addEventListener("click", function () {
  openWorkspace(workspace);
});

  const title = document.createElement("h3");
title.textContent = workspace.name;

const description = document.createElement("p");
description.textContent = workspace.description || "No description provided.";

const updatedDate = document.createElement("span");
updatedDate.classList.add("workspace-updated");

updatedDate.textContent = `Updated ${new Date(
  workspace.updatedAt
).toLocaleDateString("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric"
})}`;

card.appendChild(title);
card.appendChild(description);
card.appendChild(updatedDate);

const actions = document.createElement("div");
actions.classList.add("workspace-actions");

const editButton = document.createElement("button");
editButton.textContent = "Edit";
editButton.dataset.id = workspace.id;

editButton.addEventListener("click", function (event) {
  event.stopPropagation();
  editingWorkspaceId = workspace.id;
  workspaceModalTitle.textContent = "Edit Workspace";
  workspaceSubmitButton.textContent = "Update Workspace";

  workspaceNameInput.value = workspace.name;
  workspaceDescriptionInput.value = workspace.description;

  workspaceModal.hidden = false;
});

const deleteButton = document.createElement("button");

deleteButton.textContent = "Delete";
deleteButton.dataset.id = workspace.id;
deleteButton.addEventListener("click", function (event) {
  event.stopPropagation();
  const confirmDelete = confirm(
    `Are you sure you want to delete "${workspace.name}"?`
  );

  if (!confirmDelete) {
    return;
  }

  const workspaceIndex = workspaces.findIndex(function (item) {
    return item.id === workspace.id;
  });

  workspaces.splice(workspaceIndex, 1);

  localStorage.setItem("workora-workspaces", JSON.stringify(workspaces));

  renderWorkspaces();
  renderContinueWorking();
});

actions.appendChild(editButton);
actions.appendChild(deleteButton);

card.appendChild(actions);

    workspaceGrid.appendChild(card);

  });

}

// Handle workspace form submission
workspaceForm.addEventListener("submit", function (event) {

  event.preventDefault();

  const workspaceName = workspaceNameInput.value.trim();
  const workspaceDescription = workspaceDescriptionInput.value.trim();
  // Validate workspace name
if (workspaceName === "") {
  alert("Please enter a workspace name.");
  workspaceNameInput.focus();
  return;
}
const duplicateWorkspace = workspaces.find(function (item) {
  return (
    item.name.toLowerCase() === workspaceName.toLowerCase() &&
    item.id !== editingWorkspaceId
  );
});

if (duplicateWorkspace) {
  alert("A workspace with this name already exists.");
  workspaceNameInput.focus();
  return;
}

  if (editingWorkspaceId) {
  const workspace = workspaces.find(function (item) {
    return item.id === editingWorkspaceId;
  });

  workspace.name = workspaceName;
  workspace.description = workspaceDescription;
  workspace.updatedAt = new Date().toISOString();

} else {
  const workspace = {
    id: crypto.randomUUID(),
    name: workspaceName,
    description: workspaceDescription,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDemo: false
  };

  workspaces.push(workspace);
}
  // Save workspaces in browser storage
localStorage.setItem("workora-workspaces", JSON.stringify(workspaces));

console.log("All Workspaces:", workspaces);
renderWorkspaces();
renderContinueWorking();

// Close modal and clear form
workspaceModal.hidden = true;
workspaceForm.reset();
editingWorkspaceId = null;
workspaceSubmitButton.textContent = "Create Workspace";
});
// Display previously saved workspaces on page load
renderWorkspaces();
renderContinueWorking();