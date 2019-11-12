let specModel = {
    VehicleSpeed: function(d) 
    {
        pi = 3.1459;
        speedWheel = 0; //pre speedWheel = 1, maju kolesa ~42RPM
        speedFromData = d.tco1.VehicleSpeed / 256; //km/h
        // 1RPS je (2*pi*r)
        r = 0.538
        sw2rpm = 42
        kmph2mps = 1/3.6
        rps2mps = (2*pi*r); //= 3.38035369526m;
        curr_mps = speedFromData*kmph2mps

        currRPS = (1/rps2mps)*curr_mps			//vypocita momentalne RPS z rychlosti v mps a konstanty
        currRPM = currRPS*60					//	vypocita momentalne RPM
        speedWheel = currRPM/sw2rpm				//	vypocita konstantu ktora bude rychlost animacie kolies z momentalneho RPM
        // speedWheel = ((1/(2*pi*r))*(VehicleSpeed*kmph2mps))*60/sw2rpm
    },
};