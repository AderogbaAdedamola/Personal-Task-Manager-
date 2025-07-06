taskName = JSON.parse(localStorage.getItem('taskNameArray')) || [];
let inputItems = JSON.parse(localStorage.getItem('taskItemsArray')) || [];

function saveToStorage() {
  localStorage.setItem('taskNameArray', JSON.stringify(taskName));
  localStorage.setItem('taskItemsArray', JSON.stringify(inputItems));

}

const container = document.getElementById('container');

const addTaskDiv = document.getElementById('add-task');

function addTask() {
  addTaskDiv.style.display = 'none';
  const inputDiv = document.createElement("div")
  inputDiv.className = 'input-div';
  const inputDivText = document.createElement('h2')
  inputDivText.textContent = 'Enter New Task Name :'
  const inputDivInput = document.createElement('input');
  inputDivInput.type = 'text';
  inputDivInput.className = 'input-div-input';
  inputDivInput.placeholder = 'Enter Task Name';
  const inputDivError = document.createElement('div')
  inputDivError.className = 'error-message'
  inputDivError.textContent = '- - -input task name- - -'
  const inputDivButton = document.createElement('button')
  inputDivButton.id = 'input-div-button';
  inputDivButton.textContent = 'Next';
  inputDivButton.onclick = createNext;
  inputDivButton.className = 'test'
  inputDiv.appendChild(inputDivText);
  inputDiv.appendChild(inputDivInput);
  inputDiv.appendChild(inputDivError);
  inputDiv.appendChild(inputDivButton);
  container.appendChild(inputDiv);
};


function createNext() {
  document.querySelector('.input-div').style.display = 'none';
  const inputDivValue = document.querySelector('.input-div-input').value.trim();
  if (inputDivValue === '') {
    document.querySelector('.error-message').style.display = 'block';

    console.log(inputDivValue)
  } else {
    taskName.push({ taskNameText: inputDivValue });
    saveToStorage();

    const selectDiv = document.createElement('div');
    selectDiv.className = 'select-div';

    const label = document.createElement('label');
    label.textContent = 'Select the of sub-task inorder to achieve the task stated ';
    label.htmlFor = 'numCheckboxes';

    const select = document.createElement('select');
    select.id = 'numCheckboxes';
    const br = document.createElement('br')
    const br1 = document.createElement('br')
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Select --';
    select.appendChild(defaultOption);

    for (let i = 1; i <= 5; i++) {
      const option = document.createElement('option');

      option.value = i;
      option.textContent = i;
      select.appendChild(option);
    }

    const selectButton = document.createElement('button');
    selectButton.textContent = 'Create Task';
    selectButton.onclick = createInputDiv;

    selectDiv.appendChild(label);
    selectDiv.appendChild(br);
    selectDiv.appendChild(select);
    selectDiv.appendChild(br1);
    selectDiv.appendChild(selectButton);
    container.appendChild(selectDiv);
  }

};

function createInputDiv() {
  document.querySelector('.select-div').style.display = 'none';
  const select = document.getElementById('numCheckboxes');
  const num = parseInt(select.value);

  if (isNaN(num)) {
    alert('Please select a number between 1 and 5');
    return;
  }

  const inputDiv = document.createElement('div');
  inputDiv.className = 'input-div';

  const inputArray = [];

  for (let i = 1; i <= num; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = `cb-${Date.now()}-${i}`;
    input.className = 'input-text'
    input.setAttribute('data-key', `value${i}`);

    const br = document.createElement('br');

    inputArray.push(input);
    inputDiv.appendChild(input);
    inputDiv.appendChild(br);

  }
  const button = document.createElement('button')
  button.textContent = 'create new task'
  button.onclick = createNewTask;
  inputDiv.appendChild(button);
  container.appendChild(inputDiv);

};

function createNewTask() {
  document.querySelector('.input-div').style.display = 'none';
  const text = document.getElementsByClassName('input-text');
  const select = document.getElementById('numCheckboxes');
  const num = parseInt(select.value);

  const obj = {};

  for (let i = 0; i <= num && i < text.length; i++) {
    const key = text[i].getAttribute('data-key');
    const value = text[i].value.trim();

    if (value === '') {
      alert('Please fill in all selected inputs.');
      return; // stop the function
    }

    obj[key] = value;
  }

  inputItems.push(obj);
  saveToStorage();
  renderItems();
};


function renderItems() {
  container.innerHTML = ''; // Clear previous items

  taskName.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'input-div';

    const textSpan = document.createElement('span');
    textSpan.textContent = item.taskNameText;
    const br = document.createElement('br');
    div.appendChild(textSpan);
     div.appendChild(br);
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'buttons';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => {
      taskName.splice(index, 1);
      inputItems.splice(index, 1);
      saveToStorage();
      renderItems();
    };

    const editBtn = document.createElement('button');
    editBtn.className = 'btn edit-btn';
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => {
      const newText = prompt('Edit the task name:', item.taskNameText);
      if (newText !== null && newText.trim() !== '') {
        taskName[index].taskNameText = newText.trim();
        saveToStorage();
        renderItems();
      }
    };

    // Start of checkbox rendering
    const checkboxes = [];
    const subtasks = inputItems[index];

    for (const key in subtasks) {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `cb-${Date.now()}-${key}`;

      const label = document.createElement('label');
      label.htmlFor = checkbox.id;
      label.textContent = subtasks[key];

      const br = document.createElement('br');

      checkbox.addEventListener('change', () => {
        checkCompletion();
      });

      checkboxes.push(checkbox);
      div.appendChild(checkbox);
      div.appendChild(label);
      div.appendChild(br);
    }

    const checkCompletion = () => {
      const allChecked = checkboxes.every(cb => cb.checked);
      if (allChecked) {
        checkboxes.forEach(cb => cb.disabled = true);
        div.classList.add('completed');

        const completedMsg = document.createElement('div');
        completedMsg.className = 'completed-message';
        completedMsg.textContent = 'COMPLETED';
        completedMsg.style.color = 'green';
        div.appendChild(completedMsg);
      }
    };
    // End of checkbox rendering

    buttonsDiv.appendChild(editBtn);
    buttonsDiv.appendChild(deleteBtn);
    div.appendChild(buttonsDiv);

    container.appendChild(div);
  });

  document.getElementById('add-task').style.display = 'block';
};

renderItems();
