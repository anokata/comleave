test:
	python manage.py test
run:
	(. env/bin/activate; DJANGO_DEBUG=1 python2 -Wall manage.py runserver)

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
	virtualenv env -p python2
	(. env/bin/activate; pip install --upgrade pip; pip install -r requirements.txt)

init: _env_init frontinit


.PHONY: front
