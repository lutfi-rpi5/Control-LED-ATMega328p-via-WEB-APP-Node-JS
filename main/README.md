# Program Arduino — Kontrol 2 LED via Serial

Firmware ATmega328P untuk menerima perintah dari Node.js via serial UART. Menyalakan/mematikan 2 LED berdasarkan perintah dari web.

## Board Setup

Dapat menggunakan **Arduino Uno** atau **MiniCore** dengan konfigurasi:

| Parameter | Nilai |
|---|---|
| Board package | MiniCore / Arduino Uno |
| Board | ATmega328P |
| Clock | External 16 MHz crystal |
| BOD | 2.7V (MiniCore, opsional) |

### Cara Install MiniCore

1. Arduino IDE → File → Preferences → **Additional Boards Manager URLs**
2. Tambahkan: `https://mcudude.github.io/MiniCore/package_MCUdude_MiniCore_index.json`
3. Tools → Board → Boards Manager → cari "MiniCore" → Install
4. Pilih **Board: ATmega328/P/PA/A/PB**, **Clock: External 16MHz**, **BOD: 2.7V**

## Pin Mapping

| Komponen | Pin Arduino | Port/IC |
|---|---|---|
| LED 1 | 12 | PB4 (kaki 18) |
| LED 2 | 13 | PB5 (kaki 19) |
| Serial TX | 1 | PD1 (kaki 3) |
| Serial RX | 0 | PD0 (kaki 2) |

## Protokol Serial

**Baud rate:** 9600

### TX: Node.js → Arduino (`\n` delimiter)

Arduino membaca data dengan `Serial.readStringUntil('\n')`. Spasi di-trim.

| Data | Fungsi |
|---|---|
| `1` | LED 1 ON (`digitalWrite HIGH`) |
| `0` | LED 1 OFF (`digitalWrite LOW`) |
| `3` | LED 2 ON |
| `2` | LED 2 OFF |
| teks lain | **Echo** — dikirim balik ke Node.js via `Serial.println(cmd)` (fitur chat) |

### RX: Arduino → Node.js (`\r\n` delimiter)

| Data | Keterangan |
|---|---|
| echo chat | Jika web mengirim teks, Arduino membalas dengan teks yang sama |

## Logika Program

```cpp
void loop() {
    while (Serial.available() > 0) {
        char c = Serial.read();
        if (c == '\n') {
            // proses command
            execCommand(serialBuf);
            serialBuf = "";
        } else if (c != '\r' && serialBuf.length() < 64) {
            serialBuf += c;
        }
    }
}
```

- `\r` (CR) diabaikan agar kompatibel dengan berbagai terminal
- Buffer dibatasi 64 karakter untuk mencegah overflow

## Kompilasi & Upload

### Ke board fisik

1. Buka `main.ino` di Arduino IDE
2. Pilih board (Arduino Uno / MiniCore sesuai setup)
3. **Sketch → Upload**

### Ke Proteus

1. **Sketch → Export Compiled Binary**
2. Load file `.hex` (tanpa bootloader) ke ATmega328P di Proteus
3. Atur Clock Frequency ATmega328P ke **16 MHz**
