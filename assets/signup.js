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

function markFieldValidity(field, isValid) {
  if (!field || typeof field.setAttribute !== "function") return;
  field.setAttribute("aria-invalid", isValid ? "false" : "true");
}

function validateForm(form) {
  const firstName = form.elements.firstName.value.trim();
  const lastName = form.elements.lastName.value.trim();
  const email = normalizeEmail(form.elements.email.value);
  const password = form.elements.password.value;
  const confirmPassword = form.elements.confirmPassword.value;
  const termsAccepted = form.elements.terms.checked;

  markFieldValidity(form.elements.firstName, Boolean(firstName));
  markFieldValidity(form.elements.lastName, Boolean(lastName));
  markFieldValidity(form.elements.email, Boolean(email));
  markFieldValidity(form.elements.password, true);
  markFieldValidity(form.elements.confirmPassword, true);

  if (!firstName || !lastName) return { message: "Please enter your first and last name.", focus: "firstName" };
  if (!email) return { message: "Please enter your email.", focus: "email" };
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
    markFieldValidity(form.elements.email, false);
    return { message: "Please enter a valid email address.", focus: "email" };
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    markFieldValidity(form.elements.password, false);
    return { message: passwordError, focus: "password" };
  }

  if (password !== confirmPassword) {
    markFieldValidity(form.elements.confirmPassword, false);
    return { message: "Passwords do not match.", focus: "confirmPassword" };
  }

  if (!termsAccepted) return { message: "Please accept the Terms and Privacy Policy.", focus: "terms" };

  return { message: null, focus: null };
}

function attachSignupForm() {
  const form = document.getElementById("signup-form");
  if (!form) return;

  const errorEl = document.getElementById("form-error");
  const successEl = document.getElementById("form-success");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const { message: error, focus } = validateForm(form);
    if (error) {
      showMessage({ errorEl, successEl, error });
      if (focus && typeof form.elements[focus]?.focus === "function") {
        form.elements[focus].focus();
      }
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
