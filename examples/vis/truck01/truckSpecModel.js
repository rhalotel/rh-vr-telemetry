let specModel = {
    Update: function(json,animations,mixerObj) 
    {
        var self = this;
        var totalFuel = 0;
        var fuelLevel1 = 0;
        var Torque = 0;
        var EngineHours = 0;
        var EngineSpeed = 0;
        var enginePercentLoad = 0;
        var VehicleHDistance = 0;
        var VehicleSpeed = 0;
        var EngineCoolantTmp = 0;
        var AmbientAirTemp = 0;
        var breakPedalPosition = 0;
        var combVeight = 0;
        // totalFuel = json.fuelConsumption.TotalFuel * 0.001; //L
        // fuelLevel1 = json.dashDisplay.fuelLevel1 / 2.5; //%
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
        kmph2mps = 1/3.6
        sw2rpm = 42
        pi = 3.1459;
        r = 0.538
        speedFromData = json.tco1.VehicleSpeed / 256; //km/h
        // 1RPS je (2*pi*r)
        // rps2mps = (2*pi*r); //= 3.38035369526m;
        // curr_mps = speedFromData*kmph2mps

        // currRPS = (1/rps2mps)*curr_mps          //vypocita momentalne RPS z rychlosti v mps a konstanty
        // currRPM = currRPS*60                    //  vypocita momentalne RPM
        // speedWheel = currRPM/sw2rpm             //  vypocita konstantu ktora bude rychlost animacie kolies z momentalneho RPM
        speedWheel = ((1/(2*pi*r))*(speedFromData*kmph2mps))*60/sw2rpm;
        for (var i = 0; i < animations.length; i++) {
            animation = mixerObj.clipAction(animations[i]);
            animation.timeScale = speedWheel;
            animation.play();
        }
    },
};