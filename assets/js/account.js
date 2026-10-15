// 1. Account Page Elements
var profileForm = document.getElementById("profile-form");
var profileStatus = document.getElementById("profile-status");
var accountName = document.getElementById("account-name");
var accountEmail = document.getElementById("account-email");
var accountVerification = document.getElementById("account-verification");

function showProfileMessage(message, isError) {
  profileStatus.textContent = message;
  profileStatus.classList.toggle("error", Boolean(isError));
}

// 2. Load The Signed-In User And Their Profile
if (!window.voltSupabase) {
  showProfileMessage("Supabase could not load. Check your internet connection and project settings.", true);
} else {
  var accountClient = window.voltSupabase;

  async function loadAccount() {
    var userResult = await accountClient.auth.getUser();

    if (userResult.error || !userResult.data.user) {
      window.location.replace("login.html");
      return;
    }

    var user = userResult.data.user;
    accountEmail.textContent = user.email || "";
    accountVerification.textContent = user.email_confirmed_at ? "EMAIL CONFIRMED" : "CHECK YOUR EMAIL TO CONFIRM YOUR ACCOUNT";

    var profileResult = await accountClient
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .maybeSingle();

    if (profileResult.error) {
      accountName.textContent = "YOUR PROFILE";
      showProfileMessage("Could not load your profile. Make sure the profiles database setup has been run.", true);
      return;
    }

    var profile = profileResult.data || {};
    var fullName = profile.full_name || user.user_metadata.full_name || "VOLT MEMBER";
    accountName.textContent = fullName.toUpperCase();
    document.getElementById("profile-name").value = profile.full_name || user.user_metadata.full_name || "";
    document.getElementById("profile-phone").value = profile.phone || "";
  }

  loadAccount();

  // 3. Save Profile Changes And Sign Out
  profileForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    var currentUser = await accountClient.auth.getUser();

    if (currentUser.error || !currentUser.data.user) {
      window.location.replace("login.html");
      return;
    }

    var values = new FormData(profileForm);
    var result = await accountClient
      .from("profiles")
      .update({
        full_name: values.get("full_name").trim(),
        phone: values.get("phone").trim() || null,
        updated_at: new Date().toISOString()
      })
      .eq("id", currentUser.data.user.id)
      .select("full_name, phone")
      .single();

    if (result.error) {
      showProfileMessage(result.error.message, true);
      return;
    }

    accountName.textContent = result.data.full_name.toUpperCase();
    showProfileMessage("Profile saved.", false);
  });

  document.getElementById("sign-out").addEventListener("click", async function () {
    var result = await accountClient.auth.signOut();

    if (result.error) {
      showProfileMessage(result.error.message, true);
      return;
    }

    window.location.replace("login.html");
  });
}
