let selectedText = "";
let scrollTimeout;

document.addEventListener("mouseup", handleTextSelection);
window.addEventListener("scroll", handleScroll);

function handleTextSelection(event) {
  const selection = window.getSelection();
  selectedText = selection.toString().trim();

  if (selectedText.length > 0) {
    showPopup(event);
  } else {
    hidePopup();
  }
}

function handleScroll() {
 
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  // Set a new timeout
  scrollTimeout = setTimeout(() => {
    hidePopup();
  }, 100); 
}

function showPopup(event) {
  let popup = document.getElementById("text-selection-popup");
  if (!popup) {
    popup = createPopup();
    document.body.appendChild(popup);
  }

  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  const popupHeight = 40; 
  let topPosition = rect.top + window.scrollY - popupHeight - 5;

  
  if (topPosition < window.scrollY) {
    topPosition = rect.bottom + window.scrollY + 5; 
  }

  popup.style.left = `${rect.left + window.scrollX}px`;
  popup.style.top = `${topPosition}px`;
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
