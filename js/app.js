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
const pageTitle = document.querySelector("#page-title");
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

// Function to show a page
function showPage(pageName) {

  const isDashboard = pageName === "dashboard";

  dashboardPage.hidden = !isDashboard;
  workspacesPage.hidden = isDashboard;

  // Update header
  pageTitle.textContent = isDashboard ? "Dashboard" : "Workspaces";

  // Update active navigation
  navLinks.forEach(function (link, index) {

    if (index === 0 && isDashboard) {
      link.classList.add("active");
    } else if (index === 1 && !isDashboard) {
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

// Show dashboard when Workora starts
showPage("dashboard");

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

editButton.addEventListener("click", function () {
  editingWorkspaceId = workspace.id;
  workspaceSubmitButton.textContent = "Update Workspace";

  workspaceNameInput.value = workspace.name;
  workspaceDescriptionInput.value = workspace.description;

  workspaceModal.hidden = false;
});

const deleteButton = document.createElement("button");

deleteButton.textContent = "Delete";
deleteButton.dataset.id = workspace.id;
deleteButton.addEventListener("click", function () {
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

// Close modal and clear form
workspaceModal.hidden = true;
workspaceForm.reset();
editingWorkspaceId = null;
workspaceSubmitButton.textContent = "Create Workspace";
});
// Display previously saved workspaces on page load
renderWorkspaces();