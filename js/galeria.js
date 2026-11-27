/* ==========================================================
   galeria.js  ·  Galería de imágenes de archivo/index.html

   ¿Qué hace?
   Al hacer clic en una imagen, se abre ampliada en una ventana,
   con flechas para pasar a la siguiente (también se puede deslizar
   el dedo en el celular). De eso se encarga la librería GLightbox,
   que cargamos en el HTML antes que este archivo.

   ¿Cómo sabe GLightbox qué imágenes abrir?
   Busca los enlaces que tienen la clase "glightbox". En el HTML,
   cada imagen está dentro de un enlace así:
     <a href="../img/tucuman_arde_1.jpg" class="glightbox" ...>
   El texto que aparece en la ventana sale del atributo data-title.

   Si la librería no carga (por ejemplo, sin internet), la galería se
   sigue viendo y cada imagen abre la foto grande en una pestaña normal.
   ========================================================== */


// 1) Si la librería no cargó, no hacemos nada (la galería queda como enlaces comunes)
if (typeof GLightbox !== "undefined") {

  // 2) Iniciamos la ventana de ampliación.
  //    loop: true = después de la última imagen vuelve a la primera.
  GLightbox({ loop: true });
}
