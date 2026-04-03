let preguntasPartida = [];
let preguntaActual = 0;
let puntos = 0;

// Al cargar la ventana, verificamos datos e iniciamos
window.onload = () => {
    if (typeof preguntas !== 'undefined' && preguntas.length > 0) {
        iniciarNuevaPartida();
    } else {
        console.error("Error: No se encontró el array 'preguntas'.");
        document.getElementById("enunciado").textContent = "Error al cargar datos.";
    }
};

function iniciarNuevaPartida() {
    // Copiamos y barajamos el mazo de preguntas completo
    preguntasPartida = [...preguntas];
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

    // --- LIMPIEZA TOTAL ---
    mensajeDiv.textContent = "";
    contenedorBotones.innerHTML = "";
    
    // Ocultar contenedor y resetear imagen para evitar cuadros blancos o errores 404
    imgContainer.style.display = "none";
    imgElement.removeAttribute("src");
    imgElement.alt = "";

    // --- GESTIÓN DE IMAGEN ---
    // Solo mostramos el cuadro blanco si hay imagen y NO es categoría ANIME
    if (p.img && p.img.trim() !== "" && p.cat !== "ANIME") {
        imgElement.src = p.img;
        imgElement.alt = "Pokemon Silhouette";
        imgContainer.style.display = "grid"; // Grid activa el centrado del CSS
    }

    enunciado.textContent = p.q;

    // --- BARAJADO DE OPCIONES ---
    let opcionesMezcladas = p.options.map((texto, index) => {
        return { texto: texto, esCorrecta: index === p.correct };
    });

    for (let i = opcionesMezcladas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opcionesMezcladas[i], opcionesMezcladas[j]] = [opcionesMezcladas[j], opcionesMezcladas[i]];
    }

    // --- CREACIÓN DE BOTONES ---
    opcionesMezcladas.forEach(opcion => {
        const boton = document.createElement("button");
        boton.textContent = opcion.texto;
        boton.className = "boton-opcion";
        boton.onclick = () => verificarRespuesta(opcion.esCorrecta, boton);
        contenedorBotones.appendChild(boton);
    });
}

function verificarRespuesta(esCorrecta, botonSeleccionado) {
    const botones = document.querySelectorAll(".boton-opcion");
    const mensajeDiv = document.getElementById("resultado-mensaje");
    const pData = preguntasPartida[preguntaActual];

    // Bloquear botones
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
        
        // Revelar cuál era la correcta
        Array.from(botones).forEach(b => {
            if (b.textContent === pData.options[pData.correct]) {
                b.classList.add("reveal-correct");
            }
        });
    }

    // Esperar y pasar a la siguiente
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
        <div style="padding: 20px;">
            <h2>¡FIN DE PARTIDA!</h2>
            <p style="font-size: 1.4rem;">Puntos totales: <strong>${puntos}</strong></p>
            <button onclick="iniciarNuevaPartida()" class="boton-opcion" style="background:#333; color:white;">Reiniciar</button>
        </div>
    `;
}
