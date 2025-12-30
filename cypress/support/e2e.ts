// Cypress E2E support file

Cypress.on("uncaught:exception", (err) => {
  // Ignore GSAP animation errors in tests
  if (err.message.includes("gsap")) {
    return false;
  }
  return true;
});
