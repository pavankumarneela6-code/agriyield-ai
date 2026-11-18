// =====================================================
// EL NINO AI - AUTHENTICATION
// Login + Registration + FastAPI + JWT Integration
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    // -------------------------------------------------
    // 1. PASSWORD SHOW / HIDE
    // -------------------------------------------------

    const passwordToggleButtons = document.querySelectorAll(
        "[data-password-toggle]"
    );

    passwordToggleButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const inputId = button.dataset.passwordToggle;
            const passwordInput = document.getElementById(inputId);

            if (!passwordInput) return;

            const isPassword = passwordInput.type === "password";

            passwordInput.type = isPassword ? "text" : "password";
            button.textContent = isPassword ? "Hide" : "Show";

            button.setAttribute(
                "aria-label",
                isPassword ? "Hide password" : "Show password"
            );
        });
    });


    // -------------------------------------------------
    // 2. FIELD ERROR HELPER
    // -------------------------------------------------

    function showFieldError(inputId, errorId, message) {
        const input = document.getElementById(inputId);
        const errorElement = document.getElementById(errorId);

        if (input) {
            input.setAttribute(
                "aria-invalid",
                message ? "true" : "false"
            );
        }

        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function clearFieldError(inputId, errorId) {
        showFieldError(inputId, errorId, "");
    }


    // -------------------------------------------------
    // 3. FORM MESSAGE HELPER
    // -------------------------------------------------

    function showFormMessage(messageId, message, type) {
        const element = document.getElementById(messageId);

        if (!element) return;

        element.textContent = message;
        element.className = "form-message";

        if (message && type) {
            element.classList.add(type);
        }
    }


    // -------------------------------------------------
    // 4. EMAIL VALIDATION
    // -------------------------------------------------

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }


    // -------------------------------------------------
    // 5. BACKEND API HELPER
    // -------------------------------------------------

    const API_BASE_URL = "http://127.0.0.1:8000";

    async function sendAuthRequest(endpoint, data) {
        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );

        let result;

        try {
            result = await response.json();
        } catch {
            throw new Error("Invalid response received from the server.");
        }

        if (!response.ok) {
            throw new Error(
                result.detail || result.message || "Request failed."
            );
        }

        return result;
    }


    // -------------------------------------------------
    // 6. LOGIN FORM + JWT TOKEN STORAGE
    // -------------------------------------------------

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        const emailInput = document.getElementById("loginEmail");
        const passwordInput = document.getElementById("loginPassword");
        const submitButton = document.getElementById("loginSubmit");

        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            showFormMessage("loginMessage", "", "");

            let isValid = true;

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            if (!email) {
                showFieldError(
                    "loginEmail",
                    "loginEmailError",
                    "Please enter your email address."
                );

                isValid = false;

            } else if (!isValidEmail(email)) {
                showFieldError(
                    "loginEmail",
                    "loginEmailError",
                    "Please enter a valid email address."
                );

                isValid = false;

            } else {
                clearFieldError("loginEmail", "loginEmailError");
            }

            if (!password) {
                showFieldError(
                    "loginPassword",
                    "loginPasswordError",
                    "Please enter your password."
                );

                isValid = false;

            } else {
                clearFieldError("loginPassword", "loginPasswordError");
            }

            if (!isValid) {
                showFormMessage(
                    "loginMessage",
                    "Please correct the highlighted fields.",
                    "error"
                );

                return;
            }

            if (submitButton) {
                submitButton.disabled = true;
            }

            showFormMessage(
                "loginMessage",
                "Signing in...",
                "success"
            );

            try {
                const result = await sendAuthRequest(
                    "/api/auth/login",
                    {
                        email: email,
                        password: password
                    }
                );

                // Verify that the backend returned a JWT.
                if (!result.access_token || !result.user) {
                    throw new Error(
                        "Login response is missing the access token or user details."
                    );
                }

                // Save JWT access token.
                sessionStorage.setItem(
                    "elninoAccessToken",
                    result.access_token
                );

                // Save logged-in user details.
                sessionStorage.setItem(
                    "elninoUser",
                    JSON.stringify(result.user)
                );

                showFormMessage(
                    "loginMessage",
                    result.message || "Login successful!",
                    "success"
                );

                // Redirect to the existing dashboard.
                window.location.href = "dashboard.html";

            } catch (error) {
                showFormMessage(
                    "loginMessage",
                    error.message.includes("Failed to fetch")
                        ? "Cannot connect to the backend. Check that the server is running and CORS is configured."
                        : error.message,
                    "error"
                );

            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                }
            }
        });

        emailInput.addEventListener("input", () => {
            clearFieldError("loginEmail", "loginEmailError");
            showFormMessage("loginMessage", "", "");
        });

        passwordInput.addEventListener("input", () => {
            clearFieldError("loginPassword", "loginPasswordError");
            showFormMessage("loginMessage", "", "");
        });
    }


    // -------------------------------------------------
    // 7. REGISTRATION FORM
    // -------------------------------------------------

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        const nameInput = document.getElementById("registerName");
        const emailInput = document.getElementById("registerEmail");
        const passwordInput = document.getElementById("registerPassword");
        const confirmPasswordInput =
            document.getElementById("confirmPassword");
        const termsCheckbox = document.getElementById("acceptTerms");
        const submitButton = document.getElementById("registerSubmit");

        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            showFormMessage("registerMessage", "", "");

            let isValid = true;

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            // Validate full name.
            if (name.length < 2) {
                showFieldError(
                    "registerName",
                    "registerNameError",
                    "Please enter a name containing at least 2 characters."
                );

                isValid = false;

            } else if (name.length > 100) {
                showFieldError(
                    "registerName",
                    "registerNameError",
                    "Name must contain 100 characters or fewer."
                );

                isValid = false;

            } else {
                clearFieldError("registerName", "registerNameError");
            }

            // Validate email.
            if (!email) {
                showFieldError(
                    "registerEmail",
                    "registerEmailError",
                    "Please enter your email address."
                );

                isValid = false;

            } else if (!isValidEmail(email)) {
                showFieldError(
                    "registerEmail",
                    "registerEmailError",
                    "Please enter a valid email address."
                );

                isValid = false;

            } else {
                clearFieldError("registerEmail", "registerEmailError");
            }

            // Validate password.
            if (password.length < 8) {
                showFieldError(
                    "registerPassword",
                    "registerPasswordError",
                    "Password must contain at least 8 characters."
                );

                isValid = false;

            } else if (password.length > 72) {
                showFieldError(
                    "registerPassword",
                    "registerPasswordError",
                    "Password must contain 72 characters or fewer."
                );

                isValid = false;

            } else {
                clearFieldError(
                    "registerPassword",
                    "registerPasswordError"
                );
            }

            // Validate confirm password.
            if (!confirmPassword) {
                showFieldError(
                    "confirmPassword",
                    "confirmPasswordError",
                    "Please confirm your password."
                );

                isValid = false;

            } else if (password !== confirmPassword) {
                showFieldError(
                    "confirmPassword",
                    "confirmPasswordError",
                    "Passwords do not match."
                );

                isValid = false;

            } else {
                clearFieldError(
                    "confirmPassword",
                    "confirmPasswordError"
                );
            }

            // Validate terms checkbox.
            if (!termsCheckbox.checked) {
                showFieldError(
                    "acceptTerms",
                    "termsError",
                    "Please accept the terms to continue."
                );

                isValid = false;

            } else {
                clearFieldError("acceptTerms", "termsError");
            }

            if (!isValid) {
                showFormMessage(
                    "registerMessage",
                    "Please correct the highlighted fields.",
                    "error"
                );

                return;
            }

            if (submitButton) {
                submitButton.disabled = true;
            }

            showFormMessage(
                "registerMessage",
                "Creating your account...",
                "success"
            );

            try {
                const result = await sendAuthRequest(
                    "/api/auth/register",
                    {
                        full_name: name,
                        email: email,
                        password: password
                    }
                );

                showFormMessage(
                    "registerMessage",
                    result.message ||
                        "Registration successful! You can now log in.",
                    "success"
                );

                // Clear the form only after successful registration.
                registerForm.reset();

            } catch (error) {
                showFormMessage(
                    "registerMessage",
                    error.message.includes("Failed to fetch")
                        ? "Cannot connect to the backend. Check that the server is running and CORS is configured."
                        : error.message,
                    "error"
                );

            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                }
            }
        });

        nameInput.addEventListener("input", () => {
            clearFieldError("registerName", "registerNameError");
            showFormMessage("registerMessage", "", "");
        });

        emailInput.addEventListener("input", () => {
            clearFieldError("registerEmail", "registerEmailError");
            showFormMessage("registerMessage", "", "");
        });

        passwordInput.addEventListener("input", () => {
            clearFieldError(
                "registerPassword",
                "registerPasswordError"
            );

            showFormMessage("registerMessage", "", "");
        });

        confirmPasswordInput.addEventListener("input", () => {
            clearFieldError(
                "confirmPassword",
                "confirmPasswordError"
            );

            showFormMessage("registerMessage", "", "");
        });

        termsCheckbox.addEventListener("change", () => {
            clearFieldError("acceptTerms", "termsError");
        });
    }


    // -------------------------------------------------
    // 8. COPYRIGHT YEAR
    // -------------------------------------------------

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    console.log("El Niño AI: Authentication initialized.");
});