# swpp2021-team14
<br/>

 ## FitVox
[![Build Status](https://app.travis-ci.com/swsnu/swpp2021-team14.svg?branch=main)](https://app.travis-ci.com/swsnu/swpp2021-team14)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swpp2021-team14&metric=alert_status)](https://sonarcloud.io/dashboard?id=swsnu_swpp2021-team14)
[![Coverage Status](https://coveralls.io/repos/github/swsnu/swpp2021-team14/badge.svg?branch=main)](https://coveralls.io/github/swsnu/swpp2021-team14?branch=main&service=github)



Below sections explain how you run the application and tests for each sprint.



## Sprint2

After cloning the repository, you should run the following commands to run the application.

```shell
cd swpp2021-team14
cd fitvoxfrontend
yarn #Install dependencies
yarn run backend #Run json server
yarn start #Run react app
```

* For the Sprint2, you can only login with the following email and password.

  * email: swpp@snu.ac.kr
  * password: iluvswpp
  * Created new account will be added to json server, but as we didn't implemented the proper authentication yet, signing in using the new account will not be suppoted.

  

To test the application, run the following commands on the `fitvoxfrontend` directory. For the Sprint2, we only support the frontend unittest as we didn't implemened the backend yet, specifically only for the features that we implemented in the Sprint.

```shell
yarn test --coverage --watchAll=false
```

## Sprint3

After cloning the repository, you should run the following commands to run the application.

### Run frontend server
```shell
cd swpp2021-team14
cd fitvoxfrontend
yarn #Install dependencies
yarn start #Run react app
```

### Run backend server
```shell
cd swpp2021-team14
cd fitvoxbackend
python manage.py runserver # Run Django Backend Server
```

* For sprint 3, you can login with default user
  * username: test
  * password: password
* Or you can login with your own account after create one in Create Account page
* You can change personal settings for exercise hardness and default break time in setting page, search exercises through exericse_list page, and add new exercise in add page

To test frontend of the application, run the following commands on the `fitvoxfrontend` directory. In sprint3 we support frontend features except `CreateAccount.js` and `actionCreators`

```shell
yarn test --coverage --watchAll=false
```

To test backend of the application, run the following commands on `fitvoxbackend` directory. Make sure that your python version is more than 3.7.0

```shell
coverage run --source='./Fitvox' manage.py test
```



## Sprint4

After cloning the repository, you should run the following commands to run the application.

### Run frontend server

```shell
cd swpp2021-team14
cd fitvoxfrontend
yarn install #Install dependencies
yarn start #Run react app
```

### Run backend server

```shell
cd swpp2021-team14
cd fitvoxbackend
pip install -r requirements.txt
python manage.py makemigrations Fitvox
python manage.py migrate
python manage.py runserver # Run Django Backend Server
```

### Features

* For sprint 4, you can login with default user

  * username: test
  * password: password

* Or you can login with your own account after create one in Create Account page

* You can change personal settings for exercise hardness and default break time in setting page, search exercises through exericse_list page, and add new exercise in add page

* You can use Menu button on the right top of the page to move to the proper page.

* You can check favorite exercises in exercise list page, but this feature has minor errors and will improved in Sprint5.

* After selecting muscle type and exercise type, and by adding some tags, you can see the statistics for the selected exercises. 

* After selecting exercise in exercise list page, you may see the detail for the exercise. You may see the statistics for the exercise, and may modify tags or mark the exercise as favorite.

* If you click the appropriate date on the calendar of main page and click the move button, you can see the workout detail for the date.

* You can do following jobs in the workout detail page for the date.

  * You can add the body information of the date if you want. 
  * You can add or delete an exercise to the workout using the same query system as in the exercis list page.
  * You can add, modify, or delete the set information for each exercise in the workout.

  

To test frontend of the application, run the following commands on the `fitvoxfrontend` directory. In sprint4 we support tests for frontend features except `CreateAccount.js`.

```shell
# yarn add coveralls
yarn test --coverage --watchAll=false
```

To test backend of the application, run the following commands on `fitvoxbackend` directory. Make sure that your python version is more than 3.7.0.

```shell
# pip install coveralls
coverage run --source='./Fitvox' manage.py test
```

