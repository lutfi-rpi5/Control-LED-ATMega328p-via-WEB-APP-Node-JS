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

// Endpoint untuk menyalakan LED 1
app.get('/led1/on', (req, res) => {
    serialPort.write('1\n', (err) => {
        if (err) {
            console.error('Error sending data:', err.message);
            res.status(500).send('Failed to turn on LED 1');
        } else {
            console.log('LED 1 ON');
            res.send('LED 1 ON');
        }
    });
});

// Endpoint untuk mematikan LED 1
app.get('/led1/off', (req, res) => {
    serialPort.write('0\n', (err) => {
        if (err) {
            console.error('Error sending data:', err.message);
            res.status(500).send('Failed to turn off LED 1');
        } else {
            console.log('LED 1 OFF');
            res.send('LED 1 OFF');
        }
    });
});

// Endpoint untuk menyalakan LED 2
app.get('/led2/on', (req, res) => {
    serialPort.write('3\n', (err) => {
        if (err) {
            console.error('Error sending data:', err.message);
            res.status(500).send('Failed to turn on LED 2');
        } else {
            console.log('LED 2 ON');
            res.send('LED 2 ON');
        }
    });
});

// Endpoint untuk mematikan LED 2
app.get('/led2/off', (req, res) => {
    serialPort.write('2\n', (err) => {
        if (err) {
            console.error('Error sending data:', err.message);
            res.status(500).send('Failed to turn off LED 2');
        } else {
            console.log('LED 2 OFF');
            res.send('LED 2 OFF');
        }
    });
});

// Jalankan server pada port 3000
const PORT = 3000;
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
