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

## Set up mongoDB atlas
https://www.udemy.com/course/the-web-developer-bootcamp/learn/lecture/4474078#questions/6345892

* Create a new project
* Create a new (free) cluster
* Connect to it
  * Username: bobs
  * Password: bmubobs17

# Heroku

* Email: kob123@hotmail.co.uk
* Password: yC22$Qdl%WZD
* Yelp Camp heroku app: https://warm-reaches-48982.herokuapp.com/ | https://git.heroku.com/warm-reaches-48982.git
* Have to add `"start": "node app.js"` to scripts in package.json

## What happens when you run `git push heroku master`
* Pushes the code to heroku and runs the code
* Does an `npm install` to install all packages in package.json
* Runs the start script, i.e. node app.js
* That deploys it to the heroku site / URL

## Run commands on heroku server
* `heroku run <command>`
* e.g. `heroku run ls node-modules` to list the node modules
* If mongoose was missing (because we didn't have it in our package.json) we could run `heroku run npm install mongoose --save`

# Setting Environment Variables
* In the CLI run:
* `export DATABASEURL=mongodb://localhost:27017/yelp_camp_dynamic_price`
* This just works for the local environment. Have to use Heroku config commands to set production environment variables in Heroku.
* A bit like adding a new segment to the PATH variable.