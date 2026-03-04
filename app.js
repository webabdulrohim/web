const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'rahasia-ohim-store',
    resave: false,
    saveUninitialized: true
}));

// DATABASE SIMULASI
let produk = [
    { id: 1, nama: "Sepatu Sport Ohim", harga: 250000, gambar: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
    { id: 2, nama: "Kaos Putih Eksklusif", harga: 150000, gambar: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" }
];

// --- HALAMAN USER (HOME) ---
app.get('/', (req, res) => {
    let listProduk = produk.map(p => `
        <div style="border:1px solid #ddd; border-radius:10px; background:white; overflow:hidden; text-align:center; padding-bottom:15px;">
            <img src="${p.gambar}" style="width:100%; height:200px; object-fit:cover;">
            <h3 style="margin:10px 0;">${p.nama}</h3>
            <p style="color:#28a745; font-weight:bold;">Rp ${p.harga.toLocaleString()}</p>
            <a href="https://wa.me/6281214932916?text=Halo+Ohim-Store,+saya+mau+beli+${p.nama.replace(/ /g, '+')}" 
               style="background:#25d366; color:white; padding:10px 20px; text-decoration:none; border-radius:5px; font-weight:bold;">
               Chat WA
            </a>
        </div>
    `).join('');

    res.send(`
        <html>
        <body style="font-family:sans-serif; margin:0; background:#f4f4f4;">
            <header style="background:#28a745; color:white; padding:20px; text-align:center;">
                <h1>🌿 Ohim-Store 🌿</h1>
            </header>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:20px; padding:20px;">
                ${listProduk}
            </div>
            <footer style="text-align:center; padding:20px;"><a href="/login" style="color:#28a745;">Login Admin</a></footer>
        </body>
        </html>
    `);
});

// --- HALAMAN LOGIN ---
app.get('/login', (req, res) => {
    res.send(`
        <div style="text-align:center; margin-top:100px; font-family:sans-serif;">
            <h2 style="color:#28a745;">Login Admin Ohim-Store</h2>
            <form action="/login" method="POST">
                <input type="password" name="pass" placeholder="Password Admin" style="padding:10px; border-radius:5px; border:1:solid #ccc;"><br><br>
                <button type="submit" style="background:#28a745; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer;">Masuk</button>
            </form>
        </div>
    `);
});

app.post('/login', (req, res) => {
    if (req.body.pass === 'ohim123') { // Ganti password di sini
        req.session.isAdmin = true;
        res.redirect('/admin');
    } else {
        res.send("<script>alert('Password Salah!'); window.location='/login';</script>");
    }
});

// --- HALAMAN ADMIN (DIPROTEKSI) ---
app.get('/admin', (req, res) => {
    if (!req.session.isAdmin) return res.redirect('/login');
    
    res.send(`
        <body style="font-family:sans-serif; background:#e9f5ed; padding:20px;">
            <h2 style="color:#28a745;">Dashboard Admin Ohim-Store</h2>
            <a href="/logout" style="color:red;">Logout</a>
            <form action="/tambah" method="POST" style="margin-top:20px; background:white; padding:20px; border-radius:8px;">
                <h3>Tambah Produk</h3>
                <input name="nama" placeholder="Nama Barang" required><br><br>
                <input name="harga" type="number" placeholder="Harga" required><br><br>
                <input name="gambar" placeholder="Link Gambar (URL)" required><br><br>
                <button type="submit" style="background:#28a745; color:white; border:none; padding:10px 20px; cursor:pointer;">Tambah ke Toko</button>
            </form>
            <br><a href="/">Lihat Toko</a>
        </body>
    `);
});

app.post('/tambah', (req, res) => {
    if (req.session.isAdmin) {
        produk.push({ id: Date.now(), ...req.body });
    }
    res.redirect('/admin');
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(3000, () => console.log('Ohim-Store aktif di http://localhost:3000'));
