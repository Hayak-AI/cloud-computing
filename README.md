# Panduan Pengguna

Panduan ini akan membantu Anda untuk menyiapkan lingkungan pengembangan dan konfigurasi yang diperlukan untuk menjalankan aplikasi Hayak-AI

## 1. Persiapan Environment

### 1.1. Clone Repository
Pertama, clone repository ini ke mesin lokal Anda menggunakan perintah berikut:

```bash
git clone  https://github.com/Hayak-AI/cloud-computing.git
cd cloud-computing
```

### 1.2. Install Dependencies
Pastikan memiliki **Node.js** dan **npm** yang terpasang. Jika belum, dapat mengunduhnya dari [situs resmi Node.js](https://nodejs.org/).

Setelah itu, instal semua dependencies dengan menjalankan perintah berikut:

```bash
npm install
```

### 1.3. Menyiapkan File `.env`

Di dalam proyek, Anda akan melihat sebuah file contoh `.env.example`. Salin file ini menjadi `.env` dan sesuaikan dengan pengaturan lokal Anda. File `.env` berisi konfigurasi sensitif yang digunakan oleh aplikasi, seperti koneksi ke database, kunci API, dan pengaturan JWT.

```bash
cp .env.example .env
```

Buka file `.env` dan sesuaikan dengan detail yang diperlukan, seperti dijelaskan di bawah ini.

### 1.4. Konfigurasi Environment Variables

Berikut adalah penjelasan untuk setiap konfigurasi dalam file `.env` :

#### 1. **JWT_SECRET**
Secret key untuk **JSON Web Token** (JWT). Ini digunakan untuk menandatangani dan memverifikasi token yang digunakan dalam otentikasi.

```bash
JWT_SECRET=your_jwt_secret_key
```

**Catatan**: Gantilah `your_jwt_secret_key` dengan kunci rahasia yang kuat.

#### 2. **Database Configuration**
Konfigurasi untuk menghubungkan aplikasi ke **MySQL** atau **MariaDB**.

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=db_hayak
```

- `DB_HOST`: Alamat host database (biasanya `localhost` jika Anda menjalankan database di mesin yang sama).
- `DB_USER`: Username untuk mengakses database (misalnya `root`).
- `DB_PASSWORD`: Password untuk database Anda.
- `DB_NAME`: Nama database yang akan digunakan oleh aplikasi.

#### 3. **Server Configuration**
Konfigurasi untuk port dan host aplikasi.

```bash
PORT=3000
HOST=localhost
```

- `PORT`: Port di mana aplikasi akan berjalan. Defaultnya adalah `3000`.
- `HOST`: Host tempat aplikasi berjalan (biasanya `localhost`).

#### 4. **JWT_EXPIRES_IN**
Durasi kadaluarsa token JWT. Anda bisa mengatur ini sesuai kebutuhan.

```bash
JWT_EXPIRES_IN=30d
```

Token JWT ini akan kadaluarsa dalam 30 hari.

#### 5. **Google Cloud Configuration**
Untuk menghubungkan aplikasi dengan Google Cloud (misalnya untuk penyimpanan file di **Cloud Storage**), Anda memerlukan **Google Cloud Project ID** dan **Service Account Key**.

```bash
GCLOUD_PROJECT_ID=your_project_id
GCLOUD_KEY_FILENAME=path/to/your/serviceaccountkey.json
GCLOUD_BUCKET_NAME=your_bucket_name
```

- `GCLOUD_PROJECT_ID`: ID proyek Anda di Google Cloud.
- `GCLOUD_KEY_FILENAME`: Lokasi file JSON **Service Account Key** yang Anda unduh dari Google Cloud Console. Pastikan file ini memiliki izin yang sesuai untuk mengakses layanan Google Cloud yang Anda butuhkan.
- `GCLOUD_BUCKET_NAME`: Nama bucket Google Cloud Storage yang akan digunakan oleh aplikasi.

#### 6. **SMTP Email Configuration**
Untuk mengirim email menggunakan **SMTP** (misalnya untuk mengirimkan email verifikasi atau reset password), Anda perlu menyiapkan akun email SMTP.

```bash
SMTP_EMAIL_USER=email_example@gmail.com
SMTP_EMAIL_PASS=your_email_password
```

- `SMTP_EMAIL_USER`: Alamat email yang digunakan untuk mengirimkan email.
- `SMTP_EMAIL_PASS`: Password untuk akun email yang digunakan (pastikan Anda menggunakan password yang aman).

---

#### 7. **Custom Search API Configuration**
Jika aplikasi Anda membutuhkan akses ke Google Custom Search API, Anda perlu mengonfigurasi kunci API dan ID mesin pencarian.

```bash
CUSTOM_SEARCH_API_KEY=your_custom_search_api_key
CUSTOM_SEARCH_ENGINE_ID=your_custom_search_engine_id
CUSTOM_SEARCH_QUERY="search_query"
```

## 2. Mendapatkan ID Proyek Google Cloud

Untuk menggunakan layanan Google Cloud, Anda perlu memiliki **Google Cloud Project**. Ikuti langkah-langkah berikut untuk mendapatkan ID Proyek Anda:

### 2.1. Membuat Proyek di Google Cloud

1. Kunjungi [Google Cloud Console](https://console.cloud.google.com/).
2. Klik **"Select a Project"** di bagian atas layar.
3. Klik **"New Project"**.
4. Beri nama proyek Anda, dan pilih lokasi atau organisasi jika diperlukan.
5. Klik **"Create"**.

### 2.2. Mengaktifkan API yang Diperlukan

Jika aplikasi Anda membutuhkan API tertentu, pastikan untuk mengaktifkan API yang relevan:

1. Masuk ke [API Library](https://console.cloud.google.com/apis/library).
2. Cari API yang Anda perlukan (misalnya **Google Cloud Storage API**) dan aktifkan.

### 2.3. Membuat Service Account dan Mendapatkan Key

Untuk mengakses layanan Google Cloud dengan aplikasi Anda, Anda perlu membuat **Service Account** dan mengunduh **JSON key**:

1. Buka [Google Cloud Console - Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts).
2. Pilih proyek yang sesuai.
3. Klik **Create Service Account**.
4. Beri nama untuk service account dan tentukan peran yang sesuai (misalnya **Storage Admin** untuk akses penuh ke Cloud Storage).
5. Setelah service account dibuat, klik pada **Actions** dan pilih **Create Key**.
6. Pilih **JSON** untuk format kunci, lalu klik **Create** untuk mengunduh file kunci.

File JSON inilah yang akan Anda tempatkan di path yang sesuai, seperti yang disebutkan dalam file `.env`.

---

## 3. Menjalankan Aplikasi

Setelah Anda menyiapkan semuanya, Anda dapat menjalankan aplikasi dengan perintah berikut:

```bash
npm start
```

Aplikasi akan berjalan pada **`http://localhost:3000`** jika Anda menggunakan pengaturan default.

---

## 4. Testing Endpoints

Setelah aplikasi berjalan, Anda dapat mencoba beberapa endpoint menggunakan tools seperti [Postman](https://www.postman.com/) atau **curl**. Pastikan untuk menyertakan token JWT di header `Authorization` saat melakukan permintaan yang memerlukan autentikasi.

---

## 5. Troubleshooting

Jika Anda mengalami kesalahan atau masalah lainnya, berikut adalah beberapa langkah untuk memecahkan masalah:

1. Periksa kembali konfigurasi file `.env` dan pastikan semua informasi sudah benar.
2. Pastikan koneksi ke database sudah benar dan berjalan.
3. Periksa log aplikasi untuk melihat jika ada error yang tercatat di konsol.

---

**Semoga panduan ini membantu Anda untuk memulai dengan aplikasi ini! Jika ada pertanyaan lebih lanjut, jangan ragu untuk membuka issue di repository ini atau menghubungi pengembang.**

--- 

