# Program Arduino - Kontrol 2 LED via Serial

## Board Setup (MiniCore)

- **Board package:** MiniCore (`https://mcudude.github.io/MiniCore/package_MCUdude_MiniCore_index.json`)
- **Board:** ATmega328/P/PA/A/PB
- **Clock:** External 16MHz crystal
- **BOD:** 2.7V (recommended)

### Cara Install

1. Arduino IDE → File → Preferences → **Additional Boards Manager URLs**
2. Tambahkan: `https://mcudude.github.io/MiniCore/package_MCUdude_MiniCore_index.json`
3. Tools → Board → Boards Manager → cari "MiniCore" → Install
4. Pilih **Board: ATmega328/P/PA/A/PB**, **Clock: External 16MHz**, **BOD: 2.7V**

## Pin Mapping

| Komponen | Pin Arduino | Port/IC Kaki |
|---|---|---|
| LED 1 | 12 | PB4 (kaki 18) |
| LED 2 | 13 | PB5 (kaki 19) |
| Push Button 1 (ke GND, INPUT_PULLUP) | 7 | PD7 (kaki 13) |
| Push Button 2 (ke GND, INPUT_PULLUP) | 8 | PB0 (kaki 14) |
| Serial TX | 1 | PD1 (kaki 3) |
| Serial RX | 0 | PD0 (kaki 2) |

## Protokol Serial (baud: 9600)

### Dari Node.js ke Arduino (`\n` delimiter)

| Data | Fungsi |
|---|---|
| `1` | LED 1 ON |
| `0` | LED 1 OFF |
| `3` | LED 2 ON |
| `2` | LED 2 OFF |
| teks lain | Dicetak ke Serial Monitor (fitur chat) |

### Dari Arduino ke Node.js (`\r\n` delimiter)

| Data | Fungsi |
|---|---|
| `LED1:1` | Push button 1 ditekan (LED web ON) |
| `LED1:0` | Push button 1 dilepas (LED web OFF) |
| `LED2:1` | Push button 2 ditekan (LED web ON) |
| `LED2:0` | Push button 2 dilepas (LED web OFF) |
| `SYS:...` | Pesan sistem |

## Catatan Proteus

1. Atur COMPIM/COMPort ke **COM2** (sama dengan `app.js`)
2. Baud rate COMPIM: **9600**
3. Koneksi langsung ke kaki IC ATmega328P sesuai tabel Pin Mapping di atas
4. Push button: sambungkan ke GND, gunakan pull-up internal (tidak perlu resistor eksternal)
5. LED: sambungkan anoda ke pin Arduino via resistor 220Ω, katoda ke GND
