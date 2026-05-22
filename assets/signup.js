function setVisible(element, visible) {
  element.style.display = visible ? "block" : "none";
}

function showMessage({ errorEl, successEl, error, success }) {
  if (error) {
    errorEl.textContent = error;
    setVisible(errorEl, true);
    setVisible(successEl, false);
    return;
  }

  if (success) {
    successEl.textContent = success;
    setVisible(successEl, true);
    setVisible(errorEl, false);
  }
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function validatePassword(password) {
  const value = String(password || "");
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
    return "Password must include at least one letter and one number.";
  }
  return null;
}

function validateForm(form) {
  const firstName = form.elements.firstName.value.trim();
  const lastName = form.elements.lastName.value.trim();
  const email = normalizeEmail(form.elements.email.value);
  const password = form.elements.password.value;
  const confirmPassword = form.elements.confirmPassword.value;
  const termsAccepted = form.elements.terms.checked;

  if (!firstName || !lastName) return "Please enter your first and last name.";
  if (!email) return "Please enter your email.";
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return "Please enter a valid email address.";

  const passwordError = validatePassword(password);
  if (passwordError) return passwordError;
  if (password !== confirmPassword) return "Passwords do not match.";
  if (!termsAccepted) return "Please accept the Terms and Privacy Policy.";

  return null;
}

function attachSignupForm() {
  const form = document.getElementById("signup-form");
  if (!form) return;

  const errorEl = document.getElementById("form-error");
  const successEl = document.getElementById("form-success");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const error = validateForm(form);
    if (error) {
      showMessage({ errorEl, successEl, error });
      return;
    }

    const profile = {
      firstName: form.elements.firstName.value.trim(),
      lastName: form.elements.lastName.value.trim(),
      email: normalizeEmail(form.elements.email.value),
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("lifeos.demoProfile", JSON.stringify(profile));
    } catch {
      // Ignore storage failures (private mode, disabled storage, etc.)
    }

    showMessage({
      errorEl,
      successEl,
      success: `Thanks, ${profile.firstName}! Demo signup complete. (No real account was created.)`,
    });

    form.reset();
    form.querySelector("#firstName")?.focus();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", attachSignupForm);
} else {
  attachSignupForm();
}

