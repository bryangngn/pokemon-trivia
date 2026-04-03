let preguntaActual = 0;
let puntos = 0;

// Al iniciar el documento, cargamos la primera pregunta
document.addEventListener("DOMContentLoaded", () => {
    if (typeof preguntas !== 'undefined' && preguntas.length > 0) {
        mostrarPregunta();
    } else {
        console.error("No se encontró el array de preguntas en preguntas.js");
    }
});

function mostrarPregunta() {
    const p = preguntas[preguntaActual];
    const mensajeDiv = document.getElementById("resultado-mensaje");
    const contenedorBotones = document.getElementById("opciones-container");
    const enunciado = document.getElementById("enunciado");
    const imgContainer = document.getElementById("pokemon-img-container");

    // Limpiar estados anteriores
    mensajeDiv.textContent = "";
    mensajeDiv.className = "";
    contenedorBotones.innerHTML = "";

    // 1. Gestionar visibilidad de imagen según categoría
    if (p.cat === "ANIME") {
        imgContainer.style.display = "none";
    } else {
        imgContainer.style.display = "block";
        document.getElementById("pokemon-img").src = p.img || "default.png";
    }

    enunciado.textContent = p.q;

    // 2. Crear y barajar opciones (Algoritmo Fisher-Yates)
    let opcionesParaMezclar = p.options.map((texto, index) => {
        return { texto: texto, esCorrecta: index === p.correct };
    });

    for (let i = opcionesParaMezclar.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opcionesParaMezclar[i], opcionesParaMezclar[j]] = [opcionesParaMezclar[j], opcionesParaMezclar[i]];
    }

    // 3. Renderizar botones
    opcionesParaMezclar.forEach(opcion => {
        const boton = document.createElement("button");
        boton.textContent = opcion.texto;
        boton.className = "boton-opcion";
        
        boton.onclick = () => verificarRespuesta(opcion.esCorrecta, boton);
        
        contenedorBotones.appendChild(boton);
    });
}

function verificarRespuesta(esCorrecta, botonSeleccionado) {
    const mensajeDiv = document.getElementById("resultado-mensaje");
    const contenedorBotones = document.getElementById("opciones-container");
    const botones = contenedorBotones.getElementsByTagName("button");

    // Desactivar todos los botones para evitar doble clic
    for (let b of botones) {
        b.disabled = true;
        // Opcional: Mostrar cuál era la correcta si fallaste
        if (b.textContent === preguntas[preguntaActual].options[preguntas[preguntaActual].correct]) {
            b.classList.add("reveal-correct"); 
        }
    }

    if (esCorrecta) {
        puntos += 10;
        document.getElementById("puntos").textContent = puntos;
        botonSeleccionado.classList.add("correct-anim");
        mensajeDiv.textContent = "¡Correcto! 🌟";
        mensajeDiv.style.color = "#2ecc71";
    } else {
        botonSeleccionado.classList.add("wrong-anim");
        mensajeDiv.textContent = "¡Incorrecto! 💀";
        mensajeDiv.style.color = "#e74c3c";
    }

    // Esperar un momento y pasar a la siguiente
    setTimeout(() => {
        preguntaActual++;
        if (preguntaActual < preguntas.length) {
            mostrarPregunta();
        } else {
            finalizarJuego();
        }
    }, 1500);
}

function finalizarJuego() {
    const gameCard = document.getElementById("game-card");
    gameCard.innerHTML = `
        <div style="text-align:center; padding: 40px;">
            <h2>¡Fin del juego!</h2>
            <p style="font-size: 1.5rem;">Tu puntuación final es: <strong>${puntos}</strong></p>
            <button onclick="location.reload()" class="boton-opcion">Jugar de nuevo</button>
        </div>
    `;
}
