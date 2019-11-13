/*
    parse JSON
*/



// let gltf = null;
// let mixer = null;
let clock = new THREE.Clock();
// let scene = new THREE.Scene();
// let scene = new THREE.Scene()
// let renderer;





let engine = new rhvr.Core();
engine.init();

// var vehicleSpeed;
let truckURL = 'https://raw.githubusercontent.com/rhalotel/rh-vr-telemetry/master/examples/models/truck/triangle_faced.gltf';
let wheelVis = new rhvr.Visualisation(["container",0,truckURL,specModel]);
console.log("tototootototo"+wheelVis);
wheelVis.init();

TestDataProvider = function (params) {
   var self =this;
   this.init = function (params) {
     setInterval(function (params) {
       let e = {
         type: "recdata",
         arg: jQuery.parseJSON( getJson() )
       };

       self.dispatch("recdata",e);
    },1000)
   }
this.init();
 }

//
 provider= new TestDataProvider()
 EventDispatcherCreate(provider);

engine.setDataProvider(provider)






// updateAnimation()
/*
  implementovat pridavanie vis do core cez dispatcher predpokladam
*/



function getJson() {
  return `{
      "fuelConsumption": {
          "notUsed": 4294967295,
          "TotalFuel": 96939 
      },
      "dashDisplay": {
          "notUsed0": 255,
          "fuelLevel1": 149,
          "notUsed": {
              "FixedElementField": 255
          },
          "fuelLevel2": 255,
          "notUsed8": 255
      },
      "eecTorqueSpeed": {
          "notUsed": {
              "FixedElementField": 242
          },
          "Torque": 146,
          "EngineSpeed": 9857,
          "notUsed1": {
              "FixedElementField": 255
          }
      },
      "engineHours": {
          "EngineHours": 50969,
          "notUsed": 4294967295
      },
      "vehicleID": {
          "ch": {
              "FixedElementField": 0
          }
      },
      "fmsID": {
          "b1": 0,
          "SW": {
              "FixedElementField": 0
          },
          "notUsed2": {
              "FixedElementField": 0
          },
          "DiagSupport": 0,
          "RequestSupport": 0,
          "notUsed": 0
      },
      "vhdr": {
          "VehicleHDistance": 166991736,
          "VehicleTripDistance": 3828948
      },
      "tco1": {
          "b1": 75,
          "b2": 16,
          "b3": 192,
          "b4": 192,
          "ShaftSpeed": 12306,
          "VehicleSpeed": 22777,
          "Driver1WS": 3,
          "Driver2WS": 1,
          "MontionDetected": 1,
          "Driver1TimeRS": 0,
          "Driver1Card": 1,
          "VehiceOverspeed": 0,
          "Driver2TimeRS": 0,
          "Driver2Card": 0,
          "FMSTruckNotUsed": 3,
          "SystemEvent": 0,
          "HandlingInfo": 0,
          "TCOPerformance": 0,
          "DirectionIndicator": 3
      },
      "engineTemp": {
          "EngineCoolantTmp": 131,
          "notUsed": {
              "FixedElementField": 255
          }
      },
      "amb": {
          "notUsed1": {
              "FixedElementField": 194
          },
          "AmbientAirTemp": 9408,
          "notUsed": {
              "FixedElementField": 255
          }
      },
      "driverID": {
          "ascii": {
              "FixedElementField": 0
          }
      },
      "electronicBreak": {
          "notUsed": 0,
          "breakPedalPosition": 0,
          "notUsed1": {
              "FixedElementField": 243
          }
      },
      "eec14Fuel": {
          "notUsed": {
              "FixedElementField": 0
          },
          "fuelType": 0,
          "notUsed1": 0
      },
      "gasTotal": {
          "notUsed": {
              "FixedElementField": 0
          },
          "totalFuelGASUsed": 0
      },
      "driveEngagenment": {
          "notUsed": {
              "FixedElementField": 0
          },
          "b1": 0,
          "notUsed2": 0,
          "engageState": 0,
          "notUsed1": 0
      },
      "combWeight": {
          "notUsed": 0,
          "combVeight": 0,
          "notUsed2": 0
      },
      "axleTireWights": {
          "axleWeight00": 0,
          "axleWeight01": 0,
          "axleWeight10": 0,
          "axleWeight11": 0,
          "axleWeight12": 0,
          "axleWeight13": 0,
          "axleWeight20": 0,
          "axleWeight21": 0,
          "axleWeight22": 0,
          "axleWeight23": 0
      },
      "time": "2019-10-26T13:32:05.000Z"
  }`;
}
