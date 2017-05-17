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
