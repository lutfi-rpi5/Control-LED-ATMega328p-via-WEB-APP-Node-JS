# AGENTS.md

## Project overview
Single-package Node.js Express server that controls 2 LEDs via serial port (Arduino). Frontend in `public/` uses plain HTML/CSS/JS with no framework.

## Commands
- `npm start` — not defined, run `node app.js` directly
- No test/lint/typecheck/formatter configured

## Architecture
- **Entrypoint:** `app.js` — Express server on port **3001** (not 3000)
- **Static files:** `public/` (index.html, app.js, style.css, lamp on/off.png)
- **Serial:** `serialport` v12, COM2 @ 9600 baud, `ReadlineParser` delimiter `\r\n`
- **API:**
  - `GET /led1/toggle` — toggles LED1, sends `1` (on) or `0` (off)
  - `GET /led2/toggle` — toggles LED2, sends `3` (on) or `2` (off)
  - Both respond `{ status: boolean }`
- **Module system:** CommonJS (`require`)

## Quirks
- `app2.md` is misnamed — contains an older JS version of the server (not markdown)
- Serial port path (`COM2`) is hardcoded in `app.js:7` and must be changed per platform
- Frontend uses `fetch` with `.json()` — endpoints must return JSON
