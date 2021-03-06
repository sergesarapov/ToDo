class Todo {
  constructor(container = ".container") {
    this.container = document.querySelector(container);
    this.todos = [];
    this.renderStatic();
    this.fetchLocalStorage();
  }

  fetchLocalStorage() {
    this.todos = JSON.parse(window.localStorage.getItem("todos"));
    this.render();
  }
  renderStatic() {
    const template = `<header class="header">
    <label for="input">Type your todo here: </label>
        <input
          class="header__input"
          id="input"
          type="text"
          placeholder="Brush your teeth with my dick"
        ></input>
        <button class="header__button">Create</button>
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
          <input class="todo__radio" type="checkbox" ${
            todo.check === false ? "" : "checked"
          }/>
         <div class="wrap">
          <p class="todo__text ${todo.check === false ? "" : "text_lined"}">
            ${todo.value}
          </p>
         </div>
          <button class="todo__edit-button">Edit</button>
          <button class="todo__delete-button">Delete</button>
        </div>`;
      container.insertAdjacentHTML("beforeend", template);
    });
    this.initDeleteButton();
    this.initEditButton();
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
    createButton.addEventListener("click", () => {
      this.create(input.value);
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
  initEditButton() {
    const editButtons = this.container.querySelectorAll(".todo__edit-button");
    editButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const textVal = button.parentNode
          .querySelector(".todo__text")
          .textContent.trim();

        button.parentNode.querySelector(".todo__text").innerHTML = `
        <input class="edit" type="text" value="${textVal}" />
        <button class="todo__edit-button_pushed">Confirm</button>`;
        const curId = +button.parentNode.dataset.id;
        const butt = button.parentNode.querySelector(
          ".todo__edit-button_pushed"
        );
        button.style = "visibility: hidden;";
        butt.addEventListener("click", (e) => {
          const input = button.parentNode.querySelector(".edit").value;
          this.edit(curId, input);
        });
      });
    });
  }
  initCheckButton() {
    const checkboxes = this.container.querySelectorAll(".todo__radio");
    checkboxes.forEach((box) => {
      box.addEventListener("change", (e) => {
        this.check(+box.parentNode.dataset.id);
      });
    });
  }
}

new Todo();
