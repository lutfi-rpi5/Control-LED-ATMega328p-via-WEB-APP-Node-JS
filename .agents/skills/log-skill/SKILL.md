---
name: log-skill
description: Berikan log yang sudah dikerjakan
license: MIT
compatibility: opencode
metadata:
  audience: maintainers
---

## What I do

- Tambahkan log yang sudah dikerjakan di progress.txt

## When To Use Me

- Setelah selesai membuat file, refactor, menjalankan task, atau memperbaiki bug
- setiap kali ada perubahan kode

## How I Do It

1. Read `progress.txt` untuk melihat log terakhir
2. Append entry baru di bagian bawah file
3. Group berdasarkan tanggal (YYYY/MM/DD), gunakan bullet points
4. Format: aksi (`Modified`, `Created`, `Fixed`, `Deleted`)

## Log Format

```
## 2025/05/30

### Kategori Task
- [Modified] Mengubah `src/public/css/style.css` - ubah family-font 
- [Created] Membuat `src/middleware/auth.js` - membuat middleware untuk auth login
- [Fixed] Memperbaiki `src/public/pages/dashboard.html` - Memperbaiki div .value-card saling overlaping
- [Deleted] Menghapus `src/controllers/exportController.js` - File & Fitur di hapus
```
**PENTING:** Selalu append, jangan overwrite file yang sudah ada 