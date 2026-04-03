let preguntaActual = 0;
let puntos = 0;

// Iniciar el juego cuando la ventana y los scripts (preguntas.js) estén listos
window.onload = () => {
    if (typeof preguntas !== 'undefined' && preguntas.length > 0) {
        console.log("Trivia lista. Total de preguntas:", preguntas.length);
        mostrarPregunta();
    } else {
        console.error("Error: No se detectó el array 'preguntas' en preguntas.js");
        document.getElementById("enunciado").textContent = "Error al cargar la base de datos de preguntas.";
    }
};

function mostrarPregunta() {
    const p = preguntas[preguntaActual];
    const mensajeDiv = document.getElementById("resultado-mensaje");
    const contenedorBotones = document.getElementById("opciones-container");
    const imgContainer = document.getElementById("pokemon-img-container");
    const imgElement = document.getElementById("pokemon-img");
    const enunciado = document.getElementById("enunciado");

    // 1. Limpiar interfaz de la pregunta anterior
    mensajeDiv.textContent = "";
    mensajeDiv.style.color = "";
    contenedorBotones.innerHTML = "";

    // 2. Gestión dinámica de la imagen
    // Solo mostramos el contenedor si existe la propiedad 'img' y NO es categoría ANIME
    if (p.img && p.cat !== "ANIME") {
        imgContainer.style.display = "block";
        imgElement.src = p.img;
        imgElement.alt = "Silueta de Pokémon";
    } else {
        // Ocultamos el cuadro por completo para preguntas de texto puro
        imgContainer.style.display = "none";
        imgElement.src = ""; 
    }

    // 3. Escribir el enunciado
    enunciado.textContent = p.q;

    // 4. Preparar y barajar opciones (Algoritmo Fisher-Yates)
    // Mapeamos para saber cuál es la correcta después de mezclar
    let opcionesParaMezclar = p.options.map((texto, index) => {
        return { texto: texto, esCorrecta: index === p.correct };
    });

    for (let i = opcionesParaMezclar.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opcionesParaMezclar[i], opcionesParaMezclar[j]] = [opcionesParaMezclar[j], opcionesParaMezclar[i]];
    }

    // 5. Crear botones en el HTML
    opcionesParaMezclar.forEach(opcion => {
        const boton = document.createElement("button");
        boton.textContent = opcion.texto;
        boton.className = "boton-opcion";
        
        // Evento de clic
        boton.onclick = () => verificarRespuesta(opcion.esCorrecta, boton);
        
        contenedorBotones.appendChild(boton);
    });
}

function verificarRespuesta(esCorrecta, botonSeleccionado) {
    const mensajeDiv = document.getElementById("resultado-mensaje");
    const contenedorBotones = document.getElementById("opciones-container");
    const botones = contenedorBotones.getElementsByTagName("button");
    const pSiguiente = preguntas[preguntaActual];

    // Desactivar todos los botones para evitar clics múltiples
    for (let b of botones) {
        b.disabled = true;
        // Revelar cuál era la correcta de forma sutil si el usuario falló
        if (!esCorrecta && b.textContent === pSiguiente.options[pSiguiente.correct]) {
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

    // Esperar 1.5 segundos para que el usuario vea el resultado y pasar a la siguiente
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
            <h2>¡Trivia Completada!</h2>
            <p style="font-size: 1.5rem; margin: 20px 0;">Tu puntuación final: <strong>${puntos}</strong></p>
            <button onclick="location.reload()" class="boton-opcion" style="background:#333; color:white;">Volver a Intentar</button>
        </div>
    `;
}
