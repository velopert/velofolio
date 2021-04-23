```
docker exec -it mariadb_db_1 bash
mysql -u root -p
create database velofolio;
grant all privileges on velofolio.* TO 'velofolio'@'%' identified by 'VELOFOLIOISGOOD!';
flush privileges;
```
