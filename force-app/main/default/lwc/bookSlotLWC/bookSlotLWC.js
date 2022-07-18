import { api, LightningElement, track } from 'lwc';
import getTimeSlot from '@salesforce/apex/BookSlotClass.getTimeSlot';
export default class BookSlotLWC extends LightningElement {
    @track appointmentName = 'Bhavesh Joshi';
    @track endTimeVisibility = true;
    @track otherDateDisabled = true;
    @track selectedDate ;
    @track duration = 15;
    @api startTimeMin;
    @api endTimeMin;
    timeslots = null;

    
    
    constructor() {
        super();
        var time = new Date();
        var timeHours = time.getHours();  
        var timeMinute = time.getMinutes();
        this.startTimeMin = this.addToMintute(timeHours + ":"+timeMinute);
        this.selectedDate = time.toISOString();
    }


    get availableTimeSlots(){
        if(this.timeslots==null){
            return [{label: 'None', value:'None'}];
        }
        return this.timeslots;
        
    }
    

    

    book(event){
        //this.appointmentName = event.target.value;
        this.appointmentName = this.template.querySelector(".appName").value;
        console.log(this.appointmentName);
    }

    getCurrentTime(){
        var time = new Date();
        time = time.getTime
        console.log(time);
    }

    handleChanges(event){
        console.log(event.target.name);
        console.log(event);
        var eventName = event.target.name;
        if(eventName==="startTime"){
            this.endTimeMin = this.addToMintute(event.target.value);
            this.endTimeVisibility = false;
        }
        if(eventName==="endTime"){
            //this.endTimeMin = event.target.value;
            console.log("event", event.target.name);
        }

        if(eventName==="otherDateCB"){
            let time = new Date();
            var today = time.getDate() +'-'+time.getMonth()+"-"+time.getFullYear();
            console.log(time);
            console.log(today);
            this.template.querySelector('.otherDate').setAttribute('min', today );
            if(event.target.checked){
                this.otherDateDisabled = false;
            }else{
                this.otherDateDisabled = true;
            }
            //console.log(event.target.checked);
        }

        if(eventName==="Date"){
            console.log(event.target.value);
            this.selectedDate = event.target.value;
            this.startTimeMin = "10:00:00";
            this.endTimeMin = this.addToMintute("10:00:00");
            console.log(this.selectedDate);
        }
        
    }

    handleDuration(event){
        let btnName = event.target.name;
        if(btnName==="btn15"){
            this.duration = 15;
            this.changeButtonColor()
            //return;
        }
        if(btnName==="btn30"){
            this.duration = 30;
            //return;
        }
        if(btnName==="btn45"){
            this.duration = 45;
            //return;
        }
        if(btnName==="btn60"){
            this.duration = 60;
            //return;
        }

        this.getAvailableSlots();

    }
    addToMintute(time){
        console.log("time", time);
        time = time.split(':');
        var min = parseInt(time[1]);
        var hour = parseInt(time[0]);
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
    }


    getAvailableSlots(){
        var startTime = this.template.querySelector('.startTime').value;
        var endTime = this.template.querySelector('.endTime').value;
        
        if(! this.selectedDate || this.selectedDate==null){
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            today = yyyy + '-' + dd + '-' + mm;
            this.selectedDate =  new Date(); 
        }
        console.log("Apex call functions");
        console.log(this.selectedDate);
        console.log(this.duration);
        console.log(startTime);
        console.log(endTime);
        
        getTimeSlot(
            {
                dt: this.selectedDate ,
                minute: this.duration,
                stime: startTime,
                etime: endTime
            }
        ).then((result) => {
            var fieldMap = [];
                console.log('check response', result);
                for(var key in result){
                    fieldMap.push({label: this.mstoTime(result[key]),
                                   value: key
                                  });
                }
            this.timeslots = fieldMap;
        })
        .catch((error) => {
            console.log(error);
        });

    }

    mstoTime(s){
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
            hour = hour%12;
        }
        if(mins == 0){
            return hour + ':' + mins+'0' + ampm;
        }
        console.log('return params', hour + ':'+ mins + ampm);
        return hour + ':'+ mins + ampm
    }

    changeButtonColor(){
        if(duration==15){
            this.template.querySelector('.btn15').setAttribute('variant', 'brand' );
        }
    }
}