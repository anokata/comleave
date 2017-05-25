run:
	#python manage.py runserver
	DJANGO_DEBUG=1 python -Wall manage.py runserver

frontinit:
	npm install

front:
	npm run tsc:w

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
	echo NEED sudo systemctl restart emperor.uwsgi
	echo NEED sudo systemctl restart gunicorn.service
	echo NEED sudo systemctl start gunicorn.socket

uwsgie:
	sudo uwsgi --emperor /etc/uwsgi/vassals --uid www-data --gid www-data

start:
	systemctl start emperor.uwsgi

restart:
	systemctl restart emperor.uwsgi

guni:
	gunicorn -w 4 -b 127.0.0.1:8004 comleave.wsgi 

deleteme:
	python manage.py shell < deleteme.py 

deleteall:
	python manage.py shell < deleteall.py 
