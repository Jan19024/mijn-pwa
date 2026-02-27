-- ── sb_users tabel ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `sb_users` (
  `id`            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `name`          VARCHAR(120)    NOT NULL,
  `email`         VARCHAR(255)    NOT NULL,
  `password_hash` VARCHAR(255)    NOT NULL,
  `created_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Test-gebruiker (wachtwoord: Test1234!) ────────────────────────────────
-- Testgebruiker: ben@demo.nl / Test1234!
INSERT IGNORE INTO `sb_users` (`username`, `email`, `password`) VALUES
('Ben', 'ben@demo.nl', '$2y$12$cWB4z1hfQOkTN4AB4V9Omewvpe.yI1hgj51NCVmArNXpfnanTElyu');
