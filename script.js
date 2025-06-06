const btn = document.getElementById("changeBtn");
const greeting = document.getElementById("greeting");
const body = document.body;

function getRandomColor() {
    let letters = "0123456789ABCDEF"
    let color = "#"
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

btn.addEventListener("click", () => {
    greeting.textContent = "반가워요!"
})

greeting.addEventListener("click", () => {
    greeting.textContent = "안녕하세요!"
})

body.addEventListener("click", (event) => {
    if (event.target.id === "greeting" || event.target.id === "changeBtn") {
        return;
    }
    body.style.backgroundColor = getRandomColor();
})