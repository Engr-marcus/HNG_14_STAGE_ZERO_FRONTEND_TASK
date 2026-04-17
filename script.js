const state = {
  title: "Advanced Todo Card (Interactive and Stateful)",
  description:
    `Overview: In Stage 1, you will extend your Stage 0 Todo Card into a more interactive, stateful, and slightly more “app-like” component. You are still building a single Todo Card, not a full app. The card should now support: 
    Editable content 
    Status transitions 
    Priority changes 
    Expand / collapse behavior 
    More dynamic time handling 
    Slightly richer accessibility patterns`,
  priority: "High",
  status: "In Progress",
  dueDate: new Date("2026-04-17T18:00:00Z"),
};

// Snapshot for cancel
let snapshot = { ...state };

/* ── Element refs ── */
const card = document.getElementById("todo-card");
const titleEl = document.getElementById("todo-title");
const descEl = document.getElementById("todo-description");
const priorityBadge = document.getElementById("todo-priority");
const priorityInd = document.getElementById("priority-indicator");
const statusBadge = document.getElementById("todo-status");
const statusControl = document.getElementById("status-control");
const overdueInd = document.getElementById("overdue-indicator");
const timeEl = document.getElementById("time-remaining");
const timeText = document.getElementById("time-text");
const dueDateText = document.getElementById("due-date-text");
const dueDateDisplay = document.getElementById("due-date-display");
const checkbox = document.getElementById("todo-toggle");
const editBtn = document.getElementById("edit-btn");
const deleteBtn = document.getElementById("delete-btn");
const editForm = document.getElementById("edit-form");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");
const collapsible = document.getElementById("collapsible-section");
const expandToggle = document.getElementById("expand-toggle");
const expandLabel = document.getElementById("expand-label");
const expandArrow = expandToggle.querySelector(".expand-arrow");
const editTitleInput = document.getElementById("edit-title-input");
const editDescInput = document.getElementById("edit-description-input");
const editPriority = document.getElementById("edit-priority-select");
const editDueDate = document.getElementById("edit-due-date-input");

const COLLAPSE_THRESHOLD = 120; // chars

/* ══════════════════════════════════
       RENDER — apply state to DOM
    ══════════════════════════════════ */
function render() {
  const p = state.priority;
  const s = state.status;
  const isDone = s === "Done";

  /* Title */
  titleEl.textContent = state.title;
  titleEl.classList.toggle("done", isDone);

  /* Description */
  descEl.textContent = state.description;
  descEl.classList.toggle("done", isDone);

  /* Priority badge */
  priorityBadge.textContent = p;
  priorityBadge.className = "badge priority-" + p.toLowerCase();
  priorityBadge.setAttribute("aria-label", "Priority level: " + p);

  /* Priority indicator */
  priorityInd.className = "ind-" + p.toLowerCase();
  priorityInd.innerHTML = `<span class="priority-dot dot-${p.toLowerCase()}" aria-hidden="true"></span>${p}`;
  priorityInd.setAttribute("aria-label", "Priority: " + p);

  /* Card border accent */
  card.classList.remove("priority-low", "priority-medium", "priority-high");
  card.classList.add("priority-" + p.toLowerCase());

  /* Status badge + control */
  const stKey = s === "In Progress" ? "progress" : s.toLowerCase();
  statusBadge.textContent = s;
  statusBadge.className = "badge st-" + stKey;
  statusBadge.setAttribute("aria-label", "Status: " + s);
  statusControl.value = s;
  statusControl.className = "st-" + stKey;

  /* Checkbox */
  checkbox.checked = isDone;

  /* Card done state */
  card.classList.toggle("done-card", isDone);

  /* Due date display */
  const opts = { month: "short", day: "numeric", year: "numeric" };
  dueDateText.textContent =
    "Due " + state.dueDate.toLocaleDateString("en-US", opts);
  dueDateDisplay.setAttribute("datetime", state.dueDate.toISOString());

  /* Show/hide expand toggle based on length */
  const needsCollapse = state.description.length > COLLAPSE_THRESHOLD;
  expandToggle.style.display = needsCollapse ? "inline-flex" : "none";
  if (!needsCollapse) {
    collapsible.classList.remove("collapsed");
    collapsible.classList.add("expanded");
  }

  updateTimeDisplay();
}

/* ══════════════════════════════════
       TIME REMAINING
    ══════════════════════════════════ */
function getTimeInfo() {
  if (state.status === "Done")
    return { text: "Completed", cls: "done-state", overdue: false };
  const diff = state.dueDate - Date.now();
  const abs = Math.abs(diff);
  const mins = Math.round(abs / 60_000);
  const hrs = Math.round(abs / 3_600_000);
  const days = Math.round(abs / 86_400_000);
  if (diff < 0) {
    let text;
    if (mins < 60) text = `Overdue by ${mins} min${mins !== 1 ? "s" : ""}`;
    else if (hrs < 24) text = `Overdue by ${hrs} hour${hrs !== 1 ? "s" : ""}`;
    else text = `Overdue by ${days} day${days !== 1 ? "s" : ""}`;
    return { text, cls: "overdue", overdue: true };
  }
  if (mins < 2) return { text: "Due now!", cls: "due-soon", overdue: false };
  if (mins < 60)
    return {
      text: `Due in ${mins} minute${mins !== 1 ? "s" : ""}`,
      cls: "due-soon",
      overdue: false,
    };
  if (hrs < 24)
    return {
      text: `Due in ${hrs} hour${hrs !== 1 ? "s" : ""}`,
      cls: "due-soon",
      overdue: false,
    };
  if (days === 1)
    return { text: "Due tomorrow", cls: "due-soon", overdue: false };
  return {
    text: `Due in ${days} day${days !== 1 ? "s" : ""}`,
    cls: "",
    overdue: false,
  };
}

function updateTimeDisplay() {
  const { text, cls, overdue } = getTimeInfo();
  timeText.textContent = text;
  timeEl.className = cls;
  timeEl.setAttribute("aria-label", text);
  overdueInd.classList.toggle("visible", overdue);
  card.classList.toggle("overdue-card", overdue && state.status !== "Done");
}

setInterval(updateTimeDisplay, 30_000);

/* ══════════════════════════════════
       STATUS SYNC
    ══════════════════════════════════ */
function setStatus(newStatus) {
  state.status = newStatus;
  render();
}

/* Checkbox */
checkbox.addEventListener("change", () => {
  setStatus(checkbox.checked ? "Done" : "Pending");
});

/* Status dropdown */
statusControl.addEventListener("change", () => {
  setStatus(statusControl.value);
});

/* ══════════════════════════════════
       EXPAND / COLLAPSE
    ══════════════════════════════════ */
let isExpanded = false;

expandToggle.addEventListener("click", () => {
  isExpanded = !isExpanded;
  collapsible.classList.toggle("collapsed", !isExpanded);
  collapsible.classList.toggle("expanded", isExpanded);
  expandToggle.setAttribute("aria-expanded", String(isExpanded));
  expandLabel.textContent = isExpanded ? "Show less" : "Show more";
  expandArrow.classList.toggle("up", isExpanded);
});

/* ══════════════════════════════════
       EDIT MODE
    ══════════════════════════════════ */
function openEdit() {
  snapshot = { ...state, dueDate: new Date(state.dueDate) };
  editTitleInput.value = state.title;
  editDescInput.value = state.description;
  editPriority.value = state.priority;
  editDueDate.value = state.dueDate.toISOString().split("T")[0];
  editForm.classList.add("visible");
  editBtn.setAttribute("aria-expanded", "true");
  // Move focus into form
  setTimeout(() => editTitleInput.focus(), 50);
}

function closeEdit() {
  editForm.classList.remove("visible");
  editBtn.setAttribute("aria-expanded", "false");
  editBtn.focus();
}

editBtn.addEventListener("click", openEdit);

saveBtn.addEventListener("click", () => {
  const newTitle = editTitleInput.value.trim();
  if (!newTitle) {
    editTitleInput.focus();
    return;
  }
  state.title = newTitle;
  state.description = editDescInput.value.trim();
  state.priority = editPriority.value;
  const d = editDueDate.value;
  if (d) state.dueDate = new Date(d + "T18:00:00Z");
  // Reset expand state since description may have changed
  isExpanded = false;
  collapsible.classList.add("collapsed");
  collapsible.classList.remove("expanded");
  expandToggle.setAttribute("aria-expanded", "false");
  expandLabel.textContent = "Show more";
  expandArrow.classList.remove("up");
  render();
  closeEdit();
});

cancelBtn.addEventListener("click", () => {
  Object.assign(state, snapshot, { dueDate: new Date(snapshot.dueDate) });
  render();
  closeEdit();
});

/* Focus trap in edit form */
editForm.addEventListener("keydown", (e) => {
  if (e.key !== "Tab") return;
  const focusable = editForm.querySelectorAll("input,textarea,select,button");
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

/* Escape closes edit */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && editForm.classList.contains("visible")) {
    Object.assign(state, snapshot, {
      dueDate: new Date(snapshot.dueDate),
    });
    render();
    closeEdit();
  }
});

/* ══════════════════════════════════
       DELETE
    ══════════════════════════════════ */
deleteBtn.addEventListener("click", () => {
  alert("Delete clicked — in a real app this would remove the task.");
});

/* ══════════════════════════════════
       INIT
    ══════════════════════════════════ */
render();
