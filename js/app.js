console.log("Workora initialized!");
// Store all workspaces
// Load previously saved workspaces
const savedWorkspaces = localStorage.getItem("workora-workspaces");

const workspaces = savedWorkspaces
  ? JSON.parse(savedWorkspaces)
  : [];
  let editingWorkspaceId = null;

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

// Select modal elements
const workspaceModal = document.querySelector("#workspace-modal");
const createWorkspaceButton = document.querySelector(".page-heading .primary-button");
const cancelWorkspaceButton = document.querySelector("#cancel-workspace");
const workspaceForm = document.querySelector("#workspace-form");
const workspaceSubmitButton = workspaceForm.querySelector(
  'button[type="submit"]'
);

const workspaceNameInput = document.querySelector("#workspace-name");
const workspaceDescriptionInput = document.querySelector("#workspace-description");

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
  workspaceModal.hidden = false;
});
// Close workspace modal
cancelWorkspaceButton.addEventListener("click", function () {
  workspaceModal.hidden = true;
  workspaceForm.reset();
  editingWorkspaceId = null;
workspaceSubmitButton.textContent = "Create Workspace";
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
  detailWorkspaceName.textContent = workspace.name;

  detailWorkspaceDescription.textContent =
    workspace.description || "No description provided.";

  showPage("detail");
}

function renderContinueWorking() {
  const latestWorkspace = getLatestWorkspace();

  if (!latestWorkspace) {
    continueTitle.textContent = "Pick up where you left off";
    continueDescription.textContent =
      "Your next productive session is just one click away.";
    return;
  }

  continueTitle.textContent = latestWorkspace.name;
  continueDescription.textContent =
    latestWorkspace.description || "Your workspace is ready to continue.";
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

card.appendChild(title);
card.appendChild(description);

const actions = document.createElement("div");
actions.classList.add("workspace-actions");

const editButton = document.createElement("button");
editButton.textContent = "Edit";
editButton.dataset.id = workspace.id;

editButton.addEventListener("click", function (event) {
  event.stopPropagation();
  editingWorkspaceId = workspace.id;
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