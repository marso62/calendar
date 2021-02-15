const refs = {
  participantsSelectElement: document.getElementById("participants"),
  theadElement: document.getElementById("thead"),
  tbodyElement: document.getElementById("tbody"),
};
let state = [];

const addOptions = (arr, root) => {
  const str = arr
    .map((elem) => `<option value=${elem}>${elem}</option>`)
    .join("\n");
  root.insertAdjacentHTML("beforeend", str);
};

const utlCalendar = "http://localhost:3030/calendar";
const utlVisitors = "http://localhost:3030/visitors";

const TIME_COUNT = 9;

const getVisitors = (url) =>
  fetch(url)
    .then((data) => data.json())
    .then((data) => {
      addOptions(data, refs.participantsSelectElement);
    })
    .catch(console.log);

const getTable = (url) =>
  fetch(url)
    .then((data) => data.json())
    .then((data) => {
      state = data;
      fillTable(state);
    })
    .catch(console.log);

const fillTable = (data) => {
  const array = [...data];

  const timeArray = array
    .filter((item, index) => index < TIME_COUNT)
    .map(({ time }) => time);

  const daysArray = array
    .filter((item, index) => index % TIME_COUNT === 0)
    .map(({ day }) => day);

  const theadRow =
    "<tr><th>Name</th>" +
    daysArray.map((day) => `<th>${day}</th>`).join("") +
    "</tr>";

  refs.theadElement.insertAdjacentHTML("afterbegin", theadRow);

  const tableArr = Array(timeArray.length)
    .fill("")
    .map((elem, index) =>
      array.filter(({ time }) => time === timeArray[index])
    );

  const tbodyRows = tableArr
    .map(
      (elem) =>
        `<tr><th>${elem[0].time}</th>${elem
          .map(
            (item) =>
              `<td id=${item.id} ${
                item.nameOfTheEvent && `class="table-success"`
              } >${
                item.nameOfTheEvent
                  ? item.nameOfTheEvent +
                    '<button class="btn-sm btn-outline-danger mx-3">🗙</button>'
                  : ""
              }</td>`
          )
          .join("")}</tr>`
    )
    .join("\n");
  refs.tbodyElement.insertAdjacentHTML("afterbegin", tbodyRows);
};

getVisitors(utlVisitors);
getTable(utlCalendar);

const clearTable = () => {
  refs.tbodyElement.innerHTML = "";
  refs.theadElement.innerHTML = "";
};

const deleteEvent = (event) => {
  const { target } = event;
  if (target.nodeName !== "BUTTON") return;
  const td = target.closest("td");
  const { id } = td;
  const message = td.textContent.slice(0, -2);

  const isDelete = confirm(
    `Are you sure you want to delete "${message}" event`
  );
  if (isDelete) {
    
    const obj = state.find((elem) => elem.id === +id);
    obj.participant = [];
    obj.nameOfTheEvent = "";
    
    fetch(`${utlCalendar}/${id}`, {
      method: "PUT",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(obj),
    })
      .then(() => {
        clearTable();
        getTable(utlCalendar);
      })
      .catch(console.log);
  }
};

const setFilter = (event) => {
  if (state.length === 0) return;
  clearTable();

  const { value } = event.target;

  if (value === "All") {
    fillTable(state);
    return;
  }
 
  const str = JSON.stringify(state);
  const arr = JSON.parse(str);

  const filteredArray = arr.map((elem) => {
    if (elem.nameOfTheEvent && elem.participant.includes(value)) {
      return elem;
    } else if (elem.nameOfTheEvent) {
      elem.participant = [];
      elem.nameOfTheEvent = "";
      return elem;
    }
    return elem;
  });
  fillTable([...filteredArray]);
};

refs.tbodyElement.addEventListener("click", deleteEvent);
refs.participantsSelectElement.addEventListener("change", setFilter);
