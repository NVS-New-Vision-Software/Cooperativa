#!/bin/bash

echo "=== Configurando cron en servidor-backups ==="

# Copiar backup.sh a /usr/local/bin
cp /backup/backup.sh /usr/local/bin/backup.sh
chmod +x /usr/local/bin/backup.sh

# Crear el cronjob (backup diario a las 03:00 AM)
echo "0 3 * * * /usr/local/bin/backup.sh" > /etc/crontabs/root

# Iniciar cron en modo foreground (requerido en Docker)
crond -f
