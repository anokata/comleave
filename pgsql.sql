create role test password 'B070L<Mf4j9O15G' login;
create database django_comleave;
grant all on database django_comleave to test;
add to pg_hba.conf
local all test md5
host all test 127.0.0.1/32 password

sudo systemctl restart postgresql-9.5
