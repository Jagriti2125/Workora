console.log("Workora initialized!");
// Store all workspaces
// Load previously saved workspaces
const savedWorkspaces = localStorage.getItem("workora-workspaces");

const workspaces = savedWorkspaces
  ? JSON.parse(savedWorkspaces)
  : [];

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

    card.innerHTML = `
      <h3>${workspace.name}</h3>
      <p>${workspace.description || "No description provided."}</p>
    `;

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

  const workspace = {
    id: crypto.randomUUID(),
    name: workspaceName,
    description: workspaceDescription,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDemo: false
  };

  workspaces.push(workspace);
  // Save workspaces in browser storage
localStorage.setItem("workora-workspaces", JSON.stringify(workspaces));

console.log("All Workspaces:", workspaces);
renderWorkspaces();

// Close modal and clear form
workspaceModal.hidden = true;
workspaceForm.reset();
});
// Display previously saved workspaces on page load
renderWorkspaces();