const utlCalendar = "http://localhost:3030/calendar";
const utlVisitors = "http://localhost:3030/visitors";

const getTable = (url) =>
  fetch(url)
    .then((data) => data.json())
    .then((data) => {
      state.calendar = data;
      console.log(state.calendar);
    })
    .catch(console.log);

const getVisitors = (url) =>
  fetch(url)
    .then((data) => data.json())
    .then((data) => {
      state.visitors = data;
      console.log(state.visitors);
      
    })
    .catch(console.log);



const addEventToBD = (obj) => {
  const id = obj.day;
  console.log(url);
  console.log(id);
  fetch(url + "/" + id, {
    method: "PUT",
    body: obj,
  })
    .then((data) => data.json())
    .then(console.log)
    .catch(console.log);
};

getTable(utlCalendar);
getVisitors(utlVisitors);


