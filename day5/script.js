let todos = [];
let clickTimer = null;
let isEditing = false;
let filter = "all"; // 'all' | 'completed' | 'active'

// 페이지 로드 시 저장된 할 일 불러오기
window.onload = function () {
    const savedMode = localStorage.getItem("mode");

    // 처음 로딩 시 저장된 모드 적용
    if (savedMode === "dark") {
        document.body.classList.add("dark");
        toggleBtn.textContent = "☀️ 라이트모드";
    }

    const saved = localStorage.getItem("todos");
    if (saved) {
        todos = JSON.parse(saved);
        renderTodos();
    }
}

const toggleBtn = document.getElementById("darkModeToggle");

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");

    localStorage.setItem("mode", isDark ? "dark" : "light");
    toggleBtn.textContent = isDark ? "☀️ 라이트모드" : "🌙 다크모드";
});

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
        id: Date.now(), text: text, completed: false, pinned: false, createdAt: new Date().toLocaleString("ko-KR", {
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

    filtered.sort((a, b) => {
        if (a.pinned !== b.pinned) return b.pinned - a.pinned;
        if (a.completed !== b.completed) return a.completed - b.completed;
        return new Date(b.createdAt) - new Date(a.createdAt); // 최신 순
    })

    filtered.forEach((todo, index) => {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.padding = "6px 12px";
        li.style.borderBottom = "1px solid #eee";

        const left = document.createElement("div");
        left.style.display = "flex";
        left.style.alignItems = "center";
        left.style.gap = "8px";  // 아이템들 사이 간격

        const textSpan = document.createElement("span");
        textSpan.textContent = todo.text;
        textSpan.style.fontWeight = "bold";

        const pinBtn = document.createElement("button");
        pinBtn.textContent = todo.pinned ? "📌" : "📍";
        pinBtn.className = "pin-btn";
        pinBtn.style.cursor = "pointer";
        pinBtn.style.border = "none";
        pinBtn.style.background = "none";
        pinBtn.style.fontSize = "16px";

        pinBtn.onclick = function (e) {
            e.stopPropagation();
            todo.pinned = !todo.pinned;
            saveTodos();
            renderTodos();
        };

        left.appendChild(textSpan);
        left.appendChild(pinBtn);

        const dateSpan = document.createElement("div");
        dateSpan.textContent = todo.createdAt;
        dateSpan.style.fontSize = "12px";
        dateSpan.style.color = "gray";
        dateSpan.style.marginLeft = "8px";

        left.appendChild(dateSpan);

        if (todo.completed) {
            li.classList.add("completed");
        }

        li.addEventListener("mousedown", function () {
            if (isEditing) return; // 수정 중이면 무시

            // 버튼 클릭이면 무시
            if (
                e.target.tagName === "BUTTON" ||
                e.target.classList.contains("delete-btn") ||
                e.target.classList.contains("pin-btn")
            ) {
                return;
            }

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
        //li.appendChild(dateSpan);
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