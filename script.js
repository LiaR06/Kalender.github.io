let nav = 0;
let clicked = null; 
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById ('newEventModal');
const deleteEventModal = document.getElementById ('deleteEventModal');
const backDrop = document.getElementById ('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const eventDescriptionInput = document.getElementById('eventDescriptionInput');
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function openModal(date, is_new) {
    clicked = date;

    const eventForDay = events.find(e => e.date === clicked);

    if (is_new){
        newEventModal.style.display = 'block';
    } else {
        document.getElementById('eventTitle').innerText = eventForDay.title;
        document.getElementById('eventDescription').innerText = eventForDay.description;
        deleteEventModal.style.display = 'block';
    }

    backDrop.style.display = 'block';
}

function openAppointment(appointment) {
    document.getElementById('eventTitle').innerText = appointment.title;
    document.getElementById('eventDescription').innerText = appointment.description;
    deleteEventModal.style.display = 'block';

    document.getElementById('deleteButton').addEventListener('click', () => deleteAppointment(appointment));
    backDrop.style.display = 'block';
}


function load(){
    const dt = new Date();

    if (nav !== 0){ 
        dt.setMonth(new Date().getMonth() + nav);
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1)
    const daysInMonth = new Date(year, month +1, 0).getDate();

    const dateString = firstDayOfMonth.toLocaleDateString('en-us', { 
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    document.getElementById('monthDisplay').innerHTML = 
    `
    <span class="hidden-mobile">${dt.toLocaleDateString('de-DE', { month: 'long'})} ${year}</span> 
    <span class="hidden-desktop">${dt.toLocaleDateString('de-DE', { month: 'long'})} <p class="hidden-desktop">${year}</p></span>
    `;

    calendar.innerHTML = '';
    
    for(let i = 1; i <= paddingDays + daysInMonth; i++) { 
        const daySquare = document.createElement('div');
        const dayNumber = document.createElement('span');
        daySquare.classList.add('day');

        const dayString = `${month + 1}/${i - paddingDays}/${year}`;

        if (i > paddingDays) {
            daySquare.appendChild(dayNumber);
            dayNumber.innerHTML = i - paddingDays + `<span id="appointment_amount${i - paddingDays}"></span>`;
            if(i -paddingDays === day && nav === 0 ){
                dayNumber.id = 'currentDay';
            }

            events.forEach(element => {
                
                if (element.date === dayString) {
                    const eventDiv = document.createElement('div');
                    eventDiv.classList.add('event');
                    eventDiv.innerText = element.title;
                    eventDiv.addEventListener('click', (e) => {
                        e.stopPropagation();
                        //openModal(dayString, false);
                        openAppointment(element);
                    });
                    daySquare.appendChild(eventDiv);
                }
            });

            daySquare.addEventListener('click', () => openModal(dayString, true));
        } else {
            daySquare.classList.add('padding');
        }

        calendar.appendChild(daySquare);
    }

    updateList();
}

function closeModal(){ 
    eventTitleInput.classList.remove('error');
    eventDescriptionInput.classList.remove('error');
    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitleInput.value = '';
    eventDescriptionInput.value = '';
    clicked = null;
    load();
}

function updateList() {
    const listcontainer = document.getElementById('date-list');

    events.forEach(el => {
        const date = document.createElement('div');
        date.id = 'list_date_' + el.date;

        const heading = document.createElement('p');
        const description = document.createElement('p');

        let check = document.getElementById('list_date_' + el.date);
        if (check) {
            check.appendChild(heading);
            check.appendChild(description);
        } else {
            listcontainer.appendChild(date);
            listcontainer.appendChild(heading);
            listcontainer.appendChild(description);
        }
        
        // TODO: Funktion aufrufen wenn events updatet
        // TODO: heading und description nicht in date schreiben um styling zu ermöglichen
        
        date.innerHTML = el.date; 
        heading.innerHTML = el.title;
        description.innerHTML = el.description;
        
    });
}

function saveEvent(){ 
    if (eventTitleInput.value){
        //const num = clicked.split('/')[1];
        eventTitleInput.classList.remove('error');

        events.push({
            date: clicked, 
            title: eventTitleInput.value, 
            description: eventDescriptionInput.value, 
        });

        localStorage.setItem('events', JSON.stringify(events));
        //updateAppointmentAmount(num);
        closeModal();
    } else { 
        eventTitleInput.classList.add('error');
    }
}

/*
function updateAppointmentAmount(id) {
    const itemid = 'appointment_amount' + id;
    console.log(document.getElementById(itemid));
    document.getElementById(itemid).innerHTML = '1';
    
}
*/

function deleteEvent(){ 
    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
}

function deleteAppointment(appointment){
    console.log(appointment);
    events = events.filter(e => e !== appointment);
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
}

function initButtons() {
    document.getElementById('nextButton').addEventListener('click',() => {
        nav++;
        load();
    });

    document.getElementById('backButton').addEventListener('click',() =>{
        nav--;
        load();
    });

    document.getElementById('saveButton').addEventListener('click', saveEvent);
    document.getElementById('eventTitleInput').addEventListener("keypress", event => {
        if (event.key === 'Enter') {saveEvent()}});

    document.getElementById('cancelButton').addEventListener('click', closeModal);

    document.addEventListener("keypress", event => {
        if (event.key === 'Escape') {console.log(event)}});

    document.onkeydown = function(evt) {
        evt = evt || window.event;
        const new_modal = document.getElementById('newEventModal');
        const delete_modal = document.getElementById('deleteEventModal');
        if (evt.key === 'Escape' && new_modal.style.display !== 'none' ) {
            closeModal();
        }
        if (evt.key === 'Escape' && delete_modal.style.display !== 'none' ) {
            closeModal();
        }
    };




    document.getElementById('closeButton').addEventListener('click', closeModal);
}

initButtons()
load();