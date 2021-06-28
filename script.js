// Blocks
const dragContainer = document.getElementById('drag-container');
const blockForm = document.getElementById('block-form');
const blockName = document.getElementById('block-name');
const minActions = document.getElementById('min-num-actions');
const blockWeight = document.getElementById('block-weight');
const blockColour = document.getElementById('block-colour');
// Modal window
const modal = document.getElementById('modal');
const addModalShow = document.getElementById('show-add-modal');
const modalClose = document.getElementById('close-modal');
const addNewBlock = document.getElementById('add-block-btn');
const updateBlockBtn = document.getElementById('update-block-btn');
const deleteBlockBtn = document.getElementById('delete-block-btn');

let updatedOnLoad = false;

// Initialize Arrays
let blockList;
let blockArrays;
let blockObjects = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;


// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('blocks') && !localStorage.getItem('blocks').length === 0) {
    blockObjects = JSON.parse(localStorage.blocks);
  }
  else {
    // Create default blocks
    const toDo = {
      // id: 0,
      name: 'To do',
      numOfActions: '10',
      weighting: '10',
      colour: '#292f36',
      actionItems: ['Release the course', 'Sit back and relax']
    };
    const inProgress = {
      // id: 1,
      name: 'In-progress',
      numOfActions: '10',
      weighting: '10',
      colour: '#ffe66d',
      actionItems: ['Work on projects', 'Listen to music']
    };
    const completed = {
      // id: 2,
      name: 'Completed',
      numOfActions: '10',
      weighting: '10',
      colour: '#44cf6c',
      actionItems: ['Being cool', 'Getting stuff done']
    };
    // Push into main array
    blockObjects.push(toDo);
    blockObjects.push(inProgress);
    blockObjects.push(completed);
  }
  
}

function saveBlock(name, data) {
  if (!name && !data) {
    return false
  }
  localStorage.setItem(`${name}`, JSON.stringify(data));
}

// Filter Arrays to remove empty items
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null);
  return filteredArray;
}

// Show Modal, Focus on Input
function showModal(text) {
  let title = document.getElementById('modal-header-text');
  title.textContent = text;
  
	modal.classList.add('show-modal');
  blockName.focus();
}

// Clear Modal Input when hidden
function resetModal() {
  blockForm.reset();
  updateBlockBtn.value = '0';
  deleteBlockBtn.value = '0';
}

// Update Block Modal 
function updateModal(blockData, index) {
  const { name, numOfActions, weighting, colour} = blockData;
  let modName = document.getElementById('block-name');
  let modActions = document.getElementById('min-num-actions');
  let modWeight = document.getElementById('block-weight');
  let modColour = document.getElementById('block-colour');

  // Display block attributes
  modName.value = name;
  modActions.value = numOfActions;
  modWeight.value = weighting;
  modColour.value = colour;
  updateBlockBtn.value = index;
  deleteBlockBtn.value = index;

  // Change submit button
  addNewBlock.style.display = 'none';
  updateBlockBtn.style.display = 'inline-block';
  deleteBlockBtn.style.display = 'inline-block';

  showModal('Update Block');
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

// Change block colour
function changeBlockColour(block, color) {
  block.style.backgroundColor = color;
}

// Save and store blocks
function storeBlocks(e) {
  e.preventDefault();
  let nameVal = blockName.value;
  let minActionsNum = minActions.value;
  let weight = blockWeight.value;
  let colourVal = blockColour.value;
  
  if (!validateCol(nameVal, minActionsNum, weight)) {
    return false;
  }

  const actionData = {
    // id: blockObjects.length-1,
    name: nameVal,
    numOfActions: minActionsNum,
    weighting: weight,
    colour: colourVal,
    actionItems: []
  };
  blockObjects.push(actionData);

  // Store in local storage
  saveBlock('blocks', blockObjects);

  updateDOM();
  blockForm.reset();
  blockName.focus();
}

function updateBlock(e, blockIndex) {
  e.preventDefault()
  if (!confirm(`Update this block?`)) {
    return
  }
  let modName = document.getElementById('block-name');
  let modActions = document.getElementById('min-num-actions');
  let modWeight = document.getElementById('block-weight');
  let modColour = document.getElementById('block-colour');

  // Update object values 
  blockObjects[blockIndex].name = modName.value;
  blockObjects[blockIndex].numOfActions = modActions.value;
  blockObjects[blockIndex].weight = modWeight.value;
  blockObjects[blockIndex].colour = modColour.value;

  // Store in local storage
  saveBlock('blocks', blockObjects);

  updateDOM();
}

// Delete a specified block from storage
function deleteBlock(e, blockIndex) {
  e.preventDefault();
  if (!confirm(`Remove this block?`)) {
      return
  }
  // Find block
  blockObjects.splice(blockIndex, 1);
      
  // Store in local storage
  saveBlock('blocks', blockObjects);
  
  resetModal();
  modal.classList.remove('show-modal');
  updateDOM();
}

// Create Columns to store action items
function createColumn() {

  blockObjects.forEach((blockData, index) => {
    const { name, numOfActions, weighting, colour} = blockData;
    // Create column parts
    const actionBlock = document.createElement('li');
    const titleSpan = document.createElement('span');
    const titleText = document.createElement('h1');
    const blockEdit = document.createElement('i');
    const blockOptions = document.createElement('div');
    const closeBlock = document.createElement('i');
    
    const contentGroup = document.createElement('div');
    const actionList = document.createElement('ul');

    const buttonGroup = document.createElement('div');
    const blockAddBtn = document.createElement('div');
    const blockAddText = document.createElement('span');

    const blockSaveBtn = document.createElement('div');
    const blockSaveText = document.createElement('span');
    const textContainer = document.createElement('div');
    const textData = document.createElement('div');

    // Add styling & attributes
    actionBlock.classList.add('drag-block');
    actionBlock.classList.add('action-block');
    actionBlock.setAttribute('min-num-actions', numOfActions);
    actionBlock.setAttribute('column-weight', weighting)

    titleSpan.classList.add('header');
    blockEdit.classList.add('far');
    blockEdit.classList.add('fa-edit');
    blockEdit.addEventListener('click', () => {
      updateModal(blockData, index);
    });
    titleText.textContent = name;
    titleSpan.appendChild(titleText);
    titleSpan.appendChild(blockEdit);
    // Change colour
    changeBlockColour(titleSpan, colour);

    contentGroup.classList.add('custom-scroll');
    actionList.classList.add('drag-item-list');
    actionList.setAttribute('ondrop', 'drop(event)');
    actionList.setAttribute('ondragover', 'allowDrop(event)');
    actionList.setAttribute('ondragenter', `dragEnter(${index})`);
    contentGroup.appendChild(actionList);

    buttonGroup.classList.add('add-btn-group');
    blockAddBtn.classList.add('add-btn');
    blockAddBtn.addEventListener('click', () => {
      showInputBox(index);
    });
    blockAddText.classList.add('plus-sign');
    blockAddText.textContent = '+';
    blockSaveBtn.classList.add('add-btn');
    blockSaveBtn.classList.add('solid');
    blockSaveBtn.addEventListener('click', () => {
      hideInputBox(index);
    })
    blockSaveText.textContent = 'Save Item';
    blockAddBtn.appendChild(blockAddText);
    blockSaveBtn.appendChild(blockSaveText);
    buttonGroup.appendChild(blockAddBtn);
    buttonGroup.appendChild(blockSaveBtn);

    textContainer.classList.add('add-container');
    textData.classList.add('add-item');
    textData.contentEditable = true;
    textContainer.appendChild(textData);

    // Assemble column
    actionBlock.appendChild(titleSpan);
    actionBlock.appendChild(contentGroup);
    actionBlock.appendChild(buttonGroup);
    actionBlock.appendChild(textContainer);
    dragContainer.appendChild(actionBlock);
  });
}

// Create DOM Elements for each action item
function createItemEl(actionItems, blockInd) {
  blockList = document.querySelectorAll('.drag-item-list');
  // List Item
  actionItems.forEach((text, itemInd) => {
    const listEl = document.createElement('li');
    listEl.classList.add('drag-item');
    listEl.textContent = text;
    listEl.draggable = true;
    listEl.setAttribute('ondragstart', 'drag(event)');

    // Double click to edit item
    listEl.addEventListener('dblclick', () => {
      listEl.contentEditable = true
    });
    
    listEl.id = itemInd;
    listEl.setAttribute('onfocusout', `updateItem(${blockInd}, ${itemInd})`);
    // Append
    blockList[blockInd].appendChild(listEl);
  })
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  console.log(blockObjects);
  // Reset content
  dragContainer.textContent = '';
  createColumn();
  blockObjects.forEach((block, blockIndex) => {
    let filteredActions = filterArray(block.actionItems);
    createItemEl(filteredActions, blockIndex);
  });
  console.log(blockObjects);
  
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
}

// Update Item - Delete if necessary, or update Array value
function updateItem(blockInd, itemInd) {
  const selectedArray = blockObjects[blockInd].actionItems;
  const selectedColumnEl = document.querySelectorAll('.drag-item-list')[blockInd].children;
  
  // Remove item if empty and is not being dragged
  if (!dragging) {
    if (!selectedColumnEl[itemInd].textContent) {
      delete selectedArray[itemInd];
    }
    else {
      selectedArray[itemInd] = selectedColumnEl[itemInd].textContent;
    }
    updateDOM();
  }
}

// Add new item to column list -> Reset textbox
function addToColumn(column) {
  const addItems = document.querySelectorAll('.add-item');
  const selectedArray = blockObjects[column].actionItems;
  const itemText = addItems[column].textContent;

  if (!itemText) {
    // Close if input box empty
    return 
  }
  
  selectedArray.push(itemText);
  addItems[column].textContent = "";
  updateDOM();
}

// Show Add Item input box
function showInputBox(column) {
  let addBtns = document.querySelectorAll('.add-btn:not(.solid)');
  let saveItemBtns = document.querySelectorAll('.solid');
  let addItemContainers = document.querySelectorAll('.add-container');

  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

// Hide Add Item input box
function hideInputBox(column) {
  let addBtns = document.querySelectorAll('.add-btn:not(.solid)');
  let saveItemBtns = document.querySelectorAll('.solid');
  let addItemContainers = document.querySelectorAll('.add-container');

  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

// Update arrays after Drag & Drop change
function rebuildArrays() {
  // Reset arrays and repopulate with data
  blockList = document.querySelectorAll('.drag-item-list');
  for (i = 0; i < blockList.length; i++) {
    blockObjects[i].actionItems = Array.from(blockList[i].children).map(item => item.textContent);
  }
  // Update DOM
  updateDOM();
}

/** Drag & Drop Functionality */
// When Item Starts Dragging
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

// When a draggable item enters a column (drop area)
function dragEnter(column) {
  blockList = document.querySelectorAll('.drag-item-list');
  blockList[column].classList.add('over');
  currentColumn = column;
}

// Allow items to be dragged into columns
function allowDrop(e) {
  e.preventDefault();
}

// Dropping items into columns
function drop(e) {
  e.preventDefault();
  blockList = document.querySelectorAll('.drag-item-list');
  // Remove Background Color/Padding
  blockList.forEach((column) => {
    column.classList.remove('over');
  });
  // Add item to column (frontend effect)
  const parent = blockList[currentColumn];
  parent.appendChild(draggedItem);
  // Dragging complete
  dragging = false;
  // Update to reflect change in the columns
  rebuildArrays();
}


// Event Listeners
addNewBlock.addEventListener('click', storeBlocks);

updateBlockBtn.addEventListener('click', (e) => {
  let indVal = updateBlockBtn.value;
  updateBlock(e, indVal);
});
deleteBlockBtn.addEventListener('click', (e) => {
  let indVal = deleteBlockBtn.value;
  deleteBlock(e, indVal);
});

addModalShow.addEventListener('click', () => {
  updateBlockBtn.style.display = 'none';
  deleteBlockBtn.style.display = 'none';
  addNewBlock.style.display = 'block';
  resetModal();
  showModal('Add New Block');
});

modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

// On Load
updateDOM();

