const DUE_DATE = new Date("2026-04-16T18:00:00Z");

function getTimeRemaining() {
  const diff = DUE_DATE - Date.now();
  const abs = Math.abs(diff);
  const mins = Math.round(abs / 60_000);
  const hrs = Math.round(abs / 3_600_000);
  const days = Math.round(abs / 86_400_000);
  console.log(days);

  if (diff < 0) {
    if (mins < 60)
      return {
        text: `Overdue by ${mins} min${mins !== 1 ? "s" : ""}`,
        cls: "overdue",
      };
    if (hrs < 24)
      return {
        text: `Overdue by ${hrs} hour${hrs !== 1 ? "s" : ""}`,
        cls: "overdue",
      };
    return {
      text: `Overdue by ${days} day${days !== 1 ? "s" : ""}`,
      cls: "overdue",
    };
  }
  if (mins < 2) return { text: "Due now!", cls: "due-soon" };
  if (mins < 60)
    return {
      text: `Due in ${mins} min${mins !== 1 ? "s" : ""}`,
      cls: "due-soon",
    };
  if (days === 0) return { text: "Due today", cls: "due-soon" };
  if (days === 1) return { text: "Due tomorrow", cls: "due-soon" };
  return { text: `Due in ${days} day${days !== 1 ? "s" : ""}`, cls: "" };
}

function updateTimeRemaining() {
  const { text, cls } = getTimeRemaining();
  const wrap = document.getElementById("time-remaining");
  const span = document.getElementById("time-text");
  span.textContent = text;
  wrap.className = cls; // reset then add class
  wrap.setAttribute("aria-label", text);
}

updateTimeRemaining();
setInterval(updateTimeRemaining, 60_000); // refresh every minute

/* ── Checkbox toggle behaviour ── */
const checkbox = document.getElementById("todo-toggle");
const titleEl = document.getElementById("todo-title");
const statusEl = document.getElementById("todo-status");

checkbox.addEventListener("change", function () {
  if (this.checked) {
    titleEl.classList.add("done");
    statusEl.textContent = "Done";
    statusEl.className = "badge status-done";
    statusEl.setAttribute("aria-label", "Status: Done");
  } else {
    titleEl.classList.remove("done");
    statusEl.textContent = "In Progress";
    statusEl.className = "badge status-progress";
    statusEl.setAttribute("aria-label", "Status: In Progress");
  }
});
