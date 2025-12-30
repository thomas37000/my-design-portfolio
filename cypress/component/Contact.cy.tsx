import Contact from "@/components/Contact";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";

describe("Contact Component", () => {
  beforeEach(() => {
    // Stub GSAP to avoid animation issues in tests
    cy.stub(window, "gsap").as("gsapStub");
  });

  describe("Contact Section", () => {
    it("renders the contact section with title", () => {
      cy.mount(<Contact />);
      cy.get("h2").should("contain.text", "Me Contacter");
    });

    it("contains both ContactInfo and ContactForm", () => {
      cy.mount(<Contact />);
      cy.get("section#contact").should("exist");
      cy.get("form").should("exist");
    });
  });

  describe("ContactInfo Component", () => {
    it("renders the contact info section", () => {
      cy.mount(<ContactInfo />);
      cy.get("h3").should("contain.text", "Restons en contact");
    });

    it("displays email contact info", () => {
      cy.mount(<ContactInfo />);
      cy.contains("Email").should("be.visible");
      cy.contains("contact@example.com").should("be.visible");
    });

    it("displays phone contact info", () => {
      cy.mount(<ContactInfo />);
      cy.contains("Téléphone").should("be.visible");
      cy.contains("+33 6 12 34 56 78").should("be.visible");
    });

    it("displays location contact info", () => {
      cy.mount(<ContactInfo />);
      cy.contains("Localisation").should("be.visible");
      cy.contains("Paris, France").should("be.visible");
    });

    it("renders all three contact items", () => {
      cy.mount(<ContactInfo />);
      cy.get(".flex.items-center.gap-4").should("have.length", 3);
    });
  });

  describe("ContactForm Component", () => {
    beforeEach(() => {
      cy.mount(<ContactForm />);
    });

    it("renders all form fields", () => {
      cy.get('input[placeholder="Votre nom"]').should("exist");
      cy.get('input[placeholder="Votre email"]').should("exist");
      cy.get('input[placeholder="Sujet"]').should("exist");
      cy.get('textarea[placeholder="Votre message"]').should("exist");
    });

    it("renders the submit button", () => {
      cy.get('button[type="submit"]').should("contain.text", "Envoyer le message");
    });

    it("allows typing in the name field", () => {
      cy.get('input[placeholder="Votre nom"]')
        .type("John Doe")
        .should("have.value", "John Doe");
    });

    it("allows typing in the email field", () => {
      cy.get('input[placeholder="Votre email"]')
        .type("john@example.com")
        .should("have.value", "john@example.com");
    });

    it("allows typing in the subject field", () => {
      cy.get('input[placeholder="Sujet"]')
        .type("Test Subject")
        .should("have.value", "Test Subject");
    });

    it("allows typing in the message field", () => {
      cy.get('textarea[placeholder="Votre message"]')
        .type("This is a test message")
        .should("have.value", "This is a test message");
    });

    it("has required attribute on name, email, and message fields", () => {
      cy.get('input[placeholder="Votre nom"]').should("have.attr", "required");
      cy.get('input[placeholder="Votre email"]').should("have.attr", "required");
      cy.get('textarea[placeholder="Votre message"]').should("have.attr", "required");
    });

    it("does not require subject field", () => {
      cy.get('input[placeholder="Sujet"]').should("not.have.attr", "required");
    });

    it("has correct maxLength attributes", () => {
      cy.get('input[placeholder="Votre nom"]').should("have.attr", "maxlength", "100");
      cy.get('input[placeholder="Votre email"]').should("have.attr", "maxlength", "255");
      cy.get('input[placeholder="Sujet"]').should("have.attr", "maxlength", "200");
      cy.get('textarea[placeholder="Votre message"]').should("have.attr", "maxlength", "2000");
    });

    it("validates email format", () => {
      cy.get('input[placeholder="Votre email"]').should("have.attr", "type", "email");
    });

    it("can fill and clear form fields", () => {
      cy.get('input[placeholder="Votre nom"]').type("Test Name").clear().should("have.value", "");
      cy.get('input[placeholder="Votre email"]').type("test@test.com").clear().should("have.value", "");
    });
  });

  describe("Form Submission", () => {
    beforeEach(() => {
      cy.mount(<ContactForm />);
    });

    it("disables submit button when form is submitting", () => {
      // Fill required fields
      cy.get('input[placeholder="Votre nom"]').type("John Doe");
      cy.get('input[placeholder="Votre email"]').type("john@example.com");
      cy.get('textarea[placeholder="Votre message"]').type("Test message");

      // Intercept Supabase request
      cy.intercept("POST", "**/rest/v1/contact*", {
        statusCode: 201,
        body: {},
        delay: 1000,
      }).as("submitForm");

      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').should("contain.text", "Envoi en cours...");
    });

    it("shows success toast on successful submission", () => {
      cy.get('input[placeholder="Votre nom"]').type("John Doe");
      cy.get('input[placeholder="Votre email"]').type("john@example.com");
      cy.get('textarea[placeholder="Votre message"]').type("Test message");

      cy.intercept("POST", "**/rest/v1/contact*", {
        statusCode: 201,
        body: {},
      }).as("submitForm");

      cy.get('button[type="submit"]').click();
      cy.wait("@submitForm");
      cy.contains("Message envoyé").should("be.visible");
    });

    it("clears form after successful submission", () => {
      cy.get('input[placeholder="Votre nom"]').type("John Doe");
      cy.get('input[placeholder="Votre email"]').type("john@example.com");
      cy.get('textarea[placeholder="Votre message"]').type("Test message");

      cy.intercept("POST", "**/rest/v1/contact*", {
        statusCode: 201,
        body: {},
      }).as("submitForm");

      cy.get('button[type="submit"]').click();
      cy.wait("@submitForm");

      cy.get('input[placeholder="Votre nom"]').should("have.value", "");
      cy.get('input[placeholder="Votre email"]').should("have.value", "");
      cy.get('textarea[placeholder="Votre message"]').should("have.value", "");
    });

    it("shows error toast on failed submission", () => {
      cy.get('input[placeholder="Votre nom"]').type("John Doe");
      cy.get('input[placeholder="Votre email"]').type("john@example.com");
      cy.get('textarea[placeholder="Votre message"]').type("Test message");

      cy.intercept("POST", "**/rest/v1/contact*", {
        statusCode: 500,
        body: { error: "Server error" },
      }).as("submitFormError");

      cy.get('button[type="submit"]').click();
      cy.wait("@submitFormError");
      cy.contains("Erreur").should("be.visible");
    });
  });

  describe("Accessibility", () => {
    it("form inputs are focusable", () => {
      cy.mount(<ContactForm />);
      cy.get('input[placeholder="Votre nom"]').focus().should("be.focused");
      cy.get('input[placeholder="Votre email"]').focus().should("be.focused");
      cy.get('input[placeholder="Sujet"]').focus().should("be.focused");
      cy.get('textarea[placeholder="Votre message"]').focus().should("be.focused");
    });

    it("submit button is focusable", () => {
      cy.mount(<ContactForm />);
      cy.get('button[type="submit"]').focus().should("be.focused");
    });
  });
});
