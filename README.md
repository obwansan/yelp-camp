# MongoDB

## Starting up mondb processes

### mongod
To start the mongo daemon, enter the command `mongod` in a new tab.

If you get an error saying 'address already in use':

* Search for a list of tasks running on your machine by typing
* `sudo lsof -iTCP -sTCP:LISTEN -n -P`

* Search for mongod COMMAND and its PID and type:
* `sudo kill <mongo_command_pid>`

* Now start your mongod instance by typing:
* `mongod`

### mongo
To open an instance of the mongo shell, enter the command `mongo` in a new tab.

## Starting up the server
Run `node app.js` or `nodemon` (if you've installed it).

# Heroku

* Email: kob123@hotmail.co.uk
* Password: yC22$Qdl%WZD
* Yelp Camp heroku app: https://warm-reaches-48982.herokuapp.com/ | https://git.heroku.com/warm-reaches-48982.git
* Have to add `"start": "node app.js"` to scripts in package.json