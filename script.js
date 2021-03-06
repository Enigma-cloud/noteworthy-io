/**
 * @author Enigma-cloud
 */
/** DOM Elements */
// Title
const mainTitle = document.getElementById('main-title');
// Templates
const templatesModalBtn = document.getElementById('templates-modal');
const templates = document.getElementById('templates');
const templateList = document.getElementById('template-list');
// Blocks
const dragContainer = document.getElementById('drag-container');
const dragList = document.getElementById('drag-list')
const blockForm = document.getElementById('block-form');
const blockName = document.getElementById('block-name');
const minActions = document.getElementById('min-num-actions');
const blockWeight = document.getElementById('block-weight');
const blockColour = document.getElementById('block-colour');
const updateBlockBtn = document.getElementById('update-block-btn');
const deleteBlockBtn = document.getElementById('delete-block-btn');
// Modal
const modal = document.getElementById('modal');
const addModalShow = document.getElementById('show-add-modal');
const modalClose = document.getElementById('close-modal');
const addNewBlock = document.getElementById('add-block-btn');
const saveWorkspace = document.getElementById('save-workspace-btn');


/** Global variables*/
// On load
let templatesShowing = true;
let updatedOnLoad = false;
// Initialize Arrays
let blockList;
let blockObjects = [];
// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

// Templates
function showTemplates() {
  if (templates.classList.contains('show-template') && mainTitle.classList.contains('centered')) {
    templates.classList.remove('show-template');
    mainTitle.classList.remove('centered');
    return
  } 
  else {
    templates.classList.add('show-template');
    mainTitle.classList.add('centered');
    return
  }
  
}

function buildClassicTodo() {
  // Reset Block objects array
  blockObjects = [];
  // Create Block data
  const toDo = {
    name: 'To do',
    numOfActions: '10',
    weighting: '10',
    colour: '#292f36',
    actionItems: ['Release the course', 'Sit back and relax']
  };
  const inProgress = {
    name: 'In-progress',
    numOfActions: '10',
    weighting: '10',
    colour: '#ffe66d',
    actionItems: ['Work on projects', 'Listen to music']
  };
  const completed = {
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

function buildDeepWork() {
  // Reset Block objects array
  blockObjects = [];
  // Create default blocks
  const deepWork = {
    name: 'Deep Work',
    numOfActions: '10',
    weighting: '10',
    colour: '#1c5d99',
    actionItems: ['Release the course', 'Sit back and relax']
  };
  const shallowWork = {
    name: 'Shallow Work',
    numOfActions: '10',
    weighting: '10',
    colour: '#bbcde5',
    actionItems: ['Work on projects', 'Listen to music']
  };
  // Push into Blocks objects array
  blockObjects.push(deepWork);
  blockObjects.push(shallowWork);
}

function buildEisenhower() {
    // Reset Block objects array
    blockObjects = [];
    // Create Block data
    const urgent = {
      name: 'Urgent',
      numOfActions: '10',
      weighting: '10',
      colour: '#1d3557',
      actionItems: ['Release the course', 'Sit back and relax']
    };
    const important = {
      name: 'Important',
      numOfActions: '10',
      weighting: '10',
      colour: '#a8dadc',
      actionItems: ['Work on projects', 'Listen to music']
    };
    const urgentImportant = {
      name: 'Urgent & Important',
      numOfActions: '10',
      weighting: '10',
      colour: '#44cf6c',
      actionItems: ['Being cool', 'Getting stuff done']
    };
    const delegated = {
      name: 'Delegated',
      numOfActions: '10',
      weighting: '10',
      colour: '#e63946',
      actionItems: ['Being cool', 'Getting stuff done']
    };
    // Push into main array
    blockObjects.push(urgent);
    blockObjects.push(important);
    blockObjects.push(urgentImportant);
    blockObjects.push(delegated);
}

function buildWorkspace(e) {
  if (e.target.parentNode.id === 'classic-todo') {
    buildClassicTodo();
  }
  else if (e.target.parentNode.id === 'deep-work') {
    buildDeepWork();
  }
  else if (e.target.parentNode.id === 'eisenhower-matrix') {
    buildEisenhower();
  }
  else if (e.target.parentNode.id === 'saved-workspace') {
    getSavedBlocks();
  }
  else {
    if (dragList.textContent !== '' && confirm('Do you want to erase the current workspace and create a new one?')) {
        dragList.textContent = '';
        blockObjects = [];
    }
  }
  // Build DOM elements
  templates.classList.remove('show-template');
  dragContainer.classList.add('drag-container');
  mainTitle.classList.remove('centered');
  updateDOM();
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

// Filter Arrays to remove empty items
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null);
  return filteredArray;
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

// Get Arrays from localStorage if available, set default values if not
function getSavedBlocks() {
  if (!localStorage.getItem('savedWorkspace') && localStorage.getItem('savedWorkspace').length === 0) {
    return
  }
  blockObjects = JSON.parse(localStorage.savedWorkspace);
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
    name: nameVal,
    numOfActions: minActionsNum,
    weighting: weight,
    colour: colourVal,
    actionItems: []
  };
  blockObjects.push(actionData);

  updateDOM();
  blockForm.reset();
  blockName.focus();
}

// Save data to local storage
function saveBlocks(name, data) {
  if (!name && !data) {
    return false
  }
  localStorage.setItem(`${name}`, JSON.stringify(data));
}

// Update Block attributes
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
  // Disable modal
  resetModal();
  modal.classList.remove('show-modal');

  updateDOM();
}

// Create Columns to store action items
function createColumn() {
  blockObjects.forEach((blockData, index) => {
    const { name, numOfActions, weighting, colour} = blockData;
    // Create Block Parts
    const actionBlock = document.createElement('li');
    const titleSpan = document.createElement('span');
    const titleText = document.createElement('h1');
    const blockEdit = document.createElement('i');
    
    const contentGroup = document.createElement('div');
    const actionList = document.createElement('ul');

    const buttonGroup = document.createElement('div');
    const blockAddBtn = document.createElement('div');
    const blockAddText = document.createElement('span');

    const blockSaveBtn = document.createElement('div');
    const blockSaveText = document.createElement('span');
    const textContainer = document.createElement('div');
    const textData = document.createElement('div');

    // Block
    actionBlock.classList.add('drag-block');
    actionBlock.classList.add('action-block');
    actionBlock.setAttribute('min-num-actions', numOfActions);
    actionBlock.setAttribute('column-weight', weighting)
    // Header
    titleSpan.classList.add('header');
    blockEdit.classList.add('far');
    blockEdit.classList.add('fa-edit');
    blockEdit.addEventListener('click', () => {
      updateModal(blockData, index);
    });
    titleText.textContent = name;
    titleSpan.appendChild(titleText);
    titleSpan.appendChild(blockEdit);
    changeBlockColour(titleSpan, colour);
    // Action List - Items
    contentGroup.classList.add('custom-scroll');
    actionList.classList.add('drag-item-list');
    actionList.setAttribute('ondrop', 'drop(event)');
    actionList.setAttribute('ondragover', 'allowDrop(event)');
    actionList.setAttribute('ondragenter', `dragEnter(${index})`);
    contentGroup.appendChild(actionList);
    // List Item - Buttons 
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
    // List Item - Inputs
    textContainer.classList.add('add-container');
    textData.classList.add('add-item');
    textData.contentEditable = true;
    textContainer.appendChild(textData);
    // Assemble Block
    actionBlock.appendChild(titleSpan);
    actionBlock.appendChild(contentGroup);
    actionBlock.appendChild(buttonGroup);
    actionBlock.appendChild(textContainer);
    dragList.appendChild(actionBlock);
  });
}

// Create DOM Elements for each action item
function createItemEl(actionItems, blockInd) {
  blockList = document.querySelectorAll('.drag-item-list');
  actionItems.forEach((text, itemInd) => {
    const listEl = document.createElement('li');
    const itemText = document.createElement('div');

    const optionsContainer = document.createElement('div');
    const iconContainer = document.createElement('div');
    const iconEl = document.createElement('i');

    const listContainer = document.createElement('div');
    const optionsList = document.createElement('ul');
    const removeOption = document.createElement('li');
    const crossOutOption = document.createElement('li');

    // Item
    listEl.classList.add('drag-item');
    listEl.draggable = true;
    listEl.setAttribute('ondragstart', 'drag(event)');
    listEl.id = itemInd;
    listEl.setAttribute('onfocusout', `updateItem(${blockInd}, ${itemInd})`);

    itemText.classList.add('drag-item-text');
    itemText.setAttribute('crossed', false);
    itemText.textContent = text;
    removeOption.textContent = 'Remove item';
    crossOutOption.textContent = 'Cross out'
  
    // Options
    optionsContainer.classList.add('item-options-container');

    listContainer.classList.add('item-list-container');
    optionsList.classList.add('item-options');
    optionsList.setAttribute('open', false);

    iconContainer.classList.add('item-icon-container');
    iconEl.classList.add('fas');
    iconEl.classList.add('fa-ellipsis-v');
    // Show options
    iconEl.addEventListener('click', () => {
      if (!optionsList.open) {
        optionsList.open = true;
        optionsList.classList.add('active');
        return
      }
      optionsList.open = false;
      optionsList.classList.remove('active');
    });
    
    // Remove item
    removeOption.addEventListener('click', () => {
      if (!confirm('Are you sure you want to remove this item?')) {
        return
      }
      updateItem(blockInd, itemInd, true);
    });

    // Cross out item
    crossOutOption.addEventListener('click', () => {
      if (itemText.crossed) {
        itemText.crossed = false;
        itemText.style.textDecoration = '';
      }
      else {
        itemText.crossed = true;
        itemText.style.textDecoration = 'line-through';
      }
      
    });

    // Click text to edit item
    itemText.addEventListener('click', () => {
      itemText.contentEditable = true
    });
    
    // Append to block
    optionsList.appendChild(removeOption);
    optionsList.appendChild(crossOutOption);
    iconContainer.appendChild(iconEl);
    listContainer.appendChild(optionsList);
    optionsContainer.appendChild(iconContainer);
    optionsContainer.appendChild(listContainer);

    listEl.appendChild(itemText);
    listEl.appendChild(optionsContainer);
    blockList[blockInd].appendChild(listEl);
  })
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Reset content
  dragList.textContent = '';
  // Build blocks
  createColumn();
  blockObjects.forEach((block, blockIndex) => {
    let filteredActions = filterArray(block.actionItems);
    createItemEl(filteredActions, blockIndex);
  });
}

// Update arrays after Drag & Drop change
function rebuildArrays() {
  // Reset arrays and repopulate with data
  blockList = document.querySelectorAll('.drag-item-list');
  for (i = 0; i < blockList.length; i++) {
    blockObjects[i].actionItems = Array.from(blockList[i].children).map(item => item.childNodes[0].textContent);
  }
  // Update DOM
  updateDOM();
}

// Update Item - Delete if necessary, or update Array value
function updateItem(blockInd, itemInd, textDelete=false) {
  const selectedArray = blockObjects[blockInd].actionItems;
  const selectedColumnEl = document.querySelectorAll('.drag-item-list')[blockInd].children;
  
  // Remove item if empty and is not being dragged
  if (!dragging) {
    if (!selectedColumnEl[itemInd].childNodes[0].textContent) {
      delete selectedArray[itemInd];
    }
    else if (textDelete) {
      delete selectedArray[itemInd];
    }
    else {
      selectedArray[itemInd] = selectedColumnEl[itemInd].childNodes[0].textContent;
    }
    updateDOM();
  }
}

// Add new item to block list -> Reset textbox
function addToBlock(block) {
  const addItems = document.querySelectorAll('.add-item');
  const selectedArray = blockObjects[block].actionItems;
  const itemText = addItems[block].textContent;

  if (!itemText) {
    // Close if input box empty
    return 
  }
  
  selectedArray.push(itemText);
  addItems[block].textContent = "";
  updateDOM();
}

// Show Add Item input box
function showInputBox(block) {
  let addBtns = document.querySelectorAll('.add-btn:not(.solid)');
  let saveItemBtns = document.querySelectorAll('.solid');
  let addItemContainers = document.querySelectorAll('.add-container');

  addBtns[block].style.visibility = 'hidden';
  saveItemBtns[block].style.display = 'flex';
  addItemContainers[block].style.display = 'flex';
}

// Hide Add Item input box
function hideInputBox(block) {
  let addBtns = document.querySelectorAll('.add-btn:not(.solid)');
  let saveItemBtns = document.querySelectorAll('.solid');
  let addItemContainers = document.querySelectorAll('.add-container');

  addBtns[block].style.visibility = 'visible';
  saveItemBtns[block].style.display = 'none';
  addItemContainers[block].style.display = 'none';
  addToBlock(block);
}


/** Drag & Drop Functionality */
// When Item Starts Dragging
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

// When a draggable item enters a column (drop area)
function dragEnter(block) {
  blockList = document.querySelectorAll('.drag-item-list');
  blockList[block].classList.add('over');
  currentColumn = block;
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
  rebuildArrays();
}


/** Event Listeners */
saveWorkspace.addEventListener('click', () => {
  if (!confirm('Do you want to save changes to local storage?')) {
    return
  }
  saveBlocks('savedWorkspace', blockObjects);
  // Show toast message?
});
addNewBlock.addEventListener('click', storeBlocks);
updateBlockBtn.addEventListener('click', (e) => {
  let indVal = updateBlockBtn.value;
  updateBlock(e, indVal);
});
deleteBlockBtn.addEventListener('click', (e) => {
  let indVal = deleteBlockBtn.value;
  deleteBlock(e, indVal);
});
templatesModalBtn.addEventListener('click', showTemplates);
addModalShow.addEventListener('click', () => {
  updateBlockBtn.style.display = 'none';
  deleteBlockBtn.style.display = 'none';
  addNewBlock.style.display = 'block';
  resetModal();
  showModal('Add New Block');
});
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));
templateList.addEventListener('click', (e) => {
  buildWorkspace(e);
});
window.onbeforeunload = function(){
  return 'Are you sure you want to leave?';
};

// On Load
if (templatesShowing) {
  showTemplates();
}