// global variables and scripts

// setting the click-script for existing checkboxes

let inputs = document.querySelectorAll("input[type=checkbox]")

// for storing the # of students, kind of like an ID
let count = document.querySelectorAll("input[type=checkbox]").length

// setting up the seed element for adding new student
let trs = document.querySelectorAll("#myTable tbody tr")
let seedRow = trs[1].cloneNode(true)
let seedRowDetails = trs[2].cloneNode(true)

inputs.forEach(input => {
    registerInputActions(input)
});

let addNewButton = document.querySelector("button#add")

addNewButton.addEventListener('click', () => {
    try {
        addStudent()
        dynamicUpdates()
    } catch (error) {
        alert(`Unable to add student: ${error}`)
    }
})

// function definitions

// helper functions
function delayedAlertBox(message) {
    // so that it doesn't block the main thread
    // message is shown after html rendering is over
    // eg. row removed before message shown
    setTimeout(() => {
        alert(message)
    }, 100);
}

function generateIntRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function clearHtmlNode(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function checkboxToggling(checkbox) {
    let parentRow = checkbox.parentElement.parentElement;

    let deleteColumn = parentRow.querySelector(":nth-child(9)")
    clearHtmlNode(deleteColumn)

    let editColumn = parentRow.querySelector(":nth-child(10)")
    clearHtmlNode(editColumn)

    parentRow.bgColor = ''

    if (checkbox.checked) {
        parentRow.bgColor = 'yellow'
        deleteColumn.appendChild(DeleteRecordofstdnt(parentRow))
        editColumn.appendChild(newInputEdit())
    }

    dynamicUpdates()
}


function DeleteRecordofstdnt(tr) {
    let button = document.createElement('input')
    button.value = 'Delete'
    button.type = 'button'

    button.addEventListener('click', () => {
        tr.nextElementSibling.remove()
        tr.remove()
        dynamicUpdates()
        delayedAlertBox('record deleted successfully')
    })

    return button
}

function newInputEdit() {
    let button = document.createElement('input')
    button.value = "Edit"
    button.type = 'button'
    button.addEventListener('click', () => {
        const input = prompt("Edit the details")
        console.log(input)
    })

    return button
}

function dynamicUpdates() {
    let checked = false
    let checkboxes = document.querySelectorAll("input[type=checkbox]")

    for (let i = 0; i < checkboxes.length; i++) {
        const element = checkboxes[i];
        if (element.checked) {
            checked = true
            break
        }
    }

    document.querySelector("button#button").disabled = !checked

    const deleteAndEditRows = document.querySelectorAll("table td:nth-child(9), table th:nth-child(9), table td:nth-child(10), table th:nth-child(10)")

    deleteAndEditRows.forEach(cell => {
        cell.classList.remove("visible-cell")
        if (checked) {
            cell.classList.add("visible-cell")
        }
    })
}

function dropDownInfo(img) {
    const details = img.parentElement.parentElement.nextElementSibling

    if (details.classList.contains("expandedTextArea")) {
        details.classList.remove("expandedTextArea")
    }
    else {
        details.classList.add("expandedTextArea")
    }
}

function registerInputActions(input) {
    input.addEventListener('change', () => {
        checkboxToggling(input)
    })

    const arrow = input.nextElementSibling.nextElementSibling.nextElementSibling;

    arrow.addEventListener('click', () => {
        dropDownInfo(arrow)
    })

    // to set the state based on existing checked / unchecked state
    checkboxToggling(input)
}

function addStudent() {
    let tbody = document.querySelector("#myTable tbody")

    newRow = seedRow.cloneNode(true)
    newDetails = seedRowDetails.cloneNode(true)

    // hydrate the new row before adding
    count += 1

    const columns = newRow.querySelectorAll("td")

    columns[1].innerHTML = `Student ${count}`
    columns[2].innerHTML = `Teacher ${count}`
    columns[6].innerHTML = generateIntRange(count * 10000, count * 10000 + 9999)

    let check = newRow.querySelector("input[type=checkbox]")

    registerInputActions(check)

    tbody.appendChild(newRow)
    tbody.appendChild(newDetails)

    delayedAlertBox("New student added successfully")
}

