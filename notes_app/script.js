const addBox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box"),
  popupTitle = popupBox.querySelector("header p"),
  closeIcon = popupBox.querySelector("header i"),
  titleTag = popupBox.querySelector("input"),
  descTag = popupBox.querySelector("textarea"),
  addBtn = popupBox.querySelector("button");

// Array of month names
const months = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];
// Retrieve notes from localStorage or initialize an empty array
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
// Flags and ID for note updates
let isUpdate = false, updateId;
// Open the popup box to add a new note
addBox.addEventListener("click", () => {
  popupTitle.innerText = "Add a new Note";
  addBtn.innerText = "Add Note";
  popupBox.classList.add("show");
  document.querySelector("body").style.overflow = "hidden";
  if (window.innerWidth > 660) titleTag.focus();
});
// Close the popup box and reset fields
closeIcon.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = descTag.value = "";
  popupBox.classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
});
// Show existing notes from localStorage
function showNotes() {
  if (!notes?.length) return;
  // Remove existing notes efficiently
  document.querySelectorAll(".note").forEach(el => el.remove());  
  // Build all HTML at once
  const notesHTML = notes.map((note, id) => 
    `<li class="note">
      <div class="details">
        <p>${note.title}</p>
        <span>${note.description.replaceAll("\n", '<br/>')}</span>
      </div>
      <div class="bottom-content">
        <span>${note.date}</span>
        <div class="settings">
          <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
          <ul class="menu">
            <li onclick="updateNote(${id}, '${note.title}', '${note.description.replaceAll("\n", '<br/>')}')">
              <i class="uil uil-pen"></i>Edit
            </li>
            <li onclick="deleteNote(${id})">
              <i class="uil uil-trash"></i>Delete
            </li>
          </ul>
        </div>
      </div>
    </li>`
  ).join('');
  addBox.insertAdjacentHTML("afterend", notesHTML);
}
showNotes();
// Show menu options for each note
function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", e => {
    if (e.target.tagName !== "I" || e.target !== elem) { // Use !== instead of !=
      elem.parentElement.classList.remove("show");
    }
  });
}
// Delete a specific note
function deleteNote(noteId) {
  const confirmDel = confirm("Are you sure you want to delete this note?"); // Use const
  if (!confirmDel) return;
  notes.splice(noteId, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  setTimeout(() => showNotes(), 0);
}
// Update a specific note
function updateNote(noteId, title, filterDesc) {
  const description = filterDesc.replaceAll('<br/>', '\n'); // Use \n instead of \r\n
  updateId = noteId;
  isUpdate = true;
  addBox.click();
  titleTag.value = title;
  descTag.value = description;
  popupTitle.innerText = "Update a Note";
  addBtn.innerText = "Update Note";
}
// Add or update a note on button click
addBtn.addEventListener("click", e => {
  e.preventDefault();
  const title = titleTag.value.trim(); 
  const description = descTag.value.trim(); 
  
  if (title || description) {
    const currentDate = new Date();
    const month = months[currentDate.getMonth()]; 
    const day = currentDate.getDate(); 
    const year = currentDate.getFullYear();
    const noteInfo = { title, description, date: `${month} ${day}, ${year}` }; // Use const
    
    if (!isUpdate) {
      notes.push(noteInfo);
    } else {
      isUpdate = false;
      notes[updateId] = noteInfo;
    }
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
    closeIcon.click();
  }
});