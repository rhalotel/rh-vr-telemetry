var truckMB1 = {
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
            // 1RPS je (2*pi*r)
            // rps2mps = (2*pi*r); //= 3.38035369526m;
            // curr_mps = speedFromData*kmph2mps

            // currRPS = (1/rps2mps)*curr_mps          //vypocita momentalne RPS z rychlosti v mps a konstanty
            // currRPM = currRPS*60                    //  vypocita momentalne RPM
            // speedWheel = currRPM/sw2rpm             //  vypocita konstantu ktora bude rychlost animacie kolies z momentalneho RPM
            kmph2mps = 1/3.6
            sw2rpm = 42
            pi = 3.1459;
            r = 0.538

            // get json value from vehicle speed
            vehicleSpeedFromData = Number(json.tco1.VehicleSpeed / 256); //km/h

            // define animation names vector
            wheelAnimations = ["wheelsSpin"];

            // check for NaN
            if (!isNaN(vehicleSpeedFromData)) {
                // apply animation speed
                speedWheel = ((1/(2*pi*r))*(vehicleSpeedFromData*kmph2mps))*60/sw2rpm;
                visItem.updateTimeScale(visItem.getAnimationByName(wheelAnimations), speedWheel);
            }
        }/* *END* Wheel animation based on vehicle speed   */



        {/* *START* Tank fuel level based on json data   */
            tankAnimNames = ["NaftDrain"];
            tankAnims = visItem.getAnimationByName(tankAnimNames);
            totalFuel = Number(json.fuelConsumption.TotalFuel * 0.001);
            if (!isNaN(totalFuel)) {
                maxFuel = 600;
                // animation goes from 100% to 0% so animation on 0% percent is 100% of fuel
                percentAnim = 100-(100/maxFuel)*totalFuel;
                visItem.jumpToAnimationPercent(tankAnims, percentAnim);
            }
        }/* *END* Tank fuel level based on json data   */

        // {/* *START* Brake pedal position based on json data   */
        //     brakeNames = ["FrontBrake_0", "FrontBrake_1", "MiddleBrake_0", "MiddleBrake_1"];
        //     brakes = visItem.get3DObjectByName(brakeNames);
        //     brakePosition = Number(json.electronicBreak.breakPedalPosition * 0.4);
        //     if (!isNaN(brakePosition)) {
        //         // if (brakePosition<10) color = 0x6DE02A;
        //         // else if (brakePosition < 20) color = 0xF2EA00;
        //         // else if (brakePosition < 30) color = 0xEF632F;
        //         // else color = 0xFF2020;
        //         redConst = Math.round(brakePosition*2.55);
        //         greenConst = Math.round(255-brakePosition*2.55);
        //         blueConst = Math.round(0);
        //         color = parseInt(
        //                 '0x'+
        //                 (
        //                     (redConst).toString(16).length==1?(redConst).toString(16)+'0':(redConst).toString(16)
        //                 ) +
        //                 (
        //                     (greenConst).toString(16).length==1?(greenConst).toString(16)+'0':(greenConst).toString(16)
        //                 ) +
        //                 (
        //                     (blueConst).toString(16).length==1?(blueConst).toString(16)+'0':(blueConst).toString(16)
        //                 )
        //         );
        //         brakes.forEach(function (item, index) {
        //           item.material.color.setHex( color );
        //         });
        //     }
        // }/* *END* Brake pedal position based on json data   */


        // speedWheel = ((1/(2*pi*r))*(speedFromData*kmph2mps))*60/sw2rpm;
        // for (var i = 0; i < animations.length; i++) {
        //     animation = mixerObj.clipAction(animations[i]);
        //     animation.timeScale = speedWheel;
        //     animation.play();
        // }
    },
    init : function(visItem){
        {/* *START* Add fuel tanks and wheels to opacity items */
            opacityNames = ["MB1Model05", "e809a301-174a-4840-8233-78e7b12461eb", "e809a301-174a-4840-8233-78e7b12461eb001", "eff1b551-5d7e-4bbf-a659-e7e058cebbc3", "eff1b551-5d7e-4bbf-a659-e7e058cebbc3001"];
            visItem.opacityObjects = visItem.get3DObjectByName(opacityNames);
        }/* *END* Add fuel tanks and wheels to opacity items */
    },
};