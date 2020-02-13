/**
 * @class Model
 *
 * Manages the data of the application.
 */
class Model {
  constructor() {
    //Convert this to CRUD
    this.todos = JSON.parse(localStorage.getItem('todos')) || []
  }

  bindTodoListChanged(callback) {
    this.onTodoListChanged = callback
    console.log("changed");
  }

  _commit(todos) {
    this.onTodoListChanged(todos)
    localStorage.setItem('todos', JSON.stringify(todos))
    console.log("setItem");
  }

  addTodo(todoText, todoDescription, todoOpeningHours, todoLatitude, todoLongitude) {
    const todo = {
      id: this.todos.length > 0 ? this.todos[this.todos.length - 1].id + 1 : 1,
      text: todoText,
      description: todoDescription,
      openingHours: todoOpeningHours,
      latitude: todoLatitude,
      longitude: todoLongitude,
      complete: false,
    }
    this.todos.push(todo)
    this._commit(this.todos)
  }

  editTodo(id, updatedText) {
    this.todos = this.todos.map(todo =>
      todo.id === id ? { id: todo.id, text: updatedText, complete: todo.complete } : todo
    )

    this._commit(this.todos)
    console.log("edit_commit " + this.todos);
  }

  deleteTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id)

    this._commit(this.todos)
    console.log("edit_commit " + this.todos);
  }

  toggleTodo(id) {
    this.todos = this.todos.map(todo =>
      todo.id === id ? { id: todo.id, text: todo.text, complete: !todo.complete } : todo
    )

    this._commit(this.todos)
    console.log("toggle_commit " + this.todos);
  }
}

/**
 * @class View
 *
 * Visual representation of the model.
 */
class View {
  constructor() {
    this.app = this.getElement('#root')
    this.form = this.createElement('form')
    
    this.inputName = this.createElement('input')
    this.inputName.type = 'text'
    this.inputName.placeholder = 'Add Name'
    this.inputName.name = 'name'
    
    this.inputDescription = this.createElement('input')
    this.inputDescription.type = 'text'
    this.inputDescription.placeholder = 'Description'
    this.inputDescription.name = 'description'
    
    this.inputOpeningHours = this.createElement('input')
    this.inputOpeningHours.type = 'text'
    this.inputOpeningHours.placeholder = 'Opening Hours'
    this.inputOpeningHours.name = 'openingHours'
    
    this.inputLatitude = this.createElement('input')
    this.inputLatitude.type = 'text'
    this.inputLatitude.placeholder = 'Latitude'
    this.inputLatitude.name = 'latitude'
    
    this.inputLongitude = this.createElement('input')
    this.inputLongitude.type = 'text'
    this.inputLongitude.placeholder = 'Longitude'
    this.inputLongitude.name = 'longitude'
    
    this.submitButton = this.createElement('button')
    this.submitButton.textContent = 'Submit'
    this.form.append(this.inputName, this.inputDescription, this.inputOpeningHours, this.inputLatitude, this.inputLongitude, this.submitButton)
    this.title = this.createElement('h1')
    this.title.textContent = 'Places'
    this.todoList = this.createElement('ul', 'todo-list')
    this.app.append(this.title, this.form, this.todoList)
    this._temporaryTodoText = ''
    this._initLocalListeners()
  }

  get _todoText() {
    return this.inputName.value
  }
  get _todoDescription() {
    return this.inputDescription.value
  }
  get _todoOpeningHours() {
    return this.inputOpeningHours.value
  }
  get _todoLatitude() {
    return this.inputLatitude.value
  }
  get _todoLongitude() {
    return this.inputLongitude.value
  }
  
  

  _resetInput() {
    this.inputName.value = ''
    this.inputDescription.value = ''
    this.inputOpeningHours.value = ''
    this.inputLatitude.value = ''
    this.inputLongitude.value = ''
  }

  createElement(tag, className) {
    const element = document.createElement(tag)

    if (className) element.classList.add(className)

    return element
  }

  getElement(selector) {
    const element = document.querySelector(selector)

    return element
  }

  displayTodos(todos) {
    // Delete all nodes
    while (this.todoList.firstChild) {
      this.todoList.removeChild(this.todoList.firstChild)
    }

    // Show default message
    if (todos.length === 0) {
      const p = this.createElement('p')
      p.textContent = 'Nothing to do! Add a task?'
      this.todoList.append(p)
    } else {
      // Create nodes
      todos.forEach(todo => {
        const li = this.createElement('li')
        li.id = todo.id

        const checkbox = this.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.checked = todo.complete

        const spanName = this.createElement('span', 'name')
        spanName.contentEditable = true
        spanName.classList.add('editable')
        
        const spanDescription = this.createElement('span', 'description')
        spanDescription.contentEditable = true
        spanDescription.classList.add('editable')
        
        const spanOpeningHours = this.createElement('span', 'openingHours')
        spanOpeningHours.contentEditable = true
        spanOpeningHours.classList.add('editable')
        
        const spanLatitude = this.createElement('span', 'latitude')
        spanLatitude.contentEditable = true
        spanLatitude.classList.add('editable')
        
        const spanLongitude = this.createElement('span', 'longitude')
        spanLongitude.contentEditable = true
        spanLongitude.classList.add('editable')
        
        console.log(todo.id);

      /* if (todo.complete) {
          const strike = this.createElement('s')
          strike.textContent = todo.text
          spanName.append(strike)
        } else {
          spanName.textContent = todo.text
        } */
        spanName.textContent = todo.text
        spanDescription.textContent = todo.description
        spanOpeningHours.textContent = todo.openingHours
        spanLatitude.textContent = todo.latitude
        spanLongitude.textContent = todo.longitude

        const deleteButton = this.createElement('button', 'delete')
        deleteButton.textContent = 'Delete'
        li.append(/* checkbox,  */spanName, spanDescription, spanOpeningHours, spanLatitude, spanLongitude, deleteButton)

        // Append nodes
        this.todoList.append(li)
      })
    }

    // Debugging
    console.log(todos)
  }

  _initLocalListeners() {
    this.todoList.addEventListener('input', event => {
      if (event.target.className === 'editable') {
        this._temporaryTodoText = event.target.innerText
      }
    })
  }

  bindAddTodo(handler) {
    this.form.addEventListener('submit', event => {
      event.preventDefault()
      if (this._todoText || this._todoDescription || this._todoOpeningHours || this._todoLatitude || this._todoLongitude) {
        alert("handler: " + handler);
        handler(this._todoText, this._todoDescription, this._todoOpeningHours, this._todoLatitude, this._todoLongitude)
        this._resetInput()
        
      }
    })
  }

  bindDeleteTodo(handler) {
    this.todoList.addEventListener('click', event => {
      if (event.target.className === 'delete') {
        const id = parseInt(event.target.parentElement.id)

        handler(id)
      }
    })
  }

  bindEditTodo(handler) {
    this.todoList.addEventListener('focusout', event => {
      if (this._temporaryTodoText) {
        const id = parseInt(event.target.parentElement.id)

        handler(id, this._temporaryTodoText)
        this._temporaryTodoText = ''
      }
    })
  }

  bindToggleTodo(handler) {
    this.todoList.addEventListener('change', event => {
      if (event.target.type === 'checkbox') {
        const id = parseInt(event.target.parentElement.id)

        handler(id)
      }
    })
  }
}

/**
 * @class Controller
 *
 * Links the user input and the view output.
 *
 * @param model
 * @param view
 */
class Controller {
  constructor(model, view) {
    this.model = model
    this.view = view

    // Explicit this binding
    this.model.bindTodoListChanged(this.onTodoListChanged)
    this.view.bindAddTodo(this.handleAddTodo)
    this.view.bindEditTodo(this.handleEditTodo)
    this.view.bindDeleteTodo(this.handleDeleteTodo)
    this.view.bindToggleTodo(this.handleToggleTodo)

    // Display initial todos
    this.onTodoListChanged(this.model.todos)
  }

  onTodoListChanged = todos => {
    this.view.displayTodos(todos)
  }

  handleAddTodo = (todoText,todoDescription, todoOpeningHours, todoLatitude, todoLongitude) => {
    this.model.addTodo(todoText, todoDescription, todoOpeningHours, todoLatitude, todoLongitude)
  }

  handleEditTodo = (id, todoText) => {
    this.model.editTodo(id, todoText)
  }

  handleDeleteTodo = id => {
    this.model.deleteTodo(id)
  }

  handleToggleTodo = id => {
    this.model.toggleTodo(id)
  }
}

const app = new Controller(new Model(), new View())
