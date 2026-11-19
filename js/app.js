import { loadData, saveData } from "./services/storage.js";
import { initWorkspaceModule } from "./modules/workspace.js";
console.log("Workora initialized!");

// Display toast notifications
function showToast(message, type = "success") {
  const toast = document.createElement("div");

  toast.classList.add("toast", `toast-${type}`);
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(function () {
    toast.remove();
  }, 3000);
}
// Store all workspaces
// Load previously saved workspaces

const workspaces = loadData("workora-workspaces");

// Save workspaces to localStorage
function saveWorkspaces() {
  saveData("workora-workspaces", workspaces);
}


let activeWorkspaceId = null;
let editingResourceId = null;
let editingNoteId = null;
let editingTaskId = null;

// Store all tasks
// Load saved tasks from localStorage
const tasks = loadData("workora-tasks");
// Load saved resources
const resources = loadData("workora-resources");

// Save resources to localStorage
function saveResources() {
  saveData("workora-resources", resources);
}
// Load saved notes
const notes = loadData("workora-notes");

// Save notes to localStorage
function saveNotes() {
  saveData("workora-notes", notes);
}

// Save tasks to localStorage
function saveTasks() {
  saveData("workora-tasks", tasks);
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

// Select toast notification container
const toastContainer = document.querySelector("#toast-container");

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
// Select Kanban task containers
const todoTasksContainer = document.querySelector("#todo-tasks");
const inProgressTasksContainer = document.querySelector("#in-progress-tasks");
const completedTasksContainer = document.querySelector("#completed-tasks");
const tasksEmptyState = document.querySelector("#tasks-empty-state");

// Select task counters
const todoCount = document.querySelector("#todo-count");
const inProgressCount = document.querySelector("#in-progress-count");
const completedCount = document.querySelector("#completed-count");

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

// Select task modal elements
const taskModal = document.querySelector("#task-modal");
const addTaskButton = document.querySelector("#add-task-button");
const cancelTaskButton = document.querySelector("#cancel-task");
const taskForm = document.querySelector("#task-form");
const taskModalTitle = document.querySelector("#task-modal-title");
const taskSubmitButton = taskForm.querySelector('button[type="submit"]');
// Select task form inputs
const taskTitleInput = document.querySelector("#task-title");
const taskDescriptionInput = document.querySelector("#task-description");
const taskPriorityInput = document.querySelector("#task-priority");
const taskDueDateInput = document.querySelector("#task-due-date");
const taskStatusInput = document.querySelector("#task-status");

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
  // Refresh workspace cards whenever the page is opened
if (isWorkspaces) {
  workspaceModule.renderWorkspaces();
}
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
// Open Task Modal
// Open Task Modal
addTaskButton.addEventListener("click", function () {
  editingTaskId = null;

  taskForm.reset();
  taskModalTitle.textContent = "Add Task";
  taskSubmitButton.textContent = "Save Task";

  taskModal.hidden = false;
});

// Close Task Modal
cancelTaskButton.addEventListener("click", function () {
  taskModal.hidden = true;
  taskForm.reset();
});
// Save a new task
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = taskTitleInput.value.trim();

if (!title) {
  alert("Please enter a task title.");
  taskTitleInput.focus();
  return;
}

if (!["low", "medium", "high"].includes(taskPriorityInput.value)) {
  alert("Please select a valid priority.");
  return;
}

if (!["todo", "in-progress", "completed"].includes(taskStatusInput.value)) {
  alert("Please select a valid task status.");
  return;
}

 const isEditingTask = Boolean(editingTaskId);
  if (editingTaskId) {
  // Find the existing task
  const taskToUpdate = tasks.find(function (task) {
    return task.id === editingTaskId;
  });

  if (taskToUpdate) {
    taskToUpdate.title = title;
    taskToUpdate.description = taskDescriptionInput.value.trim();
    taskToUpdate.priority = taskPriorityInput.value;
    taskToUpdate.dueDate = taskDueDateInput.value;
    taskToUpdate.status = taskStatusInput.value;
    taskToUpdate.updatedAt = new Date().toISOString();
  }

  editingTaskId = null;

} else {
  // Create a new task
  const newTask = {
    id: crypto.randomUUID(),
    workspaceId: activeWorkspaceId,
    title: title,
    description: taskDescriptionInput.value.trim(),
    priority: taskPriorityInput.value,
    dueDate: taskDueDateInput.value,
    status: taskStatusInput.value,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.push(newTask);
}

saveTasks();
updateWorkspaceActivity(activeWorkspaceId);
renderTasks();
showToast(
  isEditingTask
    ? "Task updated successfully!"
    : "Task created successfully!"
);

  taskForm.reset();
  taskModal.hidden = true;

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

const isEditingResource = Boolean(editingResourceId);

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
    updateWorkspaceActivity(activeWorkspaceId);
  renderResources();
  showToast(
  isEditingResource
    ? "Resource updated successfully!"
    : "Resource added successfully!"
);

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
    workspaceId: activeWorkspaceId,
    title: title,
    content: content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  notes.push(note);
}

  saveNotes();
updateWorkspaceActivity(activeWorkspaceId);
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



// Show dashboard when Workora starts
showPage("dashboard");
updateGreeting();
updateDate();


function openWorkspace(workspace) {
  activeWorkspaceId = workspace.id;
  detailWorkspaceName.textContent = workspace.name;

  detailWorkspaceDescription.textContent =
    workspace.description || "No description provided.";

  showPage("detail");
renderResources();
renderNotes();
renderTasks();
}

// Initialize workspace module
const workspaceModule = initWorkspaceModule({
  workspaces,
  resources,
  notes,
  tasks,
  workspaceGrid,
  workspaceEmptyState,
  workspaceModal,
  workspaceModalTitle,
  workspaceSubmitButton,
  workspaceForm,
  createWorkspaceButton,
  cancelWorkspaceButton,
  workspaceNameInput,
  workspaceDescriptionInput,
  exploreWorkspacesButton,
  continueTitle,
  continueDescription,
  continueUpdated,
  showToast,
  saveWorkspaces,
  openWorkspace,
  showPage
});

// Update workspace activity whenever its content changes
function updateWorkspaceActivity(workspaceId) {
  const workspace = workspaces.find(function (item) {
    return item.id === workspaceId;
  });

  if (!workspace) {
    return;
  }

  workspace.updatedAt = new Date().toISOString();

  saveWorkspaces();

  workspaceModule.renderWorkspaces();
  workspaceModule.renderContinueWorking();
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

    updateWorkspaceActivity(activeWorkspaceId);
  }
showToast("Resource deleted successfully!");
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

    updateWorkspaceActivity(activeWorkspaceId);
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
// Render tasks inside their respective Kanban columns
function renderTasks() {
  // Get tasks belonging to the active workspace
  const workspaceTasks = tasks.filter(function (task) {
    return task.workspaceId === activeWorkspaceId;
  });
    // Show empty state when there are no tasks
  tasksEmptyState.hidden = workspaceTasks.length > 0;

  // Clear existing task cards
  todoTasksContainer.innerHTML = "";
  inProgressTasksContainer.innerHTML = "";
  completedTasksContainer.innerHTML = "";

  // Separate tasks by status
  const todo = workspaceTasks.filter(task => task.status === "todo");
  const inProgress = workspaceTasks.filter(task => task.status === "in-progress");
  const completed = workspaceTasks.filter(task => task.status === "completed");

  // Update column counters
  todoCount.textContent = todo.length;
  inProgressCount.textContent = inProgress.length;
  completedCount.textContent = completed.length;

  // Display task cards
  workspaceTasks.forEach(function (task) {
    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");
    // Make task card draggable
taskCard.setAttribute("draggable", "true");

// Store task ID when dragging starts
taskCard.addEventListener("dragstart", function (event) {
  event.dataTransfer.setData("text/plain", task.id);
});

    const title = document.createElement("h4");
    title.textContent = task.title;

    const description = document.createElement("p");
    description.textContent = task.description;

    const priority = document.createElement("span");
    priority.textContent = task.priority;
    priority.classList.add("task-priority", `priority-${task.priority}`);

    taskCard.appendChild(title);

    if (task.description) {
      taskCard.appendChild(description);
    }

    taskCard.appendChild(priority);
    // Create status dropdown
const statusSelect = document.createElement("select");
statusSelect.classList.add("task-status-select");

const statuses = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" }
];

// Add dropdown options
statuses.forEach(function (status) {
  const option = document.createElement("option");
  option.value = status.value;
  option.textContent = status.label;
  statusSelect.appendChild(option);
});

// Show the task's current status
statusSelect.value = task.status;

// Update task status when changed
statusSelect.addEventListener("change", function () {
  task.status = statusSelect.value;
task.updatedAt = new Date().toISOString();

saveTasks();
updateWorkspaceActivity(task.workspaceId);
renderTasks();
showToast("Task status updated successfully!");
});

taskCard.appendChild(statusSelect);

    if (task.dueDate) {
  const dueDate = document.createElement("p");

  const formattedDate = new Date(
    task.dueDate + "T00:00:00"
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  dueDate.textContent = `Due: ${formattedDate}`;
  // Check whether the task is overdue
const today = new Date();
today.setHours(0, 0, 0, 0);

const taskDueDate = new Date(task.dueDate + "T00:00:00");

if (taskDueDate < today && task.status !== "completed") {
  dueDate.classList.add("task-overdue");
}
  taskCard.appendChild(dueDate);
}
    // Create Edit button
const editButton = document.createElement("button");
editButton.textContent = "Edit";
editButton.classList.add("edit-task-button");

editButton.addEventListener("click", function () {
  editingTaskId = task.id;

  // Fill form with existing task details
  taskTitleInput.value = task.title;
  taskDescriptionInput.value = task.description;
  taskPriorityInput.value = task.priority;
  taskDueDateInput.value = task.dueDate;
  taskStatusInput.value = task.status;

  // Change modal heading and button
  taskModalTitle.textContent = "Edit Task";
  taskSubmitButton.textContent = "Update Task";

  taskModal.hidden = false;
});

taskCard.appendChild(editButton);

// Create Delete button
const deleteButton = document.createElement("button");
deleteButton.textContent = "Delete";
deleteButton.classList.add("delete-task-button");

deleteButton.addEventListener("click", function () {
  const shouldDelete = confirm(
    "Are you sure you want to delete this task?"
  );

  if (!shouldDelete) {
    return;
  }

  const taskIndex = tasks.findIndex(function (item) {
    return item.id === task.id;
  });

  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    saveTasks();
    updateWorkspaceActivity(task.workspaceId);
  }
  showToast("Task deleted successfully!");

  renderTasks();
});

taskCard.appendChild(deleteButton);

    // Place card in the correct column
    if (task.status === "todo") {
      todoTasksContainer.appendChild(taskCard);
    } else if (task.status === "in-progress") {
      inProgressTasksContainer.appendChild(taskCard);
    } else if (task.status === "completed") {
      completedTasksContainer.appendChild(taskCard);
    }
  });

}
// Set up Kanban drop zones once
const kanbanColumns = document.querySelectorAll(".kanban-column");

kanbanColumns.forEach(function (column) {
  column.addEventListener("dragover", function (event) {
    event.preventDefault();
  });

  column.addEventListener("drop", function (event) {
    event.preventDefault();

    const taskId = event.dataTransfer.getData("text/plain");
    const task = tasks.find(function (item) {
      return item.id === taskId;
    });

    if (!task || task.workspaceId !== activeWorkspaceId) return;

    task.status = column.dataset.status;
    task.updatedAt = new Date().toISOString();

    saveTasks();
updateWorkspaceActivity(task.workspaceId);
renderTasks();
    showToast("Task moved successfully!");
  });
});


// Display previously saved workspaces on page load
workspaceModule.renderWorkspaces();
workspaceModule.renderContinueWorking();