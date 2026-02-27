#!/bin/bash
set -e

echo "=== PWA Install ==="

# 1. Bestanden naar webroot
sudo cp -r "$(dirname "$0")" /var/www/html/app 2>/dev/null || \
  { sudo mkdir -p /var/www/html/app && sudo cp -r "$(dirname "$0")/." /var/www/html/app/; }
sudo chown -R www-data:www-data /var/www/html/app
echo "[OK] Bestanden gekopieerd naar /var/www/html/app"

# 2. Database tabel aanmaken + test-gebruiker
mysql -u dev -p'1123Start!' dev_db < "$(dirname "$0")/setup.sql" 2>/dev/null && \
  echo "[OK] Database ingericht" || \
  echo "[SKIP] Database al ingericht of niet beschikbaar"

# 3. Wachtwoord hash aanmaken
echo ""
echo "Kopieer onderstaand hash naar setup.sql om het testwachtwoord bij te werken:"
php -r "echo password_hash('Test1234!', PASSWORD_BCRYPT, ['cost'=>12]) . PHP_EOL;"

echo ""
echo "=== Klaar! Open: http://localhost/app ==="
