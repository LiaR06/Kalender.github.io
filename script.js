let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

// Anlegen von Variablen zur späteren Verwendung
const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const eventDescriptionInput = document.getElementById('eventDescriptionInput');
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Macht Modal sichtbar
function openModal(date) {
  clicked = date;

  // Modal und Backdrop werden sichtbar
  newEventModal.style.display = 'block';
  backDrop.style.display = 'block';
}

// Öffnet bestehenden Termin
function openAppointment(appointment) {

  // Setzt Titel und Beschreibung für geöffneten Termin
  document.getElementById('eventTitle').innerText = appointment.title;
  document.getElementById('eventDescription').innerText = appointment.description;

  // Setzt EventListener zum Löschen des Termins
  document.getElementById('deleteButton').addEventListener('click', () => deleteAppointment(appointment));

  deleteEventModal.style.display = 'block';
  backDrop.style.display = 'block';
}

// Lädt alle Kalendertage
function load() {

  const dt = new Date();
  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  // Monats Überschrift
  document.getElementById('monthDisplay').innerHTML =
    `
    <span class="hidden-mobile">${dt.toLocaleDateString('de-DE', { month: 'long' })} ${year}</span> 
    <span class="hidden-desktop">${dt.toLocaleDateString('de-DE', { month: 'long' })} <p class="hidden-desktop">${year}</p></span>
    `;

  // Setzt Inhalt des Kalenders initial leer
  calendar.innerHTML = '';

  // Loopt über die Anzahl an Monatstagen und erstellt die Terminkästchen
  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');
    const dayNumber = document.createElement('span');
    daySquare.classList.add('day');

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      daySquare.appendChild(dayNumber);
      dayNumber.innerHTML = i - paddingDays + ` <div class="amount_num" id="appointment_amount${year}${month + 1}${i - paddingDays}"></div>`;
      if (i - paddingDays === day && nav === 0) {
        daySquare.classList.add('currentDay');
      }

      // Erstellt die Termine des aktuellen Kästchens
      events.forEach(element => {
        if (element.date === dayString) {
          const eventDiv = document.createElement('div');
          eventDiv.classList.add('event');
          eventDiv.innerText = element.title;
          // Setzt EventListerner zum Öffnen des Terminmodals
          eventDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            openAppointment(element);
          });
          daySquare.appendChild(eventDiv);
        }
    
      });

      // Setzt EventListener zum Öffnen des Modals zum Erstellen neuer Termine
      daySquare.addEventListener('click', () => openModal(dayString));
    } else {
      daySquare.classList.add('padding');
    }

    // Fügt Kästchen dem Kalender hinzu
    calendar.appendChild(daySquare);
  }
  // Updated alle Terminzähler
  updateAppointmentAmount();
  
}

 
// Schließt Modal zum Erstellen neuer Termine
function closeModal() {
  eventTitleInput.classList.remove('error');
  //eventDescriptionInput.classList.remove('error');
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
  eventDescriptionInput.value = '';
  clicked = null;
  load();
}

// Helferfunktion um alle Kinderelemente eines Elements zu löschen
function removeAllListItems(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

// Updated die Listenansicht indem neue Termin-Items erstellt und hinzugefügt werden
function updateList() {
  const listcontainer = document.getElementById('date-list');
  removeAllListItems(listcontainer);

  // Loopt über alle Termine im Local Storage und fügt für jeden Eintrag ein eigenes Listenelement hinzu
  events.forEach(el => {
    const dateItem = document.createElement('div');
    dateItem.id = 'list_date_' + el.date;
    dateItem.classList.add('dateItem');

    const date = document.createElement('p');
    const heading = document.createElement('p');
    const description = document.createElement('p');

    heading.classList.add('heading');
    description.classList.add('description');

    listcontainer.appendChild(dateItem);

    dateItem.appendChild(date);
    dateItem.appendChild(heading);
    dateItem.appendChild(description);

    let dateString = el.date.split("/")

    date.innerHTML = dateString[1] + '.' + dateString[0] + '.' + dateString[2];
    heading.innerHTML = el.title;
    description.innerHTML = el.description;

   //initSearchListener();
  });
}
/*
const filterTodos = (searchStr) =>{
  console.log(dateItem.filter(heading => heading.includes(searchStr)));
}
function initSearchListener(){ 
  document.getElementById('search-input').addEventListener('keyup', (e) =>{
  filterTodos(e.target.value);
  })
  }
*/


// Speichert einen neuen Termin ab
function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove('error');
    //eventDescriptionInput.classList.remove('error');

    events.push({
      date: clicked,
      title: eventTitleInput.value,
      description: eventDescriptionInput.value,
    });
    // Speichert neues Element im Local Storage
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  } else if (!eventTitleInput.value /*&& !eventDescriptionInput.value*/) {
    eventTitleInput.classList.add('error');
  }/* else if (eventTitleInput.value && !eventDescriptionInput.value) {
    eventTitleInput.classList.remove('error');
    eventDescriptionInput.classList.add('error');
  } else if (!eventTitleInput.value && eventDescriptionInput.value) {
    eventDescriptionInput.classList.remove('error');
    eventTitleInput.classList.add('error');
  }*/
  updateList();
}

// Loopt über events (alle Termine im Localstorage) und setzt die Anzahl der Termine pro Tag
function updateAppointmentAmount() {
  events.forEach(el => {
    let dateString = el.date.split("/")
    let item = document.getElementById('appointment_amount' + dateString[2] + dateString[0] + dateString[1]);

    // Falls Termin nicht im aktuellen Monat, setze den Zähler nicht
    if (item == null) {
      return;
    }
    // Falls Terminzähler leer, setze auf "1" - Ansonsten füge +1 hinzu
    if (item.innerHTML) {
      item.innerHTML = parseInt(item.innerHTML) + 1;
    } else {
      item.innerHTML = 1;
    }
  });
}

// Löscht ein Termin aus dem Localstorage
function deleteAppointment(appointment) {
  events = events.filter(e => e !== appointment);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}

// Initiert die Buttons im Header und Modals, diese bekommen ihre zugehörigen EventListener
function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });

  document.getElementById('saveButton').addEventListener('click', saveEvent);

  document.getElementById('cancelButton').addEventListener('click', closeModal);

  document.getElementById('eventTitleInput').addEventListener("keypress", event => {
    if (event.key === 'Enter') { saveEvent() }
  });
  document.getElementById('eventDescriptionInput').addEventListener("keypress", event => {
    if (event.key === 'Enter') { saveEvent() }
  });

  document.onkeydown = function (evt) {
    evt = evt || window.event;
    const new_modal = document.getElementById('newEventModal');
    const delete_modal = document.getElementById('deleteEventModal');
    if (evt.key === 'Escape' && new_modal.style.display !== 'none') {
      closeModal();
    }
    if (evt.key === 'Escape' && delete_modal.style.display !== 'none') {
      closeModal();
    }
  };

  document.getElementById('closeButton').addEventListener('click', closeModal);
}

// Initiales ausführen aller nötigen Funktionen
initButtons()
load();
updateList();
