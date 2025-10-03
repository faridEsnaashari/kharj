CREATE USER 'metabase'@'%' IDENTIFIED BY '13578642@@Fme';
CREATE USER 'metabase'@'localhost' IDENTIFIED BY '13578642@@Fme';
ALTER USER 'metabase'@'%' IDENTIFIED WITH mysql_native_password BY '13578642@@Fme';
FLUSH PRIVILEGES;
GRANT SELECT ON *.* TO 'metabase'@'%';
GRANT SELECT ON *.* TO 'metabase'@'localhost';
CREATE DATABASE kharjdb;
