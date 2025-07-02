# 🚀 Discord MySQL Backup Bot

![Banner](https://avocato.isfucking.pro/9tQaw3.webp)

<div align="center">
  <b>Ein moderner Discord-Bot für automatische MySQL-Backups mit Slash Commands!</b><br>
  <i>A modern Discord bot for automatic MySQL backups with slash commands!</i>
</div>

---

## 🌟 Features / Funktionen

- Slash Commands für Backups & Restore
- Auswahl der Datenbank per Dropdown
- Backups mit fortlaufender ID (#1, #2, ...)
- Restore per Dropdown oder ID
- Übersichtliche Backup-Liste als Embed
- Automatische Ordner-Erstellung
- Schöne Embeds mit Status & Infos

---

## 🇩🇪 Einrichtung (Deutsch)

1. **Repository klonen:**
   ```bash
   git clone https://github.com/BenlaxerDev/discord_mysql_backup_bot.git
   cd discord_mysql_backup_bot
   ```
2. **Abhängigkeiten installieren:**
   ```bash
   npm install
   ```
3. **Konfiguration:**
   - Bearbeite `config/default.json` mit deinen Discord- und MySQL-Daten.
4. **Bot starten:**
   ```bash
   node index.js
   ```
5. **Slash Commands nutzen:**
   - `/backup` – Backup erstellen
   - `/restore` – Backup wiederherstellen
   - `/listbackups` – Alle Backups anzeigen

---

## 🇬🇧 Setup (English)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/BenlaxerDev/discord_mysql_backup_bot.git
   cd discord_mysql_backup_bot
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure:**
   - Edit `config/default.json` with your Discord and MySQL credentials.
4. **Start the bot:**
   ```bash
   node index.js
   ```
5. **Use Slash Commands:**
   - `/backup` – Create a backup
   - `/restore` – Restore a backup
   - `/listbackups` – Show all backups

---

## 📸 Beispiel / Example

![Beispiel-Embed](https://avocato.isfucking.pro/T7FsnV.png)

---

## ⚠️ Hinweise / Notes

- Stelle sicher, dass der MySQL-Client (`mysql`) im System-PATH ist!
- Nur für private/test Server empfohlen – keine sensiblen Daten öffentlich sichern!
- Für geplante Backups kann `node-cron` genutzt werden.

---

## 💡 Mitmachen / Contribute

Pull Requests und Ideen sind willkommen! / Pull requests and ideas are welcome!

---

<div align="center">
  <b>Made with ❤️ by BenlaxerDev</b>
</div> 
