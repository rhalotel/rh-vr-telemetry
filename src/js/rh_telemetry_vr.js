(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.rh_telemetry_vr = {}));
}(this, function (exports) { 'use strict';


	var Engine = function(){
		const engineInstance;

		return{
			function run(){
				console.log("I'm up and running");
			}

			function task(){
				console.log("I'm up and tasking");
			}
		};
		

		return{
			engineInstance;
		};
	};


}));