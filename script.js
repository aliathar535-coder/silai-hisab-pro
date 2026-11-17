let ratesMaster = JSON.parse(localStorage.getItem('ratesMaster')) || [
    { name: 'Cotton Shirt', rate: 45 },
    { name: 'Denim Jeans', rate: 70 },
    { name: 'Printed Kurti', rate: 35 }
];

let piecesList = JSON.parse(localStorage.getItem('piecesList')) || [];
let kharchaList = JSON.parse(localStorage.getItem('kharchaList')) || [];
let currentPhotoBase64 = "";

// Live Clock
setInterval(() => {
    document.getElementById('live-clock').innerText = new Date().toLocaleTimeString();
}, 1000);

// Swipe Touch Navigation
let touchStartX = 0;
let touchEndX = 0;
const tabs = ['work', 'kharcha', 'rates', 'studio'];

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${tabName}`).classList.add('active');
    event.currentTarget.classList.add('active');
    renderData();
}

function handleTouchStart(e) { touchStartX = e.changedTouches[0].screenX; }
function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    let activeIdx = tabs.findIndex(t => document.getElementById(`tab-${t}`).classList.contains('active'));
    if (touchEndX < touchStartX - 50 && activeIdx < tabs.length - 1) {
        document.querySelectorAll('.tab-btn')[activeIdx + 1].click();
    }
    if (touchEndX > touchStartX + 50 && activeIdx > 0) {
        document.querySelectorAll('.tab-btn')[activeIdx - 1].click();
    }
}

// Quick Entry Functions
function populateRateDropdown() {
    let select = document.getElementById('quick-garment-select');
    select.innerHTML = '<option value="">कपड़ा चुनें...</option>';
    ratesMaster.forEach(item => {
        select.innerHTML += `<option value="${item.name}" data-rate="${item.rate}">${item.name} (₹${item.rate}/pc)</option>`;
    });
}

document.getElementById('quick-garment-select').addEventListener('change', function() {
    let rate = this.options[this.selectedIndex].getAttribute('data-rate');
    if (rate) document.getElementById('quick-rate').value = rate;
});

function previewQuickPhoto(e) {
    let file = e.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            currentPhotoBase64 = e.target.result;
            document.getElementById('photo-status').innerText = "✓ फोटो जुड़ गई";
            document.getElementById('photo-status').style.color = "#43e97b";
        };
        reader.readAsDataURL(file);
    }
}

function saveQuickPiece() {
    let name = document.getElementById('quick-garment-select').value;
    let qty = parseInt(document.getElementById('quick-qty').value);
    let rate = parseFloat(document.getElementById('quick-rate').value);

    if (!name || !qty || !rate) {
        alert("कृपया कपड़ा, पीस और रेट भरें!");
        return;
    }

    piecesList.unshift({
        id: Date.now(),
        name, qty, rate,
        total: qty * rate,
        photo: currentPhotoBase64 || "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=300"
    });

    localStorage.setItem('piecesList', JSON.stringify(piecesList));
    document.getElementById('quick-qty').value = "1";
    document.getElementById('quick-rate').value = "";
    document.getElementById('quick-garment-select').value = "";
    currentPhotoBase64 = "";
    document.getElementById('photo-status').innerText = "कोई फोटो नहीं";
    renderData();
    alert("पीस सेव हो गया!");
}

function renderData() {
    populateRateDropdown();
    let totalPcs = 0, totalEarn = 0, html = "";

    piecesList.forEach(item => {
        totalPcs += item.qty;
        totalEarn += item.total;
        html += `
            <div class="glass-box" style="display:flex; gap:12px; align-items:center;">
                <img src="${item.photo}" style="width:65px; height:65px; border-radius:12px; object-fit:cover;">
                <div style="flex:1;">
                    <h4 style="color:#00f2fe;">${item.name}</h4>
                    <p style="font-size:0.85rem; color:#ccc;">${item.qty} Pcs × ₹${item.rate}</p>
                    <h3 style="color:#43e97b;">₹ ${item.total}</h3>
                </div>
                <button onclick="deletePiece(${item.id})" style="background:none; border:none; color:#ff5858; font-size:1.2rem; cursor:pointer;">🗑️</button>
            </div>
        `;
    });

    document.getElementById('total-pcs').innerText = `${totalPcs} Pcs`;
    document.getElementById('total-earn').innerText = `₹ ${totalEarn}`;
    document.getElementById('pieces-list').innerHTML = html || '<p style="text-align:center; color:#777;">कोई एंट्री नहीं है।</p>';

    // Render Rates
    let rHtml = "";
    ratesMaster.forEach((r, idx) => {
        rHtml += `
            <div class="glass-box" style="display:flex; justify-content:space-between; align-items:center;">
                <span><b>${r.name}</b></span>
                <span style="color:#00f2fe;">₹ ${r.rate} / pc</span>
                <button onclick="deleteRate(${idx})" style="background:none; border:none; color:#ff5858; cursor:pointer;">❌</button>
            </div>
        `;
    });
    document.getElementById('rates-list').innerHTML = rHtml;
}

function addNewRate() {
    let name = document.getElementById('new-cloth-name').value;
    let rate = parseFloat(document.getElementById('new-cloth-rate').value);
    if(name && rate) {
        ratesMaster.push({name, rate});
        localStorage.setItem('ratesMaster', JSON.stringify(ratesMaster));
        document.getElementById('new-cloth-name').value = '';
        document.getElementById('new-cloth-rate').value = '';
        renderData();
    }
}

function deletePiece(id) {
    piecesList = piecesList.filter(p => p.id !== id);
    localStorage.setItem('piecesList', JSON.stringify(piecesList));
    renderData();
}

function deleteRate(idx) {
    ratesMaster.splice(idx, 1);
    localStorage.setItem('ratesMaster', JSON.stringify(ratesMaster));
    renderData();
}

// Customization
function updateUserName(val) { document.getElementById('display-name').innerText = val || "A-T-H-A-R"; }
function updateGlassBlur(val) { document.documentElement.style.setProperty('--blur-val', val + 'px'); }
function update3DDepth(val) { document.documentElement.style.setProperty('--depth-val', val + 'px'); }
function setTheme(c1, c2) { document.documentElement.style.setProperty('--accent-glow', `0 8px 32px 0 rgba(${c1}, 0.4)`); }

renderData();
