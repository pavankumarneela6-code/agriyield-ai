/* ==========================================
   EL NIÑO AI
   Main JavaScript
   File: frontend/js/main.js
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. MOBILE NAVIGATION MENU
    // ==========================================

    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {

            const isOpen = navMenu.classList.toggle("active");

            menuToggle.classList.toggle("active", isOpen);

            menuToggle.setAttribute("aria-expanded", String(isOpen));

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );

        });

        // Close menu after clicking a navigation link
        const navLinks = navMenu.querySelectorAll(".nav-link");

        navLinks.forEach((link) => {

            link.addEventListener("click", () => {

                navMenu.classList.remove("active");
                menuToggle.classList.remove("active");

                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

            });

        });

        // Close menu when clicking outside the navigation
        document.addEventListener("click", (event) => {

            const clickedInsideMenu = navMenu.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideMenu && !clickedToggle) {

                navMenu.classList.remove("active");
                menuToggle.classList.remove("active");

                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

            }

        });

        // Close menu when switching to desktop width
        window.addEventListener("resize", () => {

            if (window.innerWidth > 768) {

                navMenu.classList.remove("active");
                menuToggle.classList.remove("active");

                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

            }

        });

    }


    // ==========================================
    // 2. AUTOMATIC COPYRIGHT YEAR
    // ==========================================

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    // ==========================================
    // 3. ACTIVE NAVIGATION LINK
    // ==========================================

    const pageSections = document.querySelectorAll(
        "main section[id]"
    );

    const pageNavLinks = document.querySelectorAll(
        '.nav-menu a[href^="#"]'
    );

    if (pageSections.length > 0 && pageNavLinks.length > 0) {

        const updateActiveLink = () => {

            let currentSection = "home";

            pageSections.forEach((section) => {

                const sectionTop = section.offsetTop - 150;

                if (window.scrollY >= sectionTop) {
                    currentSection = section.id;
                }

            });

            pageNavLinks.forEach((link) => {

                const targetSection = link.getAttribute("href").slice(1);

                link.classList.toggle(
                    "active",
                    targetSection === currentSection
                );

            });

        };

        window.addEventListener("scroll", updateActiveLink, {
            passive: true
        });

        updateActiveLink();

    }


    // ==========================================
    // 4. SMOOTH SCROLL FOR INTERNAL LINKS
    // ==========================================

    const internalLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    internalLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (targetElement) {

                event.preventDefault();

                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    // ==========================================
    // 5. INITIALIZATION MESSAGE
    // ==========================================

    console.log("El Niño AI: Main JavaScript initialized.");

});