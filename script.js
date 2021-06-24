// BLOCKS ARE IMPOSSIBLE TO SMOOTHLY DRAG IN FIREFOX, MAYBE USE A SPAN TO CONTAIN THE TEXT INSTEAD?

const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');

const dragContainer = document.getElementById('dragContainer');
const columnForm = document.getElementById('column-form');
// Modal window
const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const colName = document.getElementById('column-name');
const minActions = document.getElementById('min-num-actions');
const colWeight = document.getElementById('column-weight');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;


// Get Arrays from localStorage if available, set default values if not
// function getSavedColumns() {
//   if (localStorage.getItem('backlogItems')) {
//     backlogListArray = JSON.parse(localStorage.backlogItems);
//     progressListArray = JSON.parse(localStorage.progressItems);
//     completeListArray = JSON.parse(localStorage.completeItems);
//     onHoldListArray = JSON.parse(localStorage.onHoldItems);
//   } 
//   else {
//     backlogListArray = ['Release the course', 'Sit back and relax'];
//     progressListArray = ['Work on projects', 'Listen to music'];
//     completeListArray = ['Being cool', 'Getting stuff done'];
//     onHoldListArray = ['Being uncool'];
//   }
// }

// Set localStorage Arrays
// function updateSavedColumns() {
//   listArrays = [backlogListArray, progressListArray, completeListArray,
//   onHoldListArray];
//   const arrayNames = ['backlog', 'progress','complete', 'onHold'];

//   arrayNames.forEach((arrayName, index) => {
//     localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
//   });
//   return false
// }

// Filter Arrays to remove empty items
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null);
  return filteredArray;
}

// Show Modal, Focus on Input
function showModal() {
	modal.classList.add('show-modal');
  colName.focus();
}

// Validate new column
function validateCol(nameValue, actionsValue, weightValue) {
  const actionsExpression = /^[1-9][0-9]?$|^100$/
  const regex = new RegExp(actionsExpression);

  if (!nameValue || !actionsValue || !weightValue) {
    alert('Please submit values for all fields.')
    return false;
  }
  if (!weightValue.match(regex) || !actionsValue.match(regex)) {
    alert('Please enter a value within the range of 1 - 100 (inclusive) for the minimum number of actions and weighting.')
    return false;
  }
  // If valid
  return true;
}

function storeColumns(e) {
  e.preventDefault();
  const nameVal = colName.value;
  let minActionsNum = minActions.value;
  let weight = colWeight.value;
  
  if (!validateCol(nameVal, minActionsNum, weight)) {
    return false;
  }

  // Store columns for local storage - B
  // 
  // 
  const actionCol = {
    name: nameVal,
    numOfActions: minActionsNum,
    weighting: weight
  };
  listArrays.push(actionCol);
  updateDOM();
  columnForm.reset();
  colName.focus();
}

// Create Columns to store action items
function createColumn() {
  // Reset content
  dragContainer.textContent = '';

  listArrays.forEach((actionCol, index) => {
    const { name, numOfActions, weighting } = actionCol;
    // Create column parts
    const columnEl = document.createElement('li');
    const titleSpan = document.createElement('span');
    const titleText = document.createElement('h1');
    
    const contentGroup = document.createElement('div');
    const actionList = document.createElement('ul');

    const buttonGroup = document.createElement('div');
    const colAddBtn = document.createElement('div');
    const colAddText = document.createElement('span');
    
    const counter = document.createElement('div');

    const colSaveBtn = document.createElement('div');
    const colSaveText = document.createElement('span');
    const textContainer = document.createElement('div');
    const textData = document.createElement('div');

    // Add styling & attributes
    columnEl.classList.add('drag-column');
    // change styling to general column
    columnEl.classList.add('backlog-column');
    columnEl.setAttribute('min-num-actions', numOfActions);
    columnEl.setAttribute('column-weight', weighting)
    titleSpan.classList.add('header');
    titleText.textContent = name;
    titleSpan.appendChild(titleText);

    contentGroup.classList.add('custom-scroll');
    actionList.classList.add('drag-item-list');
    // actionList.setAttribute('ondrop', 'drop(event)');
    // actionList.setAttribute('ondragover', 'allowDrop(event)');
    // actionList.setAttribute('ondragover', 'ondragenter(${listArrays.length-1})');
    contentGroup.appendChild(actionList);

    buttonGroup.classList.add('add-btn-group');
    colAddBtn.classList.add('add-btn');
    colAddBtn.addEventListener('click', () => {
      showInputBox(index);
    });
    colAddText.classList.add('plus-sign');
    colAddText.textContent = '+';
    counter.classList.add('col-counter');
    colSaveBtn.classList.add('add-btn');
    colSaveBtn.classList.add('solid');
    colSaveText.textContent = 'Save Item';
    colAddBtn.appendChild(colAddText);
    colSaveBtn.appendChild(colSaveText);
    buttonGroup.appendChild(colAddBtn);
    buttonGroup.appendChild(counter);
    buttonGroup.appendChild(colSaveBtn);

    textContainer.classList.add('add-container');
    textData.classList.add('add-item');
    textData.contentEditable = true;
    textContainer.appendChild(textData);

    // Assemble column
    columnEl.appendChild(titleSpan);
    columnEl.appendChild(contentGroup);
    columnEl.appendChild(buttonGroup);
    columnEl.appendChild(textContainer);
    dragContainer.appendChild(columnEl);
  });
}

// Create DOM Elements for each action item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');

  // Temporary solution to Firefox edit or dragging issue
  listEl.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    listEl.contentEditable = true
  });
  
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  // Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  createColumn();
  // Check localStorage once
  // if (!updatedOnLoad) {
  //   getSavedColumns();
  // }

  // // Backlog Column
  // backlogList.textContent = '';
  // backlogListArray.forEach((listItem, index) => {
  //   createItemEl(backlogList, 0, listItem, index);
  // });
  // backlogListArray = filterArray(backlogListArray);

  // // Progress Column
  // progressList.textContent = '';
  // progressListArray.forEach((listItem, index) => {
  //   createItemEl(progressList, 1, listItem, index);
  // });
  // progressListArray = filterArray(progressListArray);

  // // Complete Column
  // completeList.textContent = '';
  // completeListArray.forEach((listItem, index) => {
  //   createItemEl(completeList, 2, listItem, index);
  // });
  // completeListArray = filterArray(completeListArray);

  // // On Hold Column
  // onHoldList.textContent = '';
  // onHoldListArray.forEach((listItem, index) => {
  //   createItemEl(onHoldList, 3, listItem, index);
  // });
  // onHoldListArray = filterArray(onHoldListArray);

  
  // Run getSavedColumns only once, Update Local Storage
  // updatedOnLoad = true;
  // updateSavedColumns();
  // updateColumnCounter();
}

// Update column counters
function updateColumnCounter() {
  let counters = document.querySelectorAll('.col-counter');
  counters.forEach((i, index) => {
    if (listArrays[index].length > 0) {
      i.style.display = 'flex';
      i.textContent = `${listArrays[index].length}`;
    }
    else {
      i.style.display = 'none';
    }
  });
}

// Update Item - Delete if necessary, or update Array value
// function updateItem(id, column) {
//   const selectedArray = listArrays[column];
//   const selectedColumnEl = listColumns[column].children;
//   // Remove item if empty and is not being dragged
//   if (!dragging) {
//     if (!selectedColumnEl[id].textContent) {
//       delete selectedArray[id];
//     }
//     else {
//       selectedArray[id] = selectedColumnEl[id].textContent;
//     }
//     updateDOM();
//   }
// }

// Add new item to column list -> Reset textbox
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  if (!itemText) {
    // Close if input box empty
    return 
  }
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = "";
  updateDOM();
}

// Show Add Item input box
function showInputBox(column) {
  // addBtns[column].style.visibility = 'hidden';
  // saveItemBtns[column].style.display = 'flex';
  // addItemContainers[column].style.display = 'flex';
  console.log('showInputBox');
}

// Hide Add Item input box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

// Update arrays after Drag & Drop change
// function rebuildArrays() {
//   // Reset arrays and repopulate with data
//   backlogListArray = Array.from(backlogList.children).map(item => item.textContent);
//   progressListArray = Array.from(progressList.children).map(item => item.textContent);
//   completeListArray = Array.from(completeList.children).map(item => item.textContent);
//   onHoldListArray = Array.from(onHoldList.children).map(item => item.textContent);
//   // Update DOM
//   updateDOM();
// }

/** Drag & Drop Functionality */
// When Item Starts Dragging
// function drag(e) {
//   draggedItem = e.target;
//   dragging = true;
// }

// When a draggable item enters a column (drop area)
// function dragEnter(column) {
//   listColumns[column].classList.add('over');
//   currentColumn = column;
// }

// Allow items to be dragged into columns
// function allowDrop(e) {
//   e.preventDefault();
// }

// Dropping items into columns
// function drop(e) {
//   e.preventDefault();
//   // Remove Background Color/Padding
//   listColumns.forEach((column) => {
//     column.classList.remove('over');
//   });
//   // Add item to column (frontend effect)
//   const parent = listColumns[currentColumn];
//   parent.appendChild(draggedItem);
//   // Dragging complete
//   dragging = false;
//   // Update to reflect change in the columns
//   rebuildArrays();
// }


// Event Listeners
columnForm.addEventListener('submit', storeColumns);
// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));
// On Load
// updateDOM();

