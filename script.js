const storageKey = "giveawayParticipants";

const form = document.getElementById("entry-form");
const nameInput = document.getElementById("name");
const participantList = document.getElementById("participant-list");
const feedback = document.getElementById("feedback");
const participantCount = document.getElementById("participant-count");

const getStoredParticipants = () => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error("Invalid data type");
    }
    return parsed.filter((item) => typeof item === "string");
  } catch (error) {
    console.error("Kon opgeslagen deelnemers niet lezen:", error);
    localStorage.removeItem(storageKey);
    return [];
  }
};

const saveParticipants = (participants) => {
  localStorage.setItem(storageKey, JSON.stringify(participants));
};

const createParticipantItem = (name, index) => {
  const li = document.createElement("li");
  li.textContent = name;

  const position = document.createElement("span");
  position.textContent = `#${index + 1}`;
  li.appendChild(position);

  return li;
};

const renderParticipants = () => {
  const participants = getStoredParticipants();
  participantList.innerHTML = "";

  if (participants.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = "Nog niemand heeft zich ingeschreven.";
    participantList.appendChild(empty);
  } else {
    participants.forEach((name, index) => {
      participantList.appendChild(createParticipantItem(name, index));
    });
  }

  participantCount.textContent = participants.length.toString();
};

const setFeedback = (message, type) => {
  feedback.textContent = message;
  feedback.className = "feedback";

  if (type === "error") {
    feedback.classList.add("feedback--error");
  }

  if (type === "success") {
    feedback.classList.add("feedback--success");
  }
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();

  if (!name) {
    setFeedback("Vul alsjeblieft je naam in.", "error");
    nameInput.focus();
    return;
  }

  const participants = getStoredParticipants();
  const normalized = name.toLocaleLowerCase();
  const alreadyExists = participants.some(
    (item) => item.toLocaleLowerCase() === normalized
  );

  if (alreadyExists) {
    setFeedback("Deze naam staat al op de lijst.", "error");
    nameInput.select();
    return;
  }

  const updated = [...participants, name];
  saveParticipants(updated);
  renderParticipants();
  setFeedback("Je bent succesvol ingeschreven!", "success");
  form.reset();
  nameInput.focus();
});

window.addEventListener("DOMContentLoaded", () => {
  renderParticipants();
});
