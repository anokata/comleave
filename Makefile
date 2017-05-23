run:
	python manage.py runserver

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
	cd front
	npm install
	npm run tsc
	cd ..
	python manage.py collectstatic
