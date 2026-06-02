# Control LED via Web APP NodeJS

Kontrol 2 LED dan push button pada simulasi Proteus (ATMega328p) melalui web app Node.js dengan komunikasi serial dua arah.

## Fitur

- **2 Toggle Button** di web untuk menghidupkan/mematikan LED di Proteus
- **2 LED Indicator** di web yang merespon push button di Proteus
- **Serial Log** — menampilkan seluruh komunikasi TX/RX antara Node.js dan Arduino
- **Chat** — kirim pesan teks ke Serial Monitor Arduino dari web

## Prasyarat

- Node.js >= 16
- Arduino IDE (untuk kompilasi `main/main.ino`)
- Proteus (untuk simulasi)
- Virtual Serial Port (com0com, Virtual Serial Port Emulator, atau sejenisnya)

## Setup

```bash
npm install
```

## Konfigurasi

Sesuaikan path serial port di `app.js:7`:

```js
path: 'COM2', // Ganti sesuai port serial virtual Anda
```

Port yang sama harus digunakan di COMPIM pada Proteus.

## Menjalankan

```bash
node app.js
```

Buka browser di `http://localhost:3001`.

## Upload Program Arduino

1. Buka `main/main.ino` di Arduino IDE
2. Pilih board: **Arduino Uno** (ATMega328p)
3. Upload ke board (atau simpan .hex untuk Proteus)

## Struktur File

```
.
├── app.js                # Express + Socket.IO server
├── package.json
├── public/
│   ├── index.html        # UI web
│   ├── app.js            # Frontend (Socket.IO client)
│   ├── style.css
│   └── lamp on/off.png
├── main/
│   ├── main.ino          # Program Arduino
│   └── README.md         # Dokumentasi Arduino
└── AGENTS.md             # Petunjuk untuk OpenCode agent
```

## Arsitektur

```
Browser (Socket.IO) ←→ Node.js (Express + Socket.IO) ←→ Serial Port ←→ Arduino (Proteus)
```

- **Browser → Arduino**: toggle LED via HTTP/Socket, kirim chat via Socket.IO
- **Arduino → Browser**: push button status + echo chat via serial → Socket.IO broadcast

## Protokol Serial

| Arah | Data | Arti |
|---|---|---|
| TX | `1` | LED1 ON |
| TX | `0` | LED1 OFF |
| TX | `3` | LED2 ON |
| TX | `2` | LED2 OFF |
| TX | teks | Chat ke Serial Monitor |
| RX | `LED1:1` / `LED1:0` | Push button 1 ditekan/dilepas |
| RX | `LED2:1` / `LED2:0` | Push button 2 ditekan/dilepas |
| RX | `SYS:...` | Pesan sistem Arduino |

Detail: `main/README.md`
