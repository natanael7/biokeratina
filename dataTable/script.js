async function getHeaders() {
  return await fetch("http://localhost:5500/headers.json").then((response) =>
    response.json()
  );
}
async function getData() {
  return await fetch("http://localhost:5500/data.json").then((response) =>
    response.json()
  );
}
function makeDataArray(headers, data) {
  const arr = [[]];
  for (const prop in headers) {
    arr[0].push(headers[prop]);
  }
  for (let i = 0; i < data.length; i++) {
    const toPush = [];
    for (let j = 0; j < arr[0].length; j++)
      toPush.push(data[i][arr[0][j]] || null);
    arr.push(toPush);
  }
  return arr;
}
function createTableDOM(data) {
  const tableContainer = document.createElement("div");
  tableContainer.classList.add("table__container");

  const table = document.createElement("table");
  table.classList.add("table");

  const tableHead = document.createElement("thead");
  tableHead.classList.add("table__head");

  const tableHeadRow = document.createElement("tr");
  tableHeadRow.classList.add("table__head-row");

  const tableBody = document.createElement("tbody");
  tableBody.classList.add("table__body");

  for (let i = data.length - 1; i >= 0; i--) {
    if (!i) {
      for (let j = 0; j < data[i].length; j++) {
        const row = document.createElement("th");
        row.classList.add(`column${j + 1}`);
        row.classList.add(`column`);
        row.innerHTML = data[i][j];
        tableHeadRow.appendChild(row);
      }
    } else {
      const tableRow = document.createElement("tr");
      for (let j = 0; j < data[i].length; j++) {
        const row = document.createElement("td");
        row.classList.add(`column${j + 1}`);
        row.classList.add(`column`);
        row.innerHTML = data[i][j];
        tableRow.appendChild(row);
      }
      tableBody.appendChild(tableRow);
    }
  }

  tableHead.append(tableHeadRow);
  table.append(tableHead);
  table.append(tableBody);
  tableContainer.append(table);
  document.querySelector("body").appendChild(tableContainer);
}
async function main() {
  const headers = await getHeaders();
  const data = await getData();
  const dataArray = makeDataArray(headers, data);

  createTableDOM(dataArray);
  const createResizableTable = function (table) {
    const cols = table.querySelectorAll("th");
    [].forEach.call(cols, function (col) {
      // Add a resizer element to the column
      const resizer = document.createElement("div");
      resizer.classList.add("resizer");

      // Set the height
      resizer.style.height = `${table.offsetHeight}px`;

      col.appendChild(resizer);

      createResizableColumn(col, resizer);
    });
  };

  const createResizableColumn = function (col, resizer) {
    let x = 0;
    let w = 0;

    const mouseDownHandler = function (e) {
      x = e.clientX;

      const styles = window.getComputedStyle(col);
      w = parseInt(styles.width, 10);

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);

      resizer.classList.add("resizing");
    };

    const mouseMoveHandler = function (e) {
      const dx = e.clientX - x;
      col.style.width = `${w + dx}px`;
    };

    const mouseUpHandler = function () {
      resizer.classList.remove("resizing");
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };

    resizer.addEventListener("mousedown", mouseDownHandler);
  };

  createResizableTable(document.querySelector(".table"));
}

main();
