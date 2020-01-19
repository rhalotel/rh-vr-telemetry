var house1 = {
    isSet : false,
    update: function(json,visItem) 
    {
        {/* *START* Sun position based on time */
            var sunObject = visItem.get3DObjectByName(["Sun"]);
            sunLocationName = ["SunAction"];
            sunLocationAnim = visItem.getAnimationByName(sunLocationName);
            // average sunrise time for november in london: 7:18
            var sunrise = "7:18".split(/[.:]/);
            var hours = parseInt(sunrise[0], 10);
            var minutes = sunrise[1] ? parseInt(sunrise[1], 10) : 0;
            sunrise = hours + minutes / 60;
            
            // average sunset time for november in london: 16:13
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
            	if (!this.isSet) {
            		visItem.jumpToAnimationPercent(sunLocationAnim, ((currTime-sunrise)/(sunset-sunrise))*100);
            		this.isSet=true;
            	}
                visItem.setObjectVisibility(sunObject, true);
            } else {
                visItem.setObjectVisibility(sunObject, false);
            }
        }/* *END* Sun position based on time */


        {/* *START* Battery drain based on data */
            batteryAnimNames = ["BatteryDrainAction"];
            batteryAnims = visItem.getAnimationByName(batteryAnimNames);
            // batteryState = Number(json.batteryDrainAction);
            batteryState = Number(json.battery.C);
            if (!isNaN(batteryState)) {
                maxBatteryState = 2;
                // animation goes from 100% to 0% so animation on 0% percent is 100% of fuel
                percentAnim = batteryState/maxBatteryState;
                visItem.jumpToAnimationPercent(batteryAnims, percentAnim);
            }
        }/* *END* Battery drain based on data */


        {/* *START* Grid flow based on data */
            gridAnimNames=["FirstPhaseAction","GridFlowAction","ThirdPhaseAction","GridFlowAction003"];
            gridAnims=visItem.getAnimationByName(gridAnimNames);
            // firstAnimNames = ["FirstPhaseAction"];
            // firstAnims = visItem.getAnimationByName(firstAnimNames);
            // secondAnimNames = ["SecondPhaseAction"];
            // secondAnims = visItem.getAnimationByName(secondAnimNames);
            // thirdAnimNames = ["ThirdPhaseAction"];
            // thirdAnims = visItem.getAnimationByName(thirdAnimNames);
            firstGridFlow = Number(json.grid.L1);
            secondGridFlow = Number(json.grid.L2);
            thirdGridFlow = Number(json.grid.L3);

            if (!isNaN(firstGridFlow)) {
                maxGridFlow = 1000;
                // animation goes from 100% to 0% so animation on 0% percent is 100% of fuel
                gridFlow = firstGridFlow/maxGridFlow;
                visItem.updateTimeScale(gridAnims[0], gridFlow);
            }
            else{
                visItem.updateTimeScale(gridAnims[0], 0);
            }
            if (!isNaN(secondGridFlow)) {
                maxGridFlow = 1000;
                // animation goes from 100% to 0% so animation on 0% percent is 100% of fuel
                gridFlow2 = secondGridFlow/maxGridFlow;
                visItem.updateTimeScale(gridAnims[1], gridFlow2);
            }
            else{
                visItem.updateTimeScale(gridAnims[1], 0);
            }
            if (!isNaN(thirdGridFlow)) {
                maxGridFlow = 1000;
                // animation goes from 100% to 0% so animation on 0% percent is 100% of fuel
                gridFlow3 = thirdGridFlow/maxGridFlow;
                visItem.updateTimeScale(gridAnims[2], gridFlow3);
            }
            else{
                visItem.updateTimeScale(gridAnims[2], 0);
            }
            if ((thirdGridFlow!=0) || (secondGridFlow!=0) || (firstGridFlow!=0)) {
                maxGridFlow = 1000;
                // animation goes from 100% to 0% so animation on 0% percent is 100% of fuel
                // gridFlow3 = thirdGridFlow/maxGridFlow;
                visItem.updateTimeScale(gridAnims[4], 0.8);
            }
            else{
                visItem.updateTimeScale(gridAnims[4], 0);
            }
        }/* *END* Grid flow based on data */


        {/* *START* Panels flow based on data */
            panelsAnimNames = ["GridFlowAction001"];
            panelsAnims = visItem.getAnimationByName(panelsAnimNames);
            panelsFlow = Number(json.solar.U_PANEL);
            if (!isNaN(panelsFlow) && panelsFlow>0) {
                maxPanelsFlow = 1000;
                // animation goes from 100% to 0% so animation on 0% percent is 100% of fuel
                flow = panelsFlow/maxPanelsFlow;
                visItem.updateTimeScale(panelsAnims, flow);
            }
            else{
                visItem.updateTimeScale(flowAnims, 0);
            }
        }/* *END* Panels flow based on data */



        // {/* *START* Turbine flow based on data */
        //     turbineAnimNames = ["TurbineFlowAction","TurbineToSpinAction"];
        //     turbineAnims = visItem.getAnimationByName(turbineAnimNames);
        //     turbineFlow = Number(json.solar.U_PANEL);
        //     if (!isNaN(turbineFlow) && turbineFlow>0) {
        //         maxTurbineFlow = 1200;
        //         // animation goes from 100% to 0% so animation on 0% percent is 100% of fuel
        //         flow = (1200-turbineFlow)/maxTurbineFlow;
        //         visItem.updateTimeScale(turbineAnims, flow);
        //     }
        //     else{
        //         visItem.updateTimeScale(turbineAnims, 0);
        //     }
        // }/* *END* Turbine flow based on data */


        {/* *START* Car and battery flow based on data */
            cbAnimNames = ["BatteryFlowAction","CarFlowAction"];
            cbAnims = visItem.getAnimationByName(cbAnimNames);
            // cbFlow = Number(json.combWeight.combVeight);
            energySurplus = Number(json.solar.U_PANEL);
            energyDemand = Number(json.demand.L1) + Number(json.demand.L2) + Number(json.demand.L3);
            if (energySurplus > energyDemand) {
                intensity = (energySurplus - energyDemand)*0.3;//podla prebytku urcit
                if(intensity>2)
                    intensity=2;
                visItem.updateTimeScale(cbAnims, intensity);
            }
            else{
                visItem.updateTimeScale(cbAnims, 0);
            }
        }/* *END* Car and battery flow based on data */



        {/* *START* Turbine flow based on data */
            turbineAnimNames = ["TurbineToSpinAction","TurbineFlowAction"];
            turbineAnims = visItem.getAnimationByName(turbineAnimNames);
            // cbFlow = Number(json.combWeight.combVeight);
            energySurplus = Number(json.solar.U_PANEL);
            
            if (!isNaN(energySurplus)) {
                maxEnergy=1000;
                turbine=1000-energySurplus;
                intensity=turbine/maxEnergy;
                visItem.updateTimeScale(turbineAnims, intensity);
            }
            else{
                visItem.updateTimeScale(turbineAnims, 0);
            }
        }/* *END* Turbine flow based on data */



        {/* *START* Cabinet animation based on data */
            cabinetAnimNames = ["DemandCubeAction","GridCubeAction"];
            cabinetAnims = visItem.getAnimationByName(cabinetAnimNames);
            // cbFlow = Number(json.combWeight.combVeight);
            energyDemand = Number(json.demand.L1) + Number(json.demand.L2) + Number(json.demand.L3);
            energyGrid = Number(json.grid.L1) + Number(json.grid.L2) + Number(json.grid.L3);
            if (!isNaN(energyDemand) && !isNaN(energyGrid)) {
                maxEnergy=1000;
                demandFlow=energyDemand/maxEnergy;
                gridFlow=energyGrid/maxEnergy;
                visItem.jumpToAnimationPercent(cabinetAnims[0], demandFlow);
                visItem.jumpToAnimationPercent(cabinetAnims[1], gridFlow);
            }
            else{
                visItem.jumpToAnimationPercent(turbineAnims, 0);
            }
        }/* *END* Cabinet animation based on data */
    },
    init : function(visItem){

        {/* *START* Set sun animation to represent day length and set to current time */
            // average day length for november in london: 8:54
            var day_length = "8:54".split(/[.:]/);
            hours = parseInt(day_length[0], 10);
            minutes = day_length[1] ? parseInt(day_length[1], 10) : 0;
            day_length = hours + minutes / 60;
            sunLocationName = ["SunAction"];
            sunLocationAnim = visItem.getAnimationByName(sunLocationName);
            visItem.updateTimeScale(sunLocationAnim, sunLocationAnim[0].duration/(day_length*3600));

            var sunrise = "7:18".split(/[.:]/);
            var hours = parseInt(sunrise[0], 10);
            var minutes = sunrise[1] ? parseInt(sunrise[1], 10) : 0;
            sunrise = hours + minutes / 60;
            var currDate = new Date();
            var currTime = (currDate.getHours() + ":" + currDate.getMinutes()).split(/[.:]/);
            currTimePercent = ((currTime-sunrise)/(day_length))*100;
            if (currTimePercent<=100 && currTimePercent>=0)
            	visItem.jumpToAnimationPercent(sunLocationAnim, currTimePercent);
        }/* *END* Set sun animation to represent day length */

        {/* *START* Add battery to opacity items */
            opacityNames = ["Battery001"];
            visItem.opacityObjects = visItem.get3DObjectByName(opacityNames);
        }/* *END* Add battery to opacity items */
    },
};