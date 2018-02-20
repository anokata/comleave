test:
	python manage.py test
run:
	(. env/bin/activate; DJANGO_DEBUG=1 python -Wall manage.py runserver 0.0.0.0:9005)

frontinit:
	(cd front; npm install)

front:
	(cd front; npm run tsc:w)

testquery:
	watch -n1 sudo -u postgres psql -d django_comleave -f query.sql 

migrate:
	python manage.py migrate

# new install
# add superuser
# migrate
# init front
# compile front
# init db
# create user
# config static
uwsgi:
	uwsgi comleave_uwsgi.ini

install:
	python manage.py createsuperuser
	#create manager

deploy:
	python manage.py migrate
	(cd front; npm run tsc)
	python manage.py collectstatic
#	sudo systemctl restart emperor.uwsgi
	#sudo systemctl restart emperor.uwsgi
	sudo systemctl restart gunicorn.service
	sudo systemctl restart gunicorn.socket

uwsgie:
	sudo uwsgi --emperor /etc/uwsgi/vassals --uid www-data --gid www-data

start:
	systemctl start emperor.uwsgi

restart:
	systemctl restart emperor.uwsgi

guni:
	gunicorn -w 4 -b 127.0.0.1:8004 comleave.wsgi 

deleteme:
	python manage.py shell < scripts/deleteme.py 

deleteall:
	python manage.py shell < scripts/deleteall.py 

addmany:
	python manage.py shell < scripts/addmany.py 

adddata:
	python manage.py shell < scripts/adddata.py 

test:
	python manage.py test

prod_restart:
	sudo systemctl restart gunicorn.service
	sudo systemctl restart gunicorn.socket

_env_init:
	virtualenv env -p python
	(. env/bin/activate; pip install --upgrade pip; pip install -r requirements.txt)

_db_init:
	sudo -u postgres psql -c "create role test with password 'test' login;" || true
	sudo -u postgres psql -c "create database django_comleave owner test;"
	(. env/bin/activate; python manage.py migrate)

backup:
	pg_dump -U test django_comleave | gzip > /tmp/comleave.sql.gz

backup_test:
	PGPASSWORD=Test pg_dump -U test django_comleave | gzip > /tmp/comleave.sql.gz

backup_prod:
	sudo -u postgres /usr/pgsql-9.6/bin/pg_dump django_comleave | gzip > /tmp/comleave.sql.gz
	mv /tmp/comleave.sql.gz ../

init: _env_init frontinit _db_init


.PHONY: front
