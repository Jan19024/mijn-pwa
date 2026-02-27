# Mijn PWA

Eenvoudige Progressive Web App met login, gebouwd op PHP 8 / Vanilla JS / Glassmorphism.

## Functies

- Login-ikoontje rechtsboven → glassmorphism modal
- Sessie-authenticatie via PHP en `sb_users` tabel
- Gebruikersmenu met uitloggen
- Installeerbaar als PWA (manifest + service worker)
- 14 geautomatiseerde Playwright browsertests

## Stack

- **Frontend:** Vanilla JS, CSS Glassmorphism
- **Backend:** PHP 8.3, PDO
- **Database:** MySQL / MariaDB (`sb_users`)
- **Tests:** Playwright (Chromium)

## Installatie

### Vereisten
- Apache + PHP 8.3
- MySQL / MariaDB
- Node.js 20+

### Stappen

```bash
# 1. Bestanden naar webroot
sudo cp -r . /var/www/html/app
sudo chown -R www-data:www-data /var/www/html/app

# 2. Database inrichten
sudo mysql <<'SQL'
CREATE DATABASE IF NOT EXISTS dev_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'dev'@'localhost' IDENTIFIED BY 'jouw-wachtwoord';
GRANT ALL ON dev_db.* TO 'dev'@'localhost';
FLUSH PRIVILEGES;
SQL

sudo mysql dev_db < setup.sql

# 3. Dependencies installeren (voor tests)
npm install
```

Open vervolgens **http://localhost/app**

## Tests uitvoeren

```bash
npx playwright test
```

Alle 14 tests slagen bij een correcte installatie.

## Projectstructuur

```
app/
├── index.html          # PWA hoofdpagina
├── manifest.json       # PWA manifest
├── sw.js               # Service worker
├── api/
│   └── auth.php        # Login / logout / sessie-check
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
├── tests/
│   └── login.spec.js   # Playwright tests
└── setup.sql           # Database schema
```
