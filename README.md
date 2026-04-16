# HNG Internship Task 0 - Todo Item Card

This is a frontend testable Todo Item Card built specifically for the HNG Internship Task 0.

## Project Details

- **Tech Stack:** Pure HTML, CSS, and JavaScript.
- **Features:**
  - Fully responsive design across all screen sizes.
  - Semantic HTML and accessible practices.
  - Implements all required `data-testid` attributes for the automated grading system.
  - Interactive checkbox functionality and dynamic time-remaining logic.

## Changes from Stage 0

- **Interactive Edit Mode:** Added an inline form to edit the title, description, priority, and due date.
- **State Management:** Linked the checkbox with a new status dropdown control ("Pending", "In Progress", "Done"). Marking a task as "Done" disables further edits.
- **Dynamic Collapse:** Added a functional `Read more`/`Show less` toggle for long text.
- **Enhanced Time Logic:** Added granular time threshold indicators ("Due in X hours") via a 30-second interval cycle and an explicit visual "Overdue" badge.
- **Design Decisions:** Utilized CSS `-webkit-line-clamp` for smooth description collapsing and added a solid colored accent line on the left edge of the card for priority indication.
- **Known Limitations:** Time selections rely on the standard `<input type="datetime-local">`, inheriting timezone data from the localized browser rather than enforcing strict UTC.
- **Accessibility Notes:** Implemented an active focus trap within the Edit Form, mapped `aria-expanded` properties via `aria-controls` to the description's ID, and ensured all inputs are robustly attached to `<label>` nodes.
