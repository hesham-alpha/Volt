// 1. Contact Form Demo
// The form validates in the browser but does not send or save the message.
var contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();
  document.getElementById("contact-status").textContent = "Thanks — this demo form does not send or store your message.";
  contactForm.reset();
});
