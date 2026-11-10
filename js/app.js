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

// Load saved resources
const savedResources = localStorage.getItem("workora-resources");
const resources = savedResources ? JSON.parse(savedResources) : [];

// Save resources to localStorage
function saveResources() {
  localStorage.setItem("workora-resources", JSON.stringify(resources));
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
// Open resource modal
addResourceButton.addEventListener("click", function () {
  editingResourceId = null;
  resourceForm.reset();

  resourceModalTitle.textContent = "Add Resource";
  resourceModal.querySelector('button[type="submit"]').textContent = "Save Resource";

  resourceModal.hidden = false;
});
// Close resource modal
cancelResourceButton.addEventListener("click", function () {
  resourceModal.hidden = true;
  resourceForm.reset();
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