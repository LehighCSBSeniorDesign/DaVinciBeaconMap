## DaVinci iBeacon User Manual ##

The manual below discusses how to setup and manage the platform that we used to build our project. This section is broken into two parts.

**Part 1:** Working with Kontakt.io to manage iBeacons.
	To manage the major, minor, power level and tx value of all beacons you will need access to the management console of kontakt.io 
	

 - Go to the [Control Panel](https://panel.kontakt.io/signin)
 - To log on to the admin panel use the password and username given to instructor
 - You can also create a profile for yourself and the admin can manage roles for you
 - Can I change the value of major and minor id? [Yes you can](https://support.kontakt.io/hc/en-gb/articles/201620741-iBeacon-Parameters-UUID-Major-and-Minor) 

**Part 2:** Setup app environment to run the app
	
	Prerequisites
	

 - [Node](https://nodejs.org/en/)
 - A github account
 - [Ionic](http://ionicframework.com/getting-started/)
 - Tools needed to compile Android or iOS apps

Steps

 1. Clone the repo from [here](https://github.com/LehighCSBSeniorDesign/DaVinciBeaconMap)
 2. On command line type `cordova plugin add https://github.com/petermetz/cordova-plugin-ibeacon.git`
 3. Followed by `ionic platform add android` or ios (if you have a Mac and need to make it for iOS
 4. Then build `ionic build`
 5. You can check out the web-based view of the app using`ionic serve`
 6. Finally connect your device to your laptop and type `ionic run` to load the app to your device [needs bluetooth to be on for correct functionality

**Part 3: Design Description**

The logic of the app (which is commented on the code itself) is as follows. The iBeacon controller in app.js uses the rssi value to capture beacons that are either right next to the beacon (immediate) or are nearby. After 20 seconds a event is triggered that finds the closest beacon the user is next to. This event displays a card on the front face.

**Part 4: Possible Next Steps**

 - Integrate A better datastore for beacon content
 - Generate proper authentication for customers and admins. The app right now just has the admin view which will need to be hidden
 - Fix issue with edge polling. Beacons that are just beyond the fence by a small deviation will still bounce in and out of range. Given more time we could've designed a cache to hold recently out of range beacons and remove them from the event table if they are recently placed on said cache.

