// @ts-check
const { test, expect } = require('@playwright/test');

const URL      = 'http://localhost/app';
const EMAIL    = 'bhaitsma@gmail.com';
const PASSWORD = 'Test1234!';

test.describe('PWA Login', () => {

  test('pagina laadt correct', async ({ page }) => {
    await page.goto(URL);
    await expect(page).toHaveTitle(/Mijn App/i);
    await expect(page.locator('#loginBtn')).toBeVisible();
    await expect(page.locator('.app-title')).toHaveText('Mijn App');
  });

  test('login-ikoontje opent modal', async ({ page }) => {
    await page.goto(URL);
    await expect(page.locator('#modal')).not.toHaveClass(/open/);
    await page.click('#loginBtn');
    await expect(page.locator('#modal')).toHaveClass(/open/);
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });

  test('CTA-knop opent ook modal', async ({ page }) => {
    await page.goto(URL);
    await page.click('#ctaLoginBtn');
    await expect(page.locator('#modal')).toHaveClass(/open/);
  });

  test('modal sluit met kruisje', async ({ page }) => {
    await page.goto(URL);
    await page.click('#loginBtn');
    await expect(page.locator('#modal')).toHaveClass(/open/);
    await page.click('#modalClose');
    await expect(page.locator('#modal')).not.toHaveClass(/open/);
  });

  test('modal sluit met Escape-toets', async ({ page }) => {
    await page.goto(URL);
    await page.click('#loginBtn');
    await page.keyboard.press('Escape');
    await expect(page.locator('#modal')).not.toHaveClass(/open/);
  });

  test('foutmelding bij verkeerd wachtwoord', async ({ page }) => {
    await page.goto(URL);
    await page.click('#loginBtn');
    await page.fill('#email', EMAIL);
    await page.fill('#password', 'FoutWachtwoord123');
    await page.click('#submitBtn');
    await expect(page.locator('#errorMsg')).toBeVisible();
    await expect(page.locator('#errorMsg')).toContainText('onjuist');
  });

  test('foutmelding bij leeg formulier', async ({ page }) => {
    await page.goto(URL);
    await page.click('#loginBtn');
    await page.fill('#email', '');
    await page.fill('#password', '');
    await page.click('#submitBtn');
    await expect(page.locator('#errorMsg')).toBeVisible();
  });

  test('succesvol inloggen', async ({ page }) => {
    await page.goto(URL);
    await page.click('#loginBtn');
    await page.fill('#email', EMAIL);
    await page.fill('#password', PASSWORD);
    await page.click('#submitBtn');

    // Modal sluit, avatar verschijnt
    await expect(page.locator('#modal')).not.toHaveClass(/open/);
    await expect(page.locator('#userAvatar')).toBeVisible();
    await expect(page.locator('#loginBtn')).not.toBeVisible();

    // Welkomstkaart toont gebruikersnaam
    await expect(page.locator('#userView')).toBeVisible();
    await expect(page.locator('#userName')).not.toBeEmpty();
  });

  test('toast verschijnt na inloggen', async ({ page }) => {
    await page.goto(URL);
    await page.click('#loginBtn');
    await page.fill('#email', EMAIL);
    await page.fill('#password', PASSWORD);
    await page.click('#submitBtn');
    await expect(page.locator('#toast')).toHaveClass(/show/);
  });

  test('gebruikersmenu opent na klik op avatar', async ({ page }) => {
    await page.goto(URL);
    await page.click('#loginBtn');
    await page.fill('#email', EMAIL);
    await page.fill('#password', PASSWORD);
    await page.click('#submitBtn');
    await expect(page.locator('#userAvatar')).toBeVisible();
    await page.click('#userAvatar');
    await expect(page.locator('#userMenu')).toHaveClass(/open/);
    await expect(page.locator('#menuEmail')).toHaveText(EMAIL);
  });

  test('uitloggen werkt', async ({ page }) => {
    await page.goto(URL);
    await page.click('#loginBtn');
    await page.fill('#email', EMAIL);
    await page.fill('#password', PASSWORD);
    await page.click('#submitBtn');
    await expect(page.locator('#userAvatar')).toBeVisible();

    await page.click('#userAvatar');
    await page.click('#logoutBtn');

    // Terug naar uitgelogde staat
    await expect(page.locator('#loginBtn')).toBeVisible();
    await expect(page.locator('#userAvatar')).not.toBeVisible();
    await expect(page.locator('#guestView')).toBeVisible();
  });

  test('sessie blijft na pagina-herlaad', async ({ page }) => {
    await page.goto(URL);
    await page.click('#loginBtn');
    await page.fill('#email', EMAIL);
    await page.fill('#password', PASSWORD);
    await page.click('#submitBtn');
    await expect(page.locator('#userAvatar')).toBeVisible();

    await page.reload();
    await expect(page.locator('#userAvatar')).toBeVisible();
    await expect(page.locator('#loginBtn')).not.toBeVisible();
  });

  test('manifest.json is bereikbaar', async ({ page }) => {
    const res = await page.goto('http://localhost/app/manifest.json');
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.name).toBeTruthy();
    expect(json.icons).toHaveLength(2);
  });

  test('service worker registreert', async ({ page }) => {
    await page.goto(URL);
    const swRegistered = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return false;
      const reg = await navigator.serviceWorker.getRegistration('/app/');
      return !!reg;
    });
    expect(swRegistered).toBe(true);
  });

});
