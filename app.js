const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let currentSerialPort = null;
let currentParser = null;
let isConnected = false;
let led1Status = false;
let led2Status = false;

function formatTime() {
    const now = new Date();
    return now.toLocaleTimeString('id-ID', { hour12: false });
}

function emitSerial(direction, data) {
    io.emit('serial-data', { direction, time: formatTime(), data });
}

function emitStatus(connected, path, error) {
    isConnected = connected;
    io.emit('connection-status', { connected, path, error });
}

async function openSerial(path) {
    if (currentSerialPort) {
        await closeSerial();
    }

    const port = new SerialPort({ path, baudRate: 9600 });
    const parser = new ReadlineParser({ delimiter: '\r\n' });

    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            port.close();
            reject(new Error('Timeout membuka port'));
        }, 5000);

        port.on('open', () => {
            clearTimeout(timeout);
            port.pipe(parser);
            currentSerialPort = port;
            currentParser = parser;
            emitStatus(true, path);

            parser.on('data', (data) => {
                const trimmed = data.trim();
                console.log('RX:', trimmed);
                emitSerial('rx', trimmed);
            });

            port.on('close', () => {
                currentSerialPort = null;
                currentParser = null;
                emitStatus(false, path);
            });

            port.on('error', (err) => {
                console.error('Serial error:', err.message);
            });

            resolve();
        });

        port.on('error', (err) => {
            clearTimeout(timeout);
            port.close();
            reject(err);
        });
    });
}

async function closeSerial() {
    if (!currentSerialPort) return;
    return new Promise((resolve) => {
        currentSerialPort.close(() => {
            currentSerialPort = null;
            currentParser = null;
            isConnected = false;
            resolve();
        });
    });
}

function sendSerial(data) {
    if (!currentSerialPort || !currentSerialPort.isOpen) {
        emitSerial('sys', 'Port tidak terhubung');
        return;
    }
    currentSerialPort.write(data + '\n', (err) => {
        if (err) {
            console.error('Error sending data:', err.message);
            emitSerial('sys', 'Gagal kirim: ' + err.message);
        } else {
            emitSerial('tx', data);
        }
    });
}

app.get('/led1/toggle', (req, res) => {
    if (!currentSerialPort || !currentSerialPort.isOpen) {
        return res.status(503).json({ error: 'Serial port not connected' });
    }
    led1Status = !led1Status;
    const command = led1Status ? '1' : '0';
    currentSerialPort.write(command + '\n', (err) => {
        if (err) {
            console.error('Error:', err.message);
            res.status(500).json({ status: led1Status });
        } else {
            console.log(`LED 1 ${led1Status ? 'ON' : 'OFF'}`);
            emitSerial('tx', command);
            io.emit('toggle-result', { led: 1, status: led1Status });
            res.json({ status: led1Status });
        }
    });
});

app.get('/led2/toggle', (req, res) => {
    if (!currentSerialPort || !currentSerialPort.isOpen) {
        return res.status(503).json({ error: 'Serial port not connected' });
    }
    led2Status = !led2Status;
    const command = led2Status ? '3' : '2';
    currentSerialPort.write(command + '\n', (err) => {
        if (err) {
            console.error('Error:', err.message);
            res.status(500).json({ status: led2Status });
        } else {
            console.log(`LED 2 ${led2Status ? 'ON' : 'OFF'}`);
            emitSerial('tx', command);
            io.emit('toggle-result', { led: 2, status: led2Status });
            res.json({ status: led2Status });
        }
    });
});

io.on('connection', async (socket) => {
    console.log('Client connected');

    try {
        const ports = await SerialPort.list();
        socket.emit('port-list', ports.map(p => ({ path: p.path })));
    } catch (err) {
        console.error('Error listing ports:', err.message);
    }

    socket.emit('connection-status', {
        connected: isConnected,
        path: currentSerialPort ? currentSerialPort.path : null,
    });

    socket.emit('toggle-result', { led: 1, status: led1Status });
    socket.emit('toggle-result', { led: 2, status: led2Status });

    socket.on('list-ports', async () => {
        try {
            const ports = await SerialPort.list();
            socket.emit('port-list', ports.map(p => ({ path: p.path })));
        } catch (err) {
            socket.emit('port-list', []);
        }
    });

    socket.on('connect-port', async (msg) => {
        try {
            emitSerial('sys', 'Menghubungkan ke ' + msg.path + '...');
            await openSerial(msg.path);
            emitSerial('sys', 'Terhubung ke ' + msg.path);
        } catch (err) {
            emitSerial('sys', 'Gagal terhubung ke ' + msg.path + ': ' + err.message);
            emitStatus(false, msg.path, err.message);
        }
    });

    socket.on('disconnect-port', async () => {
        if (currentSerialPort) {
            const path = currentSerialPort.path;
            await closeSerial();
            emitSerial('sys', 'Terputus dari ' + path);
            emitStatus(false, path);
        }
    });

    socket.on('send-chat', (msg) => {
        sendSerial(msg.message);
    });

    socket.on('toggle-led', (msg) => {
        if (!currentSerialPort || !currentSerialPort.isOpen) {
            emitSerial('sys', 'Port tidak terhubung');
            return;
        }
        if (msg.led === 1) {
            led1Status = !led1Status;
            const command = led1Status ? '1' : '0';
            currentSerialPort.write(command + '\n', (err) => {
                if (err) {
                    console.error('Error:', err.message);
                } else {
                    console.log(`LED 1 ${led1Status ? 'ON' : 'OFF'}`);
                    emitSerial('tx', command);
                    io.emit('toggle-result', { led: 1, status: led1Status });
                }
            });
        } else if (msg.led === 2) {
            led2Status = !led2Status;
            const command = led2Status ? '3' : '2';
            currentSerialPort.write(command + '\n', (err) => {
                if (err) {
                    console.error('Error:', err.message);
                } else {
                    console.log(`LED 2 ${led2Status ? 'ON' : 'OFF'}`);
                    emitSerial('tx', command);
                    io.emit('toggle-result', { led: 2, status: led2Status });
                }
            });
        }
    });
});

const PORT = 3005;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
