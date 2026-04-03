let preguntasPartida = [];
let preguntaActual = 0;
let puntos = 0;

window.onload = () => {
    if (typeof preguntas !== 'undefined' && preguntas.length > 0) {
        iniciarNuevaPartida();
    } else {
        document.getElementById("enunciado").textContent = "Error: Datos no encontrados.";
    }
};

function iniciarNuevaPartida() {
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

    // 1. LIMPIEZA INICIAL
    mensajeDiv.textContent = "";
    contenedorBotones.innerHTML = "";
    
    // Reset preventivo del contenedor de imagen
    imgContainer.style.display = "none";
    imgElement.src = "";
    imgElement.removeAttribute("src");
    imgElement.alt = "";

    // 2. GESTIÓN DE VISIBILIDAD DE IMAGEN
    // Solo activamos si tiene URL de imagen Y no es categoría ANIME
    if (p.img && p.img.trim() !== "" && p.cat !== "ANIME") {
        imgElement.src = p.img;
        imgElement.alt = "Pokemon Silhouette";
        imgContainer.style.display = "grid"; // Grid permite el centrado total
    }

    enunciado.textContent = p.q;

    // 3. BARAJADO DE OPCIONES
    let opcionesMezcladas = p.options.map((texto, index) => {
        return { texto: texto, esCorrecta: index === p.correct };
    });

    for (let i = opcionesMezcladas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opcionesMezcladas[i], opcionesMezcladas[j]] = [opcionesMezcladas[j], opcionesMezcladas[i]];
    }

    // 4. CREACIÓN DE BOTONES
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
        
        Array.from(botones).forEach(b => {
            if (b.textContent === pData.options[pData.correct]) {
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
        <div style="padding: 20px;">
            <h2>¡FIN DE PARTIDA!</h2>
            <p style="font-size: 1.4rem;">Puntos totales: <strong>${puntos}</strong></p>
            <button onclick="iniciarNuevaPartida()" class="boton-opcion" style="background:#333; color:white;">Reiniciar</button>
        </div>
    `;
}
