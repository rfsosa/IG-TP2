/* ==========================================================
   formulario.js  ·  Formulario de contacto

   ¿Qué hace este archivo?
   1) Revisa que los datos estén bien ANTES de enviar el mensaje.
   2) Si algo está mal, escribe el error debajo del campo y lo marca en rojo.
   3) Si todo está bien, envía el mensaje (o lo simula, ver el punto 8).

   Reglas:
     - Nombre:  solo letras y espacios, mínimo 3 caracteres.
     - Correo:  con forma de correo (algo@algo.com).
     - Asunto:  hay que elegir una opción.
     - Mensaje: entre 10 y 500 caracteres.

   Cómo está ordenado: de arriba hacia abajo, en el orden en que
   las cosas van pasando. Se carga solo en contacto.html.
   ========================================================== */


// 1) BUSCAMOS LAS PIEZAS DEL HTML
//    Es como ponerle un nombre a cada pieza para poder usarla después.
const formulario = document.getElementById("form-contacto");
const campoNombre = document.getElementById("nombre");
const campoEmail = document.getElementById("email");
const campoAsunto = document.getElementById("asunto");
const campoMensaje = document.getElementById("mensaje");
const textoContador = document.getElementById("contador-mensaje");
const avisoExito = document.getElementById("mensaje-exito");
const avisoError = document.getElementById("mensaje-error");
const botonEnviar = formulario.querySelector("button[type='submit']");


// 2) LAS REGLAS, todas juntas para poder cambiarlas fácil
const MINIMO_NOMBRE = 3;
const MINIMO_MENSAJE = 10;
const MAXIMO_MENSAJE = 500;

// Las expresiones regulares describen cómo tiene que "verse" un texto.
// Con .test(texto) preguntamos: ¿el texto cumple esa forma? (da true o false).
//
// NOMBRE: solo letras, espacios, apóstrofes y guiones.
//   ^          el texto empieza acá
//   [ ... ]    cualquiera de los caracteres que están entre corchetes
//   +          uno o más de esos caracteres
//   $          el texto termina acá (así no se cuela ningún otro símbolo)
const formatoNombre = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ' -]+$/;

// CORREO: algo + @ + algo + punto + algo (por ejemplo nombre@dominio.com)
//   [^\s@]+    uno o más caracteres que no sean espacio ni @
//   \.         un punto de verdad (la barra \ hace que el punto valga como punto)
//   [^\s@]{2,} al menos dos caracteres al final (com, ar, org...)
const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;


// 3) DOS AYUDANTES que pintan el resultado en pantalla.
//    Las funciones de validación del punto 4 los usan.

// Muestra un error: escribe el texto debajo del campo y lo pone en rojo.
function mostrarError(campo, idDelError, texto) {
  document.getElementById(idDelError).textContent = texto;
  campo.classList.add("is-invalid");      // borde rojo
  campo.classList.remove("is-valid");
}

// Muestra que el campo está bien: borra el error y lo pone en verde.
function mostrarOk(campo, idDelError) {
  document.getElementById(idDelError).textContent = "";
  campo.classList.remove("is-invalid");
  campo.classList.add("is-valid");        // borde verde
}


// 4) UNA FUNCIÓN POR CAMPO
//    Cada una se lee así: "si pasa tal problema, mostrá el error y cortá".
//    Devuelve false si hay un error, y true si el campo está bien.

function validarNombre() {
  const texto = campoNombre.value.trim();   // trim() borra los espacios de los costados

  if (texto === "") {
    mostrarError(campoNombre, "error-nombre", "Ingresá tu nombre y apellido.");
    return false;
  }
  if (texto.length < MINIMO_NOMBRE) {
    mostrarError(campoNombre, "error-nombre", "El nombre debe tener al menos " + MINIMO_NOMBRE + " caracteres.");
    return false;
  }
  if (!formatoNombre.test(texto)) {
    mostrarError(campoNombre, "error-nombre", "El nombre solo puede tener letras y espacios (sin números ni símbolos).");
    return false;
  }

  mostrarOk(campoNombre, "error-nombre");   // si llegó hasta acá, está bien
  return true;
}

function validarEmail() {
  const texto = campoEmail.value.trim();

  if (texto === "") {
    mostrarError(campoEmail, "error-email", "Ingresá tu correo electrónico.");
    return false;
  }
  if (!formatoEmail.test(texto)) {
    mostrarError(campoEmail, "error-email", "El correo no tiene un formato válido (por ejemplo: nombre@dominio.com).");
    return false;
  }

  mostrarOk(campoEmail, "error-email");
  return true;
}

function validarAsunto() {
  if (campoAsunto.value === "") {
    mostrarError(campoAsunto, "error-asunto", "Elegí un asunto.");
    return false;
  }

  mostrarOk(campoAsunto, "error-asunto");
  return true;
}

function validarMensaje() {
  const texto = campoMensaje.value.trim();

  if (texto === "") {
    mostrarError(campoMensaje, "error-mensaje", "Escribí tu mensaje.");
    return false;
  }
  if (texto.length < MINIMO_MENSAJE) {
    mostrarError(campoMensaje, "error-mensaje", "El mensaje debe tener al menos " + MINIMO_MENSAJE + " caracteres.");
    return false;
  }
  if (texto.length > MAXIMO_MENSAJE) {
    mostrarError(campoMensaje, "error-mensaje", "El mensaje no puede superar los " + MAXIMO_MENSAJE + " caracteres.");
    return false;
  }

  mostrarOk(campoMensaje, "error-mensaje");
  return true;
}


// 5) VALIDACIÓN MIENTRAS LA PERSONA USA EL FORMULARIO
//    "blur"   = cuando sale del campo: revisamos lo que escribió.
//    "input"  = cada vez que escribe algo: si el campo YA tenía un error,
//               lo revisamos de nuevo para que el error desaparezca apenas lo arregla.
//               (Así no mostramos un error a quien todavía está escribiendo.)
campoNombre.addEventListener("blur", validarNombre);
campoEmail.addEventListener("blur", validarEmail);
campoAsunto.addEventListener("blur", validarAsunto);
campoMensaje.addEventListener("blur", validarMensaje);

campoNombre.addEventListener("input", function () {
  if (campoNombre.classList.contains("is-invalid")) {
    validarNombre();
  }
});

campoEmail.addEventListener("input", function () {
  if (campoEmail.classList.contains("is-invalid")) {
    validarEmail();
  }
});

// En un desplegable, "change" es cuando la persona elige otra opción
campoAsunto.addEventListener("change", function () {
  if (campoAsunto.classList.contains("is-invalid")) {
    validarAsunto();
  }
});

campoMensaje.addEventListener("input", function () {
  actualizarContador();   // el contador se actualiza siempre
  if (campoMensaje.classList.contains("is-invalid")) {
    validarMensaje();
  }
});


// 6) EL CONTADOR DE CARACTERES ("23 / 500")
function actualizarContador() {
  const cantidad = campoMensaje.value.length;
  textoContador.textContent = cantidad + " / " + MAXIMO_MENSAJE;

  if (cantidad > MAXIMO_MENSAJE) {
    textoContador.classList.add("excedido");      // se pone rojo
  } else {
    textoContador.classList.remove("excedido");
  }
}


// 7) CUANDO ALGUIEN APRIETA "ENVIAR"
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();   // evita que el navegador recargue la página

  // Escondemos los avisos de un envío anterior
  avisoExito.hidden = true;
  avisoError.hidden = true;

  // Revisamos los cuatro campos. Los guardamos en variables antes de decidir
  // para que se muestren TODOS los errores juntos, no de a uno.
  const nombreEstaBien = validarNombre();
  const emailEstaBien = validarEmail();
  const asuntoEstaBien = validarAsunto();
  const mensajeEstaBien = validarMensaje();

  // Si alguno está mal, no enviamos: llevamos a la persona al primer error
  if (!nombreEstaBien || !emailEstaBien || !asuntoEstaBien || !mensajeEstaBien) {
    formulario.querySelector(".is-invalid").focus();
    return;
  }

  // Si todo está bien, enviamos
  enviarMensaje();
});


// 8) EL ENVÍO
//    Un sitio en GitHub Pages no puede mandar correos por sí solo.
//    Por eso el mensaje se manda a un servicio externo (por ejemplo Formspree),
//    que lo reenvía al correo del equipo.
//    La dirección de ese servicio está en el atributo data-endpoint del <form>
//    en contacto.html. Si está vacío, el envío se SIMULA (sirve para probar).
//
//    "async" y "await" significan: "esperá a que internet responda
//    antes de pasar a la línea siguiente". Así el código se lee de arriba
//    hacia abajo, como una receta.
async function enviarMensaje() {
  const direccion = formulario.dataset.endpoint;

  // Sin dirección: simulamos que salió bien y listo
  if (direccion === "") {
    terminarBien();
    return;
  }

  botonEnviar.disabled = true;   // evita que apreten "Enviar" dos veces

  // "try" = intentá hacer esto. Si algo falla (por ejemplo no hay internet),
  // el código salta al "catch".
  try {
    const respuesta = await fetch(direccion, {
      method: "POST",                           // POST = "te mando datos"
      body: new FormData(formulario),           // junta todos los campos del formulario
      headers: { Accept: "application/json" }   // pedimos la respuesta en formato JSON
    });

    // respuesta.ok es true cuando el servicio contestó que todo salió bien
    if (respuesta.ok) {
      terminarBien();
    } else {
      terminarMal();
    }
  } catch (error) {
    terminarMal();   // no hubo respuesta (sin internet, servicio caído...)
  }
}

// Qué hacemos cuando el envío salió bien
function terminarBien() {
  avisoExito.hidden = false;     // mostramos el aviso verde
  formulario.reset();            // vaciamos los campos
  limpiarMarcas();
  actualizarContador();
  botonEnviar.disabled = false;
}

// Qué hacemos cuando el envío falló (los datos escritos se conservan)
function terminarMal() {
  avisoError.hidden = false;     // mostramos el aviso rojo
  botonEnviar.disabled = false;
}

// Saca los bordes verdes y rojos de todos los campos
function limpiarMarcas() {
  const campos = [campoNombre, campoEmail, campoAsunto, campoMensaje];

  campos.forEach(function (campo) {
    campo.classList.remove("is-valid");
    campo.classList.remove("is-invalid");
  });
}


// 9) AL CARGAR LA PÁGINA: dejamos el contador en "0 / 500"
actualizarContador();