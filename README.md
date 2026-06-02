# Control LED via Web APP NodeJS

Kontrol 2 LED pada simulasi Proteus (ATmega328P) melalui web app Node.js dengan komunikasi serial.

## Fitur

- **2 Toggle Button** di web untuk menghidupkan/mematikan LED di Proteus
- **Serial Log** — menampilkan seluruh komunikasi TX (dari web) dan RX (dari Arduino)
- **Chat** — kirim pesan teks ke Serial Monitor Arduino dari web
- **Koneksi serial dinamis** — port COM dipilih dari frontend (tidak hardcoded)
- **Real-time** via Socket.IO — semua update tanpa refresh halaman

## Prasyarat

- Node.js >= 16
- Arduino IDE (untuk kompilasi `main/main.ino`)
- Proteus (untuk simulasi)
- Virtual Serial Port (com0com, Virtual Serial Port Emulator, atau sejenisnya)

## Instalasi

```bash
npm install
```

## Menjalankan

1. Compile `main/main.ino` dan load `.hex` ke Proteus
2. Jalankan server:
   ```bash
   node app.js
   ```
3. Buka browser di `http://localhost:3005`
4. Masukkan COM port (contoh: COM2) di kolom port, klik **Connect**
5. Gunakan toggle button untuk menyalakan/mematikan LED

## Struktur Proyek

```
.
├── app.js                # Express + HTTP + Socket.IO server
├── package.json
├── public/
│   ├── index.html        # UI web
│   ├── app.js            # Frontend Socket.IO client
│   ├── style.css
│   └── lamp on/off.png   # Ikon toggle LED
├── main/
│   ├── main.ino          # Firmware Arduino
│   └── README.md         # Dokumentasi Arduino & Proteus
└── AGENTS.md
```

## Arsitektur

```
Browser (Socket.IO) ←→ Node.js (Express + Socket.IO) ←→ Serial Port (RS-232) ←→ ATmega328P (Proteus)
```

| Arah | Jalur | Metode |
|---|---|---|
| Web → Arduino | Toggle LED jadi `1`, `0`, `3`, `2` via serial | Socket.IO `toggle-led` → serial write |
| Web → Arduino | Chat message via serial | Socket.IO `send-chat` → serial write |
| Arduino → Web | Data serial RX ditampilkan di log | Serial read → Socket.IO `serial-data` |

## Protokol Serial (baud 9600)

### TX (Web → Arduino, delimiter `\n`)

| Data | Fungsi |
|---|---|
| `1` | LED 1 ON |
| `0` | LED 1 OFF |
| `3` | LED 2 ON |
| `2` | LED 2 OFF |
| teks lain | Dikirim ke Serial Monitor (fitur chat) |

### RX (Arduino → Web, delimiter `\r\n`)

| Data | Keterangan |
|---|---|
| teks | Echo chat dari Arduino (jika web kirim chat, Arduino balas) |

Detail lebih lanjut: `main/README.md`

## API HTTP (backward compat)

| Endpoint | Fungsi |
|---|---|
| `GET /led1/toggle` | Toggle LED 1 (return `{ status: bool }`) |
| `GET /led2/toggle` | Toggle LED 2 (return `{ status: bool }`) |

> Catatan: endpoint HTTP mengembalikan 503 jika serial belum terhubung.

## Catatan Proteus

1. Pasang COMPIM, atur Physical Port ke COM yang sama dengan input di web
2. Baud rate COMPIM: **9600**
3. Sambungkan COMPIM TX → RXD ATmega328P (PD0), COMPIM RX → TXD ATmega328P (PD1)
4. LED: anoda ke pin via resistor 220Ω, katoda ke GND
