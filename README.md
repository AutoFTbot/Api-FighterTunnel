# Api-FighterTunnel

API script untuk FIGHTER TUNNEL

## Endpoint API

Berikut adalah daftar endpoint yang tersedia di API ini:

| Method   | Path                    | Query                     | Body             | Details                                |
|----------|-------------------------|---------------------------|------------------|----------------------------------------|
| `POST`   | `/api/cek/account`      | -                         | -                | Cek Semua Akun                         |
| `DELETE` | `/api/delssh`           | `user`                    | -                | Hapus Akun SSH                         |
| `DELETE` | `/api/delvmess`         | `user`                    | -                | Hapus Akun VMESS                       |
| `DELETE` | `/api/deltrojan`        | `user`                    | -                | Hapus Akun TROJAN                      |
| `DELETE` | `/api/delvless`         | `user`                    | -                | Hapus Akun VLESS                       |
| `GET`    | `/api/adduser/exp`      | `user`, `password`, `exp` | -                | Buat Akun SSH         |
| `GET`    | `/api/create-trojan`    | `user`, `exp`, `quota`, `limitip` | -          | Buat Akun TROJAN                       |
| `GET`    | `/api/create-vmess`     | `user`, `exp`, `quota`, `limitip` | -          | Buat Akun VMESS                       |
| `GET`    | `/api/create-vless`     | `user`, `exp`, `quota`, `limitip` | -          | Buat Akun VLESS                       |

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

### Tambah Pengguna dengan Expiry
**Request:**
- Method: `GET`
- Path: `/api/adduser/exp`
- Query Parameters:
  - `user`: Nama pengguna yang akan ditambahkan.
  - `password`: Kata sandi untuk akun.
  - `exp`: Durasi masa berlaku akun.

**Response:**
- Menambahkan pengguna dengan informasi yang diberikan dan masa berlaku yang ditentukan.

### Buat Akun TROJAN
**Request:**
- Method: `GET`
- Path: `/api/create-trojan`
- Query Parameters:
  - `user`: Nama pengguna untuk akun TROJAN.
  - `exp`: Durasi masa berlaku akun.
  - `quota`: Kuota data untuk akun.
  - `limitip`: Batas IP untuk akun.

**Response:**
- Membuat akun TROJAN dengan parameter yang diberikan.

### Buat Akun VMESS
**Request:**
- Method: `GET`
- Path: `/api/create-vmess`
- Query Parameters:
  - `user`: Nama pengguna untuk akun VMESS.
  - `exp`: Durasi masa berlaku akun.
  - `quota`: Kuota data untuk akun.
  - `limitip`: Batas IP untuk akun.

**Response:**
- Membuat akun VMESS dengan parameter yang diberikan.

### Buat Akun VLESS
**Request:**
- Method: `GET`
- Path: `/api/create-vless`
- Query Parameters:
  - `user`: Nama pengguna untuk akun VLESS.
  - `exp`: Durasi masa berlaku akun.
  - `quota`: Kuota data untuk akun.
  - `limitip`: Batas IP untuk akun.

**Response:**
- Membuat akun VLESS dengan parameter yang diberikan.

## Keamanan

API ini menggunakan metode keamanan berikut:

1. **Autentikasi API Key**:
   - Semua permintaan harus menyertakan API key yang valid. API key dapat dikirim melalui header `Authorization` atau sebagai parameter query `api_key`.

2. **Validasi IP**:
   - Hanya IP yang terdaftar yang dapat mengakses endpoint API. IP yang tidak terdaftar akan ditolak.

3. **Metode GET untuk Pengguna dan Pembuatan Akun**:
   - Endpoint `adduser` dan `create` menggunakan metode GET untuk memudahkan integrasi, tetapi tetap memerlukan autentikasi API key dan validasi IP. 


## Install paket yang di butuhkan

  1.`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash`

  2.`source ~/.nvm/nvm.sh`

  3.`vm install node`

  4.`nvm use node`

## Service
pm2 only
