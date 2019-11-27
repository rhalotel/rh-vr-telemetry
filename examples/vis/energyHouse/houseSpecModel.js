var house1 = {
    update: function(json,visItem) 
    {

        var self = this;
        
        {/* *START* Sun position based on time */
            var sunObject = visItem.get3DObjectByName(["Sun"])
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
                visItem.setObjectVisibility(sunObject, true);
            } else {
                visItem.setObjectVisibility(sunObject, false);
            }
        }/* *END* Sun position based on time */
    },
    init : function(visItem){

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

        {/* *START* Add battery to opacity items */
            opacityNames = ["Shape_IndexedFaceSet019"];
            visItem.opacityObjects = visItem.get3DObjectByName(opacityNames);
        }/* *END* Add battery to opacity items */
    },
};