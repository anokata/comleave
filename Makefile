run:
	python manage.py runserver

front:
	npm start

testquery:
	sudo -u postgres psql -d django_comleave -f query.sql 
