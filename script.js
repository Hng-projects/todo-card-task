document.addEventListener("DOMContentLoaded", () => {
  const card = document.querySelector('[data-testid="test-todo-card"]');
  const viewMode = document.getElementById("view-mode");
  const editMode = document.getElementById("edit-mode");

  const titleEl = document.querySelector('[data-testid="test-todo-title"]');
  const descEl = document.querySelector(
    '[data-testid="test-todo-description"]',
  );
  const priorityEl = document.querySelector(
    '[data-testid="test-todo-priority"]',
  );
  const priorityIndicator = document.querySelector(
    '[data-testid="test-todo-priority-indicator"]',
  );
  const dueDateEl = document.querySelector(
    '[data-testid="test-todo-due-date"]',
  );
  const timeRemainingEl = document.querySelector(
    '[data-testid="test-todo-time-remaining"]',
  );
  const overdueBadge = document.querySelector(
    '[data-testid="test-todo-overdue-indicator"]',
  );

  const statusSelect = document.querySelector(
    '[data-testid="test-todo-status-control"]',
  );
  const statusSpan = document.querySelector('[data-testid="test-todo-status"]');
  const checkbox = document.querySelector(
    '[data-testid="test-todo-complete-toggle"]',
  );
  const editBtn = document.querySelector(
    '[data-testid="test-todo-edit-button"]',
  );
  const deleteBtn = document.querySelector(
    '[data-testid="test-todo-delete-button"]',
  );
  const expandToggle = document.querySelector(
    '[data-testid="test-todo-expand-toggle"]',
  );
  const collapsibleSection = document.querySelector(
    '[data-testid="test-todo-collapsible-section"]',
  );

  const form = document.querySelector('[data-testid="test-todo-edit-form"]');
  const editTitleInput = document.querySelector(
    '[data-testid="test-todo-edit-title-input"]',
  );
  const editDescInput = document.querySelector(
    '[data-testid="test-todo-edit-description-input"]',
  );
  const editPrioritySelect = document.querySelector(
    '[data-testid="test-todo-edit-priority-select"]',
  );
  const editDueDateInput = document.querySelector(
    '[data-testid="test-todo-edit-due-date-input"]',
  );
  const cancelBtn = document.querySelector(
    '[data-testid="test-todo-cancel-button"]',
  );

  let currentDueDate = new Date(
    Date.now() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000,
  ); // Default: 3 days and 4 hours ahead.
  let isEditing = false;
  let timerInterval = null;

  function formatDateTimeLocal(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  function initDates() {
    const options = {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    };
    dueDateEl.textContent = `Due ${currentDueDate.toLocaleDateString("en-US", options)}`;
    dueDateEl.setAttribute("datetime", currentDueDate.toISOString());
  }

  function updateTimeRemaining() {
    const status = statusSelect.value;
    if (status === "Done") {
      timeRemainingEl.textContent = "Completed";
      overdueBadge.classList.add("hidden");
      timeRemainingEl.style.color = "var(--text-secondary)";
      return;
    }

    const now = new Date();
    const diffMs = currentDueDate - now;
    const isOverdue = diffMs < 0;
    const absDiff = Math.abs(diffMs);

    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (isOverdue) {
      overdueBadge.classList.remove("hidden");
      timeRemainingEl.style.color = "var(--badge-high-text)";

      if (days > 0) timeRemainingEl.textContent = `Overdue by ${days} days`;
      else if (hours > 0)
        timeRemainingEl.textContent = `Overdue by ${hours} hours`;
      else timeRemainingEl.textContent = `Overdue by ${minutes} minutes`;
    } else {
      overdueBadge.classList.add("hidden");
      timeRemainingEl.style.color = "var(--text-secondary)";

      if (absDiff < 60000) {
        timeRemainingEl.textContent = "Due now!";
      } else if (days >= 2) {
        timeRemainingEl.textContent = `Due in ${days} days`;
      } else if (days === 1) {
        timeRemainingEl.textContent = "Due tomorrow";
      } else if (hours > 0) {
        timeRemainingEl.textContent = `Due in ${hours} hours`;
      } else {
        timeRemainingEl.textContent = `Due in ${minutes} minutes`;
      }
    }
  }

  function startTimer() {
    updateTimeRemaining();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimeRemaining, 30000);
  }

  function updatePriority(level) {
    priorityEl.textContent = level;
    priorityEl.setAttribute("aria-label", `Priority: ${level}`);

    priorityEl.classList.remove(
      "priority-low",
      "priority-medium",
      "priority-high",
    );
    priorityIndicator.classList.remove(
      "priority-indicator-low",
      "priority-indicator-medium",
      "priority-indicator-high",
    );

    if (level === "Low") {
      priorityEl.classList.add("priority-low");
      priorityIndicator.classList.add("priority-indicator-low");
    } else if (level === "Medium") {
      priorityEl.classList.add("priority-medium");
      priorityIndicator.classList.add("priority-indicator-medium");
    } else {
      priorityEl.classList.add("priority-high");
      priorityIndicator.classList.add("priority-indicator-high");
    }
  }

  function updateStatus(status) {
    statusSpan.textContent = status;
    statusSelect.value = status;

    statusSelect.classList.remove(
      "status-pending",
      "status-progress",
      "status-done",
    );
    card.classList.remove("in-progress", "done");

    if (status === "Done") {
      statusSelect.classList.add("status-done");
      card.classList.add("done");
      checkbox.checked = true;
    } else if (status === "In Progress") {
      statusSelect.classList.add("status-progress");
      card.classList.add("in-progress");
      checkbox.checked = false;
    } else {
      statusSelect.classList.add("status-pending");
      checkbox.checked = false;
    }

    updateTimeRemaining();
  }

  statusSelect.addEventListener("change", (e) => {
    updateStatus(e.target.value);
  });

  checkbox.addEventListener("change", (e) => {
    if (e.target.checked) {
      updateStatus("Done");
    } else {
      updateStatus("Pending");
    }
  });

  function initCollapsible() {
    expandToggle.addEventListener("click", () => {
      const isExpanded = expandToggle.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        collapsibleSection.classList.add("collapsed");
        expandToggle.setAttribute("aria-expanded", "false");
        expandToggle.textContent = "Read more";
      } else {
        collapsibleSection.classList.remove("collapsed");
        expandToggle.setAttribute("aria-expanded", "true");
        expandToggle.textContent = "Show less";
      }
    });
  }

  function openEditMode() {
    editTitleInput.value = titleEl.textContent;
    editDescInput.value = descEl.textContent;
    editPrioritySelect.value = priorityEl.textContent;
    editDueDateInput.value = formatDateTimeLocal(currentDueDate);

    viewMode.classList.add("hidden");
    editMode.classList.remove("hidden");
    editTitleInput.focus();
    isEditing = true;
  }

  function closeEditMode() {
    editMode.classList.add("hidden");
    viewMode.classList.remove("hidden");
    editBtn.focus();
    isEditing = false;
  }

  function saveChanges(e) {
    e.preventDefault();

    titleEl.textContent = editTitleInput.value;
    descEl.textContent = editDescInput.value;
    updatePriority(editPrioritySelect.value);

    const newDateVal = new Date(editDueDateInput.value);
    if (!isNaN(newDateVal)) {
      currentDueDate = newDateVal;
      initDates();
      updateTimeRemaining();
    }

    closeEditMode();
  }

  editBtn.addEventListener("click", openEditMode);
  cancelBtn.addEventListener("click", closeEditMode);
  form.addEventListener("submit", saveChanges);

  deleteBtn.addEventListener("click", () => {
    alert("Delete Action Triggered");
  });

  function handleFocusTrap(e) {
    if (!isEditing || e.key !== "Tab") return;

    const focusableElements = form.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }

  form.addEventListener("keydown", handleFocusTrap);

  initDates();
  startTimer();
  updatePriority("High");
  updateStatus("Pending");
  initCollapsible();
});
