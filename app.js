let preguntasPartida = []; // Copia del array original para barajar
let preguntaActual = 0;
let puntos = 0;

window.onload = () => {
    if (typeof preguntas !== 'undefined' && preguntas.length > 0) {
        console.log("Base de datos cargada. Preparando partida aleatoria...");
        iniciarNuevaPartida();
    } else {
        console.error("Error: No se detectó el array 'preguntas' en preguntas.js");
        document.getElementById("enunciado").textContent = "Error al cargar la base de datos.";
    }
};

function iniciarNuevaPartida() {
    // 1. Clonamos el array original para no modificar la base de datos permanente
    preguntasPartida = [...preguntas];

    // 2. Barajamos el mazo completo de preguntas (Algoritmo Fisher-Yates)
    for (let i = preguntasPartida.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [preguntasPartida[i], preguntasPartida[j]] = [preguntasPartida[j], preguntasPartida[i]];
    }

    preguntaActual = 0;
    puntos = 0;
    document.getElementById("puntos").textContent = puntos;
    mostrarPregunta();
}

function mostrarPregunta() {
    const p = preguntasPartida[preguntaActual];
    const mensajeDiv = document.getElementById("resultado-mensaje");
    const contenedorBotones = document.getElementById("opciones-container");
    const imgContainer = document.getElementById("pokemon-img-container");
    const imgElement = document.getElementById("pokemon-img");
    const enunciado = document.getElementById("enunciado");

    // 1. Limpieza inicial de la interfaz
    mensajeDiv.textContent = "";
    contenedorBotones.innerHTML = "";
    
    // OCULTAMOS el contenedor y BORRAMOS el src inmediatamente
    // Esto evita que el navegador muestre el icono de imagen rota o el texto ALT
    imgContainer.style.display = "none";
    imgElement.removeAttribute("src");
    imgElement.alt = ""; // Vaciamos el texto alternativo temporalmente

    // 2. GESTIÓN DE IMAGEN
    // Solo si la pregunta tiene una ruta de imagen Y no es de la categoría ANIME
    if (p.img && p.cat !== "ANIME") {
        imgElement.src = p.img;
        imgElement.alt = "Pokemon Silhouette"; // Restauramos el alt solo si hay imagen
        imgContainer.style.display = "grid";    // Mostramos el contenedor con Grid para centrar
    }

    // 3. Escribir enunciado
    enunciado.textContent = p.q;

    // 4. Barajar y mostrar opciones (Mismo código de antes)
    let opcionesMezcladas = p.options.map((texto, index) => {
        return { texto: texto, esCorrecta: index === p.correct };
    });

    for (let i = opcionesMezcladas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opcionesMezcladas[i], opcionesMezcladas[j]] = [opcionesMezcladas[j], opcionesMezcladas[i]];
    }

    opcionesMezcladas.forEach(opcion => {
        const boton = document.createElement("button");
        boton.textContent = opcion.texto;
        boton.className = "boton-opcion";
        boton.onclick = () => verificarRespuesta(opcion.esCorrecta, boton);
        contenedorBotones.appendChild(boton);
    });
}

function verificarRespuesta(esCorrecta, botonSeleccionado) {
    const mensajeDiv = document.getElementById("resultado-mensaje");
    const botones = document.querySelectorAll(".boton-opcion");
    const pActual = preguntasPartida[preguntaActual];

    botones.forEach(b => b.disabled = true);

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
        
        // Revelar la respuesta correcta si falló
        Array.from(botones).forEach(b => {
            if (b.textContent === pActual.options[pActual.correct]) {
                b.classList.add("reveal-correct");
            }
        });
    }

    setTimeout(() => {
        preguntaActual++;
        if (preguntaActual < preguntasPartida.length) {
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
            <h2>¡Fin de la partida!</h2>
            <p style="font-size: 1.5rem; margin: 20px 0;">Puntuación: <strong>${puntos}</strong></p>
            <button onclick="iniciarNuevaPartida()" class="boton-opcion" style="background:#333; color:white;">Nueva Partida</button>
        </div>
    `;
}
