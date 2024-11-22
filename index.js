const API_URL = 'http://localhost:3000/events';
let events = [];
let isEditing = false;

// Fetch all events from the server
async function fetchEvents() {
    try {
        const response = await fetch(API_URL);
        events = await response.json();
        renderEvents();
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

// Create a new event
async function createEvent(eventData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        });
        const newEvent = await response.json();
        events.push(newEvent);
        renderEvents();
    } catch (error) {
        console.error('Error creating event:', error);
    }
}

// Update an existing event
async function updateEvent(id, eventData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        });
        const updatedEvent = await response.json();
        events = events.map(event =>
            event.id === id ? updatedEvent : event
        );
        renderEvents();
    } catch (error) {
        console.error('Error updating event:', error);
    }
}

// Delete an event
async function deleteEvent(id) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        events = events.filter(event => event.id !== id);
        renderEvents();
    } catch (error) {
        console.error('Error deleting event:', error);
    }
}

// Create row for new event input
function createNewEventRow() {
    return `
        <tr>
            <td><input type="text" class="new-event-name" placeholder="Event name"></td>
            <td><input type="date" class="new-event-start"></td>
            <td><input type="date" class="new-event-end"></td>
            <td class="actions">
                <button class="action-btn save-btn" onclick="handleSaveNew()">
                    // <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    //     <path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/>
                    // </svg>
                </button>
                <button class="action-btn cancel-btn" onclick="handleCancel()">
                    // <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
                    //     <path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"/>
                    // </svg>
                </button>
            </td>
        </tr>
    `;
}

// Create row for editing existing event
function createEditRow(event) {
    return `
        <tr>
            <td><input type="text" class="edit-event-name" value="${event.name}"></td>
            <td><input type="date" class="edit-event-start" value="${event.startDate}"></td>
            <td><input type="date" class="edit-event-end" value="${event.endDate}"></td>
            <td class="actions">
                <button class="action-btn save-btn" onclick="handleSaveEdit(${event.id})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/>
                    </svg>
                </button>
                <button class="action-btn cancel-btn" onclick="handleCancel()">
                    <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
                        <path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"/>
                    </svg>
                </button>
            </td>
        </tr>
    `;
}

// Create row for displaying event
function createDisplayRow(event) {
    return `
        <tr>
            <td>${event.name}</td>
            <td>${event.startDate}</td>
            <td>${event.endDate}</td>
            <td class="actions">
                <button class="action-btn edit-btn" onclick="handleEdit(${event.id})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                </button>
                <button class="action-btn delete-btn" onclick="handleDelete(${event.id})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
            </td>
        </tr>
    `;
}

// Render all events
function renderEvents() {
    const tableBody = document.getElementById('eventTableBody');
    let html = '';

    if (isEditing == 'new') {
        html += createNewEventRow();
    }

    events.forEach(event => {
        if (isEditing === event.id) {
            html += createEditRow(event);
        } else {
            html += createDisplayRow(event);
        }
    });

    tableBody.innerHTML = html;
}

// Event Handlers
function handleAddNew() {
    isEditing = 'new';
    renderEvents();
}

function handleSaveNew() {
    const name = document.querySelector('.new-event-name').value;
    const startDate = document.querySelector('.new-event-start').value;
    const endDate = document.querySelector('.new-event-end').value;

    if (name && startDate && endDate) {
        createEvent({ name, startDate, endDate });
        isEditing = false;
    }
}

function handleEdit(id) {
    isEditing = id;
    renderEvents();
}

function handleSaveEdit(id) {
    const name = document.querySelector('.edit-event-name').value;
    const startDate = document.querySelector('.edit-event-start').value;
    const endDate = document.querySelector('.edit-event-end').value;

    if (name && startDate && endDate) {
        updateEvent(id, { name, startDate, endDate });
        isEditing = false;
    }
}

function handleDelete(id) {
    if (confirm('Are you sure you want to delete this event?')) {
        deleteEvent(id);
    }
}

function handleCancel() {
    isEditing = false;
    renderEvents();
}

// Initialize
document.getElementById('addEventBtn').addEventListener('click', handleAddNew);
fetchEvents();