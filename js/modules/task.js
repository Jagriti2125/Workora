import { formatDate } from "../utils/date.js";

// Initialize the task module
export function initTaskModule({
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
  getActiveWorkspaceId,
  saveTasks,
  updateWorkspaceActivity,
  showToast
}) {
     let editingTaskId = null;

     // Open task modal
addTaskButton.addEventListener("click", function () {
  editingTaskId = null;

  taskForm.reset();
  taskModalTitle.textContent = "Add Task";
  taskSubmitButton.textContent = "Save Task";

  taskModal.hidden = false;
});

// Close task modal
cancelTaskButton.addEventListener("click", function () {
  taskModal.hidden = true;
  taskForm.reset();
});

// Handle task form submission
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
      workspaceId: getActiveWorkspaceId(),
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
  updateWorkspaceActivity(getActiveWorkspaceId());
  renderTasks();

  showToast(
    isEditingTask
      ? "Task updated successfully!"
      : "Task created successfully!"
  );

  taskForm.reset();
  taskModal.hidden = true;
  

  // We'll connect renderTasks() after moving the renderer.
});

// Render tasks inside their respective Kanban columns
function renderTasks() {
  // Get tasks belonging to the active workspace
  const workspaceTasks = tasks.filter(function (task) {
    return task.workspaceId === getActiveWorkspaceId();
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

  const formattedDate = formatDate(
  task.dueDate + "T00:00:00",
  {
    day: "numeric",
    month: "short",
    year: "numeric"
  }
);

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

    if (!task || task.workspaceId !== getActiveWorkspaceId()) return;

    task.status = column.dataset.status;
    task.updatedAt = new Date().toISOString();

    saveTasks();
updateWorkspaceActivity(task.workspaceId);
renderTasks();
    showToast("Task moved successfully!");
  });
});

return {
  renderTasks
};

}