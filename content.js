let selectedText = "";
let popup = null;

document.addEventListener("mouseup", handleMouseUp);
document.addEventListener("selectionchange", handleSelectionChange);
window.addEventListener("scroll", handleScroll);

function isEditableElement(element) {
  if (!element) return false;

  if (
    element.tagName === "INPUT" ||
    element.tagName === "TEXTAREA" ||
    element.tagName === "SELECT"
  )
    return true;

  if (element.isContentEditable || element.contentEditable === "true")
    return true;

  if (element.ownerDocument && element.ownerDocument.designMode === "on")
    return true;

  const role = element.getAttribute("role");
  if (role === "textbox" || role === "searchbox" || role === "combobox")
    return true;

  const classAndId = (element.className + " " + element.id).toLowerCase();
  if (
    classAndId.includes("search") ||
    classAndId.includes("input") ||
    classAndId.includes("textarea")
  )
    return true;

  return false;
}

function handleMouseUp(event) {
  setTimeout(() => {
    let currentElement = event.target;
    while (currentElement) {
      if (isEditableElement(currentElement)) {
        hidePopup();
        return;
      }
      currentElement = currentElement.parentElement;
    }

    const selection = window.getSelection();
    selectedText = selection.toString().trim();

    if (selectedText.length > 0) {
      showPopup(event);
    } else {
      hidePopup();
    }
  }, 0);
}

function handleSelectionChange() {
  const selection = window.getSelection();
  if (selection.toString().trim().length === 0) {
    hidePopup();
  }
}

function handleScroll() {
  hidePopup();
}

function showPopup(event) {
  if (!popup) {
    popup = createPopup();
    document.body.appendChild(popup);
  }

  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  const popupHeight = 40;
  const popupWidth = 100;

  let topPosition = rect.top + window.scrollY - popupHeight - 5;
  let leftPosition = rect.left + window.scrollX + (rect.width - popupWidth) / 2;

  if (topPosition < window.scrollY) {
    topPosition = rect.bottom + window.scrollY + 5;
  }
  if (leftPosition < window.scrollX) {
    leftPosition = window.scrollX + 5;
  } else if (leftPosition + popupWidth > window.innerWidth + window.scrollX) {
    leftPosition = window.innerWidth + window.scrollX - popupWidth - 5;
  }

  popup.style.left = `${leftPosition}px`;
  popup.style.top = `${topPosition}px`;
  popup.style.display = "flex";
}
function createPopup() {
  const popup = document.createElement("div");
  popup.id = "text-selection-popup";
  popup.style.position = "absolute";
  popup.style.zIndex = "1000";
  popup.style.background = "#fff";
  popup.style.border = "1px solid #ccc";
  popup.style.borderRadius = "4px";
  popup.style.padding = "5px";
  popup.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";

  const copyButton = createButton("Copy", copyText);
  const searchButton = createButton("Search", searchText);

  popup.appendChild(copyButton);
  popup.appendChild(searchButton);

  return popup;
}

function createButton(text, onClick) {
  const button = document.createElement("button");
  button.textContent = text;
  button.style.marginRight = "5px";
  button.style.padding = "5px 10px";
  button.style.border = "none";
  button.style.background = "#f0f0f0";
  button.style.cursor = "pointer";
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    onClick();
  });
  return button;
}

function copyText() {
  navigator.clipboard
    .writeText(selectedText)
    .then(() => {
      console.log("Text copied to clipboard");
      hidePopup();
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
}

function searchText() {
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    selectedText
  )}`;
  window.open(searchUrl, "_blank");
  hidePopup();
}

function hidePopup() {
  if (popup) {
    popup.style.display = "none";
  }
}

document.addEventListener("mousedown", (event) => {
  if (popup && popup.contains(event.target)) {
    event.preventDefault();
  }
});
