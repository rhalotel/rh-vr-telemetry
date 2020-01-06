/*
parse JSON
*/

var modelName = "None";
var dataSource = "None";
var dataSourceLink = "";
var selectHtmlElement = "";
// var htmlElementsArray = []

$(document).ready(function () {
    let configURL = ["https://rhalotel.github.io/rh-vr-telemetry/examples/vis/config.json"];

    $.each(configURL, function (i, val) {
        $.getJSON(val, function (resultJSON) {
            $.each(resultJSON.model, function (i, item) {
                console.log(item.name);
                $("#modelsToChoose").append(`<a class="dropdown-item" href="#" name="` + item.name + `" htmlElement="` + item.htmlElement + `">` + item.name + `</a>`);
                $("#container").append(`<div id="` + item.htmlElement + `" style="width:100%; height:100%; display: none;" class="modelViewer"></div>`);
                let specModel;
                $.getScript(item.specModelURL, function () {
                    var options = {
                        container: "#" + item.htmlElement,
                        gltfModel: item.url,
                        specModel: window[item.specModelId],
                    };
                    createModel(options);
                    // htmlElementsArray.push(item.htmlElement);
                });


                $.each(item.dataResources, function (i, item) {
                    console.log(item.name);
                    $("#dataToVisualize").append(`<a class="dropdown-item" href="#" name="` + item.name + `" link="` + item.param + `">` + item.name + `</a>`);
                });
                $("#dataToVisualize").append(`<div class="dropdown-divider"></div>`);
            });
            $("#modelsToChoose").append(`<div class="dropdown-divider"></div>`);



        });
    });
});

$(document).on("click", "#modelsToChoose>a", function (e) {
    modelName = $(this).attr("name");
    selectHtmlElement = $(this).attr("htmlElement");
});

$(document).on("click", "#dataToVisualize>a", function (e) {
    dataSource = $(this).attr("name");
    dataSourceLink =$(this).attr("link");
});

$(document).on("click", "#modelsToChoose>a, #dataToVisualize>a", function (e) {
    $("#selectedModelAndDataSource").text("Model: " + modelName + " - Datasource: " + dataSource + "");
});


$(document).on("click", "#showModel", function (e) {
    if (selectHtmlElement != "" || selectHtmlElement != "None") {
        $(".modelViewer").hide();
        $("#" + selectHtmlElement).show();
        engine.visToShow(selectHtmlElement);

    }
});

$(document).on("click", "#home", function (e) {
    $(".modelViewer").hide();
    $("#posterViewer").show();
});

function createModel(options) {
    let crvis = new rhvr.Visualisation(options);
    crvis.init();
}

let engine = new rhvr.Core(100);
engine.init();

// var vehicleSpeed;
// var options = {
//     container: '#viewer1',
//     gltfModel: 'https://raw.githubusercontent.com/rhalotel/rh-vr-telemetry/master/examples/models/truck/triangle_faced_with_brakes.gltf',
//     specModel: specModel,
//     // gltfModel: 'https://raw.githubusercontent.com/rhalotel/rh-vr-telemetry/master/examples/models/energy/house_curves_Sun%2BBattery_mesh.gltf',
//     // specModel: houseSpecModel,
// };
// let wheelVis = new rhvr.Visualisation(options);
// var optionsHouse = {
//     container: '#container2',
//     gltfModel: 'https://raw.githubusercontent.com/rhalotel/rh-vr-telemetry/master/examples/models/energy/house_curves_Sun%2BBattery_mesh.gltf',
//     specModel: houseSpecModel,
// };
// let houseVis = new rhvr.Visualisation(optionsHouse);

// wheelVis.init();

// houseVis.init();
TestDataProvider = function (params) {
    var self = this;
    this.init = function (params) {
        setInterval(function (params) {
            $.getJSON(dataSourceLink, function (resultJSON) {
                let e = {
                    type: "recdata",
                    //arg: jQuery.parseJSON( getJson() )
                    arg: resultJSON
                };

                self.dispatch("recdata", e);
            });

        }, 1000)
    }
    this.init();
}

//
provider = new TestDataProvider()
EventDispatcherCreate(provider);

engine.setDataProvider(provider)

// updateAnimation()
/*
  implementovat pridavanie vis do core cez dispatcher predpokladam
*/



// function getJson() {
//     return `{
//       "fuelConsumption": {
//           "notUsed": 4294967295,
//           "TotalFuel": 96939 
//       },
//       "dashDisplay": {
//           "notUsed0": 255,
//           "fuelLevel1": 149,
//           "notUsed": {
//               "FixedElementField": 255
//           },
//           "fuelLevel2": 255,
//           "notUsed8": 255
//       },
//       "eecTorqueSpeed": {
//           "notUsed": {
//               "FixedElementField": 242
//           },
//           "Torque": 146,
//           "EngineSpeed": 9857,
//           "notUsed1": {
//               "FixedElementField": 255
//           }
//       },
//       "engineHours": {
//           "EngineHours": 50969,
//           "notUsed": 4294967295
//       },
//       "vehicleID": {
//           "ch": {
//               "FixedElementField": 0
//           }
//       },
//       "fmsID": {
//           "b1": 0,
//           "SW": {
//               "FixedElementField": 0
//           },
//           "notUsed2": {
//               "FixedElementField": 0
//           },
//           "DiagSupport": 0,
//           "RequestSupport": 0,
//           "notUsed": 0
//       },
//       "vhdr": {
//           "VehicleHDistance": 166991736,
//           "VehicleTripDistance": 3828948
//       },
//       "tco1": {
//           "b1": 75,
//           "b2": 16,
//           "b3": 192,
//           "b4": 192,
//           "ShaftSpeed": 12306,
//           "VehicleSpeed": 22777,
//           "Driver1WS": 3,
//           "Driver2WS": 1,
//           "MontionDetected": 1,
//           "Driver1TimeRS": 0,
//           "Driver1Card": 1,
//           "VehiceOverspeed": 0,
//           "Driver2TimeRS": 0,
//           "Driver2Card": 0,
//           "FMSTruckNotUsed": 3,
//           "SystemEvent": 0,
//           "HandlingInfo": 0,
//           "TCOPerformance": 0,
//           "DirectionIndicator": 3
//       },
//       "engineTemp": {
//           "EngineCoolantTmp": 131,
//           "notUsed": {
//               "FixedElementField": 255
//           }
//       },
//       "amb": {
//           "notUsed1": {
//               "FixedElementField": 194
//           },
//           "AmbientAirTemp": 9408,
//           "notUsed": {
//               "FixedElementField": 255
//           }
//       },
//       "driverID": {
//           "ascii": {
//               "FixedElementField": 0
//           }
//       },
//       "electronicBreak": {
//           "notUsed": 0,
//           "breakPedalPosition": 200,
//           "notUsed1": {
//               "FixedElementField": 243
//           }
//       },
//       "eec14Fuel": {
//           "notUsed": {
//               "FixedElementField": 0
//           },
//           "fuelType": 0,
//           "notUsed1": 0
//       },
//       "gasTotal": {
//           "notUsed": {
//               "FixedElementField": 0
//           },
//           "totalFuelGASUsed": 0
//       },
//       "driveEngagenment": {
//           "notUsed": {
//               "FixedElementField": 0
//           },
//           "b1": 0,
//           "notUsed2": 0,
//           "engageState": 0,
//           "notUsed1": 0
//       },
//       "combWeight": {
//           "notUsed": 0,
//           "combVeight": 0,
//           "notUsed2": 0
//       },
//       "axleTireWights": {
//           "axleWeight00": 0,
//           "axleWeight01": 0,
//           "axleWeight10": 0,
//           "axleWeight11": 0,
//           "axleWeight12": 0,
//           "axleWeight13": 0,
//           "axleWeight20": 0,
//           "axleWeight21": 0,
//           "axleWeight22": 0,
//           "axleWeight23": 0
//       },
//       "time": "2019-10-26T13:32:05.000Z"
//   }`;
// }
