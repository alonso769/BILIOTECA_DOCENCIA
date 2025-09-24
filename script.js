// Cargar PDF.js desde CDN
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.min.js';
script.onload = function() {
    // Configuración de PDF.js
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js';
};
document.head.appendChild(script);

// Variables globales para el visor de PDF
let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;
let isRendering = false;
let scale = 1.5;

// Función para mostrar el PDF de forma segura
function verPDF(ruta) {
    const visor = document.getElementById("visor");
    const pdfViewerContainer = document.getElementById("pdfViewerContainer");
    const canvas = document.getElementById("pdfCanvas");
    const ctx = canvas.getContext('2d');
    const pageNumDisplay = document.getElementById("pageNumDisplay");
    const pdfPrev = document.getElementById("pdfPrev");
    const pdfNext = document.getElementById("pdfNext");

    // Muestra el modal
    visor.style.display = "flex";

    // Verifica si PDF.js está cargado
    if (typeof pdfjsLib === 'undefined') {
        pdfViewerContainer.innerHTML = '<p>Cargando visor de PDF...</p>';
        // Espera a que PDF.js se cargue
        const checkPDFJS = setInterval(function() {
            if (typeof pdfjsLib !== 'undefined') {
                clearInterval(checkPDFJS);
                cargarPDF(ruta, canvas, ctx, pageNumDisplay, pdfPrev, pdfNext);
            }
        }, 100);
    } else {
        cargarPDF(ruta, canvas, ctx, pageNumDisplay, pdfPrev, pdfNext);
    }

    // Bloquea interacciones no deseadas
    document.addEventListener('keydown', bloquearAtajos);
    document.getElementById('pdfViewerContainer').addEventListener('contextmenu', bloquearClicDerecho);
}

// Función para cargar el PDF
function cargarPDF(ruta, canvas, ctx, pageNumDisplay, pdfPrev, pdfNext) {
    pdfjsLib.getDocument(ruta).promise.then(function(pdf) {
        pdfDoc = pdf;
        totalPages = pdf.numPages;

        // Configura los controles de navegación
        pageNumDisplay.textContent = `Página ${currentPage} de ${totalPages}`;

        pdfPrev.onclick = function() {
            if (currentPage > 1) {
                currentPage--;
                renderPage(pdfDoc, currentPage, canvas, ctx);
                pageNumDisplay.textContent = `Página ${currentPage} de ${totalPages}`;
            }
        };

        pdfNext.onclick = function() {
            if (currentPage < totalPages) {
                currentPage++;
                renderPage(pdfDoc, currentPage, canvas, ctx);
                pageNumDisplay.textContent = `Página ${currentPage} de ${totalPages}`;
            }
        };

        // Renderiza la primera página
        renderPage(pdfDoc, currentPage, canvas, ctx);

        // Bloquea los controles del navegador
        bloquearControlesNavegador();
    }).catch(function(error) {
        console.error("Error al cargar el PDF:", error);
        pdfViewerContainer.innerHTML = '<p style="color: red; text-align: center;">Error al cargar el documento. Intenta nuevamente.</p>';
    });
}

// Función para renderizar una página del PDF
function renderPage(pdf, pageNum, canvas, ctx) {
    isRendering = true;

    pdf.getPage(pageNum).then(function(page) {
        const viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        const renderTask = page.render(renderContext);
        renderTask.promise.then(function() {
            isRendering = false;
        });
    });
}

// Función para bloquear atajos de teclado
function bloquearAtajos(e) {
    // Bloquea Ctrl+P (imprimir) y Ctrl+S (guardar)
    if (e.ctrlKey && (e.key === 'p' || e.key === 's' || e.key === 'P' || e.key === 'S')) {
        e.preventDefault();
        e.stopPropagation();
        alert("No está permitido imprimir o guardar este documento.");
    }
    // Bloquea F12 (herramientas de desarrollador)
    if (e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
    }
}

// Función para bloquear clic derecho
function bloquearClicDerecho(e) {
    e.preventDefault();
    return false;
}

// Función para bloquear controles del navegador
function bloquearControlesNavegador() {
    // Deshabilita la impresión
    window.onbeforeprint = function() {
        alert("La impresión de este documento está deshabilitada.");
        return false;
    };
}

// Función para ocultar el visor de PDF
function ocultarPDF() {
    const visor = document.getElementById("visor");
    visor.style.display = "none";

    // Remueve los listeners para evitar acumulación
    document.removeEventListener('keydown', bloquearAtajos);
    document.getElementById('pdfViewerContainer').removeEventListener('contextmenu', bloquearClicDerecho);
    window.onbeforeprint = null;
}

// Función para descargar PDF (deshabilitada)
function descargarPDF(ruta) {
    alert("La descarga de documentos está deshabilitada.");
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
const searchEntidad = document.getElementById("searchEntidad");

function filtrar() {
    const nombreInvestigador = searchName.value.toLowerCase();
    const tituloProyecto = searchTitulo.value.toLowerCase();

    const entidad = searchEntidad.value;
    const allCards = document.querySelectorAll('.pdf-card');
    allCards.forEach(card => {
        const nombreCard = card.dataset.investigador.toLowerCase();
        const tituloCard = card.dataset.titulo.toLowerCase();

        const entidadCard = card.dataset.entidad;
        const coincideNombre = nombreCard.includes(nombreInvestigador);
        const coincideTitulo = tituloCard.includes(tituloProyecto);

        const coincideEntidad = entidad === "" || entidadCard.includes(entidad);
        if (coincideNombre && coincideTitulo && coincideEntidad) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

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
