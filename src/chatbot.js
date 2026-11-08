const ownerEmail = "collinsomondi825@gmail.com";
const ownerWhatsApp = "254743100829";
const serviceOptions = [
  { value: "Web Development", label: "Web Development — from $150" },
  { value: "Mobile Development", label: "Mobile Development — from $700" },
  { value: "UI/UX Design & Prototyping", label: "UI/UX Design & Prototyping — from $700" },
  { value: "Other inquiry", label: "Other inquiry" },
];

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function createChatIcon() {
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "2");
  icon.setAttribute("stroke-linecap", "round");
  icon.setAttribute("stroke-linejoin", "round");
  icon.setAttribute("aria-hidden", "true");

  const bubble = document.createElementNS(icon.namespaceURI, "path");
  bubble.setAttribute("d", "M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z");
  icon.append(bubble);
  return icon;
}

function createAssistant() {
  if (document.getElementById("service-chat")) return;

  const widget = createElement("section", "service-chat");
  widget.id = "service-chat";
  widget.setAttribute("aria-label", "Service chat assistant");

  const launcher = createElement("button", "service-chat__launcher");
  launcher.type = "button";
  launcher.setAttribute("aria-label", "Open chat assistant");
  launcher.setAttribute("aria-expanded", "false");
  launcher.setAttribute("aria-controls", "service-chat-panel");
  launcher.append(createChatIcon());

  const panel = createElement("div", "service-chat__panel");
  panel.id = "service-chat-panel";
  panel.hidden = true;

  const header = createElement("div", "service-chat__header");
  const heading = createElement("div", "service-chat__heading");
  const title = createElement("h2", "", "Collins’ Assistant");
  const subtitle = createElement("p", "", "Services, pricing & project inquiries");
  const closeButton = createElement("button", "service-chat__close", "×");
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close chat assistant");
  heading.append(title, subtitle);
  header.append(heading, closeButton);

  const messages = createElement("div", "service-chat__messages");
  messages.setAttribute("role", "log");
  messages.setAttribute("aria-live", "polite");
  messages.setAttribute("aria-relevant", "additions text");

  const quickReplies = createElement("div", "service-chat__quick-replies");
  [
    ["Services & prices", "What services do you offer and what do they cost?"],
    ["Request a quote", "quote"],
    ["Contact Collins", "contact"],
  ].forEach(([label, prompt]) => {
    const button = createElement("button", "service-chat__chip", label);
    button.type = "button";
    button.addEventListener("click", () => handlePrompt(prompt));
    quickReplies.append(button);
  });

  const composer = createElement("form", "service-chat__composer");
  const input = createElement("input", "service-chat__input");
  input.type = "text";
  input.name = "question";
  input.placeholder = "Type your question…";
  input.autocomplete = "off";
  input.setAttribute("aria-label", "Type your question");
  input.required = true;
  const sendButton = createElement("button", "service-chat__send", "Send");
  sendButton.type = "submit";
  composer.append(input, sendButton);

  panel.append(header, messages, quickReplies, composer);
  widget.append(launcher, panel);
  document.body.append(widget);

  function addMessage(text, sender = "assistant") {
    const message = createElement("p", `service-chat__message service-chat__message--${sender}`, text);
    messages.append(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
  }

  function appendHandoffLinks(details) {
    const note = createElement("p", "service-chat__handoff-note", "Choose WhatsApp or email to send your inquiry. Nothing is sent until you choose a link.");
    const links = createElement("div", "service-chat__handoff-links");
    const subject = "Portfolio service inquiry";
    const email = document.createElement("a");
    email.href = `mailto:${ownerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(details)}`;
    email.textContent = "Send by email";

    const whatsapp = document.createElement("a");
    whatsapp.href = `https://wa.me/${ownerWhatsApp}?text=${encodeURIComponent(details)}`;
    whatsapp.target = "_blank";
    whatsapp.rel = "noopener noreferrer";
    whatsapp.textContent = "Send on WhatsApp";
    links.append(email, whatsapp);
    messages.append(note, links);
    messages.scrollTop = messages.scrollHeight;
  }

  function showQuoteForm() {
    const form = createElement("form", "service-chat__quote-form");
    const heading = createElement("p", "service-chat__quote-heading", "Tell Collins a little about your project");
    const service = createElement("select", "service-chat__input");
    service.name = "service";
    service.required = true;
    const placeholder = createElement("option", "", "Choose a service");
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = true;
    service.append(placeholder);
    serviceOptions.forEach(({ value, label }) => {
      const option = createElement("option", "", label);
      option.value = value;
      service.append(option);
    });

    const name = createElement("input", "service-chat__input");
    name.name = "name";
    name.placeholder = "Your name";
    name.autocomplete = "name";
    name.required = true;
    const contact = createElement("input", "service-chat__input");
    contact.name = "contact";
    contact.placeholder = "Your email or phone";
    contact.autocomplete = "email";
    contact.required = true;
    const details = createElement("textarea", "service-chat__input service-chat__textarea");
    details.name = "details";
    details.placeholder = "Briefly describe what you need";
    details.rows = 3;
    details.required = true;
    const submit = createElement("button", "service-chat__send service-chat__quote-submit", "Prepare inquiry");
    submit.type = "submit";
    form.append(heading, service, name, contact, details, submit);
    messages.append(form);
    messages.scrollTop = messages.scrollHeight;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const inquiry = new FormData(form);
      const summary = [
        "New portfolio inquiry",
        `Service: ${inquiry.get("service")}`,
        `Name: ${inquiry.get("name")}`,
        `Contact: ${inquiry.get("contact")}`,
        `Project details: ${inquiry.get("details")}`,
      ].join("\n");
      form.remove();
      addMessage("Thanks. Your inquiry is ready. Choose how you’d like to send it.");
      appendHandoffLinks(summary);
    });
  }

  function handlePrompt(prompt) {
    addMessage(prompt === "quote" ? "I’d like to request a quote." : prompt === "contact" ? "I’d like to contact Collins." : prompt, "user");
    const query = prompt.toLowerCase();

    if (query === "quote" || /\b(quote|hire|book|start a project|work with you|need a website|need an app)\b/.test(query)) {
      addMessage("Sure. Share a few details and I’ll prepare an inquiry for Collins.");
      showQuoteForm();
    } else if (/\b(price|prices|pricing|cost|costs|charge|charges|rate|rates|how much|budget)\b/.test(query)) {
      addMessage("Starting prices: Web development from $150, mobile development from $700, and UI/UX design & prototyping from $700. Final pricing depends on the project’s scope and requirements. Request a quote to discuss your project.");
    } else if (/\b(service|services|web|website|frontend|landing page|mobile|app|design|ui|ux|prototype)\b/.test(query)) {
      addMessage("Services include web development (business sites, landing pages and web apps), mobile development (mobile-friendly apps and React Native), and UI/UX design & prototyping (research, interface design and usability improvements). Starting prices are $150 for web development and $700 for mobile development or UI/UX. What would you like to build?");
    } else if (/\b(contact|email|call|phone|whatsapp|collins|human|person)\b/.test(query)) {
      addMessage(`You can reach Collins at ${ownerEmail} or +254 743 100 829 on WhatsApp. I can also prepare an inquiry for you to send.`);
      showQuoteForm();
    } else {
      addMessage("I can help with services, starting prices, or preparing a project inquiry. For questions that need a personal answer, share your details and Collins can follow up.");
      const quoteButton = createElement("button", "service-chat__chip", "Prepare an inquiry");
      quoteButton.type = "button";
      quoteButton.addEventListener("click", () => {
        addMessage("I’d like to prepare an inquiry.", "user");
        showQuoteForm();
      });
      messages.append(quoteButton);
    }

    messages.scrollTop = messages.scrollHeight;
  }

  addMessage("Hi! I’m Collins’ virtual assistant. Ask me about services and starting prices, or request a quote.");

  launcher.addEventListener("click", () => {
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    input.focus();
  });

  closeButton.addEventListener("click", () => {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus();
  });

  composer.addEventListener("submit", (event) => {
    event.preventDefault();
    const prompt = input.value.trim();
    if (!prompt) return;
    input.value = "";
    handlePrompt(prompt);
  });

  widget.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) {
      panel.hidden = true;
      launcher.setAttribute("aria-expanded", "false");
      launcher.focus();
    }
  });
}

createAssistant();
