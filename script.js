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
    const tripType = document.getElementById('trip-type').value;
    const returnContainer = document.getElementById('return-date-container');
    const returnDateInput = document.getElementById('return-date');

    if (tripType === 'Redondo') {
        // Muestra el contenedor de la fecha de regreso
        returnContainer.classList.remove('hidden');
        // Vuelve el campo obligatorio para que el navegador lo valide al enviar
        returnDateInput.setAttribute('required', 'true');
    } else {
        // Oculta el contenedor si es viaje sencillo
        returnContainer.classList.add('hidden');
        // Remueve el required para evitar el error de elemento oculto no focalizable
        returnDateInput.removeAttribute('required');
        // Opcional: limpia el valor anterior si cambia de opinión
        returnDateInput.value = '';
    }
}

// Control de campos para Ruta Personalizada ("Otro")
function handleRouteChange() {
    const routeSelect = document.getElementById('route-select');
    const customContainer = document.getElementById('custom-route-container');
    const customOrigin = document.getElementById('custom-origin');
    const customDestination = document.getElementById('custom-destination');

    if (!routeSelect || !customContainer) return;

    if (routeSelect.value === 'otro') {
        customContainer.classList.remove('hidden');
        if (customOrigin) customOrigin.required = true;
        if (customDestination) customDestination.required = true;
    } else {
        customContainer.classList.add('hidden');
        if (customOrigin) {
            customOrigin.value = '';
            customOrigin.required = false;
        }
        if (customDestination) {
            customDestination.value = '';
            customDestination.required = false;
        }
    }
}

// Precios Matrix actualizados para toda la flota (en MXN) - Incluyendo Aeropuerto de Cancún y Aeropuerto de Tulum
const priceTable = {
    Sedan: {
        Cancun: 499,
        CostaMujeres: 899,
        PlayaDelCarmen: 1299,
        Akumal: 1399,
        Tulum: 1800,
        TQO_TulumZH: 1400,
        TQO_TulumCentro: 1500,
        TQO_Akumal: 1600,
        TQO_Playa: 2000,
        TQO_Cancun: 2700,
        TQO_CostaMujeres: 3100
    },
    Van: {
        Cancun: 599,
        CostaMujeres: 999,
        PlayaDelCarmen: 1399,
        Akumal: 1499,
        Tulum: 2000,
        TQO_TulumZH: 1400,
        TQO_TulumCentro: 1500,
        TQO_Akumal: 1600,
        TQO_Playa: 2000,
        TQO_Cancun: 2700,
        TQO_CostaMujeres: 3100
    },
    Suburban: {
        Cancun: 1100,
        CostaMujeres: 1300,
        PlayaDelCarmen: 1500,
        Akumal: 1900,
        Tulum: 2300,
        TQO_TulumZH: 1400,
        TQO_TulumCentro: 1600,
        TQO_Akumal: 1700,
        TQO_Playa: 2200,
        TQO_Cancun: 3100,
        TQO_CostaMujeres: 3500
    },
    Trafic: {
        Cancun: 599,
        CostaMujeres: 999,
        PlayaDelCarmen: 1399,
        Akumal: 1499,
        Tulum: 2000,
        TQO_TulumZH: 1400,
        TQO_TulumCentro: 1500,
        TQO_Akumal: 1600,
        TQO_Playa: 2000,
        TQO_Cancun: 2700,
        TQO_CostaMujeres: 3100
    },
    Sprinter: {
        Cancun: 1100,
        CostaMujeres: 1300,
        PlayaDelCarmen: 1500,
        Akumal: 1900,
        Tulum: 2300,
        TQO_TulumZH: 1400,
        TQO_TulumCentro: 1600,
        TQO_Akumal: 1700,
        TQO_Playa: 2200,
        TQO_Cancun: 3100,
        TQO_CostaMujeres: 3500
    }
};

const routeNames = {
    Cancun: "Aeropuerto Cancún ⇄ Cancún Centro / Zona Hotelera",
    CostaMujeres: "Aeropuerto Cancún ⇄ Costa Mujeres",
    PlayaDelCarmen: "Aeropuerto Cancún ⇄ Playa del Carmen",
    Akumal: "Aeropuerto Cancún ⇄ Akumal",
    Tulum: "Aeropuerto Cancún ⇄ Tulum",
    TQO_TulumZH: "Aeropuerto Tulum ⇄ Tulum Zona Hotelera",
    TQO_TulumCentro: "Aeropuerto Tulum ⇄ Tulum Centro",
    TQO_Akumal: "Aeropuerto Tulum ⇄ Akumal",
    TQO_Playa: "Aeropuerto Tulum ⇄ Playa del Carmen",
    TQO_Cancun: "Aeropuerto Tulum ⇄ Cancún Zona Hotelera",
    TQO_CostaMujeres: "Aeropuerto Tulum ⇄ Costa Mujeres",
    otro: "Ruta Personalizada"
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

    let vehicleLabel = 'Sedán BAIC U5 Plus (1-4 pax)';
    if (vehicle === 'Van') vehicleLabel = 'Toyota Hiace / Van (1-10 pax)';
    if (vehicle === 'Suburban') vehicleLabel = 'Chevrolet Suburban (1-6 pax)';
    if (vehicle === 'Trafic') vehicleLabel = 'Renault Trafic (Grupos)';
    if (vehicle === 'Sprinter') vehicleLabel = 'Mercedes-Benz Sprinter (Grupos)';

    let tripLabel = tripType === 'Redondo' ? 'Redondo (Round Trip)' : 'Sencillo (One Way)';

    // Si selecciona "Otro", manejamos un precio base estimado o aviso de cotización
    if (route === 'otro') {
        estimatedPriceEl.innerText = "A cotizar";
        priceDescEl.innerText = `${vehicleLabel} • Ruta Personalizada (${tripLabel})`;
        return;
    }

    // Validación de seguridad por si alguna clave no existe en la matriz
    if (!priceTable[vehicle] || priceTable[vehicle][route] === undefined) return;

    let basePrice = priceTable[vehicle][route];
    let multiplier = tripType === 'Redondo' ? 2 : 1;
    let finalPrice = basePrice * multiplier;

    estimatedPriceEl.innerText = `$${finalPrice.toLocaleString()} MXN`;
    priceDescEl.innerText = `${vehicleLabel} • ${routeNames[route] || route} (${tripLabel})`;
}

// Run initial calculation on load
window.onload = function() {
    calculatePrice();
    toggleReturnDate();
    handleRouteChange();
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
        handleRouteChange();
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
        handleRouteChange();
        calculatePrice();
    }
    const reservarSec = document.getElementById('reservar');
    if (reservarSec) {
        reservarSec.scrollIntoView({ behavior: 'smooth' });
    }
}

// Send reservation details to Voucher, Make (Webhook) and display modal
function sendToWhatsAppAdvanced(e) {
    e.preventDefault();

    const nameEl = document.getElementById('client-name');
    const phonePrefixEl = document.getElementById('phone-prefix');
    const phoneEl = document.getElementById('client-phone');
    const vehicleEl = document.getElementById('vehicle-select');
    const routeEl = document.getElementById('route-select');
    const tripTypeEl = document.getElementById('trip-type');
    const dateEl = document.getElementById('travel-date');
    const returnDateEl = document.getElementById('return-date');
    const passengersEl = document.getElementById('passengers-count');
    
    // Captura de campos de vuelo, hotel y ruta personalizada
    const airlineEl = document.getElementById('travel-airline');
    const flightEl = document.getElementById('travel-flight');
    const hotelEl = document.getElementById('travel-hotel');
    const customOriginEl = document.getElementById('custom-origin');
    const customDestinationEl = document.getElementById('custom-destination');

    if (!nameEl || !vehicleEl || !routeEl || !tripTypeEl || !dateEl) return;

    const name = nameEl.value.trim();
    const phonePrefix = phonePrefixEl ? phonePrefixEl.value : '+52';
    const phoneNum = phoneEl ? phoneEl.value.trim() : '';
    const fullPhone = `${phonePrefix} ${phoneNum}`;

    const vehicleKey = vehicleEl.value;
    const routeKey = routeEl.value;
    const tripType = tripTypeEl.value;
    const date = dateEl.value;
    const returnDate = returnDateEl ? returnDateEl.value : '';
    const passengers = passengersEl ? passengersEl.value : '1';
    
    const airline = airlineEl ? airlineEl.value.trim() : '';
    const flight = flightEl ? flightEl.value.trim() : '';
    const hotel = hotelEl ? hotelEl.value.trim() : '';
    const customOrigin = customOriginEl ? customOriginEl.value.trim() : '';
    const customDestination = customDestinationEl ? customDestinationEl.value.trim() : '';

    if (!name) {
        alert('Por favor ingresa tu nombre completo para la reserva.');
        nameEl.focus();
        return;
    }

    if (!phoneNum) {
        alert('Por favor ingresa tu número de teléfono / WhatsApp.');
        if (phoneEl) phoneEl.focus();
        return;
    }

    if (tripType === 'Redondo' && !returnDate) {
        alert('Por favor selecciona la fecha de regreso para tu viaje redondo.');
        if (returnDateEl) returnDateEl.focus();
        return;
    }

    // Validación si eligió ruta personalizada
    if (routeKey === 'otro' && (!customOrigin || !customDestination)) {
        alert('Por favor ingresa tu Origen y Destino personalizado.');
        if (customOrigin && !customOrigin.value) customOrigin.focus();
        return;
    }

    let finalPriceText = "$ A cotizar";
    let numericPrice = 0;

    if (routeKey === 'otro') {
        finalPriceText = "Cotización por WhatsApp";
    } else {
        let basePrice = priceTable[vehicleKey][routeKey] || 0;
        let multiplier = tripType === 'Redondo' ? 2 : 1;
        numericPrice = basePrice * multiplier;
        finalPriceText = '$' + numericPrice.toLocaleString() + ' MXN';
    }

    let vehicleName = 'Sedán BAIC U5 Plus';
    if (vehicleKey === 'Van') vehicleName = 'Toyota Hiace / Van';
    if (vehicleKey === 'Suburban') vehicleName = 'Chevrolet Suburban';
    if (vehicleKey === 'Trafic') vehicleName = 'Renault Trafic';
    if (vehicleKey === 'Sprinter') vehicleName = 'Mercedes-Benz Sprinter';

    let routeName = routeKey === 'otro' ? `Origen: ${customOrigin} ➔ Destino: ${customDestination}` : (routeNames[routeKey] || routeKey);
    let folio = 'CGR-' + Math.floor(1000 + Math.random() * 9000);

    // 1. Rellenar los datos en el Voucher HTML de forma segura
    const setInnerText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    };

    setInnerText('v-folio', folio);
    setInnerText('v-nombre', `${name} (${fullPhone})`);
    setInnerText('v-vehiculo', vehicleName);
    setInnerText('v-ruta', routeName);
    
    let fechaTexto = 'Ida: ' + date;
    if (tripType === 'Redondo' && returnDate) {
        fechaTexto += ' | Regreso: ' + returnDate;
    }
    fechaTexto += ' (' + tripType + '; ' + passengers + ' pax)';
    setInnerText('v-fecha', fechaTexto);
    setInnerText('v-precio', finalPriceText);

    // 1.1 Mostrar u ocultar detalles de Vuelo/Hotel/Ruta libre en el Voucher de manera dinámica
    const vNotesContainer = document.getElementById('v-notes-container');
    const vNotasSpan = document.getElementById('v-notas');
    
    let combinedNotes = [];
    if (routeKey === 'otro') {
        combinedNotes.push(`Trayecto Libre - Origen: ${customOrigin} | Destino: ${customDestination}`);
    }
    if (airline) combinedNotes.push(`Aerolínea: ${airline}`);
    if (flight) combinedNotes.push(`Vuelo: ${flight}`);
    if (hotel) combinedNotes.push(`Hotel/Destino: ${hotel}`);

    if (combinedNotes.length > 0) {
        if (vNotasSpan) vNotasSpan.innerText = combinedNotes.join(' | ');
        if (vNotesContainer) vNotesContainer.classList.remove('hidden');
    } else {
        if (vNotesContainer) vNotesContainer.classList.add('hidden');
    }

    // 2. Generar Código QR dentro del modal
    const qrContainer = document.getElementById('codigoQR');
    if (qrContainer) {
        qrContainer.innerHTML = '';
        const qrData = `CANCUNGORIDE|Folio:${folio}|Cliente:${name}|Tel:${fullPhone}|Ruta:${routeName}|Tipo:${tripType}|Ida:${date}${returnDate ? '|Regreso:'+returnDate : ''}|Total:${finalPriceText}`;
        
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

    // 3. Envío automático de la información a Make (Webhook)
    const datosReserva = {
        folio: folio,
        name: name,
        phone: fullPhone,
        vehicleName: vehicleName,
        routeName: routeName,
        customOrigin: customOrigin,
        customDestination: customDestination,
        tripType: tripType,
        date: date,
        returnDate: returnDate,
        passengers: passengers,
        finalPrice: finalPriceText,
        airline: airline,
        flight: flight,
        hotel: hotel
    };

    fetch('https://hook.us2.make.com/wkuypywfirfk7dme2iq15jsjpuyq0vdn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosReserva)
    })
    .catch(error => console.error('Error al enviar la reserva a Make:', error));

    // 4. Mostrar el Modal del Voucher al cliente inmediatamente en su pantalla
    const modal = document.getElementById('modalVoucher');
    if (modal) {
        modal.classList.remove('hidden');
    }

    // Limpieza segura de campos de texto del formulario después de procesar
    setTimeout(() => {
        if (nameEl) nameEl.value = '';
        if (phoneEl) phoneEl.value = '';
        if (phonePrefixEl) phonePrefixEl.value = '+52';
        if (airlineEl) airlineEl.value = '';
        if (flightEl) flightEl.value = '';
        if (hotelEl) hotelEl.value = '';
        if (customOriginEl) customOriginEl.value = '';
        if (customDestinationEl) customDestinationEl.value = '';
        if (passengersEl) passengersEl.value = '2';
        if (tripTypeEl) {
            tripTypeEl.value = 'Sencillo';
            toggleReturnDate();
        }
        if (routeEl) {
            routeEl.value = 'PlayaDelCarmen';
            handleRouteChange();
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
            threshold: 0.4
        });

        hintContainers.forEach(container => {
            observer.observe(container);
        });
    }
});

// ==========================================
// Control de Botones de Flechas (Izquierda / Derecha) para la Flota
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const slider = document.getElementById('flota-slider');
    const btnLeft = document.getElementById('slide-left-btn');
    const btnRight = document.getElementById('slide-right-btn');

    if (!slider) return;

    const scrollAmount = 440;

    if (btnRight) {
        btnRight.addEventListener('click', () => {
            slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    if (btnLeft) {
        btnLeft.addEventListener('click', () => {
            slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }
});

// Función para cambiar la imagen de la Suburban según el color seleccionado
function changeSuburbanColor(color) {
    const suburbanImg = document.getElementById('suburnann');
    if (!suburbanImg) return;

    if (color === 'negro') {
        suburbanImg.src = 'suburnann.webp'; 
    } else {
        suburbanImg.src = 'suburban.webp';
    }
}
