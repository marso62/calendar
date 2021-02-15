const refs = {
  membersSelectElement: document.getElementById("participants"),
  timeSelectElement: document.getElementById("time"),
  daysSelectElement: document.getElementById("days"),
  nameInputElement: document.getElementById("inputEvent"),
  formElement: document.getElementById("eventId"),
  allMembersElement: document.getElementById("all-members"),
};
const utlCalendar = "http://localhost:3030/calendar";
const urlVisitors = "http://localhost:3030/visitors";

let state = [];
const TIME_COUNT = 9;

const addOptions = (arr, root) => {
  const str = arr
    .map((elem) => `<option value=${elem}>${elem}</option>`)
    .join("\n");
  root.insertAdjacentHTML("afterbegin", str);
};

const getTable = (url) =>
  fetch(url)
    .then((data) => data.json())
    .then((data) => {
      state = data;
      console.log(state);
      const timeArray = state
        .filter((item, index) => index < TIME_COUNT)
        .map(({ time }) => time);

      const daysArray = state
        .filter((item, index) => index % TIME_COUNT === 0)
        .map(({ day }) => day);
      addOptions(timeArray, refs.timeSelectElement);
      addOptions(daysArray, refs.daysSelectElement);
    })
    .catch(console.log);
getTable(utlCalendar);

const getVisitors = (url) =>
  fetch(url)
    .then((data) => data.json())
    .then((data) => {
      state.visitors = data;
      console.log(state.visitors);
      addOptions(data, refs.membersSelectElement);
    })
    .catch(console.log);
getVisitors(urlVisitors);

const initEvent = {
  participant: [],
  day: "",
  time: "",
  nameOfTheEvent: "",
};

let newEvent = { ...initEvent };

const handleSubmit = (event) => {
  event.preventDefault();
  const obj = state.find(
    ({ day, time }) => day === newEvent.day && time === newEvent.time
  );
  console.log(obj);
  if (obj.nameOfTheEvent) {
    alert("Failed to create an event. Time slot is alredy booked.");
    return;
  }
  const { id } = obj;
  obj.participant = newEvent.participant;
  obj.nameOfTheEvent = newEvent.nameOfTheEvent;
  console.log(obj);
  fetch(utlCalendar + "/" + id, {
    method: "PUT",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(obj),
  })
    .then(() => {
     
      window.location.href = "https://marso62.github.io/calendar/index.html";
    })
    .catch(console.log);
};
const clearForm = () => (newEvent = { ...initEvent });

const handleAddMembers = (event) => {
  const { value } = event.target;
  if (value === "All") return;
  if (newEvent.participant.includes(value)) return;
  newEvent.participant.push(value);
  refs.allMembersElement.textContent = newEvent.participant
    .map((e) => e)
    .join(", ");
};
const handleSetTime = (event) => {
  const { value } = event.target;
  if (value === "All") return;
  newEvent.time = value;
};
const handleSetDay = (event) => {
  const { value } = event.target;
  if (value === "All") return;
  newEvent.day = value;
};
const handleSetName = (event) => {
  const { value } = event.target;
  console.log(value);
  if (value === "All") return;
  newEvent.nameOfTheEvent = value;
};

refs.membersSelectElement.addEventListener("change", handleAddMembers);
refs.timeSelectElement.addEventListener("change", handleSetTime);
refs.daysSelectElement.addEventListener("change", handleSetDay);
refs.nameInputElement.addEventListener("change", handleSetName);

refs.formElement.addEventListener("submit", handleSubmit);
refs.formElement.addEventListener("reset", clearForm);
