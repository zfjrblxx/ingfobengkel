// ========================================
// DATA
// ========================================

let vehicle = JSON.parse(localStorage.getItem("garageVehicle")) || {
    name: "Honda Vario 160",
    plate: "E 1234 XX",
    year: "2024",
    odometer: 12450
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
// TODAY
// ========================================

function getToday() {

    const now = new Date();

    const year = now.getFullYear();

    const month =
        String(now.getMonth() + 1).padStart(2, "0");

    const day =
        String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ========================================
// MODAL
// ========================================

function showModal(id) {

    const modal = document.getElementById(id);

    if (modal) {
        modal.classList.add("show");
    }
}


function closeModal(id) {

    const modal = document.getElementById(id);

    if (modal) {
        modal.classList.remove("show");
    }
}


// Tutup modal ketika klik area luar
document.querySelectorAll(".modal").forEach(modal => {

    modal.addEventListener("click", function (e) {

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
        vehicle.name || "";

    document.getElementById("inputPlate").value =
        vehicle.plate || "";

    document.getElementById("inputYear").value =
        vehicle.year || "";

    showModal("vehicleModal");
}


function saveVehicle() {

    vehicle.name =
        document.getElementById("inputVehicleName").value.trim()
        || "My Motorcycle";

    vehicle.plate =
        document.getElementById("inputPlate").value.trim()
        || "-";

    vehicle.year =
        document.getElementById("inputYear").value
        || "-";

    saveData();

    render();

    closeModal("vehicleModal");
}


// ========================================
// ODOMETER
// ========================================

function openOdometer() {

    document.getElementById("inputOdometer").value =
        vehicle.odometer || "";

    showModal("odometerModal");
}


function saveOdometer() {

    const km =
        Number(
            document.getElementById("inputOdometer").value
        );

    if (km < 0 || isNaN(km)) {

        alert("Masukkan kilometer yang valid.");

        return;
    }

    vehicle.odometer = km;

    saveData();

    render();

    closeModal("odometerModal");
}


// ========================================
// OPEN SERVICE
// ========================================

function openService() {

    document.getElementById("serviceDate").value =
        getToday();

    document.getElementById("serviceKm").value =
        vehicle.odometer || "";

    document.getElementById("serviceName").value = "";

    document.getElementById("servicePart").value = "";

    document.getElementById("serviceWorkshop").value = "";

    document.getElementById("serviceCost").value = "";

    document.getElementById("serviceNotes").value = "";

    showModal("serviceModal");
}


// ========================================
// SAVE SERVICE
// ========================================

function saveService() {

    const date =
        document.getElementById("serviceDate").value;

    const name =
        document
            .getElementById("serviceName")
            .value
            .trim();

    const km =
        Number(
            document.getElementById("serviceKm").value
        );


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
            !isNaN(km) && km >= 0
                ? km
                : vehicle.odometer,

        name: name,

        part:
            document
                .getElementById("servicePart")
                .value
                .trim(),

        workshop:
            document
                .getElementById("serviceWorkshop")
                .value
                .trim(),

        cost:
            Number(
                document.getElementById("serviceCost").value
            ) || 0,

        notes:
            document
                .getElementById("serviceNotes")
                .value
                .trim()

    };


    services.push(item);


    // Update odometer jika KM servis lebih tinggi
    if (item.km > vehicle.odometer) {

        vehicle.odometer =
            item.km;

    }


    saveData();

    render();

    closeModal("serviceModal");
}


// ========================================
// DELETE SERVICE
// ========================================

function deleteService(id) {

    const confirmDelete =
        confirm("Hapus riwayat servis ini?");


    if (!confirmDelete) return;


    services =
        services.filter(
            item => item.id !== id
        );


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
        Number(
            document.getElementById("taxCost").value
        ) || 0;


    saveData();

    render();

    closeModal("taxModal");
}


// ========================================
// SAVE LOCAL STORAGE
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
// PATOKAN: 3 BULAN
// ========================================

function calculateService() {

    const remainingText =
        document.getElementById("remainingText");

    const servicePercent =
        document.getElementById("servicePercent");

    const progressBar =
        document.getElementById("progressBar");

    const lastServiceText =
        document.getElementById("lastServiceText");

    const nextServiceText =
        document.getElementById("nextServiceText");

    const overviewNextService =
        document.getElementById("overviewNextService");


    // ====================================
    // BELUM ADA SERVICE
    // ====================================

    if (!services.length) {

        if (remainingText) {
            remainingText.textContent =
                "Belum ada riwayat servis";
        }

        if (servicePercent) {
            servicePercent.textContent =
                "0%";
        }

        if (progressBar) {
            progressBar.style.width =
                "0%";
        }

        if (lastServiceText) {
            lastServiceText.textContent =
                "Catat servis pertama";
        }

        if (nextServiceText) {
            nextServiceText.textContent =
                "-";
        }

        if (overviewNextService) {
            overviewNextService.textContent =
                "-";
        }

        return;
    }


    // ====================================
    // CARI SERVICE TERBARU
    // ====================================

    const sorted =
        [...services].sort(
            (a, b) =>
                new Date(b.date + "T00:00:00") -
                new Date(a.date + "T00:00:00")
        );


    const lastService =
        sorted[0];


    // ====================================
    // TANGGAL SERVICE TERAKHIR
    // ====================================

    const lastDate =
        new Date(
            lastService.date +
            "T00:00:00"
        );


    // ====================================
    // NEXT SERVICE + 3 BULAN
    // ====================================

    const nextDate =
        new Date(lastDate);


    nextDate.setMonth(
        nextDate.getMonth() + 3
    );


    // ====================================
    // HARI INI
    // ====================================

    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    // ====================================
    // HITUNG SISA HARI
    // ====================================

    const remainingDays =
        Math.ceil(
            (
                nextDate -
                today
            ) /
            86400000
        );


    // ====================================
    // TOTAL HARI 3 BULAN
    // ====================================

    const totalDays =
        Math.max(
            1,
            Math.round(
                (
                    nextDate -
                    lastDate
                ) /
                86400000
            )
        );


    // ====================================
    // HARI SUDAH BERJALAN
    // ====================================

    const passedDays =
        Math.max(
            0,
            Math.round(
                (
                    today -
                    lastDate
                ) /
                86400000
            )
        );


    // ====================================
    // PROGRESS %
    // ====================================

    let percent =
        Math.round(
            (
                passedDays /
                totalDays
            ) * 100
        );


    percent =
        Math.max(
            0,
            Math.min(
                100,
                percent
            )
        );


    // ====================================
    // STATUS
    // ====================================

    if (remainingText) {

        if (remainingDays > 7) {

            remainingText.textContent =
                remainingDays +
                " hari lagi";

        }

        else if (remainingDays > 0) {

            remainingText.textContent =
                "⚠️ " +
                remainingDays +
                " hari lagi";

        }

        else if (remainingDays === 0) {

            remainingText.textContent =
                "🔧 Servis hari ini";

        }

        else {

            remainingText.textContent =
                "⚠️ Terlambat " +
                Math.abs(remainingDays) +
                " hari";

        }

    }


    // ====================================
    // PROGRESS
    // ====================================

    if (servicePercent) {

        servicePercent.textContent =
            percent + "%";

    }


    if (progressBar) {

        progressBar.style.width =
            percent + "%";

    }


    // ====================================
    // LAST SERVICE
    // ====================================

    if (lastServiceText) {

        lastServiceText.textContent =
            "Last " +
            formatDate(lastService.date);

    }


    // ====================================
    // NEXT SERVICE
    // ====================================

    const formattedNextDate =
        nextDate.toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );


    if (nextServiceText) {

        nextServiceText.textContent =
            "Next " +
            formattedNextDate;

    }


    // ====================================
    // OVERVIEW NEXT SERVICE
    // ====================================

    if (overviewNextService) {

        overviewNextService.textContent =
            formattedNextDate;

    }
}


// ========================================
// TAX COUNTDOWN
// ========================================

function renderTax() {

    const taxDateText =
        document.getElementById("taxDateText");

    const taxDays =
        document.getElementById("taxDays");

    const taxPrepare =
        document.getElementById("taxPrepare");


    if (!taxDateText || !taxDays) {
        return;
    }


    // Belum ada data pajak
    if (!tax.date) {

        taxDateText.textContent = "Not set";
        taxDays.textContent = "";

        if (taxPrepare) {
            taxPrepare.textContent = "";
        }

        return;
    }


    // Tanggal pembayaran
    taxDateText.textContent =
        formatDate(tax.date);


    // Nominal yang harus disiapkan
    if (taxPrepare) {

        if (tax.cost > 0) {

            taxPrepare.textContent =
                "Siapkan " + formatRupiah(tax.cost);

        } else {

            taxPrepare.textContent = "";

        }

    }


    // Hitung countdown
    const today = new Date();

    today.setHours(0, 0, 0, 0);


    const due =
        new Date(
            tax.date + "T00:00:00"
        );


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
// SERVICE HISTORY
// ========================================

function renderHistory() {

    const container =
        document.getElementById("history");


    if (!container) return;


    // Belum ada service
    if (!services.length) {

        container.innerHTML = `
            <div class="empty">
                Belum ada riwayat servis.<br>
                Catat servis pertamamu.
            </div>
        `;

        return;
    }


    // Urutkan berdasarkan tanggal terbaru
    const sortedServices =
        [...services].sort(
            (a, b) =>
                new Date(b.date + "T00:00:00") -
                new Date(a.date + "T00:00:00")
        );


    container.innerHTML =
        sortedServices
            .map(item => `

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
                                ? " • " +
                                  escapeHTML(item.workshop)
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
                            onclick="deleteService(${item.id})"
                        >
                            DELETE
                        </button>

                    </div>

                </div>

            `)
            .join("");
}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        String(value || "");


    return div.innerHTML;
}


// ========================================
// BACKUP DATA
// ========================================

function backupData() {

    const backup = {

        version: 1,

        createdAt:
            new Date().toISOString(),

        vehicle:
            vehicle,

        services:
            services,

        tax:
            tax

    };


    const json =
        JSON.stringify(
            backup,
            null,
            2
        );


    const blob =
        new Blob(
            [json],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    const date =
        getToday();


    link.href =
        url;


    link.download =
        "my-garage-backup-" +
        date +
        ".json";


    document.body.appendChild(link);


    link.click();


    document.body.removeChild(link);


    URL.revokeObjectURL(url);
}


// ========================================
// OPEN RESTORE
// ========================================

function openRestore() {

    const restoreFile =
        document.getElementById(
            "restoreFile"
        );


    if (restoreFile) {

        restoreFile.click();

    }
}


// ========================================
// RESTORE DATA
// ========================================

function restoreData(event) {

    const file =
        event.target.files[0];


    if (!file) return;


    const reader =
        new FileReader();


    reader.onload =
        function (e) {

            try {

                const backup =
                    JSON.parse(
                        e.target.result
                    );


                // Validasi backup
                if (
                    !backup.vehicle ||
                    !Array.isArray(
                        backup.services
                    ) ||
                    !backup.tax
                ) {

                    alert(
                        "File backup tidak valid."
                    );

                    event.target.value =
                        "";

                    return;
                }


                const confirmRestore =
                    confirm(
                        "Restore data ini?\n\n" +
                        "Data My Garage saat ini akan diganti."
                    );


                if (!confirmRestore) {

                    event.target.value =
                        "";

                    return;
                }


                // Restore
                vehicle =
                    backup.vehicle;


                services =
                    backup.services;


                tax =
                    backup.tax;


                saveData();


                render();


                alert(
                    "Data berhasil dipulihkan!"
                );

            }

            catch (error) {

                console.error(error);


                alert(
                    "File tidak dapat dibaca."
                );

            }


            event.target.value =
                "";

        };


    reader.readAsText(file);
}


// ========================================
// RENDER
// ========================================

function render() {

    // Vehicle
    const vehicleName =
        document.getElementById("vehicleName");

    const vehiclePlate =
        document.getElementById("vehiclePlate");

    const vehicleYear =
        document.getElementById("vehicleYear");

    const odometer =
        document.getElementById("odometer");


    if (vehicleName) {

        vehicleName.textContent =
            vehicle.name;

    }


    if (vehiclePlate) {

        vehiclePlate.textContent =
            vehicle.plate;

    }


    if (vehicleYear) {

        vehicleYear.textContent =
            vehicle.year;

    }


    if (odometer) {

        odometer.textContent =
            formatNumber(
                vehicle.odometer
            );

    }


    // Total Service
    const totalService =
        document.getElementById(
            "totalService"
        );


    if (totalService) {

        totalService.textContent =
            services.length;

    }


    // Next Service
    calculateService();


    // History
    renderHistory();


    // Pajak
    renderTax();
}


// ========================================
// START
// ========================================

render();

// ========================================
// PRINT SERVICE PREVIEW
// ========================================

let currentPrintService = null;


function printService(id) {

    const item =
        services.find(
            service => service.id === id
        );


    if (!item) {

        alert(
            "Data servis tidak ditemukan."
        );

        return;
    }


    currentPrintService = item;


    // ====================================
    // NEXT SERVICE + 3 BULAN
    // ====================================

    const serviceDate =
        new Date(
            item.date + "T00:00:00"
        );


    const nextDate =
        new Date(serviceDate);


    nextDate.setMonth(
        nextDate.getMonth() + 3
    );


    const nextServiceText =
        nextDate.toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );


    // ====================================
    // BASIC DATA
    // ====================================

    document.getElementById(
        "printDate"
    ).textContent =
        formatDate(item.date);


    document.getElementById(
        "printKm"
    ).textContent =
        formatNumber(item.km) +
        " KM";


    document.getElementById(
        "printVehicle"
    ).textContent =
        vehicle.name;


    document.getElementById(
        "printServiceName"
    ).textContent =
        item.name;


    document.getElementById(
        "printCost"
    ).textContent =
        formatRupiah(item.cost);


    document.getElementById(
        "printNextService"
    ).textContent =
        nextServiceText;


    // ====================================
    // OPTIONAL DATA
    // ====================================

    setPrintDetail(
        "printPartWrap",
        "printPart",
        item.part
    );


    setPrintDetail(
        "printWorkshopWrap",
        "printWorkshop",
        item.workshop
    );


    setPrintDetail(
        "printNotesWrap",
        "printNotes",
        item.notes
    );


    // ====================================
    // FOOTER
    // ====================================

    document.getElementById(
        "printFooter"
    ).textContent =
        "INGFO BENGKEL · " +
        formatDate(item.date).toUpperCase();


    // ====================================
    // SHOW
    // ====================================

    document.getElementById(
        "printPreview"
    ).classList.add("show");


    document.body.style.overflow =
        "hidden";
}


// ========================================
// OPTIONAL DETAIL
// ========================================

function setPrintDetail(
    wrapperId,
    valueId,
    value
) {

    const wrapper =
        document.getElementById(
            wrapperId
        );


    const element =
        document.getElementById(
            valueId
        );


    if (!wrapper || !element) {
        return;
    }


    if (value && value.trim()) {

        wrapper.style.display =
            "flex";

        element.textContent =
            value;

    }

    else {

        wrapper.style.display =
            "none";

    }
}


// ========================================
// CLOSE PRINT
// ========================================

function closePrintPreview() {

    document.getElementById(
        "printPreview"
    ).classList.remove("show");


    document.body.style.overflow =
        "";


    currentPrintService =
        null;
}


// ========================================
// PRINT
// ========================================

function printCurrentService() {

    if (!currentPrintService) {
        return;
    }


    const receipt =
        document.getElementById(
            "serviceReceipt"
        );


    const printWindow =
        window.open(
            "",
            "_blank"
        );


    if (!printWindow) {

        alert(
            "Izinkan pop-up untuk Print."
        );

        return;
    }


    printWindow.document.write(`
        <!DOCTYPE html>

        <html>

        <head>

            <title>
                Ingfo Bengkel
            </title>

            <style>

                @page {
                    size: A5 portrait;
                    margin: 15mm;
                }

                body {
                    margin: 0;
                    font-family:
                        "Courier New",
                        monospace;
                }

                .service-receipt {
                    width: 100%;
                    color: #111;
                }

                .receipt-content {
                    padding: 20px;
                }

                .receipt-header {
                    text-align: center;
                    margin-bottom: 30px;
                }

                .receipt-header h1 {
                    margin: 0;
                    font-size: 21px;
                    letter-spacing: 5px;
                }

                .receipt-header p {
                    margin-top: 8px;
                    font-size: 8px;
                    letter-spacing: 3px;
                }

                .receipt-line {
                    border-top:
                        1px dashed #888;

                    margin:
                        22px 0;
                }

                .receipt-row,
                .receipt-detail,
                .receipt-total {

                    display: flex;

                    justify-content:
                        space-between;

                    gap: 20px;

                    margin-bottom: 10px;

                    font-size: 9px;
                }

                .receipt-row strong,
                .receipt-detail strong {

                    text-align: right;

                    max-width: 65%;
                }

                .receipt-service h2 {

                    font-size: 12px;

                    margin:
                        0 0 22px;

                    text-transform:
                        uppercase;
                }

                .receipt-total strong {
                    font-size: 12px;
                }

                .receipt-next {
                    text-align: center;
                }

                .receipt-next span {
                    display: block;
                    font-size: 8px;
                    letter-spacing: 2px;
                }

                .receipt-next strong {
                    display: block;
                    margin-top: 8px;
                    font-size: 13px;
                }

                .receipt-next small {
                    display: block;
                    margin-top: 6px;
                    font-size: 7px;
                }

                .receipt-end {
                    text-align: center;
                    margin-top: 25px;
                    font-size: 9px;
                    font-weight: bold;
                    letter-spacing: 3px;
                }

                .receipt-footer {
                    text-align: center;
                    margin-top: 14px;
                    font-size: 7px;
                }

                .receipt-tear {
                    display: none;
                }

            </style>

        </head>

        <body>

            ${receipt.outerHTML}

            <script>

                window.onload =
                    function() {

                        window.print();

                    };

            <\/script>

        </body>

        </html>
    `);


    printWindow.document.close();
}


// ========================================
// SAVE IMAGE
// ========================================

function saveServiceImage() {

    alert(
        "Fitur Save Image kita pasang berikutnya."
    );
}


// ========================================
// SHARE
// ========================================

function shareService() {

    if (!currentPrintService) {
        return;
    }


    const text =
        "INGFO BENGKEL\n" +
        "RIWAYAT SERVICE\n\n" +

        vehicle.name +
        "\n" +

        formatDate(
            currentPrintService.date
        ) +

        "\n" +

        formatNumber(
            currentPrintService.km
        ) +

        " KM\n\n" +

        currentPrintService.name +

        "\n" +

        formatRupiah(
            currentPrintService.cost
        );


    if (navigator.share) {

        navigator.share({
            title:
                "Riwayat Service",
            text: text
        });

    }

    else {

        navigator.clipboard
            .writeText(text);

        alert(
            "Riwayat servis disalin."
        );

    }
}
