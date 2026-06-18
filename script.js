/* =============================
PLACEHOLDER
=============================*/
const placeholder = {
gauss: `2 4 -2 2
4 9 -3 8
-2 -3 7 10`,

gaussSeidel: `4 -1 1 7
4 -8 1 -21
-2 1 5 15
toleransi: 0.3
---
iterasi: 50(Opsional)
awal: 1, 2, 2`,

bisection:`Contoh: x^3-4*x-9
a: 2
b: 3
ketelitian: 3`,

secant:`Contoh:
fungsi: x^3-4*x-9
x0: 2
x1: 3
iterasi: 10`,

newton:`Contoh:
x: 1 2 3
y: 2 3 5`,

trapesium:`Contoh:
fungsi: x^2
a: 0
b: 4
n: 4`,

runge:`Contoh:
fungsi: x+y
x0: 0
y0: 1
h: 0.1
iterasi: 5`
}


/* =============================
UBAH PLACEHOLDER
=============================*/
function ubahPlaceholder(){
    const metode = document.getElementById("metode").value

    // sembunyikan semua blok, tampilkan hanya yang sesuai
    document.querySelectorAll('.method-block').forEach(b => b.style.display = 'none')
    const block = document.getElementById('block-' + metode)
    if(block) block.style.display = 'block'

    const helpMap = {
        bisection: 'Isi fungsi, interval a dan b, serta jumlah digit ketelitian.',
        secant: 'Isi fungsi, titik awal x0 & x1, serta iterasi.',
        newton: 'Masukkan daftar x dan y berpasangan, pisah dengan spasi.',
        trapesium: 'Isi fungsi, batas a dan b, dan jumlah subinterval n.',
        runge: 'Isi f(x,y), x0, y0, langkah h, dan jumlah iterasi.'
    }

    const helper = document.getElementById("helper")

    if (metode === "gauss" || metode === "gaussSeidel") {
        helper.innerText = ""
    } else {
        helper.innerText = helpMap[metode] || "Gunakan format seperti contoh di atas"
    }
}
ubahPlaceholder()

/* =============================
MATRIX GRID UI: create, fill example, transfer
=============================*/
function populateSizeSelectors(){
    const gaussSel = document.getElementById('gauss-size')
    const gsSel = document.getElementById('gs-size')

    if(!gaussSel || !gsSel) return

    // 🔥 PENTING: reset dulu biar tidak double
    gaussSel.innerHTML = ''
    gsSel.innerHTML = ''

    for(let i=2;i<=10;i++){
        let opt1 = document.createElement('option')
        opt1.value = i
        opt1.text = `${i} Variabel`
        gaussSel.appendChild(opt1)

        let opt2 = document.createElement('option')
        opt2.value = i
        opt2.text = `${i} Variabel`
        gsSel.appendChild(opt2)
    }

    gaussSel.value = 3
    gsSel.value = 3
}

let matrixCreated = false;

function createMatrixGrid(method){
    matrixCreated = true;
    const isGauss = method === 'gauss'
    const size = parseInt(document.getElementById(isGauss? 'gauss-size' : 'gs-size').value)
    const container = document.getElementById(isGauss? 'gauss-grid-container' : 'gs-grid-container')
    container.innerHTML = ''

    const table = document.createElement('table')
    table.className = 'matrix-grid'
    const caption = document.createElement('caption')
caption.innerText = `Sistem Persamaan Linear (${size} Variabel)`
    table.appendChild(caption)
    const info = document.createElement('div')

info.className = 'matrix-info'

info.innerHTML = `
Jumlah Variabel : <b>${size}</b><br>
Ukuran Matriks Augmented : <b>${size} × ${size}</b>
`

container.appendChild(info)

    for(let i=0;i<size;i++){
        const tr = document.createElement('tr')
        for(let j=0;j<=size;j++){
            const td = document.createElement('td')
            const inp = document.createElement('input')
            inp.type = 'text'
            inp.className = `${method}-cell`
            inp.dataset.row = i
            inp.dataset.col = j
            inp.placeholder = (j===size)? 'b' : `a${i+1}${j+1}`
            td.appendChild(inp)
            tr.appendChild(td)
            if(j===size-1){
                const sep = document.createElement('td')
                sep.innerText = '|'
                sep.className = 'sep'
                tr.appendChild(sep)
            }
        }
        table.appendChild(tr)
    }

    container.appendChild(table)
}

function clearAllInputs(){
matrixCreated = false;
    document.querySelectorAll("input").forEach(el=>{
        if(el.type !== "button" &&
           el.type !== "submit"){
            el.value = "";
        }
    });

    document.querySelectorAll("textarea")
        .forEach(el=>el.value="");

    // reset dropdown metode
    document.getElementById("metode").value = "gauss";

    // reset ukuran matriks
    document.getElementById("gauss-size").value = "3";
    document.getElementById("gs-size").value = "3";

    // HAPUS GRID MATRKS
    document.getElementById("gauss-grid-container").innerHTML = "";
    document.getElementById("gs-grid-container").innerHTML = "";

    // reset helper
    ubahPlaceholder();

    // reset output
    document.getElementById("output").innerHTML =
        "Hasil akan muncul disini...";

    // reset loading
    document.getElementById("loading").style.display = "none";

    // hapus history
    document.getElementById("history-list").innerHTML = `
        <div id="history-empty" class="history-empty">
            <i class="ti ti-history-off"></i>
            <p>Riwayat perhitungan belum tersedia</p>
            <small>Lakukan perhitungan terlebih dahulu</small>
        </div>
    `;

    cekHistoryKosong();
}

function copyResult(){

    const text = document.getElementById("output").innerText;

    if(!text || text.includes("Hasil akan muncul")){
        alert("Tidak ada hasil untuk di-copy");
        return;
    }

    const now = new Date();

    const tanggal = now.toLocaleDateString("id-ID");
    const waktu = now.toLocaleTimeString("id-ID");

    const footer = `
──────────────────────────
KALKULATOR METODE NUMERIK
           Kelompok 1 R4U
© ${now.getFullYear()} All Rights Reserved
Generated on ${tanggal} • ${waktu} WIB
──────────────────────────
`;

    const finalText = text + footer;

    navigator.clipboard.writeText(finalText)
        .then(() => alert("Hasil berhasil di-copy (format profesional)"))
        .catch(() => alert("Gagal copy"));
}
function exportPDF(){

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const hasil =
        document.getElementById("output").innerText;

    if(!hasil || hasil.includes("Hasil akan muncul")){
        alert("Tidak ada hasil untuk diexport");
        return;
    }

    // =========================
    // IDENTITAS LAPORAN
    // =========================
    const metode =
        document.getElementById("metode")
        .options[
            document.getElementById("metode").selectedIndex
        ].text;

    const now = new Date();

    const tanggal =
        now.toLocaleDateString("id-ID");

    const waktu =
        now.toLocaleTimeString("id-ID");

    // =========================
    // SETUP HALAMAN
    // =========================
    const pageWidth =
        doc.internal.pageSize.getWidth();

    const pageHeight =
        doc.internal.pageSize.getHeight();

    let y = 20;

    // =========================
    // HEADER
    // =========================
    doc.setFont("helvetica","bold");
    doc.setFontSize(18);

    doc.text(
        "KALKULATOR METODE NUMERIK",
        pageWidth/2,
        y,
        {align:"center"}
    );

    y += 8;

    doc.setFontSize(15);

    doc.text(
        "Kelompok 1 R4U",
        pageWidth/2,
        y,
        {align:"center"}
    );

    y += 12;

    doc.line(20,y,pageWidth-20,y);

    y += 10;

    // =========================
    // INFORMASI
    // =========================
    doc.setFont("helvetica","normal");
    doc.setFontSize(11);

    doc.text(`Metode : ${metode}`,20,y);
    y += 7;

    doc.text(`Tanggal : ${tanggal}`,20,y);
    y += 7;

    doc.text(`Waktu : ${waktu}`,20,y);
    y += 12;

    // =========================
    // HASIL
    // =========================
    doc.setFont("helvetica","bold");
    doc.text("HASIL PERHITUNGAN",20,y);

    y += 7;

    doc.line(20,y,pageWidth-20,y);

    y += 10;

    doc.setFont("courier","normal");
    doc.setFontSize(10);

    const lines =
        doc.splitTextToSize(
            hasil,
            pageWidth - 40
        );

    lines.forEach(line=>{

        if(y > pageHeight - 20){

            addFooter(doc);

            doc.addPage();

            y = 20;
        }

        doc.text(line,20,y);

        y += 6;
    });

    // =========================
    // FOOTER HALAMAN TERAKHIR
    // =========================
    addFooter(doc);

    doc.save(
        `hasil-${metode
            .toLowerCase()
            .replace(/\s+/g,'-')}.pdf`
    );
}

/* =========================
FOOTER PDF
========================= */
function addFooter(doc){

    const pageWidth =
        doc.internal.pageSize.getWidth();

    const pageHeight =
        doc.internal.pageSize.getHeight();

    const pageNumber =
        doc.internal.getNumberOfPages();

    doc.setFontSize(9);

    doc.setFont("helvetica","italic");

    doc.text(
        "Generated by Kalkulator Numerik Kelompok 1 R4U",
        pageWidth/2,
        pageHeight-10,
        {align:"center"}
    );

    doc.text(
        `Halaman ${pageNumber}`,
        pageWidth-20,
        pageHeight-10,
        {align:"right"}
    );
}

function addHistory(text, metode){

    const container = document.getElementById("history-list");
    const emptyState = document.getElementById("history-empty");

    if(emptyState){
        emptyState.style.display = "none";
    }

    const item = document.createElement("div");
    item.className = "history-item";

    const info = document.createElement("div");
    info.className = "history-info";

    const methodEl = document.createElement("div");
    methodEl.className = "history-method";

    const methodNameMap = {
        gauss:"Eliminasi Gauss",
        gaussSeidel:"Gauss-Seidel",
        bisection:"Metode Bagi Dua",
        secant:"Metode Secant",
        newton:"Interpolasi Newton",
        trapesium:"Integrasi Trapesium",
        runge:"Runge Kutta Orde 4"
    };

    methodEl.textContent =
        methodNameMap[metode] || metode;

    const dateEl = document.createElement("div");
    dateEl.className = "history-date";

    const now = new Date();

    dateEl.textContent =
        now.toLocaleDateString("id-ID") +
        " • " +
        now.toLocaleTimeString("id-ID");

    const previewEl = document.createElement("div");
    previewEl.className = "history-preview";

    previewEl.textContent =
        text.split("\n")[0].substring(0,60);

    info.appendChild(methodEl);
    info.appendChild(dateEl);
    info.appendChild(previewEl);

    info.onclick = () => {
        document.getElementById("output").innerText = text;
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "history-delete";
    deleteBtn.innerHTML =
        '<i class="ti ti-trash"></i>';

    deleteBtn.onclick = (e)=>{
        e.stopPropagation();
        item.remove();
        cekHistoryKosong();
    };

    item.appendChild(info);
    item.appendChild(deleteBtn);

    container.prepend(item);

    while(
        container.querySelectorAll(".history-item").length > 10
    ){
        container.lastElementChild.remove();
    }
}

function cekHistoryKosong(){

    const historyItems =
        document.querySelectorAll(".history-item");

    const emptyState =
        document.getElementById("history-empty");

    if(historyItems.length === 0){
        emptyState.style.display = "block";
    }else{
        emptyState.style.display = "none";
    }
}

function toggleHistory() {
  const historyBox = document.getElementById("history-list");
  if (historyBox.style.display === "none" || historyBox.style.display === "") {
    historyBox.style.display = "block";
  } else {
    historyBox.style.display = "none";
  }
}

function buildMatrixDataFromGrid(method){
    const cells = Array.from(document.querySelectorAll(`.${method}-cell`));

    if(cells.length === 0){
        throw new Error("Matriks belum dibuat.");
    }

    const rows = Math.max(...cells.map(c => parseInt(c.dataset.row))) + 1;
    const cols = Math.max(...cells.map(c => parseInt(c.dataset.col))) + 1;

    let lines = [];

    for(let i = 0; i < rows; i++){
        let vals = [];

        for(let j = 0; j < cols; j++){
            const el = cells.find(
                c =>
                parseInt(c.dataset.row) === i &&
                parseInt(c.dataset.col) === j
            );

            if(!el || !el.value.trim()){
                throw new Error(
                    `Elemen matriks baris ${i+1}, kolom ${j+1} masih kosong nich`
                );
            }

            vals.push(el.value.trim());
        }

        lines.push(vals.join(' '));
    }

    return lines.join('\n');
}

function fillExample(type, exampleText, sizeId, cellClass) {
    const rows = exampleText.trim().split('\n');

    // Paksa ukuran matriks 3x3
    document.getElementById(sizeId).value = 3;

    // Generate grid
    createMatrixGrid(type);

    // Ambil semua cell
    const cells = document.querySelectorAll(`.${cellClass}`);

    rows.forEach((row, r) => {
        const values = row.trim().split(/\s+/);

        values.forEach((value, c) => {
            const cell = [...cells].find(
                el =>
                    Number(el.dataset.row) === r &&
                    Number(el.dataset.col) === c
            );

            if (cell) cell.value = value;
        });
    });
}

function fillGaussExample() {
    fillExample(
        'gauss',
        placeholder.gauss,
        'gauss-size',
        'gauss-cell'
    );
}

function fillGaussSeidelExample() {
    // Ambil teks mentah dari placeholder
    const rawText = placeholder.gaussSeidel;
    
    // Pecah menjadi baris-baris teks, lalu saring yang kosong
    const allLines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    const matrixLines = [];
    
    // Pindai setiap baris satu per satu
    allLines.forEach(line => {
        const lowerLine = line.toLowerCase();
        
        if (lowerLine.includes('toleransi:')) {
            const elTol = document.getElementById('gs-tol');
            if (elTol) elTol.value = line.split(':')[1].trim();
        } 
        else if (lowerLine.includes('iterasi:')) {
            const elIter = document.getElementById('gs-iter');
            let iterVal = line.split(':')[1].trim();
            // Bersihkan teks dari huruf seperti "(Opsional)" agar tersisa angkanya saja
            iterVal = iterVal.replace(/[^0-9]/g, ''); 
            if (elIter) elIter.value = iterVal;
        } 
        else if (lowerLine.includes('awal:')) {
            const initialVals = line.split(':')[1].split(',').map(v => v.trim());
            initialVals.forEach((v, i) => {
                const elX = document.getElementById(`gs-x${i+1}`);
                if (elX) elX.value = v;
            });
        } 
        else if (!line.includes('---')) {
            // Sisa baris yang bukan pengaturan otomatis dianggap sebagai data matriks
            matrixLines.push(line);
        }
    });

    // Gabungkan kembali teks matriksnya
    const matrixText = matrixLines.join('\n');

    // Tembakkan matriks yang sudah bersih ke dalam grid UI
    fillExample(
        'gaussSeidel',
        matrixText,
        'gs-size',
        'gaussSeidel-cell'
    );
}


function closeGuide(){
    document.getElementById("tutorialGuide").style.display = "none";
}

// Initialize selectors on DOM ready
document.addEventListener('DOMContentLoaded', function(){
    populateSizeSelectors()
})

/* =============================
UTILITAS UI
=============================*/
function tampilError(pesan){
document.getElementById("output").innerHTML = "❌ ERROR:\n" + pesan
}

function tampilLoading(status){
document.getElementById("loading").style.display =
status ? "block" : "none"
}

/* =============================
FUNGSI HITUNG (UTAMA)
=============================*/
function hitung(){
const metode = document.getElementById("metode").value
let data = ''

// build data string sesuai format yang sudah dipakai fungsi-fungsi
try{
    switch(metode){
case 'gauss':

if(document.querySelectorAll('.gauss-cell').length === 0){
    throw 'Silakan buat variabel matriks terlebih dahulu';
}

data = buildMatrixDataFromGrid('gauss');

if(!data){
    throw 'Silakan isi matriks terlebih dahulu';
}

break

case 'gaussSeidel': {
    if(document.querySelectorAll('.gaussSeidel-cell').length === 0){
        throw 'Silakan buat variabel matriks terlebih dahulu';
    }
    
    let matrixData = buildMatrixDataFromGrid('gaussSeidel');
    if(!matrixData){
        throw 'Silakan isi seluruh elemen matriks terlebih dahulu';
    }
    
    // Ambil nilai Toleransi dan Iterasi dari UI
    const tol = document.getElementById('gs-tol').value.trim();
    const iter = document.getElementById('gs-iter').value.trim();
    
    // Ambil ukuran matriks saat ini untuk mengumpulkan Solusi Awal secara dinamis
    const size = parseInt(document.getElementById('gs-size').value);
    let initialSolutions = [];
    
    for(let i = 1; i <= size; i++){
        let xVal = document.getElementById(`gs-x${i}`) ? document.getElementById(`gs-x${i}`).value.trim() : "";
        // Jika kosong, default ke 0
        initialSolutions.push(xVal === "" ? "0" : xVal); 
    }
    
    // Format data: Matriks \n --- \n tol \n iter \n x1,x2,x3...
    data = `${matrixData}\n---\ntoleransi: ${tol}\niterasi: ${iter}\nawal: ${initialSolutions.join(',')}`;
    break;
}

case 'bisection': {
            const f = document.getElementById('bisection-f').value.trim();
            const a = document.getElementById('bisection-a').value.trim();
            const b = document.getElementById('bisection-b').value.trim();
            const digits = document.getElementById('bisection-digits').value.trim(); // Modifikasi input digit desimal
            const tol = document.getElementById('bisection-tol').value.trim(); 
            
            if(!f || !a || !b) throw new Error('Lengkapi fungsi dan interval (a,b) untuk Bisection');
            
            // Susun data string untuk diparsing dengan key ketelitian
            data = `fungsi: ${f}\na: ${a}\nb: ${b}\nketelitian: ${digits}\ntoleransi: ${tol}`;
            break;
        }

        case 'secant':{
            const f = document.getElementById('secant-f').value.trim()
            const x0 = document.getElementById('secant-x0').value.trim()
            const x1 = document.getElementById('secant-x1').value.trim()
            const it = document.getElementById('secant-iter').value
            if(!f||!x0||!x1) throw 'Lengkapi fungsi dan x0/x1 untuk Secant'
            data = `fungsi: ${f}\nx0: ${x0}\nx1: ${x1}\niterasi: ${it}`
            break
        }

        case 'newton':{
            const xs = document.getElementById('newton-x').value.trim()
            const ys = document.getElementById('newton-y').value.trim()
            if(!xs||!ys) throw 'Masukkan daftar x dan y untuk Interpolasi Newton'
            data = `x: ${xs}\ny: ${ys}`
            break
        }

        case 'trapesium':{
            const f = document.getElementById('trapesium-f').value.trim()
            const a = document.getElementById('trapesium-a').value.trim()
            const b = document.getElementById('trapesium-b').value.trim()
            const n = document.getElementById('trapesium-n').value
            if(!f||!a||!b) throw 'Lengkapi fungsi dan batas a/b untuk Trapesium'
            data = `fungsi: ${f}\na: ${a}\nb: ${b}\nn: ${n}`
            break
        }

        case 'runge':{
            const f = document.getElementById('runge-f').value.trim()
            const x0 = document.getElementById('runge-x0').value.trim()
            const y0 = document.getElementById('runge-y0').value.trim()
            const h = document.getElementById('runge-h').value.trim()
            const it = document.getElementById('runge-iter').value
            if(!f||!x0||!y0||!h) throw 'Lengkapi f, x0, y0, dan h untuk Runge Kutta'
            data = `fungsi: ${f}\nx0: ${x0}\ny0: ${y0}\nh: ${h}\niterasi: ${it}`
            break
        }

        default:
            throw 'Metode belum tersedia'
    }
}catch(err){
    tampilError(err)
    return
}

// tampilkan teks menghitung
tampilLoading(true)
document.getElementById("output").innerHTML = ""

setTimeout(()=>{
    const container = document.getElementById("history-list");
    try{
        switch(metode){
case "gauss":
    let raw = parseMatrix(data);
    let result = gaussSolve(raw);

    const hasil = result.html;

    const outputEl = document.getElementById("output");
    outputEl.innerHTML = hasil;
    break;

case "bisection": {
            const parsedData = parseBisectionPro(data);
            const hasilBisection = metodeBisectionPro(parsedData);
            
            let outputBisection ="═══════════════════════════════\n";
            outputBisection +=  "        METODE BISECTION\n";
            outputBisection +=  "═══════════════════════════════\n";
            outputBisection += hasilBisection.log;
            
            document.getElementById("output").innerHTML = "<pre>" + outputBisection + "</pre>";
            break;
        }

        case "secant":
            metodeSecant(data)
            break

        case "trapesium":
            metodeTrapesium(data)
            break

        case "runge":
            rungeKutta(data)
            break

        case "gaussSeidel":
            metodeGaussSeidel(data)
            break

        case "newton":
            interpolasiNewton(data)
            break
    }

    const hasilText =
        document.getElementById("output").innerText;

    if(
        hasilText &&
        !hasilText.includes("ERROR")
    ){
        addHistory(hasilText, metode);
    }

}catch(err){
    tampilError(err.message || err)
    return
}

    // sembunyikan loading setelah hasil keluar
    tampilLoading(false)

},600)
}

function parseMatrix(input){
    let rows = input.split("\n").map(r => r.trim()).filter(r => r.length)

    let matrix = rows.map(r=>{
        let vals = r.split(/\s+/).map(v=>{
let num;

try {
    num = math.evaluate(v);
} catch (e) {
    throw "Input bukan angka valid: " + v;
}

if (!isFinite(num)) {
    throw "Nilai tidak valid: " + v;
}
            return num
        })
        return vals
    })

    let cols = matrix[0].length

    if(!matrix.every(r => r.length === cols)){
        throw "Jumlah kolom tiap baris harus sama"
    }

    if(cols !== matrix.length + 1){
        throw "Harus matriks augmented (n x n+1)"
    }

    if(matrix.length > 10){
        throw "Maksimal ukuran matriks adalah 10x10"
    }

    return matrix
}

function formatNumber(v){
    // hilangkan noise kecil (floating error)
    if(Math.abs(v) < 1e-10) return "0"

    // kalau bilangan bulat → tampilkan tanpa desimal
    if(Number.isInteger(v)) return v.toString()

    // kalau desimal → batasi tapi tidak dipaksa
    return parseFloat(v.toFixed(6)).toString()
}

function formatMatrix(mat){

    let html = `<table class="matrix-output">`

    mat.forEach(row=>{
        html += `<tr>`

        row.forEach((val,i)=>{
            if(i === row.length - 1){
                html += `<td class="b">${formatNumber(val)}</td>`
            }else{
                html += `<td>${formatNumber(val)}</td>`
            }
        })

        html += `</tr>`
    })

    html += `</table>`

    return html
}

function safeEval(expr, scope = {}) {
    if (!expr || expr.trim() === "") {
        throw "Komponen input tidak boleh kosong";
    }
    try {
        let result = math.evaluate(expr, scope);
        
        // Proteksi jika math.js mengembalikan tipe data objek, array, atau fungsi
        if (typeof result !== 'number' || !isFinite(result)) {
            throw "Input harus menghasilkan angka real tunggal (bukan matriks, vektor, atau angka imajiner)";
        }
        
        return result;
    } catch (e) {
        // Jika error berasal dari pesan kustom di atas, teruskan pesan tersebut
        if (typeof e === 'string') throw e;
        throw "Format perhitungan tidak valid: " + expr;
    }
}

// =============================
// METODE ELIMINASI GAUSS (FINAL PRODUCTION READY 100%)
// =============================
function gaussSolve(matrixInput) {
    let M = matrixInput.map(r => [...r]);
    let n = M.length;
    let output = "";

    // Helper untuk memformat angka agar rapi dan menghilangkan noise desimal
    const fmt = (num) => {
        if (Math.abs(num) < 1e-10) return "0";
        if (Number.isInteger(num)) return num.toString();
        return parseFloat(num.toFixed(4)).toString();
    };

    // Helper untuk mencetak matriks dalam bentuk ASCII art
    const printMatrix = (mat) => {
        let res = "";
        for (let i = 0; i < n; i++) {
            let rowA = mat[i].slice(0, n).map(v => fmt(v).padStart(4)).join("  ");
            let bVal = fmt(mat[i][n]).padStart(4);
            res += `[ ${rowA} | ${bVal} ]\n`;
        }
        return res;
    };

    output += "Penyelesaian:\n";

    // =============================
    // 1. Merubah SPL ke bentuk AX = B
    // =============================
    output += "1. Merubah SPL ke bentuk AX = B\n";
    for (let i = 0; i < n; i++) {
        let rowA = M[i].slice(0, n).map(v => fmt(v).padStart(4)).join("  ");
        let bVal = fmt(M[i][n]).padStart(4);
        // Tanda sama dengan hanya muncul di baris tengah
        let equals = i === Math.floor((n-1)/2) ? "=" : " ";
        output += `[ ${rowA} ] [ x${i+1} ] ${equals} [ ${bVal} ]\n`;
    }
    output += "\n";

    // =============================
    // 2. Membuat augmented matriks
    // =============================
    output += "2. Membuat augmented matriks\n";
    output += printMatrix(M) + "\n";

    // =============================
    // 3. Melakukan Operasi Baris Elementer (OBE)
    // =============================
    output += "3. Melakukan OBE\n";
    
    let pivotRow = 0; // Deklarasi baris pivot terpisah
    
    for (let col = 0; col < n; col++) { // Loop berdasarkan kolom, bukan baris
        
        // PENGAMAN 1: PARTIAL PIVOTING
        let maxRow = pivotRow;
        for (let i = pivotRow + 1; i < n; i++) {
            if (Math.abs(M[i][col]) > Math.abs(M[maxRow][col])) {
                maxRow = i;
            }
        }

        // Jika satu kolom di bawah pivot bernilai 0 semua, pindah ke kolom berikutnya 
        // tapi TETAP di baris pivot yang sama
        if (Math.abs(M[maxRow][col]) < 1e-10) continue;

        // Tukar baris jika nilai terbesar bukan di baris saat ini
        if (maxRow !== pivotRow) {
            [M[pivotRow], M[maxRow]] = [M[maxRow], M[pivotRow]];
            output += `Tukar Baris ${pivotRow+1} dengan Baris ${maxRow+1} (Partial Pivoting):\n`;
            output += printMatrix(M) + "\n";
        }

        let matrixChanged = false;
        let stepOutput = "";

        for (let i = pivotRow + 1; i < n; i++) {
            if (Math.abs(M[pivotRow][col]) < 1e-10) continue; 

            let factor = M[i][col] / M[pivotRow][col];
            
            if (Math.abs(factor) > 1e-10) {
                let sign = factor > 0 ? "-" : "+";
                let absFactor = Math.abs(factor);
                let multStr = absFactor === 1 ? `B${pivotRow+1}` : `${fmt(absFactor)}B${pivotRow+1}`;
                stepOutput += `B${i+1} ${sign} ${multStr} -> B${i+1}'\n`;

                for (let j = col; j <= n; j++) {
                    M[i][j] -= factor * M[pivotRow][j];
                    if (Math.abs(M[i][j]) < 1e-10) M[i][j] = 0; 
                }
                matrixChanged = true;
            }
        }
        
        if (matrixChanged) {
            output += stepOutput;
            output += printMatrix(M) + "\n";
        }
        
        pivotRow++; // Hanya naikkan baris jika eliminasi berhasil dilakukan
        if (pivotRow >= n) break; // Cegah out of bounds
    }
    // =============================
    // PENGAMAN 2: DETEKSI SOLUSI SINGULAR (Tidak ada solusi / Solusi tak hingga)
    // =============================
    let rankA = 0;
    let rankAug = 0;

    for (let i = 0; i < n; i++) {
        let isRowAZero = true;
        for (let j = 0; j < n; j++) {
            if (Math.abs(M[i][j]) > 1e-10) isRowAZero = false;
        }
        if (!isRowAZero) rankA++;

        let isRowAugZero = isRowAZero && (Math.abs(M[i][n]) <= 1e-10);
        if (!isRowAugZero && !isRowAZero) {
            rankAug++;
        } else if (isRowAZero && Math.abs(M[i][n]) > 1e-10) {
            rankAug++; // Kasus baris 0 = Konstanta
        }
    }

if (rankA < rankAug) {
        output += "❌ MATRIKS SINGULAR TERDETEKSI\nSistem persamaan ini INKONSISTEN (Tidak Memiliki Solusi) karena setelah dieksekusi OBE, terdapat persamaan tidak masuk akal (misal: 0 = konstanta tak nol).\n";
return { html: "<pre style='white-space: pre-wrap; word-wrap: break-word;'>" + output + "</pre>", type: "no-solution" };    
} else if (rankA < n) {
        output += "♾️ MATRIKS SINGULAR TERDETEKSI\nSistem persamaan ini KONSISTEN NAMUN MEMILIKI BANYAK SOLUSI (Infinite Solutions) karena jumlah persamaan linear yang bebas lebih sedikit dari jumlah variabelnya.\n";
return { html: "<pre style='white-space: pre-wrap; word-wrap: break-word;'>" + output + "</pre>", type: "infinite" };    
}
    
    // =============================
    // 4. Merubah AX = B -> A'X = B'
    // =============================
    output += "4. Merubah AX = B -> A'X = B'\n";
    for (let i = 0; i < n; i++) {
        let rowA = M[i].slice(0, n).map(v => fmt(v).padStart(4)).join("  ");
        let bVal = fmt(M[i][n]).padStart(4);
        let equals = i === Math.floor((n-1)/2) ? "=" : " ";
        output += `[ ${rowA} ] [ x${i+1} ] ${equals} [ ${bVal} ]\n`;
    }
    output += "\n";

    // =============================
    // 5. Selesaikan SPL (Back Substitution)
    // =============================
    output += "5. Selesaikan SPL\n";
    let x = new Array(n).fill(0);
    
    for (let i = n - 1; i >= 0; i--) {
        let num = M[i][n];
        let subStr = `${fmt(M[i][i])}x${i+1}`;
        let hasKnowns = false;
        let sumKnowns = 0;

        for (let j = i + 1; j < n; j++) {
            let coef = M[i][j];
            if (Math.abs(coef) > 1e-10) {
                let sign = coef > 0 ? "+" : "-";
                let absCoef = Math.abs(coef);
                let formatCoef = absCoef === 1 ? "" : fmt(absCoef);
                let xValStr = x[j] < 0 ? `(${fmt(x[j])})` : `${fmt(x[j])}`;
                
                // Menyusun string yang langsung berisi angka substitusi
                if (absCoef === 1) {
                    subStr += ` ${sign} ${xValStr}`;
                } else {
                    subStr += ` ${sign} ${formatCoef}(${fmt(x[j])})`;
                }
                
                sumKnowns += coef * x[j];
                hasKnowns = true;
            }
        }
        
        subStr += ` = ${fmt(M[i][n])}`;
        
        output += `Mencari nilai x${i+1}:\n`;
        output += `${subStr}\n`;
        
        if (hasKnowns) {
            let totalSub = M[i][n] - sumKnowns;
            let moveStr = `${fmt(M[i][i])}x${i+1}`;
            // Mencegah output menjadi "2x1 = -4" jadi "2x1 = -4", pastikan tanda rapi
            let operStr = totalSub >= 0 ? `${fmt(totalSub)}` : `${fmt(totalSub)}`;
            output += `${moveStr} = ${operStr}\n`;
            num = totalSub;
        }

        x[i] = num / M[i][i];
        
        // Tampilkan proses pembagian agar step-by-stepnya jelas
        if (Math.abs(M[i][i] - 1) > 1e-10) {
            output += `x${i+1} = ${fmt(num)} / ${fmt(M[i][i])}\n`;
        }
        
        output += `x${i+1} = ${fmt(x[i])}\n\n`;
    }

    // =============================
    // 6. Kesimpulan Hasil Akhir
    // =============================
    output += "Jadi solusi SPL adalah\n";
    for (let i = 0; i < n; i++) {
        let label = `x${i+1}`;
        let prefix = i === Math.floor((n-1)/2) ? `[ ${label} ] = ` : `[ ${label} ]   `;
        output += `${prefix}[ ${fmt(x[i]).padStart(3)} ]\n`;
    }

return { html: "<pre style='white-space: pre-wrap; word-wrap: break-word;'>" + output + "</pre>", type: "unique", solution: x };
}

// =========================================================================
// METODE GAUSS-SEIDEL (PRODUCTION READY - REVISED DATA PARSING)
// =========================================================================    
function metodeGaussSeidel(data) {
    // 1. PARSING INPUT BARU DARI STRING DATA
    let parts = data.split("\n---\n");
    let matrixText = parts[0];
    let configText = parts.length > 1 ? parts[1] : "";

    let lines = matrixText.split("\n").map(r => r.trim()).filter(r => r.length);
    let A = lines.map(r => r.split(/\s+/).map(v => safeEval(v)));
    let n = A.length;

    for (let i = 0; i < n; i++) {
        if (A[i].length !== n + 1) {
            throw "Format matriks harus augmented (n x n+1)";
        }
    }

    // Default konfigurasi
    let epsilon = 0.0001; 
    let maxIter = 50;
    let x = new Array(n).fill(0);

    // Parse Konfigurasi (Toleransi, Iterasi, Solusi Awal)
    if (configText) {
        let configLines = configText.split("\n").map(v => v.trim()).filter(Boolean);
        configLines.forEach(line => {
            const idx = line.indexOf(":");
            if (idx === -1) return;
            const key = line.substring(0, idx).trim().toLowerCase();
            const value = line.substring(idx + 1).trim();

            if (key === "toleransi" && value) {
                let parsedTol = parseFloat(value);
                if (isNaN(parsedTol) || parsedTol <= 0) throw "ERROR: Nilai toleransi (ε) harus berupa angka positif.";
                epsilon = parsedTol;
            } else if (key === "iterasi" && value) {
                let parsedIter = parseInt(value, 10);
                if (isNaN(parsedIter) || parsedIter <= 0) throw "ERROR: Jumlah iterasi maksimum harus bilangan bulat positif.";
                maxIter = parsedIter;
            } else if (key === "awal" && value) {
                let vals = value.split(',').map(v => parseFloat(v));
                for(let i=0; i<Math.min(n, vals.length); i++){
                   if(!isNaN(vals[i])) x[i] = vals[i];
                }
            }
        });
    }

    let output = "Penyelesaian:";

    // Greedy pivoting untuk stabilitas diagonal utama
    for (let i = 0; i < n; i++) {
        let maxRow = i;
        let maxVal = Math.abs(A[i][i]);
        
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(A[k][i]) > maxVal) {
                maxVal = Math.abs(A[k][i]);
                maxRow = k;
            }
        }
        
        if (maxRow !== i) {
            [A[i], A[maxRow]] = [A[maxRow], A[i]];
            output += `💡 [Optimasi] Tukar Baris ${i+1} dengan Baris ${maxRow+1}\n`;
        }
    }

    // Validasi elemen diagonal tidak boleh nol
    for (let i = 0; i < n; i++) {
        if (Math.abs(A[i][i]) < 1e-12) {
            throw `ERROR: Elemen diagonal baris ke-${i+1} bernilai 0.`;
        }
    }

    // Pengecekan sifat dominan diagonal secara matematis
    let isDiagonallyDominant = true;
    let barisLemah = [];
    for (let i = 0; i < n; i++) {
        let diagVal = Math.abs(A[i][i]);
        let rowSum = A[i].slice(0, n).reduce((sum, val) => sum + Math.abs(val), 0) - diagVal;
        if (diagVal < rowSum) {
            isDiagonallyDominant = false;
            barisLemah.push(i + 1);
        }
    }

    if (!isDiagonallyDominant) {
        output += `⚠️ [Peringatan]: Matriks tidak dominan diagonal (Baris: ${barisLemah.join(", ")}). Angka berisiko divergen.\n`;
    }
    output += "\n";

    output += "Konfigurasi Parameter:\n";
    output += `Toleransi (ε) = ${epsilon}\n`;
    output += `Batas Iterasi = ${maxIter}\n`;
    output += `Tebakan Awal  = (${x.join(", ")})\n\n`;

    // Helper formatter angka presisi tinggi agar bersih dari noise desimal
    const fmt = (num, precision = 3) => {
        if (Math.abs(num) < 1e-10) return "0";
        if (Number.isInteger(num)) return num.toString();
        return parseFloat(num.toFixed(precision)).toString();
    };

    // 2. PEMBENTUKAN OUTPUT PERSAMAAN SPL
    output += "1. Membuat Sistem Persamaan Linear\n";
    for (let i = 0; i < n; i++) {
        let diag = A[i][i];
        let numB = A[i][n];
        let terms = [];

        for (let j = 0; j < n; j++) {
            if (i === j) continue;
            let val = -A[i][j];
            if (val !== 0) {
                let koef = Math.abs(val) === 1 ? "" : fmt(Math.abs(val));
                terms.push(val > 0 ? `+ ${koef}x${j+1}` : `- ${koef}x${j+1}`);
            }
        }
        
        let exprStr = `${fmt(numB)} ` + terms.join(" ");
        if (exprStr.trim().startsWith("+")) exprStr = exprStr.trim().substring(1).trim();
        
        let bagiStr = diag === 1 ? "" : ` / ${fmt(diag)}`;
        output += `    x${i+1} = (${exprStr.trim()})${bagiStr}\n`;
    }
    output += "\n";

    // 3. PROSES ITERASI DENGAN FORMAT SPASI LONGGAR
    output += "2. Perhitungan Iterasi\n";
    let converged = false;

    for (let it = 1; it <= maxIter; it++) {
        output += `- Iterasi ${it}\n`;
        
        let solusiAwalStr = Array.from({length: n}, (_, k) => `x${k+1}=${fmt(x[k], 3)}`).join(", ");
        output += `Solusi awal: (${solusiAwalStr})\n`;

        let xOld = [...x];
        let allErrorsBelowEpsilon = true; 

        for (let i = 0; i < n; i++) {
            let diag = A[i][i];
            let sum = A[i][n];
            let stepTerms = [];

            for (let j = 0; j < n; j++) {
                if (i === j) continue;
                sum -= A[i][j] * x[j];
                
                let coefVal = -A[i][j];
                if (coefVal !== 0) {
                    let absCoef = Math.abs(coefVal);
                    let xjStr = fmt(x[j], 3);
                    if (x[j] < 0) xjStr = `(${xjStr})`; // Beri tanda kurung pembungkus jika nilai negatif

                    // FIX AMBIGUITAS: Tampilkan operator silang (×) jika ada koefisien bebas
                    let termStr = absCoef === 1 ? xjStr : `${fmt(absCoef)}×${xjStr}`;
                    stepTerms.push(coefVal > 0 ? `+ ${termStr}` : `- ${termStr}`);
                }
            }

            let xi = sum / diag;
            
            // Proteksi angka meledak tak hingga (Divergence Guard)
            if (!isFinite(xi) || Math.abs(xi) > 1e12) {
                throw `Peringatan: Perhitungan divergen pada iterasi ke-${it}. Pastikan koefisien persamaan benar.`;
            }

            let err = 0;
            if (Math.abs(xi) > 1e-12) {
                err = Math.abs((xi - xOld[i]) / xi);
            } else if (Math.abs(xOld[i]) > 1e-12) {
                err = 1;
            }
            
            if (err >= epsilon) allErrorsBelowEpsilon = false;

            let conditionStr = err >= epsilon ? `> ${epsilon}` : `< ${epsilon}`;
            let exprStep = `${fmt(A[i][n])} ` + stepTerms.join(" ");
            if (exprStep.trim().startsWith("+")) exprStep = exprStep.trim().substring(1).trim();
            
            let bagiStr = diag === 1 ? "" : ` / ${fmt(diag)}`;

            output += `    x${i+1} = (${exprStep.trim()})${bagiStr}\n`;
            output += `       = ${fmt(xi, 3)}  →  Ex${i+1} = |(${fmt(xi, 3)} - ${fmt(xOld[i], 3)}) / ${fmt(xi, 3)}| = ${fmt(err, 3)} ${conditionStr}\n`;

            x[i] = xi; 
        }

        if (allErrorsBelowEpsilon) {
            output += `Karena semua Ex < ε, maka iterasi selesai\n\n`;
            converged = true;
            break;
        } else {
            output += `Karena ada Ex > ε, maka iterasi dilanjutkan (semua harus < ε)\n\n`;
        }
    }

    // 4. HASIL AKHIR SPL DENGAN FORMAT GANDA (NILAI KONVERGEN + PENDEKATAN)
    output += "Jadi solusi SPL yang diperoleh adalah:\n";

    const exactValues = x.map(v => fmt(v, 6));
    const maxWidth = Math.max(...exactValues.map(v => v.length));

    for (let i = 0; i < n; i++) {
        let label = `x${i+1}`;
        let centerSymbol = (i === Math.floor((n - 1) / 2)) ? "=" : " ";

        let exactVal = exactValues[i];
        let approxVal = fmt(x[i], 2);

    output += `[ ${label} ] ${centerSymbol} [ ${exactVal.padStart(maxWidth)} ]   ≈   ${approxVal}\n`;
    }
    if (!converged) {
        output += `\n(⚠️ Peringatan: Iterasi berhenti di batas maksimum tanpa konvergensi sempurna.)\n`;
    }

    const outputEl = document.getElementById("output");
    outputEl.textContent = output;
}


// =========================================
// HELPER EVALUASI MATEMATIKA
// =========================================
function evalFunction(expr, xValue){
    try {
        let hasil = math.evaluate(expr, {x: xValue});
        if (!isFinite(hasil)) throw new Error(`Hasil tidak terdefinisi pada x=${xValue}`);
        return hasil;
    } catch(e) {
        throw new Error(`Gagal menghitung fungsi '${expr}'. Pastikan format benar (contoh perkalian: 6*x).`);
    }
}

// =========================================
// PARSING & VALIDASI INPUT BISECTION PRO
// =========================================
function parseBisectionPro(data) {
    if (!data || typeof data !== 'string') {
        throw new Error("Data input kosong atau tidak berformat teks.");
    }

    const lines = data.split("\n").map(v => v.trim()).filter(Boolean);
    const obj = {};

    lines.forEach(line => {
        const idx = line.indexOf(":");
        if (idx === -1) return;
        const key = line.substring(0, idx).trim().toLowerCase();
        const value = line.substring(idx + 1).trim();
        obj[key] = value;
    });

    if (!obj.fungsi) throw new Error("Fungsi belum diisi.");
    if (obj.a === undefined) throw new Error("Nilai batas awal (a) belum diisi.");
    if (obj.b === undefined) throw new Error("Nilai batas akhir (b) belum diisi.");

    const parseNumber = (expr, fieldName) => {
        try {
            const safeExpr = expr.replace(/,/g, '.');
            const result = math.evaluate(safeExpr);
            if (typeof result !== 'number' || !isFinite(result)) throw new Error();
            return result;
        } catch (e) {
            throw new Error(`Input pada '${fieldName}' tidak valid: ${expr}.`);
        }
    };

    const a = parseNumber(obj.a, "a");
    const b = parseNumber(obj.b, "b");

    if (a === b) throw new Error("Nilai a dan b tidak boleh sama.");

    let toleransi = 0.0001; 
    if (obj.toleransi) {
        toleransi = parseNumber(obj.toleransi, "toleransi");
        if (toleransi <= 0) throw new Error("Toleransi harus lebih besar dari 0.");
    }

    let ketelitian = 3; // Default ketelitian pembulatan desimal jika kosong
    if (obj.ketelitian) {
        let parsedDigits = parseInt(obj.ketelitian, 10);
        if (!isNaN(parsedDigits) && parsedDigits >= 0) {
            ketelitian = parsedDigits;
        }
    }

    // Batasi maksimum iterasi internal di latar belakang demi keamanan loop sistem
    let maksIterasi = 100;

    return { fungsi: obj.fungsi.replace(/,/g, '.'), a, b, toleransi, maksIterasi, ketelitian };
}


// =========================================================================
// LOGIKA MATEMATIKA BISECTION: PRESISI PENUH INTERNAL, PEMBULATAN HANYA PADA UI
// =========================================================================
function metodeBisectionPro(data) {
    let { fungsi, a, b, toleransi, maksIterasi, ketelitian } = data;
    let outputLog = "";

    // Helper Formatter: Hanya mengubah representasi STRING untuk Tampilan UI
    const fmtStep = (num) => {
        if (Math.abs(num) < 1e-10) return "0";
        // Menggunakan toFixed untuk memaksa jumlah digit desimal tetap sesuai input UI
        return num.toFixed(ketelitian);
    };

    // Helper Formatter: Khusus logaritma dasar agar tetap informatif (6 desimal)
    const fmtLog = (num) => {
        if (Math.abs(num) < 1e-10) return "0";
        return parseFloat(num.toFixed(6)).toString();
    };

    // Variabel kalkulasi internal mempertahankan nilai presisi penuh mutlak
    let currentA = a;
    let currentB = b;
    let fa = evalFunction(fungsi, currentA);
    let fb = evalFunction(fungsi, currentB);

    if (Math.sign(fa) === Math.sign(fb)) {
        throw new Error(`Interval tidak valid: f(${fmtStep(currentA)})=${fmtStep(fa)} dan f(${fmtStep(currentB)})=${fmtStep(fb)} memiliki tanda yang sama (Tidak memenuhi Teorema Nilai Antara).`);
    }

    // --- BAGIAN 1: ITERASI MINIMUM ---
    outputLog += `1. Menentukan banyaknya iterasi:\n`;
    outputLog += `   R > [ ln|b - a| - ln(ε) ] / ln(2)\n`;
    
    let numR = (Math.log(Math.abs(currentB - currentA)) - Math.log(toleransi)) / Math.log(2);
    let R = Math.ceil(numR > 0 ? numR : 0);

    outputLog += `   R > [ ln|${fmtStep(currentB)} - ${fmtStep(currentA)}| - ln(${toleransi}) ] / ln(2)\n`;
    outputLog += `   R > ${fmtLog(numR)}  -->  R = ${R} (Banyaknya iterasi = ${R})\n\n`;
    outputLog += `2. Menentukan selang [a, b] = [${fmtStep(currentA)}, ${fmtStep(currentB)}]\n\n`;

    let tableRows = [];
    let detailLog = `4. Penjabaran Iterasi:\n`;
    
    let root = null;
    let iterasiTercapai = 0;
    let galat = 0; 

    // --- BAGIAN 2: PROSES ITERASI DENGAN PRESISI PENUH ---
    for (let i = 1; i <= maksIterasi; i++) {
        iterasiTercapai = i;
        
        // Perhitungan tanpa pembulatan beruntun di dalam memori
        let c = (currentA + currentB) / 2;
        let fc = evalFunction(fungsi, c);
        galat = Math.abs(currentB - c);

        let oldA = currentA;
        let oldB = currentB;
        let oldFa = fa;
        let oldFc = fc;
        let oldFb = fb;
        let selangBaruStr = "";

        detailLog += "──────────────────────────\n";
        detailLog += `ITERASI ${i}\n`;
        detailLog += "──────────────────────────\n";
        
        detailLog += `  c = (${fmtStep(oldA)} + ${fmtStep(oldB)}) / 2 = ${fmtStep(c)}\n`;
        detailLog += `  f(a) = ${fmtStep(oldFa)} | f(c) = ${fmtStep(oldFc)} | f(b) = ${fmtStep(oldFb)}\n`;

        if (Math.abs(fc) < 1e-12) {
            detailLog += `  f(c) = 0, akar eksak ditemukan mutlak.\n\n`;
            selangBaruStr = "Akar Eksak";
            galat = 0;
            root = c;
            tableRows.push({ i, a: oldA, c: oldB, b: oldB, fa: oldFa, fc: oldFc, fb: oldFb, selangBaru: selangBaruStr, lebar: galat });
            break;
        }

        let signFaFc = Math.sign(oldFa) !== Math.sign(oldFc) ? "-" : "+";
        let signFcFb = Math.sign(oldFc) !== Math.sign(oldFb) ? "-" : "+";

        let strFa = oldFa < 0 ? `(${fmtStep(oldFa)})` : fmtStep(oldFa);
        let strFc = oldFc < 0 ? `(${fmtStep(oldFc)})` : fmtStep(oldFc);
        let strFb = oldFb < 0 ? `(${fmtStep(oldFb)})` : fmtStep(oldFb);

        detailLog += `  f(a) . f(c) = ${strFa} . ${strFc} = [${signFaFc}] ... `;
        
        if (Math.sign(oldFa) !== Math.sign(oldFc)) {
            detailLog += `< 0  --> [a, c] --> b = c\n`;
            selangBaruStr = `[a, c] -> b=c`;
            currentB = c;
            fb = fc;
        } else {
            detailLog += `> 0\n`;
            detailLog += `  f(c) . f(b) = ${strFc} . ${strFb} = [${signFcFb}] ... < 0  --> [c, b] --> a = c\n`;
            selangBaruStr = `[c, b] -> a=c`;
            currentA = c;
            fa = fc;
        }

        let tandaGalat = galat > toleransi ? ">" : "<";
        let statusIterasi = galat > toleransi ? "Iterasi lanjut" : "Iterasi selesai";

        detailLog += `  Panjang selang = |b - c| = |${fmtStep(oldB)} - ${fmtStep(c)}| = ${fmtStep(galat)} ${tandaGalat} ${toleransi} (${statusIterasi})\n`;

        // Menyimpan objek asli presisi tinggi ke dalam penampung tabel
        tableRows.push({ i, a: oldA, c, b: oldB, fa: oldFa, fc: oldFc, fb: oldFb, selangBaru: selangBaruStr, lebar: galat });

        if (galat <= toleransi) {
            root = c;
            break;
        }
    }

    if (root === null) root = (currentA + currentB) / 2; 

    // --- BAGIAN 3: TABEL PENOLONG (ADAPTIF DESIMAL) ---
    let tableLog = `3. Buat tabel penolong\n`;
    let colWidth = Math.max(12, ketelitian + 5);
    
    tableLog += `i    | ${"a".padEnd(colWidth)} | ${"c".padEnd(colWidth)} | ${"b".padEnd(colWidth)} | ${"f(a)".padEnd(colWidth)} | ${"f(c)".padEnd(colWidth)} | ${"f(b)".padEnd(colWidth)} | Selang Baru     | Panjang Selang\n`;
    tableLog += "-".repeat(75 + (colWidth * 6)) + "\n";
    
    tableRows.forEach(r => {
        let op = r.lebar > toleransi ? ">" : "<";
        let lebarCol = `${fmtStep(r.lebar)} ${op} ${toleransi}`;
        tableLog += `${r.i.toString().padEnd(4)} | ${fmtStep(r.a).padEnd(colWidth)} | ${fmtStep(r.c).padEnd(colWidth)} | ${fmtStep(r.b).padEnd(colWidth)} | ${fmtStep(r.fa).padEnd(colWidth)} | ${fmtStep(r.fc).padEnd(colWidth)} | ${fmtStep(r.fb).padEnd(colWidth)} | ${r.selangBaru.padEnd(15)} | ${lebarCol}\n`;    
    });
    tableLog += `\n`;

    // --- BAGIAN 4: KESIMPULAN HASIL AKHIR DENGAN TWIN OUTPUT ---
    outputLog += tableLog + detailLog;
    outputLog += `══════════════════════════\n`;
    outputLog += `               HASIL AKHIR\n`;
    outputLog += `══════════════════════════\n`;
    outputLog += `=> Maka, solusi dari f(x) = ${fungsi} adalah\n`;
    
    let exactRoot = parseFloat(root.toFixed(6)).toString();
    let approxRoot = fmtStep(root);

    outputLog += `   x = c = [ ${exactRoot.padStart(9)} ]   ≈   ${approxRoot}\n`; 
    outputLog += `   f(x) = f(c) = ${fmtStep(evalFunction(fungsi, root))}.\n`;
    outputLog += `   • Diselesaikan   : Pada Iterasi ke-${iterasiTercapai}\n`;
    outputLog += `   • Panjang Selang : ${fmtStep(galat)}\n`;

    return { 
        akar: root, 
        galatAkhir: galat, 
        iterasi: iterasiTercapai, 
        log: outputLog, 
        status: galat <= toleransi ? "Sukses" : "Maks iterasi" 
    };
}

/* =============================
LOGIKA SECANT
=============================*/

/* =============================
LOGIKA TRAPESIUM
=============================*/

/* =============================
LOGIKA RUNGE KUTTA
=============================*/

/* =============================
SPLASH SCREEN
=============================*/
setTimeout(()=>{
document.getElementById("splash").style.display="none"
},3000)

// =============================
// FIX GLOBAL SCOPE
// =============================
window.hitung = hitung
window.gaussSolve = gaussSolve
window.metodeBisectionPro = metodeBisectionPro
window.metodeSecant = metodeSecant
window.metodeTrapesium = metodeTrapesium
window.rungeKutta = rungeKutta
window.metodeGaussSeidel = metodeGaussSeidel
window.interpolasiNewton = interpolasiNewton

// =============================
// PASTIKAN DOM READY
// =============================
document.addEventListener("DOMContentLoaded", function(){

    populateSizeSelectors()

    createMatrixGrid('gauss')

    ubahPlaceholder()

})
function toggleTutorial(){
    const modal = document.getElementById("tutorialModal")
    modal.classList.toggle("active")
}