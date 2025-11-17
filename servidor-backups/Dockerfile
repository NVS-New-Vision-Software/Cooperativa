FROM alpine:3.19

RUN apk add --no-cache mysql-client bash

WORKDIR /backup

COPY scripts/backup.sh /backup/backup.sh
RUN chmod +x /backup/backup.sh

CMD ["bash", "/backup/backup.sh"]
