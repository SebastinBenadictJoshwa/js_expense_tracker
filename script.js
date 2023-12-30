const expence = document.getElementById("expence");
const amount = document.getElementById("amount");
const hiddenVal = document.getElementById("hiddenVal");
const button = document.querySelector("button");
const table = document.querySelector("table");
const span = document.querySelector("span");
const searchBox = document.getElementById("search");
let elem = "";
let expenceList = JSON.parse(localStorage.getItem("expenceData")) || [];

button.addEventListener("click", addToList);
searchBox.addEventListener("input", searchItem);

function searchItem() {
  const rows = table.getElementsByTagName("tr");
  let keyword = searchBox.value.toLowerCase();
  let count = 0;

  for (let i = 1; i < rows.length; i++) {
    if (rows[i].getElementsByTagName("td").length > 1) {
      let name = rows[i]
        .getElementsByTagName("td")[0]
        .textContent.toLowerCase();
      let price = rows[i]
        .getElementsByTagName("td")[1]
        .textContent.toLowerCase();

      if (name.includes(keyword) || price.includes(keyword)) {
        rows[i].style.display = "";
        count++;
      } else {
        rows[i].style.display = "none";
      }
    }
  }

  let notFound = document.getElementById("center");
  if (count === 0) {
    if (!notFound) {
      elem = document.createElement("tr");
      elem.innerHTML = `<td colspan="3" id="center">No expenses found</td>`;
      table.appendChild(elem);
    }
  } else if (count > 0) {
    if (notFound && notFound.parentElement) {
      table.removeChild(notFound.parentElement);
    }
  }
}

function addToList() {
  const listItem = [expence.value, amount.value];
  if (expence.value && amount.value) {
    if (hiddenVal.value) {
      const oldData = hiddenVal.value.split(",");
      const oldIndex = expenceList.findIndex((item) =>
        item.every((value, index) => value === oldData[index])
      );
      expenceList[oldIndex] = listItem;
      hiddenVal.value = "";
      button.textContent = "Add Expense";
      notify("Expence edited successfully");
    } else {
      expenceList.push(listItem);
      createTableData(expence.value, amount.value);
      notify("Expence added successfully");
    }
    table.innerHTML = `
        <tr>
            <th>Expense</th>
            <th>Amount</th>
            <th>Action</th>
        </tr>`;
    loadData();
    addToLocalStorage();
  } else {
    alert("please enter inputs in all the fields");
  }
}

function addToLocalStorage() {
  localStorage.setItem("expenceData", JSON.stringify(expenceList));
  updateTotal();
}

function updateTotal() {
  const total = expenceList.reduce((acc, amount) => acc + Number(amount[1]), 0);
  span.innerHTML = '<i class="fa fa-inr"></i> ' + total;
}

function editItem(value) {
  [expence.value, amount.value] = value;
  hiddenVal.value = value.join(",");
  button.textContent = "Edit Expense";
}

function deleteItem(oldData) {
  const deleteConfirm = window.confirm(
    "Are you sure, You want to delete this?"
  );
  if (deleteConfirm) {
    const itemIndex = expenceList.findIndex((item) =>
      item.every((value, index) => value === oldData[index])
    );

    if (itemIndex > -1) {
      expenceList.splice(itemIndex, 1);
      loadData();
      addToLocalStorage();
    } else {
      console.log("Item not found in the list");
    }
    notify("Expence deleted successfully");
  }
}

function createTableData(input1, input2) {
  const tableData = document.createElement("tr");
  tableData.innerHTML = `
        <td>${input1}</td>
        <td>${input2}</td>
        <td><i class="fa fa-edit" onclick="editItem(['${input1}', '${input2}'])"></i>
            <i class="fa fa-trash" onclick="deleteItem(['${input1}', '${input2}'])"></i></td>
    `;
  table.appendChild(tableData);
  expence.value = "";
  amount.value = "";
  updateTotal();
}

function loadData() {
  table.innerHTML = `
        <tr>
            <th>Expense</th>
            <th>Amount</th>
            <th>Action</th>
        </tr>`;

  if (expenceList.length > 0) {
    expenceList.forEach((value) => createTableData(value[0], value[1]));
  } else {
    let elem = document.createElement("tr");
    elem.innerHTML = `<td colspan="3" class="center">No expenses found</td>`;
    table.appendChild(elem);
  }
}

loadData();

function notify(message) {
  if (Notification.permission === "granted") {
    const notification = new Notification(message);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        const notification = new Notification(message);
      }
    });
  }
}

function sortExpence(select) {
  switch (select.value) {
    case "priceHToL":
      expenceList.sort((a, b) => b[1] - a[1]);
      break;
    case "priceLToH":
      expenceList.sort((a, b) => a[1] - b[1]);
      break;
    case "aToZ":
      expenceList.sort((a, b) => a[0].localeCompare(b[0]));
      break;
    case "zToA":
      expenceList.sort((a, b) => b[0].localeCompare(a[0]));
      break;
    default:
      expenceList.sort();
      break;
  }
  loadData();
}

function clearExpenses() {
  const isConfirmed = window.confirm("Are you sure you want to proceed?");
  if (isConfirmed) {
    expenceList = [];
    addToLocalStorage();
    loadData();
  }
}
