class Todo {
  constructor(container = ".container") {
    this.container = document.querySelector(container);
    this.todos = [];
    this.renderStatic();
    this.fetchLocalStorage();
  }

  fetchLocalStorage() {
    if (window.localStorage.getItem("todos") !== null) {
      this.todos = JSON.parse(window.localStorage.getItem("todos"));
      this.render();
    }
  }
  renderStatic() {
    const template = `<header class="header">
    <form>
    <label for="input">Type your todo here: </label>
        <input
          class="header__input"
          id="input"
          type="text"
          placeholder="Buy skunk essence 🦨"
        ></input>
        <button type="submit" class="header__button">Create</button>
        </form>
      </header>
      <section class="todos-container"></section>`;
    this.container.insertAdjacentHTML("beforeend", template);
    this.initCreateButton();
  }

  render() {
    const container = document.querySelector(".todos-container");
    container.innerHTML = "";
    this.todos.forEach((todo) => {
      const template = `<div class="todo ${
        todo.check === false ? "" : "todo_done"
      }" data-id=${todo.id} >
          <input id="checkbox" class="todo__radio" type="checkbox" ${
            todo.check === false ? "" : "checked"
          }/>
          <label class="label" for="checkbox"></label>
          <div class="wrap">
              <p class="todo__text ${todo.check === false ? "" : "text_lined"}">
                ${todo.value}
              </p>
          </div>
          <button class="todo__edit-button">Edit</button>
          <button class="todo__delete-button">Delete</button>
        </div>`;
      container.insertAdjacentHTML("afterbegin", template);
    });
    this.initDeleteButton();
    this.toggleEditConfirm();
    this.initCheckButton();
    window.localStorage.setItem("todos", JSON.stringify(this.todos));
  }

  create(value) {
    let newId = 0;
    if (this.todos.length !== 0) {
      newId = this.todos[this.todos.length - 1].id + 1;
    }
    this.todos.push({ id: newId, value: value, check: false });
    this.render();
  }

  delete(id) {
    this.todos.forEach((el, i) => {
      if (el.id === id) {
        this.todos.splice(i, 1);
      }
    });
    this.render();
  }
  edit(id, value) {
    this.todos.forEach((todo) => {
      if (todo.id === id) {
        todo.value = value;
      }
    });
    this.render();
  }
  check(id) {
    this.todos.forEach((todo) => {
      if (todo.id === id) {
        todo.check === false ? (todo.check = true) : (todo.check = false);
      }
    });
    this.render();
  }
  initCreateButton() {
    const input = document.querySelector(".header__input");
    const createButton = document.querySelector(".header__button");
    createButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.create(input.value);
      input.value = "";
    });
  }
  initDeleteButton() {
    const container = document.querySelector(".todos-container");
    const deleteButtons = this.container.querySelectorAll(
      ".todo__delete-button"
    );
    deleteButtons.forEach((butt) => {
      butt.addEventListener("click", (e) => {
        container.childNodes.forEach((todo, i) => {
          if (+todo.dataset.id === +e.target.parentNode.dataset.id) {
            this.delete(+e.target.parentNode.dataset.id);
          }
        });
      });
    });
  }
  toggleEditConfirm() {
    const editButtons = this.container.querySelectorAll(".todo__edit-button");
    editButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        if (e.target.textContent === "Edit") {
          this.editButton(button);
          e.target.textContent = "Confirm";
        } else if (e.target.textContent === "Confirm") {
          this.confirmButton(button);
          e.target.textContent = "Edit";
        }
      });
    });
  }
  editButton(button) {
    const textVal = button.parentNode
      .querySelector(".todo__text")
      .textContent.trim();
    button.parentNode.querySelector(".wrap").innerHTML = `
        <input class="edit" type="text" value="${textVal}" />`;
  }
  confirmButton(button) {
    const curId = +button.parentNode.dataset.id;
    const input = button.parentNode.querySelector(".edit").value;
    this.edit(curId, input);
  }
  initCheckButton() {
    const checkboxes = this.container.querySelectorAll(".label");
    checkboxes.forEach((box) => {
      box.addEventListener("click", (e) => {
        this.check(+box.parentNode.dataset.id);
      });
    });
  }
}

new Todo();
