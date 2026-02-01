
document.addEventListener("DOMContentLoaded", function() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll("#nav-links a");

  navLinks.forEach(link => {
    const linkPath = link.getAttribute("href");

    // Check if the link path matches the current window path
    if (linkPath === currentPath || (currentPath === "/" && linkPath === "/index.html")) {
      link.classList.add("active");

      // Optional: Highlight the parent if it's in a sub-menu
      const parentLi = link.closest("ul").parentElement;
      if (parentLi && parentLi.tagName === "LI") {
          parentLi.classList.add("parent-active");
      }
    }
  });
});
