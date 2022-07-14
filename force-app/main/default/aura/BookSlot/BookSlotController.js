({
    doInit : function(component, event, helper) {
        //helper.getPicklistValues(component, event);
        var today = $A.localizationService.formatDate(new Date(), "YYYY-MM-DD");
        component.set('v.today', today);
        component.set('v.app.Date__c', today);
        var todayTime = new Date();
        helper.setButtonColor(component, event, 1);
        
        if(  component.get('v.visibility') ){
            console.log("Visiblity is on");
            var startSlot = todayTime.getHours()+ ':' + todayTime.getMinutes();
            console.log('startSlot-->', startSlot);
            var newstartSlot = helper.addMinutes(startSlot);
            console.log("working - 1", newstartSlot);
            component.find("StartSlots").set("v.min",newstartSlot);
            console.log("working - 2");
        } 
        else{
            component.find("StartSlots").set("v.min",'10:00');
        }
       
        
    },
    BookSlot : function(component, event, helper) {
        helper.saveRecord(component, event);
    },
    
    GetTimeSlot:function(component, event, helper) {
        helper.getPicklistValues(component, event);
        component.find("StartSlots").set("v.min",'10:00');
    },
    
    Min15: function(cmp, event, helper){
        cmp.set('v.duration', 15);
        helper.setButtonColor(cmp, event, 1);
        helper.getPicklistValues(cmp, event);
        
    },
    
    Min30: function(cmp, event, helper){
        cmp.set('v.duration', 30);
        //event.getSource().set("v.variant","destructive" );
        helper.setButtonColor(cmp, event, 2);
        helper.getPicklistValues(cmp, event);
    },
    
    Min45: function(cmp, event, helper){
        cmp.set('v.duration', 45);
        helper.setButtonColor(cmp, event, 3);
        helper.getPicklistValues(cmp, event);
    },
    Min60: function(cmp, event, helper){
        cmp.set('v.duration', 60);
        helper.setButtonColor(cmp, event, 4);
        helper.getPicklistValues(cmp, event);
        
    },
    showSuccess : function(component, event, helper) {
        console.log("Date"," Yes Called");
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : 'Success',
            message: 'This is a success message',
            duration:' 5000',
            key: 'info_alt',
            type: 'success',
            mode: 'pester'
        });
        toastEvent.fire();
        $A.get('e.force:refreshView').fire();
        alert("Data is saved");
        
    },
    
    handleChange: function(component, event, helper){
        component.set('v.visibility',!event.getSource().get('v.checked') );
        
    },
    
    setEndTimeSlots: function(component, event, helper){
        var startSlot = component.get('v.stime');
        if( startSlot ){
            console.log("checking conditions", "set End Time slot functions");
            component.set('v.endTimeVisiblity', false);
        }
        var startSlot = helper.addMinutes(startSlot);
        component.find("EndSlots").set("v.min",startSlot);
        
    },
    
    
    
    
})