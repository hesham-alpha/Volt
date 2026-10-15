// 1. Account Page Elements
var loginForm = document.getElementById("login-form");
var signupForm = document.getElementById("signup-form");
var forgotForm = document.getElementById("forgot-form");
var resetForm = document.getElementById("reset-form");
var authStatus = document.getElementById("auth-status");
var authForms = [loginForm, signupForm, forgotForm, resetForm];
var isPasswordRecovery = new URLSearchParams(window.location.search).get("view") === "reset";

// 2. Show The Selected Account Form
function showAuthForm(formName) {
  authForms.forEach(function (form) {
    form.classList.toggle("hidden", form.id !== formName);
  });

  document.querySelectorAll("[data-auth-view]").forEach(function (button) {
    var isSelected = button.dataset.authView === formName.replace("-form", "");
    button.classList.toggle("active", isSelected && button.classList.contains("auth-tab"));
    button.setAttribute("aria-selected", String(isSelected));
  });
}

function showAuthMessage(message, isError) {
  authStatus.textContent = message;
  authStatus.classList.toggle("error", Boolean(isError));
}

if (isPasswordRecovery) {
  showAuthForm("reset-form");
} else {
  showAuthForm("login-form");
}

document.querySelectorAll("[data-auth-view]").forEach(function (button) {
  button.addEventListener("click", function () {
    showAuthForm(button.dataset.authView + "-form");
    showAuthMessage("", false);
  });
});

document.getElementById("show-forgot").addEventListener("click", function () {
  showAuthForm("forgot-form");
  showAuthMessage("", false);
});

// 3. Connect Forms To Supabase Auth
if (!window.voltSupabase) {
  showAuthMessage("Supabase could not load. Check your internet connection and project settings.", true);
} else {
  var authClient = window.voltSupabase;

  authClient.auth.getSession().then(function (result) {
    if (result.data.session && !isPasswordRecovery) {
      window.location.replace("account.html");
    }
  });

  authClient.auth.onAuthStateChange(function (event) {
    if (event === "PASSWORD_RECOVERY") {
      isPasswordRecovery = true;
      showAuthForm("reset-form");
      showAuthMessage("Choose a new password for your account.", false);
      return;
    }

    if (event === "SIGNED_IN" && !isPasswordRecovery) {
      window.location.replace("account.html");
    }
  });

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    var values = new FormData(loginForm);
    var result = await authClient.auth.signInWithPassword({
      email: values.get("email").trim(),
      password: values.get("password")
    });

    if (result.error) {
      showAuthMessage(result.error.message, true);
      return;
    }

    window.location.replace("account.html");
  });

  signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    var values = new FormData(signupForm);
    var result = await authClient.auth.signUp({
      email: values.get("email").trim(),
      password: values.get("password"),
      options: {
        data: { full_name: values.get("full_name").trim() },
        emailRedirectTo: new URL("login.html", window.location.href).href
      }
    });

    if (result.error) {
      showAuthMessage(result.error.message, true);
      return;
    }

    if (result.data.session) {
      window.location.replace("account.html");
      return;
    }

    showAuthMessage("Account created. Check your email to confirm your address, then sign in.", false);
    showAuthForm("login-form");
  });

  forgotForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    var email = new FormData(forgotForm).get("email").trim();
    var result = await authClient.auth.resetPasswordForEmail(email, {
      redirectTo: new URL("login.html?view=reset", window.location.href).href
    });

    if (result.error) {
      showAuthMessage(result.error.message, true);
      return;
    }

    showAuthMessage("If an account uses that email, a password reset link is on its way.", false);
    forgotForm.reset();
  });

  resetForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    var password = new FormData(resetForm).get("password");
    var result = await authClient.auth.updateUser({ password: password });

    if (result.error) {
      showAuthMessage(result.error.message, true);
      return;
    }

    showAuthMessage("Password updated. You can now sign in with your new password.", false);
    showAuthForm("login-form");
    window.history.replaceState({}, document.title, "login.html");
  });
}
