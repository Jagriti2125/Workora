// Initialize the resource module
export function initResourceModule({
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
  getActiveWorkspaceId,
  saveResources,
  updateWorkspaceActivity,
  showToast
}) {
     let editingResourceId = null;

     // Open resource modal
addResourceButton.addEventListener("click", function () {
  editingResourceId = null;
  resourceForm.reset();

  resourceModalTitle.textContent = "Add Resource";
  resourceModal.querySelector('button[type="submit"]').textContent =
    "Save Resource";

  resourceModal.hidden = false;
});

 // Cancel resource modal
cancelResourceButton.addEventListener("click", function () {
  resourceModal.hidden = true;
  resourceForm.reset();
});

// Handle resource form submission
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

  if (isEditingResource) {
    const resource = resources.find(function (item) {
      return item.id === editingResourceId;
    });

    if (resource) {
      resource.title = title;
      resource.url = url;
      resource.description = description;
      resource.updatedAt = new Date().toISOString();

      saveResources();
    }

    editingResourceId = null;
  } else {
    const resource = {
      id: crypto.randomUUID(),
      workspaceId: getActiveWorkspaceId(),
      title,
      url,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    resources.push(resource);
    saveResources();
  }

  updateWorkspaceActivity(getActiveWorkspaceId());
  renderResources();

  showToast(
    isEditingResource
      ? "Resource updated successfully!"
      : "Resource added successfully!"
  );

  resourceModal.hidden = true;
  resourceForm.reset();
});

function renderResources() {
  // Get resources belonging to the active workspace
  const workspaceResources = resources.filter(function (resource) {
    return resource.workspaceId === getActiveWorkspaceId();
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

    updateWorkspaceActivity(getActiveWorkspaceId());
  }
showToast("Resource deleted successfully!");
  renderResources();
});

actions.append(editButton, deleteButton);

resourceCard.append(title, description, link, actions);
resourceGrid.appendChild(resourceCard);
  });
}

return {
  renderResources
};
}