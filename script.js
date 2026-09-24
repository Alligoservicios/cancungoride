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
if (travelDateInput) {
    const today = new Date().toISOString().split('T')[0];
    travelDateInput.value = today;
    travelDateInput.min = today;
}

// precios Matrix (en MXN)
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

    let basePrice = priceTable[vehicle][route];
    let multiplier = tripType === 'Redondo' ? 2 : 1;
    let finalPrice = basePrice * multiplier;

    let vehicleLabel = vehicle === 'Sedan' ? 'Sedán BAIC U5 Plus (1-3 pax)' : 'Toyota Hiace Van (1-10 pax)';
    let tripLabel = tripType === 'Redondo' ? 'Redondo (Round Trip)' : 'Sencillo (One Way)';

    estimatedPriceEl.innerText = `$${finalPrice.toLocaleString()} MXN`;
    priceDescEl.innerText = `${vehicleLabel} • Aeropuerto ⇄ ${routeNames[route]} (${tripLabel})`;
}

// Run initial calculation on load
window.onload = function() {
    calculatePrice();
};

// Quick quote from hero section
function quickQuoteHero(e) {
    e.preventDefault();
    const vehicle = document.getElementById('hero-vehiculo').value;
    const ruta = document.getElementById('hero-ruta').value;

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

// Send to WhatsApp with advanced message and SPEI payment request
function sendToWhatsAppAdvanced(e) {
    e.preventDefault();

    const name = document.getElementById('client-name').value.trim();
    const vehicleKey = document.getElementById('vehicle-select').value;
    const routeKey = document.getElementById('route-select').value;
    const tripType = document.getElementById('trip-type').value;
    const date = document.getElementById('travel-date').value;
    const passengers = document.getElementById('passengers-count').value;
    const notesEl = document.getElementById('travel-notes');
    const notes = notesEl ? notesEl.value.trim() : '';

    let basePrice = priceTable[vehicleKey][routeKey];
    let multiplier = tripType === 'Redondo' ? 2 : 1;
    let finalPrice = basePrice * multiplier;

    let vehicleName = vehicleKey === 'Sedan' ? 'Sedán BAIC U5 Plus (Beijing)' : 'Toyota Hiace / Van';
    let routeName = routeNames[routeKey];
    
    // Tu número de WhatsApp configurado con código de país (México: 52)
    const whatsappNumber = "529982257895"; 

    let message = `¡Hola, *Cancungoride*! Deseo reservar y solicitar los datos para transferencia SPEI:%0A%0A`;
    message += `👤 *Pasajero:* ${encodeURIComponent(name)}%0A`;
    message += `🚗 *Vehículo:* ${encodeURIComponent(vehicleName)}%0A`;
    message += `📍 *Ruta:* Aeropuerto ⇄ ${encodeURIComponent(routeName)}%0A`;
    message += `🔄 *Tipo de Viaje:* ${encodeURIComponent(tripType)}%0A`;
    message += `👥 *Pasajeros:* ${encodeURIComponent(passengers)}%0A`;
    message += `📅 *Fecha:* ${encodeURIComponent(date)}%0A`;
    message += `💰 *Tarifa Estimada:* $${finalPrice.toLocaleString()} MXN%0A`;
    message += `💳 *Método de pago:* Transferencia Bancaria (SPEI)%0A`;
    if(notes) {
        message += `📝 *Notas/Vuelo:* ${encodeURIComponent(notes)}%0A`;
    }
    message += `%0A¡Quedo a la espera de la cuenta CLABE para realizar el depósito y confirmar!`;

    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappURL, '_blank');

    // Limpieza segura de campos de texto tras enviar
    setTimeout(() => {
        const nameInput = document.getElementById('client-name');
        const notesInput = document.getElementById('travel-notes');
        const passengersInput = document.getElementById('passengers-count');
        const dateInput = document.getElementById('travel-date');

        if (nameInput) nameInput.value = '';
        if (notesInput) notesInput.value = '';
        if (passengersInput) passengersInput.value = '2';
        
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }

        calculatePrice();
    }, 500);
}

// Activar animación de deslizamiento (scroll hint) cuando el elemento entra en pantalla
document.addEventListener("DOMContentLoaded", function() {
    const hintContainers = document.querySelectorAll('.scroll-hint-anim');

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
});
