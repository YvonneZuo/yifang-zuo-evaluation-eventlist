let editingEventId = null;

function renderEvents(events) {
  console.log('render')
  const eventListElem = document.getElementById("event-list");
  eventListElem.innerHTML = ""; // Clear existing events

  events.forEach(event => {
    const row = document.createElement("tr");


    const eventNameCell = document.createElement("td");
    eventNameCell.textContent = event.eventName;

    const startDateCell = document.createElement("td");
    startDateCell.textContent = event.startDate;

    const endDateCell = document.createElement("td");
    endDateCell.textContent = event.endDate;

    const actionCell = document.createElement("td");


    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-btn";
    editButton.addEventListener("click", () => {

      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.value = event.eventName;

      const startInput = document.createElement("input");
      startInput.type = "date";
      startInput.value = event.startDate;

      const endInput = document.createElement("input");
      endInput.type = "date";
      endInput.value = event.endDate;


      eventNameCell.textContent = '';
      eventNameCell.appendChild(nameInput);

      startDateCell.textContent = '';
      startDateCell.appendChild(startInput);

      endDateCell.textContent = '';
      endDateCell.appendChild(endInput);


      const saveButton = document.createElement("button");
      saveButton.textContent = "Save";
      saveButton.className = "save-btn";
      saveButton.addEventListener("click", async () => {
        try {
          const updatedEvent = await eventAPI.updateEvent(event.id, {
            eventName: nameInput.value,
            startDate: startInput.value,
            endDate: endInput.value
          });

          eventNameCell.textContent = updatedEvent.eventName;
          startDateCell.textContent = updatedEvent.startDate;
          endDateCell.textContent = updatedEvent.endDate;

          actionCell.innerHTML = '';
          actionCell.appendChild(editButton);
          actionCell.appendChild(deleteButton);
        } catch (error) {
          console.error('Error updating event:', error);
          alert('Failed to update event');
        }
      });


      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Cancel";
      cancelButton.className = "cancel-btn";
      cancelButton.addEventListener("click", () => {

        eventNameCell.textContent = event.eventName;
        startDateCell.textContent = event.startDate;
        endDateCell.textContent = event.endDate;


        actionCell.innerHTML = '';
        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);
      });

      actionCell.innerHTML = '';
      actionCell.appendChild(saveButton);
      actionCell.appendChild(cancelButton);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";
    deleteButton.addEventListener("click", async () => {
      if (confirm('Are you sure you want to delete this event?')) {
        try {
          await eventAPI.deleteEvent(event.id);
          renderEvents(await eventAPI.getEvents());
        } catch (error) {
          console.error('Error deleting event:', error);
          alert('Failed to delete event');
        }
      }
    });


    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);

    row.appendChild(eventNameCell);
    row.appendChild(startDateCell);
    row.appendChild(endDateCell);
    row.appendChild(actionCell);

    eventListElem.appendChild(row);
  });
}


function setUpAddEventForm() {
  const addEventButton = document.getElementById("add-event-btn");
  let isAddingNew = false;

  addEventButton.addEventListener("click", () => {
    if (isAddingNew) return;
    isAddingNew = true;

    const eventListElem = document.getElementById("event-list");
    const newRow = document.createElement("tr");

    // Create input cells
    const nameCell = document.createElement("td");
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "Event Name";
    nameCell.appendChild(nameInput);

    const startCell = document.createElement("td");
    const startInput = document.createElement("input");
    startInput.type = "date";
    startCell.appendChild(startInput);

    const endCell = document.createElement("td");
    const endInput = document.createElement("input");
    endInput.type = "date";
    endCell.appendChild(endInput);

    const actionCell = document.createElement("td");

    // Save button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.className = "save-btn";
    saveButton.addEventListener("click", async () => {
      if (nameInput.value && startInput.value && endInput.value) {
        try {
          await eventAPI.postEvent({
            eventName: nameInput.value,
            startDate: startInput.value,
            endDate: endInput.value
          });
          // Refresh the event list
          const events = await eventAPI.getEvents();
          renderEvents(events);
          isAddingNew = false;
        } catch (error) {
          console.error('Error saving event:', error);
          alert('Failed to save event');
        }
      } else {
        alert('Please fill in all fields');
      }
    });

    // Cancel button
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.className = "cancel-btn";
    cancelButton.addEventListener("click", () => {
      newRow.remove();
      isAddingNew = false;
    });

    actionCell.appendChild(saveButton);
    actionCell.appendChild(cancelButton);


    newRow.appendChild(nameCell);
    newRow.appendChild(startCell);
    newRow.appendChild(endCell);
    newRow.appendChild(actionCell);


    eventListElem.appendChild(newRow);
  });
}

(async function init() {
  setUpAddEventForm();
  const events = await eventAPI.getEvents();
  renderEvents(events);
})();