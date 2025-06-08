let todos = [];
let clickTimer = null;
let isEditing = false;

// 페이지 로드 시 저장된 할 일 불러오기
window.onload = function () {
    const saved = localStorage.getItem("todos");
    if (saved) {
        todos = JSON.parse(saved);
        renderTodos();
    }
}

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function addTodo() {
    const input = document.getElementById("todoInput");
    const text = input.value.trim();

    if (text === "") {
        alert("내용을 입력해주세요!");
        return;
    }

    todos.push({ text: text, completed: false });
    saveTodos();
    renderTodos();

    input.value = "";
}

function renderTodos() {
    const list = document.getElementById("todoList");
    list.innerHTML = "";

    todos.forEach((todo, index) => {
        const li = document.createElement("li");
        li.textContent = todo.text;
        if (todo.completed) {
            li.classList.add("completed");
        }

        li.addEventListener("mousedown", function () {
            if (isEditing) return; // 수정 중이면 무시

            clickTimer = setTimeout(() => {
                if (!isEditing) {
                    todos[index].completed = !todos[index].completed;
                    saveTodos();
                    renderTodos();
                }
            }, 250);
        });

        li.addEventListener("dblclick", function () {
            clearTimeout(clickTimer);
            isEditing = true;

            const input = document.createElement("input");
            input.type = "text";
            input.value = todo.text;
            input.className = "edit";

            input.onblur = saveEdit;
            input.onkeydown = function (e) {
                if (e.key === "Enter") saveEdit();
            };

            function saveEdit() {
                const newText = input.value.trim();
                if (newText) {
                    todos[index].text = newText;
                    saveTodos();
                }
                isEditing = false;
                renderTodos();
            }

            li.innerHTML = "";
            li.appendChild(input);
            input.focus();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "삭제";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = function (event) {
            event.stopPropagation();
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        };

        li.appendChild(deleteBtn);
        list.appendChild(li);
    })
}