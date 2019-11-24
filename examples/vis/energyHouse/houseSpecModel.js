let houseSpecModel = {
    update: function(json,visItem) 
    {
        // var self = this;
        // var totalFuel = 0;
        // var fuelLevel1 = 0;
        // var Torque = 0;
        // var EngineHours = 0;
        // var EngineSpeed = 0;
        // var enginePercentLoad = 0;
        // var VehicleHDistance = 0;
        // var VehicleSpeed = 0;
        // var EngineCoolantTmp = 0;
        // var AmbientAirTemp = 0;
        // var breakPedalPosition = 0;
        // var combVeight = 0;
        // totalFuel = json.fuelConsumption.TotalFuel * 0.001; //L
        // Torque = json.eecTorqueSpeed.Torque - 125.0; //%
        // EngineHours = json.engineHours.EngineHours * 0.05; //s
        // EngineSpeed = json.eecTorqueSpeed.EngineSpeed * 0.125; //rpm
        // enginePercentLoad = 0; // %
        // VehicleHDistance = json.vhdr.VehicleHDistance * 5.0 / 1000; //km
        // VehicleSpeed = json.tco1.VehicleSpeed / 256; //km/h
        // EngineCoolantTmp = json.engineTemp.EngineCoolantTmp - 40.0; //°C
        // AmbientAirTemp = (json.amb.AmbientAirTemp * 0.03125) - 273.0; //°C 
        // breakPedalPosition = json.electronicBreak.breakPedalPosition * 0.4; //%
        // combVeight = json.combWeight.combVeight;
        



        {/* *START* Wheel animation based on vehicle speed   */
            // // 1RPS je (2*pi*r)
            // // rps2mps = (2*pi*r); //= 3.38035369526m;
            // // curr_mps = speedFromData*kmph2mps

            // // currRPS = (1/rps2mps)*curr_mps          //vypocita momentalne RPS z rychlosti v mps a konstanty
            // // currRPM = currRPS*60                    //  vypocita momentalne RPM
            // // speedWheel = currRPM/sw2rpm             //  vypocita konstantu ktora bude rychlost animacie kolies z momentalneho RPM
            // kmph2mps = 1/3.6
            // sw2rpm = 42
            // pi = 3.1459;
            // r = 0.538

            // // get json value from vehicle speed
            // vehicleSpeedFromData = Number(json.tco1.VehicleSpeed / 256); //km/h

            // // define animation names vector
            // wheelAnimations = ["WheelBackTopSpin", "WheelFrontTopSpin", "WheelFrontMiddleSpin", "WheelBackMiddleSpin"];

            // // check for NaN
            // if (!isNaN(vehicleSpeedFromData)) {
            //     // apply animation speed
            //     speedWheel = ((1/(2*pi*r))*(vehicleSpeedFromData*kmph2mps))*60/sw2rpm;
            //     visItem.updateTimeScale(visItem.getAnimationByName(wheelAnimations), speedWheel);
            // }
        }/* *END* Wheel animation based on vehicle speed   */



        {/* *START* Tank fuel level based on json data   */
            // tankAnimNames = ["Fuel01_Drain", "Fuel02_Drain"];
            // tankAnims = visItem.getAnimationByName(tankAnimNames);
            // totalFuel = Number(json.fuelConsumption.TotalFuel * 0.001);
            // if (!isNaN(totalFuel)) {
            //     maxFuel = 600;
            //     // animation goes from 100% to 0% so animation on 0% percent is 100% of fuel
            //     percentAnim = 100-(100/maxFuel)*totalFuel;
            //     visItem.jumpToAnimationPercent(tankAnims, percentAnim);
            // }
        }/* *END* Tank fuel level based on json data   */

        {/* *START* Brake pedal position based on json data   */
            // brakeNames = ["FrontBrake_0", "FrontBrake_1", "MiddleBrake_0", "MiddleBrake_1"];
            // brakes = visItem.get3DObjectByName(brakeNames);
            // brakePosition = Number(json.electronicBreak.breakPedalPosition * 0.4);
            // if (!isNaN(brakePosition)) {
            //     if (brakePosition<10) color = 0x6DE02A;
            //     else if (brakePosition < 20) color = 0xF2EA00;
            //     else if (brakePosition < 30) color = 0xEF632F;
            //     else color = 0xFF2020;
            //     brakes.forEach(function (item, index) {
            //       item.material.color.setHex( color );
            //     });
            // }
        }/* *END* Brake pedal position based on json data   */


        // speedWheel = ((1/(2*pi*r))*(speedFromData*kmph2mps))*60/sw2rpm;
        // for (var i = 0; i < animations.length; i++) {
        //     animation = mixerObj.clipAction(animations[i]);
        //     animation.timeScale = speedWheel;
        //     animation.play();
        // }


        {/* *START* Sun position based on time */
            var sunObject = visItem.get3DObjectByName(["Sun"])
            // average sunrise for november in london: 7:18
            var sunrise = "7:18".split(/[.:]/);
            var hours = parseInt(sunrise[0], 10);
            var minutes = sunrise[1] ? parseInt(sunrise[1], 10) : 0;
            sunrise = hours + minutes / 60;
            
            // average sunset for november in london: 16:13
            var sunset = "16:13".split(/[.:]/);
            hours = parseInt(sunset[0], 10);
            minutes = sunset[1] ? parseInt(sunset[1], 10) : 0;
            sunset = hours + minutes / 60;

            var currDate = new Date();
            var currTime = (currDate.getHours() + ":" + currDate.getMinutes()).split(/[.:]/);
            hours = parseInt(currTime[0], 10);
            minutes = currTime[1] ? parseInt(currTime[1], 10) : 0;
            currTime = hours + minutes / 60;
            if (currTime>=sunrise && currTime <=sunset) {
                visItem.setObjectVisibility(sunObject, true);
            } else {
                visItem.setObjectVisibility(sunObject, false);
            }

        }/* *END* Sun position based on time */



    },
    init : function(visItem){
        {/* *START* Set opacity of fuel tanks to 0.5 */
            // opacityNames = ["Truck_Fueltank01", "Truck_Fueltank02", "WheelBackMiddleMaterial_1", "WheelFrontMiddleMaterial_2", "WheelFrontTopMaterial_2", "WheelBackTopMaterial_1"];
            // visItem.opacityObjects = visItem.get3DObjectByName(opacityNames);
        }/* *END* Set opacity of fuel tanks to 0.5 */

        {/* *START* Set sun animation to represent day length */
            // average day length for november in london: 8:54
            var day_length = "8:54".split(/[.:]/);
            hours = parseInt(day_length[0], 10);
            minutes = day_length[1] ? parseInt(day_length[1], 10) : 0;
            day_length = hours + minutes / 60;
            sunLocationName = ["SunAction"];
            sunLocationAnim = visItem.getAnimationByName(sunLocationName);
            visItem.updateTimeScale(sunLocationAnim, sunLocationAnim[0].duration/(day_length*3600));
        }/* *END* Set sun animation to represent day length */
    },
};