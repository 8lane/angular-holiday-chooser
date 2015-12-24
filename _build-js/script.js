// @codekit-prepend "snowstorm.js"
// @codekit-prepend "angular.min.js"
// @codekit-prepend "angular-route.js"
// @codekit-prepend "angular-animate.js"

angular.module('holidayApp', ['ngRoute', 'ngAnimate'])
 
.controller('mainController', function($scope, $http, $q, getData) {

	snowStorm.snowColor = '#d6e3f1';
	snowStorm.targetElement = 'snow';
  
	$scope.options = {
		introTitle: null,
		introDesc: null
	};

	$scope.holiday = {
		user: {},
		choices: {},
		showChoices: false
	};

	getData.fetch().then(function(ret) {
		if (typeof ret.data.choices !== "undefined" && typeof ret.data.options !== "undefined") {
			$scope.holiday.choices = ret.data.choices;
			$scope.options = ret.data.options;

			if ($scope.options.enableSignup) {
				$scope.holiday.user.set = false;
			} else {
				$scope.holiday.user.set = true;
				$scope.holiday.user.name = $scope.options.recipient;
			}
		}
	});

})

.controller('holidayUser', function($scope) {

	$scope.submit = function() {
		$scope.holiday.user.set = true;
	}

})

.controller('holidayIntro', function($scope) {
	$scope.showIntro = true;
	$scope.showIntroStep1 = true;

	$scope.nextStep = function(step) {
		$scope['showIntroStep'+parseInt(step-1)+''] = false;
		$scope['showIntroStep'+step+''] = true;
	}

	$scope.finishIntro = function(step) {
		$scope['showIntroStep'+parseInt(step)+''] = false;
		$scope.showIntro = false;
		$scope.holiday.showChoices = true;
	}
})

.controller('holidayChoices', function($scope, $window) {
	$scope.showConfirm = false;

	$scope.openChoice = function(evt) {
		$scope.showConfirm = true;
	};

	$scope.hideConfirm = function() {
		$scope.showConfirm = false;
	}

	$scope.confirmChoice = function() {
		$scope.holiday.user.choice = $scope.holiday.choiceModel;
		$scope.holiday.user.chosen = true;
		$scope.holiday.showChoices = false;
	}
})

.controller('holidaySummary', function($scope) {
})

.filter('filterTags', function() {
	return function(input, scope) {

		if (!input) {
			return;
		}

		var matches, optionType, output;
		matches = input.match(/\{(.*?)\}/);

		if (matches) {
			optionType = matches[1].charAt(0).toUpperCase() + matches[1].slice(1);
			output = input.replace('{'+matches[1]+'}', scope.options['app'+optionType+'']);
			return output;
		}
	};
})

.directive('fixHeight', ['$window', function ($window) {
    return function (scope, ele, attrs) {
    	var fixSizes = {
    		init: function() {
    			var self = this;
    			self.ele = ele;
    			self.sizes = {};
    			self.items = null;

    			self.resize();
    		},
    		resize: function() {
    			var self = this,
    				w = $window;

				self.items = self.ele.parent().children();

    			self.sizes = {
					wh: w.innerHeight,
					ww: w.innerWidth / self.items.length,
					pw: w.innerWidth			
    			}

		     	self.ele.parent().css({
		     		'position': 'absolute',
		     		'overflow': 'hidden',
		    		'height': self.sizes.wh + 'px',
		    		'width': self.sizes.pw + 'px'
		    	});

				angular.forEach(self.items, function(item, key) {
			    	angular.element(item).css({
			    		'height': self.sizes.wh + 'px',
			    		'width': self.sizes.ww + 'px',
			    		'left': key * self.sizes.ww + 'px'
			    	});
				});
    		}
    	}

    	fixSizes.init();

		angular.element($window).bind('resize', function(){
			fixSizes.init();
        });
    }
}])

.factory("getData",function($http, $q){
	var data = {},
		baseURL = 'db/data.json';

	return {
		fetch: function() {
           return $http.get(baseURL);
		}
	}
})

.config(function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'templates/intro.html',
		controller: 'mainController'
	});

	$locationProvider.html5Mode(false);
});