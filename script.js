// ========================================
// SAFE LOCAL STORAGE
// ========================================

function loadStorage(key, fallback, validator) {

    try {

        const stored =
            localStorage.getItem(key);

        // Belum ada data
        if (stored === null) {
            return fallback;
        }


        const parsed =
            JSON.parse(stored);


        // Data null
        if (parsed === null) {
            return fallback;
        }


        // Struktur data tidak sesuai
        if (
            validator &&
            !validator(parsed)
        ) {

            console.warn(
                "Struktur localStorage tidak valid:",
                key
            );

            return fallback;
        }


        return parsed;

    }

    catch (error) {

        console.error(
            "Gagal membaca localStorage:",
            key,
            error
        );

        return fallback;
    }
}


// ========================================
// DEFAULT DATA
// ========================================

const defaultVehicle = {

    name: "Honda Vario 160",

    plate: "E 1234 XX",

    year: "2024",

    odometer: 12450
};


const defaultTax = {

    date: "",

    cost: 0
};


// ========================================
// VALIDATOR VEHICLE
// ========================================

function isValidVehicle(data) {

    if (
        !data ||
        typeof data !== "object" ||
        Array.isArray(data)
    ) {
        return false;
    }


    return (
        typeof data.name === "string" &&

        typeof data.plate === "string" &&

        (
            typeof data.year === "string" ||
            typeof data.year === "number"
        ) &&

        typeof data.odometer === "number" &&

        Number.isFinite(data.odometer) &&

        data.odometer >= 0
    );
}


// ========================================
// VALIDATOR SERVICE
// ========================================

function isValidService(item) {

    if (
        !item ||
        typeof item !== "object" ||
        Array.isArray(item)
    ) {
        return false;
    }


    return (
        (
            typeof item.id === "number" ||
            typeof item.id === "string"
        ) &&

        isValidDate(item.date) &&
item.date !== "" &&

        typeof item.name === "string" &&

        typeof item.km === "number" &&

        Number.isFinite(item.km) &&

        item.km >= 0 &&

        typeof item.part === "string" &&

        typeof item.workshop === "string" &&

        typeof item.cost === "number" &&

        Number.isFinite(item.cost) &&

        item.cost >= 0 &&

        typeof item.notes === "string"
    );
}


// ========================================
// VALIDATOR SERVICES
// ========================================

function isValidServices(data) {

    if (!Array.isArray(data)) {
        return false;
    }


    // Batasi jumlah data
    if (data.length > 5000) {
        return false;
    }


    return data.every(
        item => isValidService(item)
    );
}


// ========================================
// VALIDATOR TAX
// ========================================

function isValidTax(data) {

    if (
        !data ||
        typeof data !== "object" ||
        Array.isArray(data)
    ) {
        return false;
    }


    return (
        isValidDate(data.date) &&

        typeof data.cost === "number" &&

        Number.isFinite(data.cost) &&

        data.cost >= 0
    );
}


// ========================================
// LOAD DATA
// ========================================

let vehicle =
    loadStorage(
        "garageVehicle",
        { ...defaultVehicle },
        isValidVehicle
    );


let services =
    loadStorage(
        "garageServices",
        [],
        isValidServices
    );


let tax =
    loadStorage(
        "garageTax",
        { ...defaultTax },
        isValidTax
    );


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
// VALIDATE DATE
// FORMAT: YYYY-MM-DD
// ========================================

function isValidDate(value) {

    if (typeof value !== "string") {
        return false;
    }

    // Pajak boleh belum diatur
    if (value === "") {
        return true;
    }

    // Harus YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const [year, month, day] =
        value.split("-").map(Number);

    const date =
        new Date(year, month - 1, day);

    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
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

    const name =
        document
            .getElementById("inputVehicleName")
            .value
            .trim();

    const plate =
        document
            .getElementById("inputPlate")
            .value
            .trim();

    const year =
        document
            .getElementById("inputYear")
            .value
            .trim();


    // ====================================
    // VALIDASI
    // ====================================

    if (name.length > 50) {

        alert(
            "Nama kendaraan maksimal 50 karakter."
        );

        return;
    }


    if (plate.length > 20) {

        alert(
            "Plat nomor maksimal 20 karakter."
        );

        return;
    }


    if (year.length > 10) {

        alert(
            "Tahun kendaraan tidak valid."
        );

        return;
    }


    // ====================================
    // BACKUP DATA LAMA
    // ====================================

    const oldVehicle =
        { ...vehicle };


    // ====================================
    // UPDATE DATA
    // ====================================

    vehicle.name =
        name || "My Motorcycle";

    vehicle.plate =
        plate || "-";

    vehicle.year =
        year || "-";


    // ====================================
    // SIMPAN
    // ====================================

    if (!saveData()) {

        // Rollback ke data sebelumnya
        vehicle =
            oldVehicle;

        return;
    }


    // ====================================
    // BERHASIL
    // ====================================

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

    const input =
        document.getElementById(
            "inputOdometer"
        ).value.trim();


    // ====================================
    // VALIDASI
    // ====================================

    if (input === "") {

        alert("Masukkan kilometer.");

        return;
    }


    const km =
        Number(input);


    if (
        !Number.isFinite(km) ||
        km < 0 ||
        km > 9999999
    ) {

        alert(
            "Masukkan kilometer yang valid."
        );

        return;
    }


    // ====================================
    // BACKUP DATA LAMA
    // ====================================

    const oldOdometer =
        vehicle.odometer;


    // ====================================
    // UPDATE DATA
    // ====================================

    vehicle.odometer =
        Math.round(km);


    // ====================================
    // SIMPAN
    // ====================================

    if (!saveData()) {

        // Rollback
        vehicle.odometer =
            oldOdometer;

        return;
    }


    // ====================================
    // BERHASIL
    // ====================================

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
        document.getElementById(
            "serviceDate"
        ).value;


    const name =
        document.getElementById(
            "serviceName"
        ).value.trim();


    const kmInput =
        document.getElementById(
            "serviceKm"
        ).value.trim();


    const part =
        document.getElementById(
            "servicePart"
        ).value.trim();


    const workshop =
        document.getElementById(
            "serviceWorkshop"
        ).value.trim();


    const costInput =
        document.getElementById(
            "serviceCost"
        ).value.trim();


    const notes =
        document.getElementById(
            "serviceNotes"
        ).value.trim();


// ====================================
// TANGGAL
// ====================================

if (!date) {

    alert("Pilih tanggal servis.");

    return;
}

if (!isValidDate(date)) {

    alert("Tanggal servis tidak valid.");

    return;
}
    


    // ====================================
    // NAMA SERVICE
    // ====================================

    if (!name) {

        alert("Masukkan jenis servis.");

        return;
    }


    if (name.length > 100) {

        alert(
            "Jenis servis maksimal 100 karakter."
        );

        return;
    }


    // ====================================
    // KM
    // ====================================

    const km =
        kmInput === ""
            ? vehicle.odometer
            : Number(kmInput);


    if (
        !Number.isFinite(km) ||
        km < 0 ||
        km > 9999999
    ) {

        alert(
            "Kilometer servis tidak valid."
        );

        return;
    }


    // ====================================
    // BIAYA
    // ====================================

    const cost =
        costInput === ""
            ? 0
            : Number(costInput);


    if (
        !Number.isFinite(cost) ||
        cost < 0 ||
        cost > 999999999999
    ) {

        alert(
            "Biaya servis tidak valid."
        );

        return;
    }


    // ====================================
    // BATAS PANJANG TEXT
    // ====================================

    if (part.length > 500) {

        alert(
            "Spare part maksimal 500 karakter."
        );

        return;
    }


    if (workshop.length > 100) {

        alert(
            "Nama bengkel maksimal 100 karakter."
        );

        return;
    }


    if (notes.length > 1000) {

        alert(
            "Catatan maksimal 1000 karakter."
        );

        return;
    }


    // ====================================
    // SIMPAN
    // ====================================

    const item = {

        id: Date.now(),

        date: date,

        km: Math.round(km),

        name: name,

        part: part,

        workshop: workshop,

        cost: Math.round(cost),

        notes: notes
    };


    // ====================================
// BACKUP DATA LAMA
// ====================================

const oldServices =
    [...services];

const oldOdometer =
    vehicle.odometer;


// ====================================
// UPDATE DATA
// ====================================

services.push(item);


// Update odometer jika KM servis lebih tinggi
if (item.km > vehicle.odometer) {

    vehicle.odometer =
        item.km;
}


// ====================================
// SIMPAN
// ====================================

if (!saveData()) {

    // Rollback services
    services =
        oldServices;

    // Rollback odometer
    vehicle.odometer =
        oldOdometer;

    return;
}


// ====================================
// BERHASIL
// ====================================

render();

closeModal("serviceModal");


// ========================================
// DELETE SERVICE
// ========================================

function deleteService(id) {

    const confirmDelete =
        confirm("Hapus riwayat servis ini?");


    if (!confirmDelete) {
        return;
    }


    // ====================================
    // BACKUP DATA LAMA
    // ====================================

    const oldServices =
        [...services];


    // ====================================
    // HAPUS SERVICE
    // ====================================

    services =
        services.filter(
            item => item.id !== id
        );


    // ====================================
    // SIMPAN
    // ====================================

    if (!saveData()) {

        // Rollback
        services =
            oldServices;

        return;
    }


    // ====================================
    // BERHASIL
    // ====================================

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

    const date =
        document.getElementById(
            "taxDate"
        ).value;


    // ====================================
    // VALIDASI TANGGAL
    // ====================================

    if (!isValidDate(date)) {

        alert("Tanggal pajak tidak valid.");

        return;
    }


    const costInput =
        document.getElementById(
            "taxCost"
        ).value.trim();


    const cost =
        costInput === ""
            ? 0
            : Number(costInput);


    // ====================================
    // VALIDASI NOMINAL
    // ====================================

    if (
        !Number.isFinite(cost) ||
        cost < 0 ||
        cost > 999999999999
    ) {

        alert(
            "Nominal pajak tidak valid."
        );

        return;
    }


    // ====================================
    // BACKUP DATA LAMA
    // ====================================

    const oldTax =
        { ...tax };


    // ====================================
    // UPDATE DATA
    // ====================================

    tax.date =
        date;

    tax.cost =
        Math.round(cost);


    // ====================================
    // SIMPAN
    // ====================================

    if (!saveData()) {

        // Rollback
        tax =
            oldTax;

        return;
    }


    // ====================================
    // BERHASIL
    // ====================================

    render();

    closeModal("taxModal");
}


// ========================================
// SAVE LOCAL STORAGE - SAFE + ROLLBACK
// ========================================

function saveData() {

    // ====================================
    // BACKUP LOCAL STORAGE LAMA
    // ====================================

    let oldVehicle;
    let oldServices;
    let oldTax;


    try {

        oldVehicle =
            localStorage.getItem(
                "garageVehicle"
            );

        oldServices =
            localStorage.getItem(
                "garageServices"
            );

        oldTax =
            localStorage.getItem(
                "garageTax"
            );


        // ====================================
        // SIAPKAN DATA BARU
        // ====================================

        const newVehicle =
            JSON.stringify(vehicle);

        const newServices =
            JSON.stringify(services);

        const newTax =
            JSON.stringify(tax);


        // ====================================
        // SIMPAN DATA BARU
        // ====================================

        localStorage.setItem(
            "garageVehicle",
            newVehicle
        );

        localStorage.setItem(
            "garageServices",
            newServices
        );

        localStorage.setItem(
            "garageTax",
            newTax
        );


        return true;

    }

    catch (error) {

        console.error(
            "Gagal menyimpan data:",
            error
        );


        // ====================================
        // ROLLBACK LOCAL STORAGE
        // ====================================

        try {

            restoreStorageValue(
                "garageVehicle",
                oldVehicle
            );

            restoreStorageValue(
                "garageServices",
                oldServices
            );

            restoreStorageValue(
                "garageTax",
                oldTax
            );

        }

        catch (rollbackError) {

            console.error(
                "Rollback localStorage gagal:",
                rollbackError
            );
        }


        // ====================================
        // PESAN ERROR
        // ====================================

        if (
            error.name ===
                "QuotaExceededError" ||

            error.name ===
                "NS_ERROR_DOM_QUOTA_REACHED"
        ) {

            alert(
                "Penyimpanan browser penuh.\n\n" +
                "Backup data terlebih dahulu lalu hapus data yang tidak diperlukan."
            );

        }

        else {

            alert(
                "Data gagal disimpan.\n\n" +
                "Perubahan dibatalkan."
            );

        }


        return false;
    }
}


// ========================================
// RESTORE NILAI LOCAL STORAGE
// ========================================

function restoreStorageValue(
    key,
    oldValue
) {

    // Key sebelumnya tidak ada
    if (oldValue === null) {

        localStorage.removeItem(key);

        return;
    }


    // Kembalikan nilai lama
    localStorage.setItem(
        key,
        oldValue
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

    <div class="history-actions">

        <button
    class="print-btn"
    onclick="printService(${item.id})"
>
    PRINT
</button>

        <button
            class="delete-btn"
            onclick="deleteService(${item.id})"
        >
            DELETE
        </button>

    </div>

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
// RESTORE DATA - SECURE
// ========================================

function restoreData(event) {

    const file = event.target.files[0];

    if (!file) return;


    // ====================================
    // CEK TIPE FILE
    // ====================================

    if (
        file.type &&
        file.type !== "application/json"
    ) {

        alert("File harus berformat JSON.");

        event.target.value = "";

        return;
    }


    // ====================================
    // BATASI UKURAN FILE - MAX 2 MB
    // ====================================

    const maxSize =
        2 * 1024 * 1024;


    if (file.size > maxSize) {

        alert("File backup terlalu besar. Maksimal 2 MB.");

        event.target.value = "";

        return;
    }


    // ====================================
    // BACA FILE
    // ====================================

    const reader =
        new FileReader();


    reader.onload = function (e) {

        try {

            const backup =
                JSON.parse(e.target.result);


            // ====================================
            // VALIDASI STRUKTUR UTAMA
            // ====================================

            if (
                !backup ||
                typeof backup !== "object" ||
                Array.isArray(backup)
            ) {

                throw new Error(
                    "Struktur backup tidak valid."
                );
            }


// ====================================
// VALIDASI VEHICLE
// ====================================

if (!isValidVehicle(backup.vehicle)) {

    throw new Error(
        "Data kendaraan rusak atau tidak valid."
    );
}


// ====================================
// VALIDASI SERVICES
// ====================================

if (!isValidServices(backup.services)) {

    throw new Error(
        "Riwayat servis rusak atau tidak valid."
    );
}


// ====================================
// VALIDASI TAX
// ====================================

if (!isValidTax(backup.tax)) {

    throw new Error(
        "Data pajak rusak atau tidak valid."
    );
}




            // ====================================
            // KONFIRMASI RESTORE
            // ====================================

            const confirmRestore =
                confirm(
                    "Restore data ini?\n\n" +
                    "Data Ingfo Bengkel saat ini akan diganti."
                );


            if (!confirmRestore) {

                event.target.value = "";

                return;
            }


            // ====================================
            // RESTORE
            // ====================================

// ====================================
// BACKUP DATA LAMA
// ====================================

const oldVehicle =
    vehicle;

const oldServices =
    services;

const oldTax =
    tax;


// ====================================
// PASANG DATA RESTORE
// ====================================

vehicle =
    backup.vehicle;

services =
    backup.services;

tax =
    backup.tax;


// ====================================
// SIMPAN
// ====================================

if (!saveData()) {

    // Rollback vehicle
    vehicle =
        oldVehicle;

    // Rollback services
    services =
        oldServices;

    // Rollback tax
    tax =
        oldTax;

    return;
}


// ====================================
// BERHASIL
// ====================================

render();


       

        }

        catch (error) {

            console.error(
                "Restore error:",
                error
            );


            alert(
                "File backup tidak valid.\n\n" +
                error.message
            );

        }


        // Reset input
        event.target.value = "";

    };


    // ====================================
    // ERROR SAAT MEMBACA FILE
    // ====================================

    reader.onerror = function () {

        alert(
            "File gagal dibaca."
        );

        event.target.value = "";

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

async function saveServiceImage() {

    const receipt =
        document.getElementById("serviceReceipt");

    if (!receipt) {
        alert("Receipt tidak ditemukan.");
        return;
    }

    try {

        const canvas = await html2canvas(receipt, {
            scale: 3,
            backgroundColor: "#ffffff",
            useCORS: true
        });

        const link =
            document.createElement("a");

        const date =
            currentPrintService
                ? currentPrintService.date
                : getToday();

        link.download =
            `ingfo-bengkel-${date}.png`;

        link.href =
            canvas.toDataURL("image/png");

        link.click();

    }

    catch (error) {

        console.error(error);

        alert("Gagal menyimpan gambar.");

    }
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
