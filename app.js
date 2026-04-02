// app.js
import db from './preguntas.js';

let currentQuestionIndex = 0;
let score = 0;

// Mezclar preguntas al iniciar para que no siempre salgan en el mismo orden
const shuffledDb = db.sort(() => Math.random() - 0.5);

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const imageContainer = document.getElementById('image-container');
const scoreDisplay = document.getElementById('score');
const catTag = document.getElementById('cat');

function loadQuestion() {
    const q = shuffledDb[currentQuestionIndex];
    
    // Limpiar contenedores
    optionsContainer.innerHTML = '';
    imageContainer.innerHTML = '';
    
    // Categoría y Texto
    catTag.innerText = q.cat;
    questionText.innerHTML = `<h3>${q.q}</h3>`;
    
    // Si tiene imagen, mostrarla
    if (q.img) {
        const imgElement = document.createElement('img');
        imgElement.src = q.img;
        imgElement.className = 'img-pokemon';
        imageContainer.appendChild(imgElement);
    }
    
    // Generar botones de opciones
    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.innerText = option;
        btn.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(btn);
    });

    scoreDisplay.innerText = `Puntuación: ${score} | Pregunta: ${currentQuestionIndex + 1}/1000`;
}

function checkAnswer(selectedIndex) {
    const correctIndex = shuffledDb[currentQuestionIndex].correct;
    
    if (selectedIndex === correctIndex) {
        score++;
        alert("¡Correcto! 🌟");
    } else {
        alert(`Incorrecto. La respuesta era: ${shuffledDb[currentQuestionIndex].options[correctIndex]}`);
    }
    
    currentQuestionIndex++;
    
    if (currentQuestionIndex < shuffledDb.length) {
        loadQuestion();
    } else {
        alert(`¡Fin del juego! Puntuación final: ${score}/${shuffledDb.length}`);
        location.reload(); // Reiniciar
    }
}

// Iniciar juego
loadQuestion();