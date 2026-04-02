import db from './preguntas.js';

// --- ESTADO GLOBAL ---
let shuffledDb = [];
let currentQuestionIndex = 0;
let score = 0;

// Referencias DOM
const catTag = document.getElementById('cat');
const imageContainer = document.getElementById('image-container');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const feedbackMsg = document.getElementById('feedback-message');
const scoreDisplay = document.getElementById('score-info');

// --- INICIAR JUEGO ---
function initGame() {
    // Barajamos el mazo completo de 1.300 preguntas
    shuffledDb = [...db].sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    score = 0;
    loadQuestion();
}

function loadQuestion() {
    const q = shuffledDb[currentQuestionIndex];
    
    // Resetear contenedores
    optionsContainer.innerHTML = '';
    feedbackMsg.innerHTML = '';
    imageContainer.innerHTML = '';

    catTag.innerText = q.cat || "GENERAL";
    questionText.innerHTML = `<h3>${q.q}</h3>`;

    // --- GESTIÓN DE IMAGEN CON ESTADO DE CARGA ---
    if (q.img && q.img.trim() !== "") {
        imageContainer.classList.remove('hidden');
        
        // 1. Crear el placeholder de carga
        const skeleton = document.createElement('div');
        skeleton.className = 'loading-skeleton';
        skeleton.innerText = 'Cargando Pokémon...';
        imageContainer.appendChild(skeleton);

        // 2. Crear la imagen en memoria
        const imgElement = document.createElement('img');
        imgElement.src = q.img;
        imgElement.className = 'img-pokemon img-hidden'; // Empezamos invisible
        
        if (q.cat === "SILUETA") {
            imgElement.style.filter = "brightness(0)";
        }

        // 3. Cuando la imagen termine de descargar de internet:
        imgElement.onload = () => {
            skeleton.remove(); // Quitamos el efecto de carga
            imgElement.classList.remove('img-hidden');
            imgElement.classList.add('img-visible');
        };

        // 4. Manejo de errores (por si falla la URL)
        imgElement.onerror = () => {
            skeleton.innerHTML = "❌ Imagen no disponible";
            skeleton.style.animation = "none";
            skeleton.style.background = "#fee";
        };

        imageContainer.appendChild(imgElement);
    } else {
        imageContainer.classList.add('hidden');
    }

    // Crear botones de opciones
    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.innerText = option;
        btn.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(btn);
    });

    updateScoreboard();
}

// --- LOGICA DE RESPUESTA ---
function checkAnswer(selectedIndex) {
    const q = shuffledDb[currentQuestionIndex];
    const buttons = optionsContainer.querySelectorAll('button');
    
    buttons.forEach(btn => btn.classList.add('disabled'));

    // Revelar imagen si era silueta
    const img = imageContainer.querySelector('img');
    if (img) img.style.filter = "none";

    if (selectedIndex === q.correct) {
        score++;
        buttons[selectedIndex].classList.add('correct');
        feedbackMsg.innerHTML = "<span style='color: var(--correct)'>¡Correcto! ✨</span>";
    } else {
        buttons[selectedIndex].classList.add('incorrect');
        buttons[q.correct].classList.add('correct'); // Mostrar la buena
        feedbackMsg.innerHTML = "<span style='color: var(--incorrect)'>¡Era " + q.options[q.correct] + "!</span>";
    }

    // Pausa dramática antes de la siguiente
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < shuffledDb.length) {
            loadQuestion();
        } else {
            showFinalResults();
        }
    }, 1600);
}

// --- FINAL ---
function showFinalResults() {
    imageContainer.classList.remove('hidden');
    imageContainer.innerHTML = "🏆";
    imageContainer.style.fontSize = "4rem";
    questionText.innerHTML = `<h3>¡Reto Finalizado!</h3><p>Has acertado ${score} de ${shuffledDb.length}</p>`;
    optionsContainer.innerHTML = `<button onclick="location.reload()" style="grid-column: 1/-1; background: var(--primary); color:white;">VOLVER A EMPEZAR</button>`;
    feedbackMsg.innerHTML = "";
}

function updateScoreboard() {
    scoreDisplay.innerText = `Puntuación: ${score} | Pregunta: ${currentQuestionIndex + 1}/${shuffledDb.length}`;
}

// Arrancar
initGame();
