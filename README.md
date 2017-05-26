Overwork/unwork registration and accept web app

App allow do jobs like:

    - Register and login new users(also with ldap account)
    - Show summary, filter data by user.
    - Register work/not work time interval. 

In manager account:

    - Accept, deny, delete, particully edit work interval request.
    - View all requests and filter it.

App would send mail notify if email setted in user and manager accounts.



Frontend: Angular 2

Backend:  Django

DB:       Postgresql

Webserver: nginx

Wsgi: gunicorn/uwsgi

Development environment preparing:

    pip install -r requirements.txt
	python manage.py createsuperuser
	python manage.py migrate
    cd front
    npm install

Compile frontend:

    cd front
	npm run tsc

Prepare deploy:

	python manage.py collectstatic
