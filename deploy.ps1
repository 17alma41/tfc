$remotePath = "root@172.233.117.251:/root/tfc"

# Crear directorio si no existe
ssh root@172.233.117.251 "mkdir -p /root/tfc"

# Copiar archivos
scp -r ./backend $remotePath/
scp -r ./frontend $remotePath/
scp -r ./caddy $remotePath/
scp docker-compose.yml $remotePath/
scp database.sqlite $remotePath/
