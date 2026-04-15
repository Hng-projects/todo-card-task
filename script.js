document.addEventListener("DOMContentLoaded", () => {
  const nowOffset = Date.now() + 3 * 24 * 60 * 60 * 1000;
  const dueDate = new Date(nowOffset);

  const timeRemainingEl = document.querySelector(
    '[data-testid="test-todo-time-remaining"]',
  );
  const dueDateEl = document.querySelector(
    '[data-testid="test-todo-due-date"]',
  );

  const options = { month: "short", day: "numeric", year: "numeric" };
  dueDateEl.textContent = `Due ${dueDate.toLocaleDateString("en-US", options)}`;
  dueDateEl.setAttribute("datetime", dueDate.toISOString());

  function updateTimeRemaining() {
    const now = new Date();
    const diffMs = dueDate - now;

    if (Math.abs(diffMs) < 60000) {
      timeRemainingEl.textContent = "Due now!";
      return;
    }

    const isOverdue = diffMs < 0;
    const absDiff = Math.abs(diffMs);

    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

    let timeStr = "";

    if (days >= 2) {
      timeStr = `${days} days`;
    } else if (days === 1) {
      timeStr = "tomorrow";
    } else if (hours > 0) {
      timeStr = `${hours} hours`;
    } else {
      timeStr = `${minutes} minutes`;
    }

    if (isOverdue) {
      timeRemainingEl.textContent = `Overdue by ${timeStr}`;
      timeRemainingEl.style.color = "var(--badge-high-text)";
    } else {
      if (days === 1) {
        timeRemainingEl.textContent = "Due tomorrow";
      } else {
        timeRemainingEl.textContent = `Due in ${timeStr}`;
      }
    }
  }

  updateTimeRemaining();
});
