<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

session_start();

// ── Config (uit global-config) ─────────────────────────────────────────────
const DB_HOST = 'localhost';
const DB_USER = 'dev';
const DB_PASS = '';
const DB_NAME = 'dev_db';

function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]
        );
    }
    return $pdo;
}

function json_out(array $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function current_user(): ?array {
    if (empty($_SESSION['user_id'])) return null;
    try {
        $stmt = db()->prepare('SELECT id, username, email FROM sb_users WHERE id = ? LIMIT 1');
        $stmt->execute([$_SESSION['user_id']]);
        return $stmt->fetch() ?: null;
    } catch (Throwable) {
        return null;
    }
}

// ── Router ─────────────────────────────────────────────────────────────────
$action = $_GET['action'] ?? '';

match ($action) {
    'check'  => action_check(),
    'login'  => action_login(),
    'logout' => action_logout(),
    default  => json_out(['error' => 'Onbekende actie'], 400),
};

// ── Acties ─────────────────────────────────────────────────────────────────

function action_check(): never {
    $user = current_user();
    if ($user) {
        json_out(['loggedIn' => true, 'user' => ['name' => $user['username'], 'email' => $user['email']]]);
    }
    json_out(['loggedIn' => false]);
}

function action_login(): never {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_out(['success' => false, 'message' => 'POST verwacht'], 405);
    }

    $raw  = file_get_contents('php://input');
    $body = json_decode($raw, true);

    // Fallback: form-encoded POST of lege body
    if (!is_array($body)) {
        $email    = trim((string)($_POST['email']    ?? ''));
        $password = (string)($_POST['password'] ?? '');
    } else {
        $email    = trim((string)($body['email']    ?? ''));
        $password = (string)($body['password'] ?? '');
    }

    if ($email === '' || $password === '') {
        json_out(['success' => false, 'message' => 'Vul alle velden in.']);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_out(['success' => false, 'message' => 'Ongeldig e-mailadres.']);
    }

    try {
        $stmt = db()->prepare('SELECT id, username, email, password FROM sb_users WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        $user = $stmt->fetch();
    } catch (Throwable $e) {
        json_out(['success' => false, 'message' => 'Databasefout: ' . $e->getMessage()]);
    }

    if (!$user || !password_verify($password, $user['password'])) {
        // Zelfde bericht voor onbekend e-mail of fout wachtwoord (security)
        json_out(['success' => false, 'message' => 'E-mailadres of wachtwoord onjuist.']);
    }

    session_regenerate_id(true);
    $_SESSION['user_id'] = $user['id'];

    json_out([
        'success' => true,
        'user'    => ['name' => $user['username'], 'email' => $user['email']],
    ]);
}

function action_logout(): never {
    $_SESSION = [];
    session_destroy();
    json_out(['success' => true]);
}
