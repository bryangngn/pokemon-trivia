import db from './preguntas.js';

// --- CONFIGURACIÓN GLOBAL ---
let shuffledDb = [];
let currentQuestionIndex = 0;
let score = 0;

// Referencias al DOM
const catTag = document.getElementById('cat');
const imageContainer = document.getElementById('image-container');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const feedbackMsg = document.getElementById('feedback-message');
const scoreDisplay = document.getElementById('score');

// --- INICIO DEL JUEGO ---
function initGame() {
    // Barajar todas las preguntas al empezar para que nunca sea igual
    shuffledDb = [...db].sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    score = 0;
    loadQuestion();
}

// --- CARGAR PREGUNTA ---
function loadQuestion() {
    // Limpiar interfaz
    optionsContainer.innerHTML = '';
    imageContainer.innerHTML = '';
    feedbackMsg.innerHTML = '';
    
    const q = shuffledDb[currentQuestionIndex];

    // Actualizar Texto y Categoría
    catTag.innerText = q.cat || "GENERAL";
    questionText.innerHTML = `<h3>${q.q}</h3>`;
    
    // Gestionar Imagen (Normal o Silueta)
    if (q.img) {
        const imgElement = document.createElement('img');
        imgElement.src = q.img;
        imgElement.className = 'img-pokemon';
        
        // Si la categoría es SILUETA, aplicamos el filtro negro
        if (q.cat === "SILUETA") {
            imgElement.style.filter = "brightness(0)";
        }
        
        imageContainer.appendChild(imgElement);
    } else {
        // Placeholder si no hay imagen
        imageContainer.innerHTML = "<div style='font-size:3rem; color:#eee'>?</div>";
    }

    // Crear Botones de Opciones
    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.innerText = option;
        btn.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(btn);
    });

    // Actualizar Marcador
    updateScoreboard();
}

// --- COMPROBAR RESPUESTA ---
function checkAnswer(selectedIndex) {
    const q = shuffledDb[currentQuestionIndex];
    const buttons = optionsContainer.querySelectorAll('button');
    
    // Bloquear otros clics
    buttons.forEach(btn => btn.classList.add('disabled'));

    if (selectedIndex === q.correct) {
        // ACIERTO
        score++;
        buttons[selectedIndex].classList.add('correct');
        feedbackMsg.innerHTML = "<span style='color: #2ecc71'>¡Correcto! ✨</span>";
        
        // Si era silueta, la revelamos al acertar
        const img = imageContainer.querySelector('img');
        if (img) img.style.filter = "none";
        
    } else {
        // ERROR
        buttons[selectedIndex].classList.add('incorrect');
        buttons[q.correct].classList.add('correct'); // Resaltar la correcta
        feedbackMsg.innerHTML = "<span style='color: #e74c3c'>¡Oh no! Era " + q.options[q.correct] + "</span>";
        
        // Revelar silueta también en error para aprender
        const img = imageContainer.querySelector('img');
        if (img) img.style.filter = "none";
    }

    // Esperar un momento y pasar a la siguiente
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < shuffledDb.length) {
            loadQuestion();
        } else {
            finishGame();
        }
    }, 1500); // 1.5 segundos de pausa para ver el resultado
}

// --- FINALIZAR ---
function finishGame() {
    questionText.innerHTML = `<h2>🏆 ¡Reto Completado!</h2>`;
    imageContainer.innerHTML = `<div style='font-size:1.2rem'>Puntuación Final:<br><strong style='font-size:3rem'>${score}</strong><br>de ${shuffledDb.length}</div>`;
    optionsContainer.innerHTML = `<button onclick="location.reload()" style="grid-column: 1/-1">Jugar de Nuevo</button>`;
    feedbackMsg.innerHTML = "";
}

function updateScoreboard() {
    scoreDisplay.innerText = `Puntuación: ${score} | Pregunta: ${currentQuestionIndex + 1}/${shuffledDb.length}`;
}

// Ejecutar al cargar la página
initGame();
