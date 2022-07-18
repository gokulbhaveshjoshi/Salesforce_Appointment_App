({
    getPicklistValues : function(component, event) {
        var action = component.get("c.getTimeSlot");
        var x = component.get("v.app.Date__c");
        var y = component.get("v.duration");
        var a = component.get("v.stime");
        var b = component.get("v.etime");
        console.log("Date-->", x);
        console.log("start Time", a);
        console.log("End Time", b);
        action.setParams({
            dt: x,
            minute: y,
            stime: a,
            etime: b
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                var fieldMap = [];
                console.log('check response', result);
                for(var key in result){
                    fieldMap.push({key: key,
                                   value: this.mstoTime(result[key])
                                  });
                }
                console.log("TimeValue", fieldMap);
                component.set("v.fieldMap", fieldMap);
            }
        });
        $A.enqueueAction(action);
    },
    
    saveRecord: function(component, event){
        var duration = component.get("v.duration");
        var Appointment = component.get("v.app");
        //alert(Appointment.Name + " " + Appointment.Time__c +" "+ Appointment);
        var action = component.get("c.CreateAppointment");
        action.setParams({
            app : Appointment,
            duration: duration
        });
        
        action.setCallback(this,function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                var msg = component.get('c.showSuccess');
                $A.enqueueAction(msg);             
                
                
            } else if(state === "ERROR"){
                var errors = action.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        alert(errors[0].message);
                    }
                }
            }
        });       
        $A.enqueueAction(action);
    },
    
    setButtonColor: function(cmp, event, number){
        if(number==1){
            console.log('number--1', number);
            cmp.find("btn1").set("v.variant","brand-outline");
            cmp.find("btn2").set("v.variant","brand");
            cmp.find("btn3").set("v.variant","brand");
            cmp.find("btn4").set("v.variant","brand");
        }
        if(number==2){
            console.log('number--2', number);
            cmp.find("btn1").set("v.variant","brand");
            cmp.find("btn2").set("v.variant","brand-outline");
            cmp.find("btn3").set("v.variant","brand");
            cmp.find("btn4").set("v.variant","brand");
        }
        if(number==3){
            console.log('number--3', number);
            cmp.find("btn1").set("v.variant","brand");
            cmp.find("btn2").set("v.variant","brand");
            cmp.find("btn3").set("v.variant","brand-outline");
            cmp.find("btn4").set("v.variant","brand");
        }
        if(number==4){
            console.log('number--4', number);
            cmp.find("btn1").set("v.variant","brand");
            cmp.find("btn2").set("v.variant","brand");
            cmp.find("btn4").set("v.variant","brand-outline");
            cmp.find("btn3").set("v.variant","brand");
        }                
        
    },
    
    // Custom Functions
    addMinutes: function(time){
        console.log("time", time);
        time = time.split(':');
        var min = parseInt(time[1]);
        var hour = parseInt(time[0]);
        
        // Set upcoming minutes
        /*switch(min){
            case 0:
                min = 15;
                break;
            case 15:
                min = 30;
                break;
            case 30:
                min = 45;
                break;
            case 45:
                min = '00';
                hour+=1;
                break;
        }
        */
        
        if(min<15){
            min = 15;
        }
        else{
            if(min<30){
                min = 30;
            }
            else{
                if(min<45){
                    min = 45;
                }
                else{
                    min = '00';
                    hour = hour + 1;
                }
            }
        }
        time = hour +':'+ min;
        console.log('check new slot time', time);
        return time;
    },
    
    mstoTime: function(s){
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hour = (s - mins) / 60;
        var ampm;
        
        if(hour> 11){
            ampm = ' PM';
        }
        else{
            ampm = ' AM'
        }
        if(hour>12){
            hour = hour %12;
        }
        if(mins == 0){
            return hour + ':' + mins+'0' + ampm;
        }
        console.log('return params', hour + ':'+ mins + ampm);
        return hour + ':'+ mins + ampm
    },
 
})