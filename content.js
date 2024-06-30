let selectedText = "";

document.addEventListener("mouseup", handleTextSelection);

function handleTextSelection(event) {
  const selection = window.getSelection();
  selectedText = selection.toString().trim();

  if (selectedText.length > 0) {
    showPopup(event);
  } else {
    hidePopup();
  }
}

function showPopup(event) {
  let popup = document.getElementById("text-selection-popup");
  if (!popup) {
    popup = createPopup();
    document.body.appendChild(popup);
  }

  const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
  popup.style.left = `${event.pageX}px`;
  popup.style.top = `${rect.bottom + window.scrollY}px`;
  popup.style.display = "flex";

  document.addEventListener("mousedown", hidePopupOnClickOutside);
}

function createPopup() {
  const popup = document.createElement("div");
  popup.id = "text-selection-popup";

  const copyButton = createButton("Copy", copyText);
  const searchButton = createButton("Search", searchText);

  popup.appendChild(copyButton);
  popup.appendChild(searchButton);

  return popup;
}

function createButton(text, onClick) {
  const button = document.createElement("button");
  button.textContent = text;
  button.addEventListener("click", onClick);
  return button;
}

function hidePopupOnClickOutside(event) {
  const popup = document.getElementById("text-selection-popup");
  if (popup && !popup.contains(event.target)) {
    hidePopup();
  }
}

function copyText() {
  navigator.clipboard
    .writeText(selectedText)
    .then(() => {
      console.log("Text copied to clipboard");
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
  hidePopup();
}

function searchText() {
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    selectedText
  )}`;
  window.open(searchUrl, "_blank");
  hidePopup();
}

function hidePopup() {
  const popup = document.getElementById("text-selection-popup");
  if (popup) {
    popup.style.display = "none";
  }
  document.removeEventListener("mousedown", hidePopupOnClickOutside);
}
