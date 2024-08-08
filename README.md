# Api-FighterTunnel

API script untuk FIGHTER TUNNEL

## Endpoint API

Berikut adalah daftar endpoint yang tersedia di API ini:

| Method   | Path                 | Query            | Body             | Details                                |
|----------|----------------------|------------------|------------------|----------------------------------------|
| `POST`   | `/api/cek/account`   | -                | -                | Cek Semua Akun                         |
| `DELETE` | `/api/delssh`        | user             | -                | Hapus Akun SSH                         |
| `DELETE` | `/api/delvmess`      | user             | -                | Hapus Akun VMESS                       |
| `DELETE` | `/api/deltrojan`     | user             | -                | Hapus Akun TROJAN                      |
| `DELETE` | `/api/delvless`      | user             | -                | Hapus Akun VLESS                       |

## Cara Menggunakan

### Cek Semua Akun
**Request:**
- Method: `POST`
- Path: `/api/cek/account`

**Response:**
- Mengembalikan daftar semua akun yang tersedia.

### Hapus Akun SSH
**Request:**
- Method: `DELETE`
- Path: `/api/delssh`
- Query Parameters:
  - `user`: Nama pengguna atau ID akun SSH yang akan dihapus.

**Response:**
- Menghapus akun SSH yang ditentukan.

### Hapus Akun VMESS
**Request:**
- Method: `DELETE`
- Path: `/api/delvmess`
- Query Parameters:
  - `user`: Nama pengguna atau ID akun VMESS yang akan dihapus.

**Response:**
- Menghapus akun VMESS yang ditentukan.

### Hapus Akun TROJAN
**Request:**
- Method: `DELETE`
- Path: `/api/deltrojan`
- Query Parameters:
  - `user`: Nama pengguna atau ID akun TROJAN yang akan dihapus.

**Response:**
- Menghapus akun TROJAN yang ditentukan.

### Hapus Akun VLESS
**Request:**
- Method: `DELETE`
- Path: `/api/delvless`
- Query Parameters:
  - `user`: Nama pengguna atau ID akun VLESS yang akan dihapus.

**Response:**
- Menghapus akun VLESS yang ditentukan.
