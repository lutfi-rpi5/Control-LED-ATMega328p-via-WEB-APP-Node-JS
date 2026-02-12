document.getElementById('led1-toggle').addEventListener('click', () => {
    fetch('/led1/toggle')
        .then((response) => response.json())
        .then((data) => {
            const button = document.getElementById('led1-toggle');
            const img = document.getElementById('led1-icon');
            const span = button.querySelector('span'); // Ambil elemen teks di dalam tombol

            if (data.status) {
                button.setAttribute('data-status', 'on');
                img.src = 'lamp on.png'; // Ganti ke gambar lampu hidup
                img.alt = 'LED 1 Hidup';
                span.textContent = 'LED 1 ON'; // Hanya ubah teks
            } else {
                button.setAttribute('data-status', 'off');
                img.src = 'lamp off.png'; // Ganti ke gambar lampu mati
                img.alt = 'LED 1 Mati';
                span.textContent = 'LED 1 OFF'; // Hanya ubah teks
            }
        })
        .catch((error) => console.error('Error:', error));
});

document.getElementById('led2-toggle').addEventListener('click', () => {
    fetch('/led2/toggle')
        .then((response) => response.json())
        .then((data) => {
            const button = document.getElementById('led2-toggle');
            const img = document.getElementById('led2-icon');
            const span = button.querySelector('span'); // Ambil elemen teks di dalam tombol

            if (data.status) {
                button.setAttribute('data-status', 'on');
                img.src = 'lamp on.png'; // Ganti ke gambar lampu hidup
                img.alt = 'LED 2 Hidup';
                span.textContent = 'LED 2 ON'; // Hanya ubah teks
            } else {
                button.setAttribute('data-status', 'off');
                img.src = 'lamp off.png'; // Ganti ke gambar lampu mati
                img.alt = 'LED 2 Mati';
                span.textContent = 'LED 2 OFF'; // Hanya ubah teks
            }
        })
        .catch((error) => console.error('Error:', error));
});
