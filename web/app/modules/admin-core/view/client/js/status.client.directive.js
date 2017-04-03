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
	});