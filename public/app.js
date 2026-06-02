const socket = io();

const logWindow = document.getElementById('log-window');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const portInput = document.getElementById('port-input');
const portConnect = document.getElementById('port-connect');
const portStatus = document.getElementById('port-status');

let connected = false;

function formatPort(raw) {
    return raw.toUpperCase().replace(/\s+/g, '');
}

function appendLog(type, time, data) {
    const entry = document.createElement('div');
    entry.className = 'log-entry ' + type;
    const label = type === 'tx' ? 'TX' : type === 'rx' ? 'RX' : 'SYS';
    entry.textContent = '[' + time + '] [' + label + '] ' + data;
    logWindow.appendChild(entry);
    logWindow.scrollTop = logWindow.scrollHeight;
}

function sendChat() {
    const message = chatInput.value.trim();
    if (!message) return;
    if (!connected) {
        appendLog('sys', '', 'Port belum terhubung');
        return;
    }
    socket.emit('send-chat', { message });
    chatInput.value = '';
}

function setConnected(state, path) {
    connected = state;
    if (state) {
        portConnect.textContent = 'Disconnect';
        portConnect.className = 'disconnect';
        portStatus.className = 'status-dot connected';
        portInput.disabled = true;
    } else {
        portConnect.textContent = 'Connect';
        portConnect.className = '';
        portStatus.className = 'status-dot disconnected';
        portInput.disabled = false;
    }
}

chatSend.addEventListener('click', sendChat);
chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendChat();
});

portConnect.addEventListener('click', () => {
    if (connected) {
        socket.emit('disconnect-port');
    } else {
        const path = formatPort(portInput.value);
        if (!path) {
            appendLog('sys', '', 'Masukkan COM port terlebih dahulu');
            return;
        }
        portInput.value = path;
        socket.emit('connect-port', { path });
    }
});

socket.on('connection-status', (msg) => {
    setConnected(msg.connected, msg.path);
    if (!msg.connected && msg.error) {
        portInput.disabled = false;
    }
});

socket.on('serial-data', (msg) => {
    appendLog(msg.direction, msg.time, msg.data);
});

socket.on('toggle-result', (msg) => {
    const button = document.getElementById('led' + msg.led + '-toggle');
    const img = document.getElementById('led' + msg.led + '-icon');
    const span = button.querySelector('span');

    if (msg.status) {
        button.setAttribute('data-status', 'on');
        img.src = 'lamp on.png';
        img.alt = 'LED ' + msg.led + ' Hidup';
        span.textContent = 'LED ' + msg.led + ' ON';
    } else {
        button.setAttribute('data-status', 'off');
        img.src = 'lamp off.png';
        img.alt = 'LED ' + msg.led + ' Mati';
        span.textContent = 'LED ' + msg.led + ' OFF';
    }
});

document.getElementById('led1-toggle').addEventListener('click', () => {
    if (!connected) {
        appendLog('sys', '', 'Port belum terhubung');
        return;
    }
    socket.emit('toggle-led', { led: 1 });
});

document.getElementById('led2-toggle').addEventListener('click', () => {
    if (!connected) {
        appendLog('sys', '', 'Port belum terhubung');
        return;
    }
    socket.emit('toggle-led', { led: 2 });
});
