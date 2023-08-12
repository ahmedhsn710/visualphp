// golbal variables
const draggables = document.querySelectorAll('.draggable')
const droparea = document.querySelector('.workspace')
let vararray = []
let funarray = []
let selectedFunction = ""
let selectedFunctionParas = 0
const operators = ["+", "-", "*", "/", "%", "."]
const compoper = [">", "<", "==", "===", ">=", "<=", "!=", "!=="]
// Ensure that the input is not a PHP reserved keyword
const reservedKeywords = [
  'abstract',
  'and',
  'array',
  'as',
  'break',
  'callable',
  'case',
  'catch',
  'class',
  'clone',
  'const',
  'continue',
  'declare',
  'default',
  'die',
  'do',
  'echo',
  'else',
  'elseif',
  'empty',
  'enddeclare',
  'endfor',
  'endforeach',
  'endif',
  'endswitch',
  'endwhile',
  'eval',
  'exit',
  'extends',
  'final',
  'finally',
  'for',
  'foreach',
  'function',
  'global',
  'goto',
  'if',
  'implements',
  'include',
  'include_once',
  'instanceof',
  'insteadof',
  'interface',
  'isset',
  'list',
  'namespace',
  'new',
  'or',
  'print',
  'private',
  'protected',
  'public',
  'require',
  'require_once',
  'return',
  'static',
  'switch',
  'throw',
  'trait',
  'try',
  'unset',
  'use',
  'var',
  'while',
  'xor',
]
let clickCounts = {}


// utility functions

// displaying info div function
function startingInfo(){
  document.getElementById('main').classList.add('blur')
  form = 
    `
    <div class="popup-form" id="info-form">
    <form>
      <h1>Instructions for using this website</h1>
      <ul>
      <li>Drag the elements From the Components area to Workspace area</li>
      <li>Fill the required attributes to complete the component drop</li>
      <li>You can also move the lines in the workspace by draging them</li>
      <li>To delete a componenet click three time in a row on that element in 1s</li>
      <li>You can also code manually by use the manual code componenet</li>
      <li>After completing code click on the run button and the output will be displayed</li>
      </ul>
      <br>
      <button type="submit" style="margin-left: 40%">  OK !  </button>
    </form>
    </div>`

    const range = document.createRange()
    const formFragment = range.createContextualFragment(form)
    document.body.appendChild(formFragment)

    // Checking the submit event
    const formElement = document.getElementById("info-form")
    formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      document.getElementById('main').classList.remove('blur')
      formElement.remove()
    })

}

// check vaild php variable name
function isValidPhpVariableName(inputValue) {
  // Ensure that the input starts with a letter or underscore
  if (!inputValue.match(/^[a-zA-Z_]/)) {
    return false;
  }

  // Ensure that the input contains only letters, numbers, and underscores
  if (!inputValue.match(/^[\w_]+$/)) {
    return false;
  }

  if (reservedKeywords.indexOf(inputValue) !== -1) {
    return false;
  }

  // Input is a valid PHP variable name
  return true;
}

// create button functions
function createVariableButtons(buttondiv, textdiv) {
  const buttonsDiv = document.getElementById(buttondiv);
  const textarea = document.getElementById(textdiv);

  // Loop through the vararray and create a button for each element
  vararray.forEach((variableName) => {
    const button = document.createElement("button");
    button.textContent = variableName;

    // Add an event listener to the button to add the variable name to the text area
    button.addEventListener("click", (event) => {
      event.preventDefault(); // Remove the default form submission behavior
      textarea.value += "$" + variableName + " "; // Add variable name to text area
    });

    buttonsDiv.appendChild(button); // Add the button to the buttons div
  });
}

function createArthmeticButtons(buttondiv, textdiv) {
  const buttonsDiv = document.getElementById(buttondiv);
  const textarea = document.getElementById(textdiv);

  // Loop through the vararray and create a button for each element
  operators.forEach((operator) => {
    const button = document.createElement("button");
    button.textContent = operator;

    // Add an event listener to the button to add the variable name to the text area
    button.addEventListener("click", (event) => {
      event.preventDefault(); // Remove the default form submission behavior
      textarea.value += " " + operator + " "; // Add variable name to text area
    });

    buttonsDiv.appendChild(button); // Add the button to the buttons div
  });
}

function createComparisonButtons(buttondiv, textdiv) {
  const buttonsDiv = document.getElementById(buttondiv);
  const textarea = document.getElementById(textdiv);

  // Loop through the vararray and create a button for each element
  compoper.forEach((operator) => {
    const button = document.createElement("button");
    button.textContent = operator;

    // Add an event listener to the button to add the variable name to the text area
    button.addEventListener("click", (event) => {
      event.preventDefault(); // Remove the default form submission behavior
      textarea.value += " " + operator + " "; // Add variable name to text area
    });

    buttonsDiv.appendChild(button); // Add the button to the buttons div
  });
}

// returns the element that is below the current y position
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect()
    const offset = y - box.top - box.height / 2
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child }
    } else {
      return closest
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element
}

// reads all the text in the divs and creates code
function getTextInDivs(element) {
  let text = '';

  const divNodes = element.getElementsByTagName('div');
  for (let i = 0; i < divNodes.length; i++) {
    if (i == 0 || i == 1) {
      continue
    }
    text += divNodes[i].textContent.trim() + '\n';
  }

  return text.trim();
}

// create input form for function paramaters
function createInputLines(number) {
  let inputLinesHtml = `<div class="popup-form" id="input-var-form">
  <form>`;
  for (var i = 1; i <= number; i++) {
    inputLinesHtml += "<label for='inputLine" + i + "'>Input Line " + i + ":</label>";
    inputLinesHtml += "<input type='text' id='inputLine" + i + "' name='inputLine" + i + "' required><br>";
  }

  inputLinesHtml += `<button type="submit">Submit</button></form> </div>`

  
  return inputLinesHtml;
}

// reseting the clickcount 
function resetCount() {
  clickCounts = {}
}

// add eventlisteners to new created elements
function addlisteners(newnode) {
  newnode.addEventListener('dragstart', () => {
    newnode.classList.add('dragging')
  })

  newnode.addEventListener('dragend', () => {
    newnode.classList.remove('dragging')
  })

  newnode.addEventListener('click', () => {
    const id = newnode.id;
    clickCounts[id] = (clickCounts[id] || 0) + 1;

    // Check if the div has been clicked twice in a row
    if (clickCounts[id] === 3) {
      // Delete the div
      newnode.classList.add("shrink");
      setTimeout(() => {
        newnode.parentNode.removeChild(newnode);
      }, 1500);
      delete clickCounts[id];
    }
  });
}

function addlisteners(newnode1, newnode2) {
  newnode1.addEventListener('dragstart', () => {
    newnode1.classList.add('dragging')
  })

  newnode1.addEventListener('dragend', () => {
    newnode1.classList.remove('dragging')
  })

  newnode1.addEventListener('click', () => {
    const id = newnode1.id;
    clickCounts[id] = (clickCounts[id] || 0) + 1;

    // Check if the div has been clicked twice in a row
    if (clickCounts[id] === 3) {
      // Delete the div
      newnode1.classList.add("shrink");
      newnode2.classList.add("shrink");
      setTimeout(() => {
        newnode1.parentNode.removeChild(newnode1);
        newnode2.parentNode.removeChild(newnode2);
      }, 1500);
      delete clickCounts[id];
    }
  });
}

function addlisteners(newnode1, newnode2, newnode3, newnode4, newnode5) {
  newnode1.addEventListener('dragstart', () => {
    newnode1.classList.add('dragging')
  })

  newnode1.addEventListener('dragend', () => {
    newnode1.classList.remove('dragging')
  })

  newnode1.addEventListener('click', () => {
    const id = newnode1.id;
    clickCounts[id] = (clickCounts[id] || 0) + 1;

    // Check if the div has been clicked twice in a row
    if (clickCounts[id] === 3) {
      // Delete the div
      newnode1.classList.add("shrink");
      newnode2.classList.add("shrink");
      newnode3.classList.add("shrink");
      newnode4.classList.add("shrink");
      newnode5.classList.add("shrink");
      setTimeout(() => {
        newnode1.parentNode.removeChild(newnode1);
        newnode2.parentNode.removeChild(newnode2);
        newnode3.parentNode.removeChild(newnode3);
        newnode4.parentNode.removeChild(newnode4);
        newnode5.parentNode.removeChild(newnode5);
      }, 1500);
      delete clickCounts[id];
    }
  });
}

setInterval(resetCount, 1000);


// dragging css
draggables.forEach(draggable => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging')
  })

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging')
  })
})

// removing default behaviour
droparea.addEventListener('dragover', e => {
  e.preventDefault()
})

// on drop functionality
droparea.addEventListener('drop', e => {

  // getting the draged element
  const draggable = document.querySelector('.dragging')

  // getting the element before which is the position of element being dragged
  const afterElement = getDragAfterElement(droparea, e.clientY)

  // If it is variable 
  if (draggable.getAttribute('comp') == 'variable') {

    // Blurring the background
    droparea.classList.add('blur')

    // Creating a form and appending it as a node 
    const form =
      `<div class="popup-form" id="variable-form" class="draggable" draggable="true">
        <form>
          <label for="name-input">Name:</label>
          <input type="text" id="name-input" required>

          <label for="value-input">Value:</label>
          <input type="text" id="value-input" required>

          <button type="submit">Submit</button>
        </form>
      </div>`

    const center = document.getElementById('center')
    const range = document.createRange()
    const formFragment = range.createContextualFragment(form)
    center.appendChild(formFragment)


    // Checking the submit event
    const formElement = document.getElementById("variable-form")
    formElement.addEventListener('submit', (event) => {
      event.preventDefault();

      // Getting the values
      const nameInput = document.getElementById('name-input')
      const valueInput = document.getElementById('value-input')

      const name = nameInput.value
      const value = valueInput.value

      let vaildPhp = isValidPhpVariableName(name)

      if (vaildPhp) {
        // Creating php code node and appending it to droparea
        const node = `<div class="draggable" draggable="true" comp="text">$${name} = "${value}";</div>`
        const newnode = range.createContextualFragment(node).querySelector('.draggable')

        if (afterElement == null) {
          droparea.appendChild(newnode)
        } else {
          droparea.insertBefore(newnode, afterElement)
        }
        vararray.push(name)
        addlisteners(newnode)

        // Removing the blur
        droparea.classList.remove('blur')

        // Removing the form
        document.getElementById(`variable-form`).remove();
      }
      else {
        alert('Not valid php variable name')
      }
    })
  }

  // If it is echo 
  if (draggable.getAttribute('comp') == 'echo') {

    // Blurring the background
    droparea.classList.add('blur')

    // Creating a form and appending it as a node 
    const form =
      `<div class="popup-form" id="echo-form">
        <form>
          <label for="text-input">Text:</label>
          <textarea type="text" id="text-input" required></textarea>

          <h5>variables & operators</h5>
          <div id='echo-buttons'></div>

          <button type="submit">Submit</button>
        </form>
      </div>`

    const center = document.getElementById('center')
    const range = document.createRange()
    const formFragment = range.createContextualFragment(form)
    center.appendChild(formFragment)
    createVariableButtons('echo-buttons', 'text-input')
    createArthmeticButtons('echo-buttons', 'text-input')

    // Checking the submit event
    const formElement = document.getElementById("echo-form")
    formElement.addEventListener('submit', (event) => {
      event.preventDefault();

      // Getting the values
      const textInput = document.getElementById('text-input')

      const text = textInput.value

      // Creating php code node and appending it to droparea
      const node = `<div class="draggable" draggable="true" comp="text">echo "${text}";</div>`
      const newnode = range.createContextualFragment(node).querySelector('.draggable')

      if (afterElement == null) {
        droparea.appendChild(newnode)
      } else {
        droparea.insertBefore(newnode, afterElement)
      }

      addlisteners(newnode)

      // Removing the blur
      droparea.classList.remove('blur')

      // Removing the form
      document.getElementById(`echo-form`).remove();
    })
  }

  // If it is comment 
  if (draggable.getAttribute('comp') == 'comment') {

    // Blurring the background
    droparea.classList.add('blur')

    // Creating a form and appending it as a node 
    const form =
      `<div class="popup-form" id="comment-form">
        <form>
          <label for="text-input">Text:</label>
          <input type="text" id="text-input" required>

          <button type="submit">Submit</button>
        </form>
      </div>`

    const center = document.getElementById('center')
    const range = document.createRange()
    const formFragment = range.createContextualFragment(form)
    center.appendChild(formFragment)


    // Checking the submit event
    const formElement = document.getElementById("comment-form")
    formElement.addEventListener('submit', (event) => {
      event.preventDefault();

      // Getting the values
      const textInput = document.getElementById('text-input')

      const text = textInput.value

      // Creating php code node and appending it to droparea
      const node = `<div class="draggable" draggable="true" comp="text">// ${text}</div>`
      const newnode = range.createContextualFragment(node).querySelector('.draggable')

      if (afterElement == null) {
        droparea.appendChild(newnode)
      } else {
        droparea.insertBefore(newnode, afterElement)
      }

      addlisteners(newnode)

      // Removing the blur
      droparea.classList.remove('blur')

      // Removing the form
      document.getElementById(`comment-form`).remove();
    })
  }

  // If it is for 
  if (draggable.getAttribute('comp') == 'for') {

    // Blurring the background
    droparea.classList.add('blur')

    // Creating a form and appending it as a node 
    const form =
      `<div class="popup-form" id="for-form">
        <form>
          <label for="itrations">Itrations:</label>
          <input type="value" id="itrations" required>

          <h5>variables & operators</h5>
          <div id='for-buttons'></div>

          <button type="submit">Submit</button>
        </form>
      </div>`

    const center = document.getElementById('center')
    const range = document.createRange()
    const formFragment = range.createContextualFragment(form)
    center.appendChild(formFragment)
    createVariableButtons('for-buttons', 'itrations')


    // Checking the submit event
    const formElement = document.getElementById("for-form")
    formElement.addEventListener('submit', (event) => {
      event.preventDefault();

      // Getting the values
      const conditionInput = document.getElementById('itrations')

      const condition = conditionInput.value

      // Creating php code node and appending it to droparea
      const node1 = `<div class="draggable" draggable="true" comp="text">for ($i = 0; $i < ${condition}; $i++) {</div>`
      const node2 = `<div class="draggable" draggable="true" comp="text">}</div>`
      let newnode1 = range.createContextualFragment(node1).querySelector('.draggable')
      let newnode2 = range.createContextualFragment(node2).querySelector('.draggable')
      if (afterElement == null) {
        droparea.appendChild(newnode1)
      } else {
        droparea.insertBefore(newnode1, afterElement)
      }

      addlisteners(newnode1, newnode2)


      if (afterElement == null) {
        droparea.appendChild(newnode2)
      } else {
        droparea.insertBefore(newnode2, afterElement)
      }

      addlisteners(newnode2, newnode1)

      // Removing the blur
      droparea.classList.remove('blur')

      // Removing the form
      document.getElementById(`for-form`).remove();

    })
  }

  // If it is while 
  if (draggable.getAttribute('comp') == 'while') {

    // Blurring the background
    droparea.classList.add('blur')

    // Creating a form and appending it as a node 
    const form =
      `<div class="popup-form" id="while-form">
        <form>
          <label for="condition-input">Condition:</label>
          <textarea type="text" id="condition-input" required></textarea>

          <h5>variables & operators</h5>
          <div id='while-buttons'></div>

          <button type="submit">Submit</button>
        </form>
      </div>`

    const center = document.getElementById('center')
    const range = document.createRange()
    const formFragment = range.createContextualFragment(form)
    center.appendChild(formFragment)
    createVariableButtons('while-buttons', 'condition-input')
    createComparisonButtons('while-buttons', 'condition-input')


    // Checking the submit event
    const formElement = document.getElementById("while-form")
    formElement.addEventListener('submit', (event) => {
      event.preventDefault();

      // Getting the values
      const conditionInput = document.getElementById('condition-input')

      const condition = conditionInput.value

      // Creating php code node and appending it to droparea
      const node1 = `<div class="draggable" draggable="true" comp="text">while (${condition}) {</div>`
      const node2 = `<div class="draggable" draggable="true" comp="text">}</div>`
      let newnode1 = range.createContextualFragment(node1).querySelector('.draggable')
      let newnode2 = range.createContextualFragment(node2).querySelector('.draggable')
      if (afterElement == null) {
        droparea.appendChild(newnode1)
      } else {
        droparea.insertBefore(newnode1, afterElement)
      }

      addlisteners(newnode1, newnode2)


      if (afterElement == null) {
        droparea.appendChild(newnode2)
      } else {
        droparea.insertBefore(newnode2, afterElement)
      }

      addlisteners(newnode2, newnode1)

      // Removing the blur
      droparea.classList.remove('blur')

      // Removing the form
      document.getElementById(`while-form`).remove();

    })
  }

  // If it is if 
  if (draggable.getAttribute('comp') == 'if') {

    // Blurring the background
    droparea.classList.add('blur')

    // Creating a form and appending it as a node 
    const form =
      `<div class="popup-form" id="if-form">
        <form>
          <label for="condition-input">Condition:</label>
          <textarea type="text" id="condition-input" required></textarea>

          <h5>variables & operators</h5>
          <div id='if-buttons'></div>

          <button type="submit">Submit</button>
        </form>
      </div>`

    const center = document.getElementById('center')
    const range = document.createRange()
    const formFragment = range.createContextualFragment(form)
    center.appendChild(formFragment)
    createVariableButtons('if-buttons', 'condition-input')
    createComparisonButtons('if-buttons', 'condition-input')


    // Checking the submit event
    const formElement = document.getElementById("if-form")
    formElement.addEventListener('submit', (event) => {
      event.preventDefault();

      // Getting the values
      const conditionInput = document.getElementById('condition-input')

      const condition = conditionInput.value

      // Creating php code node and appending it to droparea
      const node1 = `<div class="draggable" draggable="true" comp="text">if (${condition}) {</div>`
      const node2 = `<div class="draggable" draggable="true" comp="text">}</div>`
      let newnode1 = range.createContextualFragment(node1).querySelector('.draggable')
      let newnode2 = range.createContextualFragment(node2).querySelector('.draggable')
      if (afterElement == null) {
        droparea.appendChild(newnode1)
      } else {
        droparea.insertBefore(newnode1, afterElement)
      }

      addlisteners(newnode1, newnode2)


      if (afterElement == null) {
        droparea.appendChild(newnode2)
      } else {
        droparea.insertBefore(newnode2, afterElement)
      }

      addlisteners(newnode2, newnode2)

      // Removing the blur
      droparea.classList.remove('blur')

      // Removing the form
      document.getElementById(`if-form`).remove();

    })
  }

  // If it is else-if 
  if (draggable.getAttribute('comp') == 'else-if') {

    // Blurring the background
    droparea.classList.add('blur')

    // Creating a form and appending it as a node 
    const form =
      `<div class="popup-form" id="else-if-form">
        <form>
          <label for="condition-input">Condition:</label>
          <textarea type="text" id="condition-input" required></textarea>

          <h5>variables & operators</h5>
          <div id='else-if-buttons'></div>

          <button type="submit">Submit</button>
        </form>
      </div>`

    const center = document.getElementById('center')
    const range = document.createRange()
    const formFragment = range.createContextualFragment(form)
    center.appendChild(formFragment)
    createVariableButtons('else-if-buttons', 'condition-input')
    createComparisonButtons('else-if-buttons', 'condition-input')


    // Checking the submit event
    const formElement = document.getElementById("else-if-form")
    formElement.addEventListener('submit', (event) => {
      event.preventDefault();

      // Getting the values
      const conditionInput = document.getElementById('condition-input')

      const condition = conditionInput.value

      // Creating php code node and appending it to droparea
      const node1 = `<div class="draggable" draggable="true" comp="text">else if (${condition}) {</div>`
      const node2 = `<div class="draggable" draggable="true" comp="text">}</div>`
      let newnode1 = range.createContextualFragment(node1).querySelector('.draggable')
      let newnode2 = range.createContextualFragment(node2).querySelector('.draggable')
      if (afterElement == null) {
        droparea.appendChild(newnode1)
      } else {
        droparea.insertBefore(newnode1, afterElement)
      }

      addlisteners(newnode1, newnode2)


      if (afterElement == null) {
        droparea.appendChild(newnode2)
      } else {
        droparea.insertBefore(newnode2, afterElement)
      }

      addlisteners(newnode2, newnode1)

      // Removing the blur
      droparea.classList.remove('blur')

      // Removing the form
      document.getElementById(`else-if-form`).remove();

    })
  }

  // If it is else
  if (draggable.getAttribute('comp') == 'else') {

    const range = document.createRange()
    // Creating php code node and appending it to droparea
    const node1 = `<div class="draggable" draggable="true" comp="text">else {</div>`
    const node2 = `<div class="draggable" draggable="true" comp="text">}</div>`
    let newnode1 = range.createContextualFragment(node1).querySelector('.draggable')
    let newnode2 = range.createContextualFragment(node2).querySelector('.draggable')
    if (afterElement == null) {
      droparea.appendChild(newnode1)
    } else {
      droparea.insertBefore(newnode1, afterElement)
    }

    addlisteners(newnode1, newnode2)


    if (afterElement == null) {
      droparea.appendChild(newnode2)
    } else {
      droparea.insertBefore(newnode2, afterElement)
    }

    addlisteners(newnode2, newnode1)
  }

  // If it is manual code 
  if (draggable.getAttribute('comp') == 'code') {

    // Blurring the background
    droparea.classList.add('blur')

    // Creating a form and appending it as a node 
    const form =
      `<div class="popup-form" id="code-form">
        <form>
          <label for="code">Code : </label>
          <textarea type="text" id="code" required></textarea>

          <h5>variables & operators</h5>
          <div id='code-buttons'></div>

          <button type="submit">Submit</button>
        </form>
      </div>`

    const center = document.getElementById('center')
    const range = document.createRange()
    const formFragment = range.createContextualFragment(form)
    center.appendChild(formFragment)
    createVariableButtons('code-buttons', 'code')
    createComparisonButtons('code-buttons', 'code')


    // Checking the submit event
    const formElement = document.getElementById("code-form")
    formElement.addEventListener('submit', (event) => {
      event.preventDefault();

      // Getting the values
      const conditionInput = document.getElementById('code')

      const condition = conditionInput.value

      // Creating php code node and appending it to droparea
      const node = `<div class="draggable" draggable="true" comp="text">${condition}</div>`
      let newnode = range.createContextualFragment(node).querySelector('.draggable')
      if (afterElement == null) {
        droparea.appendChild(newnode)
      } else {
        droparea.insertBefore(newnode, afterElement)
      }

      addlisteners(newnode)

      // Removing the blur
      droparea.classList.remove('blur')

      // Removing the form
      document.getElementById(`code-form`).remove();

    })
  }

  // If it is read-file 
  if (draggable.getAttribute('comp') == 'read-file') {

    // Blurring the background
    droparea.classList.add('blur')

    // Creating a form and appending it as a node 
    const form =
      `<div class="popup-form" id="read-file-form">
        <form>
          <label for="file-name">name :</label>
          <textarea type="text" id="file-name" required></textarea>

          <button type="submit">Submit</button>
        </form>
      </div>`

    const center = document.getElementById('center')
    const range = document.createRange()
    const formFragment = range.createContextualFragment(form)
    center.appendChild(formFragment)


    // Checking the submit event
    const formElement = document.getElementById("read-file-form")
    formElement.addEventListener('submit', (event) => {
      event.preventDefault();

      // Getting the values
      const fileInput = document.getElementById('file-name')

      const filename = fileInput.value


      // Creating php code node and appending it to droparea
      const node1 = `<div class="draggable" draggable="true" comp="text">$myfile = fopen("${filename}", "r");</div>`
      const node2 = `<div class="draggable" draggable="true" comp="text">while(!feof($myfile)) {</div>`
      const node3 = `<div class="draggable" draggable="true" comp="text">echo fgets($myfile) . "<br>";</div>`
      const node4 = `<div class="draggable" draggable="true" comp="text">}</div>`
      const node5 = `<div class="draggable" draggable="true" comp="text">fclose($myfile);</div>`
      let newnode1 = range.createContextualFragment(node1).querySelector('.draggable')
      let newnode2 = range.createContextualFragment(node2).querySelector('.draggable')
      let newnode3 = range.createContextualFragment(node3).querySelector('.draggable')
      let newnode4 = range.createContextualFragment(node4).querySelector('.draggable')
      let newnode5 = range.createContextualFragment(node5).querySelector('.draggable')
      if (afterElement == null) {
        droparea.appendChild(newnode1)
      } else {
        droparea.insertBefore(newnode1, afterElement)
      }

      addlisteners(newnode1, newnode2, newnode3, newnode4, newnode5)

      if (afterElement == null) {
        droparea.appendChild(newnode2)
      } else {
        droparea.insertBefore(newnode2, afterElement)
      }

      addlisteners(newnode2, newnode1, newnode3, newnode4, newnode5)

      if (afterElement == null) {
        droparea.appendChild(newnode3)
      } else {
        droparea.insertBefore(newnode3, afterElement)
      }

      addlisteners(newnode3, newnode2, newnode1, newnode4, newnode5)

      if (afterElement == null) {
        droparea.appendChild(newnode4)
      } else {
        droparea.insertBefore(newnode4, afterElement)
      }

      addlisteners(newnode4, newnode2, newnode3, newnode1, newnode5)

      if (afterElement == null) {
        droparea.appendChild(newnode5)
      } else {
        droparea.insertBefore(newnode5, afterElement)
      }

      addlisteners(newnode5, newnode2, newnode3, newnode4, newnode1)

      // Removing the blur
      droparea.classList.remove('blur')

      // Removing the form
      document.getElementById(`read-file-form`).remove();

    })
  }

  // If it is write-file 
  if (draggable.getAttribute('comp') == 'write-file') {

    // Blurring the background
    droparea.classList.add('blur')

    // Creating a form and appending it as a node 
    const form =
      `<div class="popup-form" id="write-file-form">
        <form>
          <label for="file-name">Name :</label>
          <input type="text" id="file-name" required>
          <label for="content">Content :</label>
          <textarea type="text" id="content" required></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>`

    const center = document.getElementById('center')
    const range = document.createRange()
    const formFragment = range.createContextualFragment(form)
    center.appendChild(formFragment)


    // Checking the submit event
    const formElement = document.getElementById("write-file-form")
    formElement.addEventListener('submit', (event) => {
      event.preventDefault();

      // Getting the values
      const fileInput = document.getElementById('file-name')
      const textInput = document.getElementById('content')

      const filename = fileInput.value
      const text = textInput.value

      // Creating php code node and appending it to droparea
      const node1 = `<div class="draggable" draggable="true" comp="text">$myfile = fopen("${filename}", "a");</div>`
      const node2 = `<div class="draggable" draggable="true" comp="text">$txt = "${text}";</div>`
      const node3 = `<div class="draggable" draggable="true" comp="text">fwrite($myfile, $txt);</div>`
      const node4 = `<div class="draggable" draggable="true" comp="text">fclose($myfile);</div>`
      let newnode1 = range.createContextualFragment(node1).querySelector('.draggable')
      let newnode2 = range.createContextualFragment(node2).querySelector('.draggable')
      let newnode3 = range.createContextualFragment(node3).querySelector('.draggable')
      let newnode4 = range.createContextualFragment(node4).querySelector('.draggable')
      if (afterElement == null) {
        droparea.appendChild(newnode1)
      } else {
        droparea.insertBefore(newnode1, afterElement)
      }

      newnode1.addEventListener('dragstart', () => {
        newnode1.classList.add('dragging')
      })

      newnode1.addEventListener('dragend', () => {
        newnode1.classList.remove('dragging')
      })

      newnode1.addEventListener('click', () => {
        const id = newnode1.id;
        clickCounts[id] = (clickCounts[id] || 0) + 1;

        // Check if the div has been clicked twice in a row
        if (clickCounts[id] === 3) {
          // Delete the div
          newnode1.classList.add("shrink");
          newnode2.classList.add("shrink");
          newnode3.classList.add("shrink");
          newnode4.classList.add("shrink");
          setTimeout(() => {
            newnode1.parentNode.removeChild(newnode1);
            newnode2.parentNode.removeChild(newnode2);
            newnode3.parentNode.removeChild(newnode3);
            newnode4.parentNode.removeChild(newnode4);
          }, 1500);
          delete clickCounts[id];
        }
      });

      if (afterElement == null) {
        droparea.appendChild(newnode2)
      } else {
        droparea.insertBefore(newnode2, afterElement)
      }

      newnode2.addEventListener('dragstart', () => {
        newnode2.classList.add('dragging')
      })

      newnode2.addEventListener('dragend', () => {
        newnode2.classList.remove('dragging')
      })

      newnode2.addEventListener('click', () => {
        const id = newnode2.id;
        clickCounts[id] = (clickCounts[id] || 0) + 1;

        // Check if the div has been clicked twice in a row
        if (clickCounts[id] === 3) {
          // Delete the div
          newnode1.classList.add("shrink");
          newnode2.classList.add("shrink");
          newnode3.classList.add("shrink");
          newnode4.classList.add("shrink");
          setTimeout(() => {
            newnode1.parentNode.removeChild(newnode1);
            newnode2.parentNode.removeChild(newnode2);
            newnode3.parentNode.removeChild(newnode3);
            newnode4.parentNode.removeChild(newnode4);
          }, 1500);
          delete clickCounts[id];
        }
      });

      if (afterElement == null) {
        droparea.appendChild(newnode3)
      } else {
        droparea.insertBefore(newnode3, afterElement)
      }

      newnode3.addEventListener('dragstart', () => {
        newnode3.classList.add('dragging')
      })

      newnode3.addEventListener('dragend', () => {
        newnode3.classList.remove('dragging')
      })

      newnode3.addEventListener('click', () => {
        const id = newnode3.id;
        clickCounts[id] = (clickCounts[id] || 0) + 1;

        // Check if the div has been clicked twice in a row
        if (clickCounts[id] === 3) {
          // Delete the div
          newnode1.classList.add("shrink");
          newnode2.classList.add("shrink");
          newnode3.classList.add("shrink");
          newnode4.classList.add("shrink");
          setTimeout(() => {
            newnode1.parentNode.removeChild(newnode1);
            newnode2.parentNode.removeChild(newnode2);
            newnode3.parentNode.removeChild(newnode3);
            newnode4.parentNode.removeChild(newnode4);
          }, 1500);
          delete clickCounts[id];
        }
      });

      if (afterElement == null) {
        droparea.appendChild(newnode4)
      } else {
        droparea.insertBefore(newnode4, afterElement)
      }

      newnode4.addEventListener('dragstart', () => {
        newnode4.classList.add('dragging')
      })

      newnode4.addEventListener('dragend', () => {
        newnode4.classList.remove('dragging')
      })

      newnode4.addEventListener('click', () => {
        const id = newnode4.id;
        clickCounts[id] = (clickCounts[id] || 0) + 1;

        // Check if the div has been clicked twice in a row
        if (clickCounts[id] === 3) {
          // Delete the div
          newnode1.classList.add("shrink");
          newnode2.classList.add("shrink");
          newnode3.classList.add("shrink");
          newnode4.classList.add("shrink");
          setTimeout(() => {
            newnode1.parentNode.removeChild(newnode1);
            newnode2.parentNode.removeChild(newnode2);
            newnode3.parentNode.removeChild(newnode3);
            newnode4.parentNode.removeChild(newnode4);
          }, 1500);
          delete clickCounts[id];
        }
      });

      // Removing the blur
      droparea.classList.remove('blur')

      // Removing the form
      document.getElementById(`write-file-form`).remove();

    })
  }

  // If it is create-function 
  if (draggable.getAttribute('comp') == 'create-function') {

    // Blurring the background
    droparea.classList.add('blur')

    // Creating a form and appending it as a node 
    const form =
      `<div class="popup-form" id="create-function-form">
        <form>
          <label for="name">Name :</label>
          <input type="value" id="name" required>
          <label for="no-para">Number of Parameters :</label>
          <input type="value" id="no-para" required>
          <button type="submit">Submit</button>
          <div id="inputLines"></div>
        </form>
      </div>`


    const center = document.getElementById('center')
    const range = document.createRange()
    const formFragment = range.createContextualFragment(form)
    center.appendChild(formFragment)


    // Checking the submit event
    let formElement = document.getElementById("create-function-form")
    formElement.addEventListener('submit', (event) => {
      event.preventDefault();

      // Getting the values
      const noparaInput = document.getElementById('no-para')
      const nopara = noparaInput.value
      const nameInput = document.getElementById('name')
      const name = nameInput.value
      funarray.push([name, nopara])
      // Removing the form
      formElement.remove();

      let newform = createInputLines(nopara);
      const center = document.getElementById('center')
      const range = document.createRange()
      const formFragment = range.createContextualFragment(newform)
      center.appendChild(formFragment)

      newform =document.getElementById('input-var-form')
      newform.addEventListener('submit', (event) => {
        event.preventDefault();
        let paras = ""
        for (let i = 0; i < nopara; i++) {
          paras += "$"
          paras += document.getElementById(`inputLine${i+1}`).value
          paras += ","
        }
        paras = paras.slice(0, -1)
        
        
        // Creating php code node and appending it to droparea
        const node1 = `<div class="draggable" draggable="true" comp="text">function ${name}(${paras}) {</div>`
        const node2 = `<div class="draggable" draggable="true" comp="text">}</div>`
        let newnode1 = range.createContextualFragment(node1).querySelector('.draggable')
        let newnode2 = range.createContextualFragment(node2).querySelector('.draggable')
        if (afterElement == null) {
          droparea.appendChild(newnode1)
        } else {
          droparea.insertBefore(newnode1, afterElement)
        }

        addlisteners(newnode1, newnode2)

        if (afterElement == null) {
          droparea.appendChild(newnode2)
        } else {
          droparea.insertBefore(newnode2, afterElement)
        }

        addlisteners(newnode2, newnode1)

        // Removing the blur
        droparea.classList.remove('blur')

        document.getElementById(`input-var-form`).remove();
      })

      
    })
  }

  // If it is call-function 
  if (draggable.getAttribute('comp') == 'call-function') {

    // Blurring the background
    droparea.classList.add('blur')

    // Creating a form and appending it as a node 
    const form =
      `<div class="popup-form" id="call-function-form">
        <form>
          <div id='fun-buttons'></div>
        </form>
      </div>`


    const center = document.getElementById('center')
    const range = document.createRange()
    const formFragment = range.createContextualFragment(form)
    center.appendChild(formFragment)

    const buttonsDiv = document.getElementById('fun-buttons');

    // Loop through the vararray and create a button for each element
    funarray.forEach((functionName) => {
      const button = document.createElement("button");
      button.textContent = functionName[0];
      button.value = functionName[1];
  
      // Add an event listener to the button to add the variable name to the text area
      button.addEventListener("click", (event) => {
        selectedFunction = button.textContent
        selectedFunctionParas = button.value
        document.getElementById('call-function-form').remove()
        let newform = createInputLines(selectedFunctionParas);
        const center = document.getElementById('center')
        const range = document.createRange()
        const formFragment = range.createContextualFragment(newform)
        center.appendChild(formFragment)
  
        newform =document.getElementById('input-var-form')
        newform.addEventListener('submit', (event) => {
          event.preventDefault();
          let paras = ""
          for (let i = 0; i < selectedFunctionParas; i++) {
            paras += ""
            paras += document.getElementById(`inputLine${i+1}`).value
            paras += ","
          }
          paras = paras.slice(0, -1)
          
          
          // Creating php code node and appending it to droparea
          const node = `<div class="draggable" draggable="true" comp="text"> ${selectedFunction}(${paras});</div>`
          let newnode = range.createContextualFragment(node).querySelector('.draggable')
          if (afterElement == null) {
            droparea.appendChild(newnode)
          } else {
            droparea.insertBefore(newnode, afterElement)
          }
  
          addlisteners(newnode)
  
          // Removing the blur
          droparea.classList.remove('blur')
  
          document.getElementById(`input-var-form`).remove();
        })
  
      });
  
      buttonsDiv.appendChild(button); // Add the button to the buttons div
    });

  }

  // If in the workspace
  if (draggable.getAttribute('comp') == 'text') {
    // console.log(afterElement)
    if (afterElement == null) {
      droparea.appendChild(draggable)
    } else {
      droparea.insertBefore(draggable, afterElement)
    }
  }
})

// sending php code to server and displaying the output
document.getElementById('run-button').addEventListener('click', () => {
  // reading code from divs
  let phpcode = getTextInDivs(droparea)
  // Sending the PHP code to the server
  fetch('server.php', {
    method: 'POST',
    body: JSON.stringify({ phpcode: phpcode }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.text())
    .then(output => {
      // Displaying the output to the user
      console.log(output);
      document.getElementById('output').innerHTML = output;
    })
    .catch(error => alert(error));
})


