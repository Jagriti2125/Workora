console.log("Workora initialized!");

// Select page elements
const dashboardPage = document.querySelector("#dashboard-page");
const workspacesPage = document.querySelector("#workspaces-page");
const pageTitle = document.querySelector("#page-title");

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

// Show dashboard when Workora starts
showPage("dashboard");