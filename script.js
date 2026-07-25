```javascript
// ========================================
// DATA
// ========================================

let vehicle = JSON.parse(localStorage.getItem("garageVehicle")) || {
    name: "Honda Vario 160",
    plate: "E 1234 XX",
    year: "2024",
    odometer: 12450,
    interval: 2000
};

let services =
    JSON.parse(localStorage.getItem("garageServices")) || [];

let tax =
    JSON.parse(localStorage.getItem("garageTax")) || {
        date: "",
        cost: 0
    };


// ========================================
// FORMAT
// ========================================

function formatNumber(number) {
    return Number(number || 0).toLocaleString("id-ID");
}

function formatRupiah(number) {
    return "Rp" + Number(number || 0).toLocaleString("id-ID");
}

function formatDate(date) {

    if (!date) return "-";

    const d = new Date(date + "T00:00:00");

    return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


// ========================================
// MODAL
// ========================================

function showModal(id) {
    document.getElementById(id).classList.add("show");
}

function closeModal(id) {
    document.getElementById(id).classList.remove("show");
}

document.querySelectorAll(".modal").forEach(modal => {

    modal.addEventListener("click", function(e) {

        if (e.target === modal) {
            modal.classList.remove("show");
        }

    });

});


// ========================================
// VEHICLE
// ========================================

function openVehicle() {

    document.getElementById("inputVehicleName").value =
        vehicle.name;

    document.getElementById("inputPlate").value =
        vehicle.plate;

    document.getElementById("inputYear").value =
        vehicle.year;

    document.getElementById("serviceInterval").value =
        vehicle.interval;

    showModal("vehicleModal");
}


function saveVehicle() {

    vehicle.name =
        document.getElementById("inputVehicleName").value ||
        "My Motorcycle";

    vehicle.plate =
        document.getElementById("inputPlate").value ||
        "-";

    vehicle.year =
        document.getElementById("inputYear").value ||
        "-";

    vehicle.interval =
        Number(document.getElementById("serviceInterval").value) ||
        2000;

    saveData();
    render();

    closeModal("vehicleModal");
}


// ========================================
// ODOMETER
// ========================================

function openOdometer() {

    document.getElementById("inputOdometer").value =
        vehicle.odometer;

    showModal("odometerModal");
}


function saveOdometer() {

    const km =
        Number(document.getElementById("inputOdometer").value);

    if (!km) {
        alert("Masukkan kilometer.");
        return;
    }

    vehicle.odometer = km;

    saveData();
    render();

    closeModal("odometerModal");
}


// ========================================
// SERVICE
// ========================================

function openService() {

    document.getElementById("serviceDate").value =
        getToday();

    document.getElementById("serviceKm").value =
        vehicle.odometer;

    document.getElementById("serviceName").value = "";
    document.getElementById("servicePart").value = "";
    document.getElementById("serviceWorkshop").value = "";
    document.getElementById("serviceCost").value = "";
    document.getElementById("serviceNotes").value = "";

    showModal("serviceModal");
}


function getToday() {

    const now = new Date();

    const year = now.getFullYear();

    const month =
        String(now.getMonth() + 1).padStart(2, "0");

    const day =
        String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function saveService() {

    const date =
        document.getElementById("serviceDate").value;

    const name =
        document.getElementById("serviceName").value.trim();

    if (!date) {
        alert("Pilih tanggal servis.");
        return;
    }

    if (!name) {
        alert("Masukkan jenis servis.");
        return;
    }

    const item = {

        id: Date.now(),

        date: date,

        km:
            Number(document.getElementById("serviceKm").value) ||
            vehicle.odometer,

        name: name,

        part:
            document.getElementById("servicePart").value.trim(),

        workshop:
            document.getElementById("serviceWorkshop").value.trim(),

        cost:
            Number(document.getElementById("serviceCost").value) ||
            0,

        notes:
            document.getElementById("serviceNotes").value.trim()

    };

    services.unshift(item);

    if (item.km > vehicle.odometer) {
        vehicle.odometer = item.km;
    }

    saveData();
    render();

    closeModal("serviceModal");
}


function deleteService(id) {

    const confirmDelete =
        confirm("Hapus riwayat servis ini?");

    if (!confirmDelete) return;

    services =
        services.filter(item => item.id !== id);

    saveData();
    render();
}


// ========================================
// TAX
// ========================================

function openTax() {

    document.getElementById("taxDate").value =
        tax.date || "";

    document.getElementById("taxCost").value =
        tax.cost || "";

    showModal("taxModal");
}


function saveTax() {

    tax.date =
        document.getElementById("taxDate").value;

    tax.cost =
        Number(document.getElementById("taxCost").value) || 0;

    saveData();
    render();

    closeModal("taxModal");
}


// ========================================
// LOCAL STORAGE
// ========================================

function saveData() {

    localStorage.setItem(
        "garageVehicle",
        JSON.stringify(vehicle)
    );

    localStorage.setItem(
        "garageServices",
        JSON.stringify(services)
    );

    localStorage.setItem(
        "garageTax",
        JSON.stringify(tax)
    );
}


// ========================================
// NEXT SERVICE
// ========================================

function calculateService() {

    let lastServiceKm = 0;

    if (services.length) {

        const sorted =
            [...services].sort((a, b) => b.km - a.km);

        lastServiceKm = sorted[0].km;

    }

    if (!lastServiceKm) {

        lastServiceKm =
            Math.floor(
                vehicle.odometer / vehicle.interval
            ) * vehicle.interval;

    }

    let nextKm =
        lastServiceKm + vehicle.interval;

    if (nextKm <= vehicle.odometer) {

        nextKm =
            vehicle.odometer + vehicle.interval;

    }

    const remaining =
        nextKm - vehicle.odometer;

    const used =
        vehicle.interval - remaining;

    let percent =
        Math.round(
            (used / vehicle.interval) * 100
        );

    percent =
        Math.max(0, Math.min(100, percent));


    document.getElementById("remainingText").textContent =
        formatNumber(remaining) + " km remaining";

    document.getElementById("servicePercent").textContent =
        percent + "%";

    document.getElementById("progressBar").style.width =
        percent + "%";

    document.getElementById("currentKmText").textContent =
        formatNumber(vehicle.odometer) + " KM";

    document.getElementById("nextKmText").textContent =
        "Next " + formatNumber(nextKm) + " KM";
}


// ========================================
// TAX COUNTDOWN
// ========================================

function renderTax() {

    const taxDateText =
        document.getElementById("taxDateText");

    const taxDays =
        document.getElementById("taxDays");


    if (!tax.date) {

        taxDateText.textContent = "Not set";
        taxDays.textContent = "";

        return;
    }


    taxDateText.textContent =
        formatDate(tax.date);


    const today = new Date();

    today.setHours(0, 0, 0, 0);


    const due =
        new Date(tax.date + "T00:00:00");


    const difference =
        Math.ceil(
            (due - today) / 86400000
        );


    if (difference > 0) {

        taxDays.textContent =
            difference + " days";

    }

    else if (difference === 0) {

        taxDays.textContent =
            "TODAY";

    }

    else {

        taxDays.textContent =
            Math.abs(difference) +
            " days late";

    }
}


// ========================================
// HISTORY
// ========================================

function renderHistory() {

    const container =
        document.getElementById("history");


    if (!services.length) {

        container.innerHTML = `
            <div class="empty">
                Belum ada riwayat servis.<br>
                Catat servis pertamamu.
            </div>
        `;

        return;
    }


    const sortedServices =
        [...services].sort((a, b) => {

            return new Date(b.date) -
                   new Date(a.date);

        });


    container.innerHTML =
        sortedServices.map(item => `

            <div class="history-card">

                <div class="history-date">
                    ${formatDate(item.date)}
                </div>

                <div class="history-title">
                    ${escapeHTML(item.name)}
                </div>

                <div class="history-detail">

                    ${formatNumber(item.km)} KM

                    ${
                        item.workshop
                        ? " • " + escapeHTML(item.workshop)
                        : ""
                    }

                </div>


                ${
                    item.part
                    ? `
                        <div class="history-detail">
                            Spare part:
                            ${escapeHTML(item.part)}
                        </div>
                    `
                    : ""
                }


                ${
                    item.notes
                    ? `
                        <div class="history-detail">
                            ${escapeHTML(item.notes)}
                        </div>
                    `
                    : ""
                }


                <div class="history-bottom">

                    <div class="history-cost">
                        ${formatRupiah(item.cost)}
                    </div>

                    <button
                        class="delete-btn"
                        onclick="deleteService(${item.id})">
                        DELETE
                    </button>

                </div>

            </div>

        `).join("");
}


// ========================================
// SECURITY
// ========================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value || "");

    return div.innerHTML;
}


// ========================================
// RENDER
// ========================================

function render() {

    document.getElementById("vehicleName").textContent =
        vehicle.name;

    document.getElementById("vehiclePlate").textContent =
        vehicle.plate;

    document.getElementById("vehicleYear").textContent =
        vehicle.year;

    document.getElementById("odometer").textContent =
        formatNumber(vehicle.odometer);


    document.getElementById("totalService").textContent =
        services.length;


    const total =
        services.reduce(
            (sum, item) =>
                sum + Number(item.cost || 0),
            0
        );


    document.getElementById("totalCost").textContent =
        formatRupiah(total);


    calculateService();

    renderHistory();

    renderTax();
}


// ========================================
// START
// ========================================

render();
```
