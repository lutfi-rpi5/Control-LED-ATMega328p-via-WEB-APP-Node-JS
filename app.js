// Import module serialport
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// Konfigurasi Serial Port
const serialPort = new SerialPort({
    path: 'COM2', // Ganti 'COM2' dengan port serial yang sesuai
    baudRate: 9600,
});

// Parser untuk membaca data dari serial port
const parser = new ReadlineParser({ delimiter: '\r\n' });
serialPort.pipe(parser);

// Import module express
const express = require('express');
const app = express();

// Gunakan folder 'public' untuk file statis (HTML, CSS, JS)
app.use(express.static('public'));

// Status awal LED
let led1Status = false; // false = OFF, true = ON
let led2Status = false;

// Endpoint untuk toggle LED 1
app.get('/led1/toggle', (req, res) => {
    led1Status = !led1Status;
    const command = led1Status ? '1\n' : '0\n';
    serialPort.write(command, (err) => {
        if (err) {
            console.error('Error sending data:', err.message);
            res.status(500).send('Failed to toggle LED 1');
        } else {
            console.log(`LED 1 ${led1Status ? 'ON' : 'OFF'}`);
            res.json({ status: led1Status });
        }
    });
});

// Endpoint untuk toggle LED 2
app.get('/led2/toggle', (req, res) => {
    led2Status = !led2Status;
    const command = led2Status ? '3\n' : '2\n';
    serialPort.write(command, (err) => {
        if (err) {
            console.error('Error sending data:', err.message);
            res.status(500).send('Failed to toggle LED 2');
        } else {
            console.log(`LED 2 ${led2Status ? 'ON' : 'OFF'}`);
            res.json({ status: led2Status });
        }
    });
});

// Jalankan server pada port 3000
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// Event untuk memastikan serial port terbuka
serialPort.on('open', () => {
    console.log('Serial Port Opened');
});

// Event untuk membaca data dari serial port
parser.on('data', (data) => {
    console.log('Received from Arduino:', data);
});
