"use strict";

angular.module('core')
	.directive('status', function () {
		return {
			restrict: 'EAC', //E = element, A = attribute, C = class, M = comment
			link: function ($scope, element, attrs) {
				var tag =  '<span class="label label-danger">unpublish</span>';
				
				if(attrs.status==1){
					tag =  '<span class="label label-success">publish</span>';
				}
				element.append(tag);
			}
		}
	})
	.directive('ckEditor', [function () {
	return {
		require: '?ngModel',
		restrict: 'AEC',
		link: function (scope, elm, attr, model) {
			var isReady = false;
			var data = [];
			var ck = CKEDITOR.replace(elm[0]);

			function setData() {
				if (!data.length) { return; }

				var d = data.splice(0, 1);
				ck.setData(d[0] || '<span></span>', function () {
					setData();
					isReady = true;
				});
			}

			ck.on('instanceReady', function (e) {
				if (model) { setData(); }
			});

			elm.bind('$destroy', function () {
				ck.destroy(false);
			});

			if (model) {
				ck.on('change', function () {
					scope.$apply(function () {
						var data = ck.getData();
						if (data == '<span></span>') {
							data = null;
						}
						model.$setViewValue(data);
					});
				});

				model.$render = function (value) {
					if (model.$viewValue === undefined) {
						model.$setViewValue("");
						model.$viewValue = "";
					}

					data.push(model.$viewValue);

					if (isReady) {
						isReady = false;
						setData();
					}
				};
			}

		}
	};
}]);
