```
docker exec -it mariadb_db_1 bash
mysql -u root -p
create database velopolio;
grant all privileges on velopolio.* TO 'velopolio'@'%' identified by 'VELOPOLIOISGOOD!';
flush privileges;
```
