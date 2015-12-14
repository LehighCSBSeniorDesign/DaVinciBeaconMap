// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
/*
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
*/

angular.module('beacon', ['ionic', 'ngCordovaBeacon'])
    .run(function($ionicPlatform, $cordovaBeacon) {
        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
            cordova.plugins.locationManager.requestWhenInUseAuthorization();
            //beacon.value("beaconStamp", new Date().getTime());
        });
    })

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'template/tabs.html'
        })
        .state('tab.settings', {
            url: '/settings',
            views: {
                'settings': {
                    templateUrl: 'template/settings.html',
                    controller: 'SettingsCtrl'
                }
            }
        })
        .state('tab.beacon-test', {
            url: '/beacon-test',
            views: {
                'settings': {
                    templateUrl: 'template/beacontest.html',
                    //controller: 'FarRangeController'
                }
            }
        })
        .state('tab.change_pv', {
            url: '/change_pv',
            views: {
                'settings': {
                    templateUrl: 'template/change_pv.html',
                    controller: 'CPVCtrl'
                }
            }
        })
        .state('tab.change_fv', {
            url: '/change_fv',
            views: {
                'settings': {
                    templateUrl: 'template/change_fv.html',
                    controller: 'CFVCtrl'
                }
            }
        })
        .state('tab.change_nv', {
            url: '/change_nv',
            views: {
                'settings': {
                    templateUrl: 'template/change_nv.html',
                    controller: 'CNVCtrl'
                }
            }
        })
        .state('tab.cards', {
            url: '/cards',
            views: {
                'cards': {
                    templateUrl: 'template/cards.html',
                    controller: 'DisplayFrontPage'
                }
            }
        })
        .state('tab.area-detail', {
            url: '/cards/:areaId',
            views: {
                'cards': {
                    templateUrl: 'template/exhibits.html',
                    controller: 'DisplayExhibit'
                }
            }
        })
        .state('tab.exhibit-info', {
            url: '/cards/:areaId/:exhibitId',
            views: {
                'cards': {
                    templateUrl: 'template/info.html',
                    controller: 'DisplayExhibitInfo'
                }
            }
        })
        .state('login', {
            url: '/',
            templateUrl: 'template/login.html',
            controller: 'loginCtrl'
        });
    $urlRouterProvider.otherwise('/');
})

.factory('beaconList', function() {
    var beaconss = {};
    var closeBeaconss = {};
    var closeRSSIs = {};
    var eventHandled = [];
    var cardMinorEvents = 0;

    return {
        setBeaconList: function(x) {
            beaconss = x;
        },
        getBeaconList: function() {
            return beaconss;
        },
        setCloseBeaconList: function(x) {
            closeBeaconss = x;
        },
        getCloseBeaconList: function() {
            return closeBeaconss;
        },
        setCloseRSSI: function(x) {
            closeRSSIs = x;
        },
        getCloseRSSI: function() {
            return closeRSSIs;
        },
        addEvents: function(x) {
            eventHandled.push(x);
        },
        eventTriggered: function(x) {
            return eventHandled.indexOf(x);
        },
        setCME: function(x) {
            cardMinorEvents = x;
        },
        getCME: function() {
            return cardMinorEvents;
        }
    }
})

.factory("Settings", function($http) {
    var nearValue;
    var farValue;
    var pollValue;
    /*
        var promise = $http.get('data/settings.json')
            .success(function(data) {
                console.log(data.settings[0]);
                nearValue = data.settings[0].nearValue;
                farValue = data.settings[0].farValue;
                pollValue = data.settings[0].pollingValue;
                console.log(nearValue);
            })*/
    return {
        init: function() {
            return $http.get('data/settings.json')
                .then(function(response) {
                    //console.log(response.data);
                    //console.log(response.data.settings[0]);
                    nearValue = response.data.settings[0].nearValue;
                    farValue = response.data.settings[0].farValue;
                    pollValue = response.data.settings[0].pollingValue;
                    //console.log(nearValue);
                })
        },
        setNV: function(x) {
            nearValue = x;
        },
        getNV: function() {
            return nearValue;
        },
        setFV: function(x) {
            farValue = x;
        },
        getFV: function() {
            return farValue;
        },
        setPV: function(x) {
            pollValue = x;
        },
        getPV: function() {
            return pollValue;
        },
        save: function() {
            //save
        }
    }
})

.controller("BeaconListener", function($scope, $rootScope, $http, $state, $ionicPlatform, $cordovaBeacon, $interval, $ionicModal, beaconList, Settings) {
    Settings.init().then(function() {
        $scope.beacons = {};
        $scope.closeBeacons = {};
        // var closeRSSI = {};
        $scope.closeRSSI = {};
        $scope.cardMinorEvent = 0;
        $rootScope.NV = Settings.getNV();
        $rootScope.FV = Settings.getFV();
        $rootScope.PV = Settings.getPV();
        $ionicModal.fromTemplateUrl('template/modal.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        $scope.forward = function(areaId, exhibitId) {
            $state.go('tab.exhibit-info', {'areaId':areaId, 'exhibitId':exhibitId});
            $scope.modal.hide();
        };
        //console.log($scope.NV);
        var poll = false;
        var minPicker = function() {
            var min = -9999;
            var minKey = -1;
            angular.forEach($scope.closeRSSI, function(key, value) {
                if (key > min && key < 0) {
                    min = key;
                    minKey = value;
                }
                console.log(key + " " + value);

            });
            //$scope.test = beaconList.getCME();
            /*
            if(beaconList.getCME() == minKey) {
                $scope.test = beaconList.getCME();
            }*/

            if ($scope.cardMinorEvent == minKey && beaconList.eventTriggered(minKey) == -1) {
                //pop up card and add to array
                //$scope.show = function() {
                $http.get('data/exhibits.json')
                    .success(function(data) {
                        $scope.ei = minKey-1;
                        $scope.ai = 1;
                        $scope.name = data.area[1].exhibits[minKey-1].name;
                        $scope.info = data.area[1].exhibits[minKey-1].info;
                        $scope.picture = data.area[1].exhibits[minKey-1].picture;
                        $scope.modal.show();
                    });
                beaconList.addEvents(minKey);
                //};
            }
            $scope.cardMinorEvent = minKey;
            beaconList.setCME(minKey);
            poll = false;
        };
        $scope.isPoll = "No";
        $scope.currentTime = 0;

        var tick = function() {
            //$scope.currentTime = parseInt((Date.now() / 1000) % 60) + 1;
            $scope.currentTime += 1;
            if ($scope.currentTime % $rootScope.PV === 0) {
                $scope.isPoll = "Yes";
                minPicker();

            } else {
                $scope.isPoll = "No";
            }
            if ($scope.currentTime >= 60) {
                $scope.currentTime = 0;
            }
        }
        tick();
        $interval(tick, 1000);
        $ionicPlatform.ready(function() {
            $cordovaBeacon.requestAlwaysAuthorization();
            //cordova.plugins.locationManager.requestWhenInUseAuthorization();
            $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function(event, pluginResult) {
                var uniqueBeaconKey;
                for (var i = 0; i < pluginResult.beacons.length; i++) {
                    var currentRSSI = pluginResult.beacons[i].rssi;
                    var currentMinor = pluginResult.beacons[i].minor;
                    var currentMajor = pluginResult.beacons[i].major;

                    //uniqueBeaconKey = pluginResult.beacons[i].uuid + ":" + pluginResult.beacons[i].major + ":" + pluginResult.beacons[i].minor;
                    if (currentRSSI > $rootScope.FV) {
                        $scope.beacons[currentMinor] = currentMajor;
                        beaconList.setBeaconList($scope.beacons);
                        if (currentRSSI > $rootScope.NV) {
                            $scope.closeBeacons[currentMinor] = currentMajor;
                            delete $scope.beacons[currentMinor];
                            beaconList.setCloseBeaconList($scope.closeBeacons);
                            //closeRSSI[currentMinor] = currentRSSI;
                            $scope.closeRSSI[currentMinor] = currentRSSI;
                            beaconList.setCloseRSSI($scope.closeRSSI);
                        } else {
                            // closeRSSI[currentMinor] = 0;
                            $scope.closeRSSI[currentMinor] = currentRSSI;
                            beaconList.setCloseRSSI($scope.closeRSSI);
                            if (currentMinor in $scope.closeBeacons) {
                                delete $scope.closeBeacons[currentMinor];
                                beaconList.setCloseBeaconList($scope.closeBeacons);
                            }
                        }
                    } else {
                        if (currentMinor in $scope.beacons) {
                            delete $scope.beacons[currentMinor];
                            beaconList.setBeaconList($scope.beacons);
                        }
                        if (currentMinor in $scope.closeBeacons) {
                            delete $scope.closeBeacons[currentMinor];
                            beaconList.setBeaconList($scope.beacons);
                        }

                    }

                    // uniqueBeaconKey = pluginResult.beacons[i].uuid + ":" + pluginResult.beacons[i].major + ":" + pluginResult.beacons[i].minor;
                    // $scope.beacons[uniqueBeaconKey] = pluginResult.beacons[i];
                }
                // if(poll){
                //     minPicker();
                // }



                $scope.$apply();
            });
            $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("kontakt1", "f7826da6-4fa2-4e98-8024-bc5b71e0893e"));
        });
    })
})

.controller('SettingsCtrl', function($scope, $ionicModal, $cordovaBeacon) {
    $ionicModal.fromTemplateUrl('template/modal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.closeModal = function() {
        $scope.modal.hide();
    }

    $scope.show = function() {
        $scope.modal.show();
    };
    $scope.requestAuth = function() {
        $cordovaBeacon.requestAlwaysAuthorization();

    };
})

.controller('loginCtrl', function($scope, $state) {
    $scope.submitForm = function() {
        $state.go('tab.cards');
    }
})

.controller('CPVCtrl', function($scope, $rootScope, $state, Settings) {
        $scope.submitForm = function(response) {
            //console.log(response);
            Settings.setPV(response);
            $rootScope.PV = Settings.getPV();
            $state.go('tab.settings');
        }
    })
    .controller('CFVCtrl', function($scope, $rootScope, $state, Settings) {
        $scope.submitForm = function(response) {
            Settings.setFV(response);
            $rootScope.FV = Settings.getFV();
            $state.go('tab.settings');
        }
    })
    .controller('CNVCtrl', function($scope, $rootScope, $state, Settings) {
        $scope.submitForm = function(response) {
            Settings.setNV(response);
            $rootScope.NV = Settings.getNV();
            $state.go('tab.settings');
        }
    })

.controller('DisplayFrontPage', function($scope, $http) {
    $http.get('data/areas.json')
        .success(function(data) {
            // The json data will now be in scope.
            //$scope.datas = data.areas;
            $scope.splitData = splitData(data.areas, 2);
            //console.log($scope.splitData);
        });

})

.controller('DisplayExhibit', function($scope, $http, $stateParams, beaconList) {
    $http.get('data/exhibits.json')
        .success(function(data) {
            // The json data will now be in scope.
            //$scope.datas = data.area;
            //console.log($stateParams.areaId);
            //console.log(data.area[$stateParams.areaId].exhibits);
            $scope.areaId = $stateParams.areaId;
            $scope.splitData = splitData(data.area[$stateParams.areaId].exhibits, 3);
            //console.log($scope.splitData);
            var beacons = beaconList.getBeaconList();
            var closeBeacons = beaconList.getCloseBeaconList();
            $scope.beacons = beacons;
            $scope.closeBeacons = closeBeacons;
            $scope.checkGreen = function(x) {
                for (key in closeBeacons) {
                    if (key == x) {
                        return true;
                    }
                }
                return false;
            };
            $scope.checkYellow = function(x) {
                /*
                for (key in closeBeacons) {
                    if (key == x) {
                        return false;
                    }
                }*/
                for (key in beacons) {
                    if (key == x) {
                        return true;
                    }
                }
                return false;
            };
        });
})

.controller('DisplayExhibitInfo', function($scope, $http, $stateParams) {
    $http.get('data/exhibits.json')
        .success(function(data) {
            //console.log($stateParams.areaId);
            //console.log($stateParams.exhibitId);
            //console.log(data.area[$stateParams.areaId].exhibits[$stateParams.exhibitId]);
            $scope.name = data.area[$stateParams.areaId].exhibits[$stateParams.exhibitId].name;
            $scope.picture = data.area[$stateParams.areaId].exhibits[$stateParams.exhibitId].picture;
            $scope.info = data.area[$stateParams.areaId].exhibits[$stateParams.exhibitId].info;
        })

});

function splitData(arr, size) {
    var newArr = [];
    for (var i = 0; i < arr.length; i += size) {
        newArr.push(arr.slice(i, i + size));
    }
    return newArr;
};
