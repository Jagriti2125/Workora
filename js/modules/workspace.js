
// Workspace module
// Handles workspace creation, editing, deletion and rendering.

// Initialize workspace module
export function initWorkspaceModule({
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
}) {

  // Store the ID of the workspace being edited
  let editingWorkspaceId = null;

  // Find the most recently updated workspace
  function getLatestWorkspace() {
    if (workspaces.length === 0) {
      return null;
    }

    const sortedWorkspaces = [...workspaces].sort(function (a, b) {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    return sortedWorkspaces[0];
  }

  // Update the Dashboard's Continue Working section
  function renderContinueWorking() {
    const latestWorkspace = getLatestWorkspace();

    if (!latestWorkspace) {
      exploreWorkspacesButton.textContent = "Explore Workspaces →";
      continueUpdated.textContent = "A little progress every day.";
      continueTitle.textContent = "Your journey starts here!";
      continueDescription.textContent =
        "Create your first workspace to bring your projects, learning resources and ideas together.";

      return;
    }

    exploreWorkspacesButton.textContent = "Resume Workspace →";

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
    workspaceGrid.innerHTML = "";

    if (workspaces.length === 0) {
      workspaceEmptyState.hidden = false;
      return;
    }

    workspaceEmptyState.hidden = true;

    workspaces.forEach(function (workspace) {
      const card = document.createElement("div");

      card.classList.add("workspace-card");

      card.addEventListener("click", function () {
        openWorkspace(workspace);
      });

      const title = document.createElement("h3");
      title.textContent = workspace.name;

      const description = document.createElement("p");
      description.textContent =
        workspace.description || "No description provided.";

      // Count items belonging to this workspace
      const resourceCount = resources.filter(function (item) {
        return item.workspaceId === workspace.id;
      }).length;

      const noteCount = notes.filter(function (item) {
        return item.workspaceId === workspace.id;
      }).length;

      const taskCount = tasks.filter(function (item) {
        return item.workspaceId === workspace.id;
      }).length;

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

      // Workspace statistics
      const stats = document.createElement("div");
      stats.classList.add("workspace-stats");

      stats.innerHTML = `
        <span>${resourceCount} Resources</span>
        <span>${noteCount} Notes</span>
        <span>${taskCount} Tasks</span>
      `;

      card.appendChild(stats);
      card.appendChild(updatedDate);

      const actions = document.createElement("div");
      actions.classList.add("workspace-actions");

      // Edit workspace button
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

      // Delete workspace button
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

        saveWorkspaces();

        renderWorkspaces();
        renderContinueWorking();
      });

      actions.appendChild(editButton);
      actions.appendChild(deleteButton);

      card.appendChild(actions);
      workspaceGrid.appendChild(card);
    });
  }

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
saveWorkspaces();

console.log("All Workspaces:", workspaces);
renderWorkspaces();
renderContinueWorking();
showToast(
  editingWorkspaceId ? "Workspace updated successfully!" : "Workspace created successfully!"
);

// Close modal and clear form
workspaceModal.hidden = true;
workspaceForm.reset();
editingWorkspaceId = null;
workspaceSubmitButton.textContent = "Create Workspace";
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

exploreWorkspacesButton.addEventListener("click", function () {
  const latestWorkspace = getLatestWorkspace();

  if (latestWorkspace) {
    openWorkspace(latestWorkspace);
  } else {
    showPage("workspaces");
  }
});

  return {
    renderWorkspaces,
    renderContinueWorking,
    getLatestWorkspace
  };
}
