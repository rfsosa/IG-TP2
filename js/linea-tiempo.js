/* ==========================================================
   linea-tiempo.js  ·  Línea del tiempo de contexto/index.html

   ¿Qué hace?
   Los 8 episodios están escritos en el HTML, uno debajo del otro.
   Este script deja ver UNO solo por vez. Se puede elegir con los
   marcadores del eje, con "Anterior" y "Siguiente", con las flechas
   del teclado o deslizando el dedo sobre la ficha (en el celular).

   ¿Cómo lo hace?
   Cada episodio es un <li class="episodio"> y cada marcador del eje
   es un <button class="boton-episodio">. Van en el mismo orden:
   el marcador número 3 corresponde al episodio número 3.
   Para ocultar o mostrar usamos el atributo "hidden" del HTML.
   Todo lo visual (colores, animación, forma de los marcadores)
   está en el CSS: acá solo cambiamos clases y el ancho de la línea roja.

   Si el JavaScript no carga, el eje queda oculto y la página se
   lee completa, como una lista común.

   Este archivo se carga solo en contexto/index.html.
   ========================================================== */


// 1) BUSCAMOS LOS ELEMENTOS DEL HTML que vamos a necesitar
const contenedor = document.getElementById("linea-tiempo");
const eje = document.getElementById("botones-episodios");
const lineaRoja = document.querySelector(".eje-progreso");
const panelControles = document.getElementById("controles-episodios");
const listaEpisodios = document.querySelector(".episodios");
const botonesEpisodio = document.querySelectorAll(".boton-episodio");
const episodios = document.querySelectorAll(".episodio");
const botonAnterior = document.getElementById("btn-anterior");
const botonSiguiente = document.getElementById("btn-siguiente");
const textoContador = document.getElementById("contador-episodios");

// 2) UNA VARIABLE para recordar qué episodio se está mostrando.
//    Empieza en 0, que es el primero (en programación se cuenta desde 0).
let episodioActual = 0;


// 3) LA FUNCIÓN PRINCIPAL: muestra el episodio que le pedimos
function mostrarEpisodio(numero) {
  // Primero, ocultamos todos los episodios y "apagamos" todos los marcadores
  for (let i = 0; i < episodios.length; i++) {
    episodios[i].hidden = true;
    botonesEpisodio[i].classList.remove("active");
    botonesEpisodio[i].classList.remove("pasado");

    // Los marcadores de los episodios anteriores al actual quedan marcados como "pasado"
    if (i < numero) {
      botonesEpisodio[i].classList.add("pasado");
    }
  }

  // Después, mostramos solo el episodio pedido y prendemos su marcador
  episodios[numero].hidden = false;
  botonesEpisodio[numero].classList.add("active");

  // Guardamos cuál es el episodio actual
  episodioActual = numero;

  // La línea roja del eje avanza hasta el marcador actual.
  // Calculamos el porcentaje y se lo ponemos como ancho a la línea roja.
  const porcentaje = ((numero + 0.5) / episodios.length) * 100;
  lineaRoja.style.width = porcentaje + "%";

  // En el celular el eje se desplaza: lo movemos para que el marcador activo quede al centro
  const marcador = botonesEpisodio[numero];
  eje.scrollLeft = marcador.offsetLeft - eje.clientWidth / 2 + marcador.clientWidth / 2;

  // Actualizamos el texto "Episodio 3 de 8"
  textoContador.textContent = "Episodio " + (numero + 1) + " de " + episodios.length;

  // "Anterior" no sirve en el primero, y "Siguiente" no sirve en el último
  botonAnterior.disabled = (numero === 0);
  botonSiguiente.disabled = (numero === episodios.length - 1);
}

// Dos funciones chicas para no repetir las comprobaciones de los límites
function irAlSiguiente() {
  if (episodioActual < episodios.length - 1) {
    mostrarEpisodio(episodioActual + 1);
  }
}

function irAlAnterior() {
  if (episodioActual > 0) {
    mostrarEpisodio(episodioActual - 1);
  }
}


// 4) QUÉ PASA CUANDO ALGUIEN HACE CLIC

// En cada marcador del eje: mostramos el episodio con su mismo número
botonesEpisodio.forEach(function (boton, indice) {
  boton.addEventListener("click", function () {
    mostrarEpisodio(indice);
  });
});

botonAnterior.addEventListener("click", irAlAnterior);
botonSiguiente.addEventListener("click", irAlSiguiente);


// 5) TECLADO: flechas izquierda y derecha (cuando el foco está dentro de la línea del tiempo)
contenedor.addEventListener("keydown", function (evento) {
  if (evento.key === "ArrowRight") {
    irAlSiguiente();
  }
  if (evento.key === "ArrowLeft") {
    irAlAnterior();
  }
});


// 6) CELULAR: deslizar el dedo sobre la ficha del episodio
//    Guardamos dónde empezó el toque y, al terminar, vemos hacia dónde se movió.
let toqueInicialX = 0;

listaEpisodios.addEventListener("touchstart", function (evento) {
  toqueInicialX = evento.touches[0].clientX;
});

listaEpisodios.addEventListener("touchend", function (evento) {
  const diferencia = evento.changedTouches[0].clientX - toqueInicialX;

  if (diferencia < -50) {
    irAlSiguiente();   // deslizó hacia la izquierda: episodio siguiente
  }
  if (diferencia > 50) {
    irAlAnterior();    // deslizó hacia la derecha: episodio anterior
  }
});


// 7) AL CARGAR LA PÁGINA
contenedor.classList.add("activa");   // el CSS usa esta clase para sacar la numeración de la lista
eje.hidden = false;                   // mostramos el eje y los controles (venían ocultos)
panelControles.hidden = false;
mostrarEpisodio(0);                   // arrancamos por el primer episodio
