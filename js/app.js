import { loadData, saveData } from "./services/storage.js";
import { initWorkspaceModule } from "./modules/workspace.js";
import { initResourceModule } from "./modules/resource.js";
import { initNoteModule } from "./modules/note.js";
import { initTaskModule } from "./modules/task.js";
import { showToast } from "./utils/notifications.js";
import { formatDate } from "./utils/date.js";


// Load previously saved workspaces

const workspaces = loadData("workora-workspaces");

// Save workspaces to localStorage
function saveWorkspaces() {
  saveData("workora-workspaces", workspaces);
}


let activeWorkspaceId = null;

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
  const formattedDate = formatDate(new Date(), {
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
resourceModule.renderResources();
noteModule.renderNotes();
taskModule.renderTasks();
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

// Initialize note module
const noteModule = initNoteModule({
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
  getActiveWorkspaceId: function () {
    return activeWorkspaceId;
  },
  saveNotes,
  updateWorkspaceActivity,
  showToast
});

// Initialize task module
const taskModule = initTaskModule({
  tasks,
  todoTasksContainer,
  inProgressTasksContainer,
  completedTasksContainer,
  tasksEmptyState,
  todoCount,
  inProgressCount,
  completedCount,
  taskModal,
  taskModalTitle,
  taskSubmitButton,
  taskForm,
  addTaskButton,
  cancelTaskButton,
  taskTitleInput,
  taskDescriptionInput,
  taskPriorityInput,
  taskDueDateInput,
  taskStatusInput,
  getActiveWorkspaceId: function () {
    return activeWorkspaceId;
  },
  saveTasks,
  updateWorkspaceActivity,
  showToast
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

// Initialize resource module
const resourceModule = initResourceModule({
  resources,
  resourceGrid,
  resourceEmptyState,
  resourceModal,
  resourceModalTitle,
  resourceForm,
  addResourceButton,
  cancelResourceButton,
  resourceTitleInput,
  resourceUrlInput,
  resourceDescriptionInput,
  getActiveWorkspaceId: function () {
    return activeWorkspaceId;
  },
  saveResources,
  updateWorkspaceActivity,
  showToast
});

// Display previously saved workspaces on page load
workspaceModule.renderWorkspaces();
workspaceModule.renderContinueWorking();