FROM alpine:3.19

RUN apk add --no-cache mysql-client bash coreutils tzdata

# Zona horaria (opcional)
RUN cp /usr/share/zoneinfo/America/Montevideo /etc/localtime

WORKDIR /backup

COPY scripts/backup.sh /backup/backup.sh
COPY scripts/configurar_cron.sh /backup/configurar_cron.sh

RUN chmod +x /backup/backup.sh /backup/configurar_cron.sh

CMD ["bash", "/backup/configurar_cron.sh"]
