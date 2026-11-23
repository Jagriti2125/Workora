// Display toast notifications
export function showToast(message, type = "success") {
  const toast = document.createElement("div");

  toast.classList.add("toast", `toast-${type}`);
  toast.textContent = message;

  const toastContainer = document.querySelector("#toast-container");
  toastContainer.appendChild(toast);

  setTimeout(function () {
    toast.remove();
  }, 3000);
}