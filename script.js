// Funciones para ver y descargar PDF
function verPDF(ruta) {
    const visor = document.getElementById("visor");
    const pdfViewer = document.getElementById("pdfViewer");
    pdfViewer.src = ruta;
    visor.style.display = "flex";
}

function descargarPDF(ruta) {
    window.open(ruta, '_blank');
}

function ocultarPDF() {
    const visor = document.getElementById("visor");
    const pdfViewer = document.getElementById("pdfViewer");
    visor.style.display = "none";
    pdfViewer.src = "";
}

// --- NUEVO: Ver detalles ---
function verDetalles(btn) {
    const card = btn.closest('.pdf-card');
    const hoja = card.dataset.hoja || "No registrada";
    const titulo = card.dataset.titulo || "No registrado";
    const investigador = card.dataset.investigador || "No registrado";
    const celular = card.dataset.celular || "No registrado";
    const correo = card.dataset.correo || "No registrado";
    const entidad = card.dataset.entidad || "No registrada";
    const eess = card.dataset.eess || "No registrado";
    const solicitud = card.dataset.solicitud || "No registrada";
    const estado = card.dataset.estado || "No registrado";
    const inicio = card.dataset.inicio || "No registrado";
    const termino = card.dataset.termino || "No registrado";
    const informe = card.dataset.informe || "No registrado";
    const sesion = card.dataset.sesion || "No registrada";

    const modal = document.getElementById("detallesModal");
    const contenido = document.getElementById("detallesContenido");

    contenido.innerHTML = `
        <h2>HOJA DE TRÁMITE: ${hoja}</h2>
        <p><strong>Título del Proyecto:</strong> ${titulo}</p>
        <p><strong>Investigador Principal:</strong> ${investigador}</p>
        <hr>
        <p><strong>Celular:</strong> ${celular}</p>
        <p><strong>Correo Electrónico:</strong> ${correo}</p>
        <p><strong>Entidad:</strong> ${entidad}</p>
        <p><strong>EESS de Ejecución:</strong> ${eess}</p>
        <p><strong>Solicitud:</strong> ${solicitud}</p>
        <p><strong>Estado de Constancia:</strong> ${estado}</p>
        <p><strong>Fecha de Inicio:</strong> ${inicio}</p>
        <p><strong>Fecha de Término:</strong> ${termino}</p>
        <p><strong>Informe Final:</strong> ${informe}</p>
        <p><strong>Fecha de Sesión Aprobación:</strong> ${sesion}</p>
    `;
    modal.style.display = "flex";
}



function ocultarDetalles() {
    const modal = document.getElementById("detallesModal");
    document.getElementById("detallesContenido").innerHTML = "";
    modal.style.display = "none";
}

// --- Filtros ---
const searchName = document.getElementById("searchName");
const searchTitulo = document.getElementById("searchTitulo");
const searchEstado = document.getElementById("searchEstado");
const searchEspecialidad = document.getElementById("searchEspecialidad");
const searchEntidad = document.getElementById("searchEntidad");

function filtrar() {
    const nombreInvestigador = searchName.value.toLowerCase();
    const tituloProyecto = searchTitulo.value.toLowerCase();
    const estado = searchEstado.value;
    const especialidad = searchEspecialidad.value;
    const entidad = searchEntidad.value;

    const allCards = document.querySelectorAll('.pdf-card');

    allCards.forEach(card => {
        const nombreCard = card.dataset.investigador.toLowerCase();
        const tituloCard = card.dataset.titulo.toLowerCase();
        const estadoCard = card.dataset.estado;
        const especialidadCard = card.dataset.especialidad;
        const entidadCard = card.dataset.entidad;

        const coincideNombre = nombreCard.includes(nombreInvestigador);
        const coincideTitulo = tituloCard.includes(tituloProyecto);
        const coincideEstado = estado === "" || estadoCard.includes(estado);
        const coincideEspecialidad = especialidad === "" || especialidadCard === especialidad;
        const coincideEntidad = entidad === "" || entidadCard.includes(entidad);

        if (coincideNombre && coincideTitulo && coincideEstado && coincideEspecialidad && coincideEntidad) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// Elimina o comenta estos listeners:
// searchName.addEventListener("input", filtrar);
// searchTitulo.addEventListener("input", filtrar);
// searchEstado.addEventListener("change", filtrar);
// searchEspecialidad.addEventListener("change", filtrar);
// searchEntidad.addEventListener("change", filtrar);

// Agrega el listener para el botón "Filtrar"
document.getElementById("btnFiltrar").addEventListener("click", filtrar);


// --- Lógica del Carrusel de Imágenes ---
let slideIndex = 1;
showSlides(slideIndex);

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("image-slide");
  let dots = document.getElementsByClassName("dot");

  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}

  for (i = 0; i < slides.length; i++) {
    slides[i].classList.remove('active-slide');
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].classList.remove('active');
  }

  slides[slideIndex-1].classList.add('active-slide');
  dots[slideIndex-1].classList.add('active');
}

// Carrusel automático
setInterval(() => {
    slideIndex++;
    showSlides(slideIndex);
}, 5000);



document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
});
