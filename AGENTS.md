# AGENTS.md

## Project overview
Single-package Node.js Express + Socket.IO server that controls 2 LEDs via serial port (Arduino/Proteus). Frontend in `public/` uses plain HTML/CSS/JS with Socket.IO client.

## Commands
- `npm start` — not defined, run `node app.js` directly
- No test/lint/typecheck/formatter configured

## Architecture
- **Entrypoint:** `app.js` — Express + HTTP + Socket.IO server on port **3001**
- **Static files:** `public/` (index.html, app.js, style.css, lamp on/off.png)
- **Serial:** `serialport` v12, baud 9600, `ReadlineParser` delimiter `\r\n`. Port dipilih dari frontend (tidak hardcoded)
- **Real-time:** Socket.IO for bidirectional communication (log, chat, toggle status)
- **Module system:** CommonJS (`require`)

## Dependencies
- `express`, `serialport`, `@serialport/parser-readline`, `socket.io`

## API & Events

### HTTP (backward compat)
  - `GET /led1/toggle` — toggles LED1, sends `1` (on) / `0` (off), returns `{ status: boolean }`
  - `GET /led2/toggle` — toggles LED2, sends `3` (on) / `2` (off), returns `{ status: boolean }`

### Socket.IO events

| Event | Dir | Payload |
|---|---|---|
| `list-ports` | C→S | (no payload) |
| `port-list` | S→C | `[{ path: string }]` |
| `connect-port` | C→S | `{ path: string }` |
| `disconnect-port` | C→S | (no payload) |
| `connection-status` | S→C | `{ connected: bool, path?: string, error?: string }` |
| `toggle-led` | C→S | `{ led: 1\|2 }` |
| `send-chat` | C→S | `{ message: string }` |
| `serial-data` | S→C | `{ direction: 'tx'\|'rx'\|'sys', time: string, data: string }` |
| `toggle-result` | S→C | `{ led: 1\|2, status: boolean }` |

### Serial protocol (`\n` TX, `\r\n` RX)

| Arah | Data | Arti |
|---|---|---|
| TX | `1` / `0` | LED1 ON/OFF |
| TX | `3` / `2` | LED2 ON/OFF |
| TX | teks | Chat ke Serial Monitor Arduino |
| RX | teks | Echo chat dari Arduino (jika web kirim chat) |

## Quirks
- `app2.md` is misnamed — contains an older JS version of the server (not markdown)
- Serial port path is NOT hardcoded — user types port name in text field (auto-upper-case + trim spasi), communicates via `connect-port`/`disconnect-port` socket events
- Frontend toggles use Socket.IO `toggle-led`, NOT the HTTP endpoints (those exist for API compat only, return 503 if serial not connected)
- Arduino program lives in `main/main.ino` (documentation in `main/README.md`)
