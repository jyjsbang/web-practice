let todos = [];
let clickTimer = null;
let isEditing = false;
let filter = "all"; // 'all' | 'completed' | 'active'

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

    todos.push({
        id: Date.now(), text: text, completed: false, createdAt: new Date().toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        })
    });
    saveTodos();
    renderTodos();

    input.value = "";
}

function renderTodos() {
    const list = document.getElementById("todoList");
    list.innerHTML = "";

    const filtered = todos.filter((todo) => {
        if (filter === "all") return true;
        if (filter === "completed") return todo.completed;
        if (filter === "active") return !todo.completed;
    })

    filtered.forEach((todo, index) => {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.padding = "6px 12px";
        li.style.borderBottom = "1px solid #eee";

        // 왼쪽 부분 (텍스트 + 날짜)
        const left = document.createElement("div");

        const textSpan = document.createElement("span");
        textSpan.textContent = todo.text;
        textSpan.style.fontWeight = "bold";

        const dateSpan = document.createElement("div");
        dateSpan.textContent = todo.createdAt;
        dateSpan.style.fontSize = "12px";
        dateSpan.style.color = "gray";

        left.appendChild(textSpan);
        left.appendChild(dateSpan);

        if (todo.completed) {
            li.classList.add("completed");
        }

        li.addEventListener("mousedown", function () {
            if (isEditing) return; // 수정 중이면 무시

            clickTimer = setTimeout(() => {
                if (!isEditing) {
                    todo.completed = !todo.completed;
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
        deleteBtn.textContent = "삭제";
        deleteBtn.style.padding = "4px 8px";
        deleteBtn.style.marginLeft = "16px"; // ← 너무 오른쪽 안 가게 조절
        deleteBtn.style.flexShrink = "0"; // ← 줄어들지 않게

        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = function (event) {
            event.stopPropagation();
            todos = todos.filter((t) => t.id !== todo.id);
            saveTodos();
            renderTodos();
        };

        li.appendChild(left);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    })
}

document.querySelectorAll("#filter-buttons button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        filter = e.target.dataset.filter;
        renderTodos();
    });
})