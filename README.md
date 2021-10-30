# swpp2021-team14
<br/>

 ## FitVox
[![Build Status](https://travis-ci.com/swsnu/swpp2021-teamX.svg?branch=main)](https://travis-ci.com/swsnu/swpp2021-team14)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swpp2021-team14&metric=alert_status)](https://sonarcloud.io/dashboard?id=swsnu_swpp2021-team14)



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

