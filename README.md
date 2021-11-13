# swpp2021-team14
<br/>

 ## FitVox
[![Build Status](https://travis-ci.com/swsnu/swpp2021-team14.svg?branch=main)](https://travis-ci.com/swsnu/swpp2021-team14)
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

