// Toggle Mobile Menu
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}

// Set minimum date for date picker to today
const travelDateInput = document.getElementById('travel-date');
const returnDateInput = document.getElementById('return-date');

if (travelDateInput) {
    const today = new Date().toISOString().split('T')[0];
    travelDateInput.value = today;
    travelDateInput.min = today;
    if (returnDateInput) {
        returnDateInput.min = today;
        returnDateInput.value = today;
    }
    
    // Actualizar dinámicamente el mínimo de la fecha de regreso al cambiar la fecha de ida
    travelDateInput.addEventListener('change', function() {
        if (returnDateInput) {
            returnDateInput.min = this.value;
            if (returnDateInput.value < this.value) {
                returnDateInput.value = this.value;
            }
        }
    });
}

// Mostrar u ocultar la fecha de regreso según el tipo de servicio seleccionado
function toggleReturnDate() {
    const tripTypeEl = document.getElementById('trip-type');
    if (!tripTypeEl) return;
    
    const tripType = tripTypeEl.value;
    const returnContainer = document.getElementById('return-date-container');
    const returnDateEl = document.getElementById('return-date');

    if (tripType === 'Redondo') {
        if (returnContainer) returnContainer.classList.remove('hidden');
        if (returnDateEl) returnDateEl.required = true;
    } else {
        if (returnContainer) returnContainer.classList.add('hidden');
        if (returnDateEl) {
            returnDateEl.required = false;
            returnDateEl.value = '';
        }
    }
}

// Precios Matrix (en MXN)
const priceTable = {
    Sedan: {
        Cancun: 499,
        CostaMujeres: 899,
        PlayaDelCarmen: 1299,
        Akumal: 1399,
        Tulum: 1800
    },
    Van: {
        Cancun: 599,
        CostaMujeres: 999,
        PlayaDelCarmen: 1399,
        Akumal: 1499,
        Tulum: 2000
    }
};

const routeNames = {
    Cancun: "Cancún Centro / Zona Hotelera",
    CostaMujeres: "Costa Mujeres",
    PlayaDelCarmen: "Playa del Carmen",
    Akumal: "Akumal",
    Tulum: "Tulum"
};

// Calculate Price Function
function calculatePrice() {
    const vehicleEl = document.getElementById('vehicle-select');
    const routeEl = document.getElementById('route-select');
    const tripTypeEl = document.getElementById('trip-type');
    const estimatedPriceEl = document.getElementById('estimated-price');
    const priceDescEl = document.getElementById('price-desc');

    if (!vehicleEl || !routeEl || !tripTypeEl || !estimatedPriceEl || !priceDescEl) return;

    const vehicle = vehicleEl.value;
    const route = routeEl.value;
    const tripType = tripTypeEl.value;

    // Validación de seguridad por si alguna clave no existe en la matriz
    if (!priceTable[vehicle] || priceTable[vehicle][route] === undefined) return;

    let basePrice = priceTable[vehicle][route];
    let multiplier = tripType === 'Redondo' ? 2 : 1;
    let finalPrice = basePrice * multiplier;

    let vehicleLabel = vehicle === 'Sedan' ? 'Sedán BAIC U5 Plus (1-3 pax)' : 'Toyota Hiace Van (1-10 pax)';
    let tripLabel = tripType === 'Redondo' ? 'Redondo (Round Trip)' : 'Sencillo (One Way)';

    estimatedPriceEl.innerText = `$${finalPrice.toLocaleString()} MXN`;
    priceDescEl.innerText = `${vehicleLabel} • Aeropuerto ⇄ ${routeNames[route] || route} (${tripLabel})`;
}

// Run initial calculation on load
window.onload = function() {
    calculatePrice();
    toggleReturnDate();
};

// Quick quote from hero section
function quickQuoteHero(e) {
    e.preventDefault();
    const heroVehiculo = document.getElementById('hero-vehiculo');
    const heroRuta = document.getElementById('hero-ruta');
    
    if (!heroVehiculo || !heroRuta) return;

    const vehicle = heroVehiculo.value;
    const ruta = heroRuta.value;

    const vehicleSelect = document.getElementById('vehicle-select');
    const routeSelect = document.getElementById('route-select');

    if (vehicleSelect && routeSelect) {
        vehicleSelect.value = vehicle;
        routeSelect.value = ruta;
        calculatePrice();
    }

    const reservarSec = document.getElementById('reservar');
    if (reservarSec) {
        reservarSec.scrollIntoView({ behavior: 'smooth' });
    }
}

// Select route directly from tariff cards
function selectRouteAndScroll(routeKey) {
    const routeSelect = document.getElementById('route-select');
    if (routeSelect) {
        routeSelect.value = routeKey;
        calculatePrice();
    }
    const reservarSec = document.getElementById('reservar');
    if (reservarSec) {
        reservarSec.scrollIntoView({ behavior: 'smooth' });
    }
}

// Send to WhatsApp with advanced message and Voucher/QR generation (Manual Trigger)
function sendToWhatsAppAdvanced(e) {
    e.preventDefault();

    const nameEl = document.getElementById('client-name');
    const vehicleEl = document.getElementById('vehicle-select');
    const routeEl = document.getElementById('route-select');
    const tripTypeEl = document.getElementById('trip-type');
    const dateEl = document.getElementById('travel-date');
    const returnDateEl = document.getElementById('return-date');
    const passengersEl = document.getElementById('passengers-count');
    const notesEl = document.getElementById('travel-notes');

    if (!nameEl || !vehicleEl || !routeEl || !tripTypeEl || !dateEl) return;

    const name = nameEl.value.trim();
    const vehicleKey = vehicleEl.value;
    const routeKey = routeEl.value;
    const tripType = tripTypeEl.value;
    const date = dateEl.value;
    const returnDate = returnDateEl ? returnDateEl.value : '';
    const passengers = passengersEl ? passengersEl.value : '1';
    const notes = notesEl ? notesEl.value.trim() : '';

    if (!name) {
        alert('Por favor ingresa tu nombre completo para la reserva.');
        nameEl.focus();
        return;
    }

    if (tripType === 'Redondo' && !returnDate) {
        alert('Por favor selecciona la fecha de regreso para tu viaje redondo.');
        if (returnDateEl) returnDateEl.focus();
        return;
    }

    let basePrice = priceTable[vehicleKey][routeKey] || 0;
    let multiplier = tripType === 'Redondo' ? 2 : 1;
    let finalPrice = basePrice * multiplier;

    let vehicleName = vehicleKey === 'Sedan' ? 'Sedán BAIC U5 Plus (Beijing)' : 'Toyota Hiace / Van';
    let routeName = routeNames[routeKey] || routeKey;
    let folio = 'CGR-' + Math.floor(1000 + Math.random() * 9000);

    // 1. Rellenar los datos en el Voucher HTML de forma segura
    const setInnerText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    };

    setInnerText('v-folio', folio);
    setInnerText('v-nombre', name);
    setInnerText('v-vehiculo', vehicleKey === 'Sedan' ? 'Sedán BAIC' : 'Toyota Hiace');
    setInnerText('v-ruta', routeName);
    
    let fechaTexto = 'Ida: ' + date;
    if (tripType === 'Redondo' && returnDate) {
        fechaTexto += ' | Regreso: ' + returnDate;
    }
    fechaTexto += ' (' + tripType + '; ' + passengers + ' pax)';
    setInnerText('v-fecha', fechaTexto);
    setInnerText('v-precio', '$' + finalPrice.toLocaleString() + ' MXN');

    // 1.1 Mostrar u ocultar las Notas en el Voucher de manera dinámica
    const vNotesContainer = document.getElementById('v-notes-container');
    const vNotasSpan = document.getElementById('v-notas');
    if (notes) {
        if (vNotasSpan) vNotasSpan.innerText = notes;
        if (vNotesContainer) vNotesContainer.classList.remove('hidden');
    } else {
        if (vNotesContainer) vNotesContainer.classList.add('hidden');
    }

    // 2. Generar Código QR dentro del modal
    const qrContainer = document.getElementById('codigoQR');
    if (qrContainer) {
        qrContainer.innerHTML = '';
        const qrData = `CANCUNGORIDE|Folio:${folio}|Cliente:${name}|Ruta:${routeName}|Tipo:${tripType}|Ida:${date}${returnDate ? '|Regreso:'+returnDate : ''}|Total:$${finalPrice}`;
        
        if (typeof QRCode !== 'undefined') {
            try {
                new QRCode(qrContainer, {
                    text: qrData,
                    width: 64,
                    height: 64,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.M
                });
            } catch (err) {
                qrContainer.innerHTML = '<span class="text-[9px] text-center font-bold text-navy">QR VÁLIDO</span>';
            }
        } else {
            qrContainer.innerHTML = '<span class="text-[9px] text-center font-bold text-navy">QR VÁLIDO</span>';
        }
    }

    // 3. Preparar mensaje y asignar enlace al botón de WhatsApp del modal (por si el cliente quiere dar clic manual después)
    const whatsappNumber = "529982257895"; 

    let message = `¡Hola, *Cancungoride*! Deseo confirmar mi reserva con folio *${folio}* y solicitar datos SPEI:%0A%0A`;
    message += `👤 *Pasajero:* ${encodeURIComponent(name)}%0A`;
    message += `🚗 *Vehículo:* ${encodeURIComponent(vehicleName)}%0A`;
    message += `📍 *Ruta:* Aeropuerto ⇄ ${encodeURIComponent(routeName)}%0A`;
    message += `🔄 *Tipo de Viaje:* ${encodeURIComponent(tripType)}%0A`;
    
    if(tripType === 'Redondo' && returnDate) {
        message += `📅 *Fecha de Ida:* ${encodeURIComponent(date)}%0A`;
        message += `📅 *Fecha de Regreso:* ${encodeURIComponent(returnDate)}%0A`;
    } else {
        message += `📅 *Fecha:* ${encodeURIComponent(date)}%0A`;
    }

    message += `👥 *Pasajeros:* ${encodeURIComponent(passengers)}%0A`;
    message += `💰 *Tarifa Estimada:* $${finalPrice.toLocaleString()} MXN%0A`;
    message += `💳 *Método de pago:* Transferencia Bancaria (SPEI)%0A`;
    if(notes) {
        message += `📝 *Notas/Vuelo:* ${encodeURIComponent(notes)}%0A`;
    }
    message += `%0A¡Quedo a la espera de la cuenta CLABE para realizar el depósito!`;

    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    const btnWhatsApp = document.getElementById('btnEnviarWhatsApp');
    if (btnWhatsApp) {
        btnWhatsApp.href = whatsappURL;
    }

    // --- NUEVO: ENVÍO SILENCIOSO A MAKE ---
    const datosReserva = {
        folio: folio,
        name: name,
        vehicleName: vehicleName,
        routeName: routeName,
        tripType: tripType,
        date: date,
        returnDate: returnDate,
        passengers: passengers,
        finalPrice: finalPrice,
        notes: notes
    };

    // Reemplaza 'TU_URL_DE_WEBHOOK_DE_MAKE_AQUI' con la URL que copiaste de Make
    fetch('https://hook.us2.make.com/kc1u5a6ofhfg0gfdq7j4ttrw5oezse5d', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosReserva)
    })
    .catch(error => console.error('Error al enviar alerta:', error));
    // -------------------------------------

    // 4. Mostrar el Modal del Voucher al cliente de forma limpia
    const modal = document.getElementById('modalVoucher');
    if (modal) {
        modal.classList.remove('hidden');
    }

    // Limpieza segura de campos de texto del formulario después de procesar
    setTimeout(() => {
        if (nameEl) nameEl.value = '';
        if (notesEl) notesEl.value = '';
        if (passengersEl) passengersEl.value = '2';
        if (tripTypeEl) {
            tripTypeEl.value = 'Sencillo';
            toggleReturnDate();
        }
        
        if (dateEl) {
            const today = new Date().toISOString().split('T')[0];
            dateEl.value = today;
            if (returnDateEl) returnDateEl.value = today;
        }

        calculatePrice();
    }, 800);
}

// Función para cerrar la ventana modal del voucher
function cerrarModalVoucher() {
    const modal = document.getElementById('modalVoucher');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Función para descargar el comprobante en PDF / Imprimir
function descargarPDF() {
    const areaComprobante = document.getElementById('areaComprobante');
    if (!areaComprobante) return;
    
    const contenido = areaComprobante.innerHTML;
    const ventanaImpresion = window.open('', '_blank', 'width=600,height=700');
    
    if (ventanaImpresion) {
        ventanaImpresion.document.write(`
            <html>
                <head>
                    <title>Voucher de Reserva - Cancungoride</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff; padding: 20px; }
                    </style>
                </head>
                <body onload="window.print(); window.close();">
                    <div class="max-w-md mx-auto bg-white p-6 border border-gray-300 rounded-2xl shadow-lg">
                        ${contenido}
                    </div>
                </body>
            </html>
        `);
        ventanaImpresion.document.close();
    }
}

// Activar animación de deslizamiento (scroll hint) cuando el elemento entra en pantalla
document.addEventListener("DOMContentLoaded", function() {
    const hintContainers = document.querySelectorAll('.scroll-hint-anim');

    if (hintContainers.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'none';
                    entry.target.offsetHeight; // Trigger reflow
                    entry.target.style.animation = null;
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.4 // Se activa cuando al menos el 40% del contenedor es visible en pantalla
        });

        hintContainers.forEach(container => {
            observer.observe(container);
        });
    }
});
