public class BookSlotClass {
    public static Time stringToTime(String strTimeChange){
        String[] strTimeSplit = strTimeChange.split(':');
        Time timeChange = Time.newInstance( Integer.valueOf(strTimeSplit[0]),Integer.valueOf(strTimeSplit[1])  ,0 ,0);
        return timeChange;
    }
    
    @AuraEnabled
    public static  Map<Time, Time> getTimeSlot(Date dt, Integer minute, String stime, String etime){
        system.debug(dt);
        Time slotstarttime = stringToTime(stime);
        Time slotendtime = stringToTime(etime);
       
        
        Map<Time, Time> options = new Map<Time, Time>();
        Date searchDate = Date.valueOf(dt);
        Time myTime;
        System.debug(dt);
        Date d1 = date.today();
        System.debug(d1);
        System.debug(dt>d1);
        List<Book_Slot__c> bookSlots = [SELECT Time__c, Start_time__c, End_time__c FROM Book_Slot__c where Date__c=: searchDate];
        if(searchDate<d1){
            myTime = Time.newInstance(17, 00, 00, 0); 
        }
        else{
            if(searchDate==d1){
                Time t = DateTime.now().time();
                Time t1 = slotstarttime;
                if(t>t1){
                    t1 = t;
                }
                
                Integer hour = t1.hour();
                Integer m = t1.minute();
                /*Integer min = 0;
                Integer Tmin = m/15;
                Switch on Tmin{
                    when 0{
                        min = 15;
                    }
                    when 1 {
                        min = 30;
                    }
                    when 2{
                        min = 45;
                    }
                    when 3{
                        min = 00;
                        hour = hour + 1;
                    }
                    when else{
                        min = 00;
                    }
                }  */            
                myTime = Time.newInstance(hour, m, 00, 0); 
            }
            else{
                myTime = slotstarttime; 
            }
        }
        
        
        while (myTime < slotendtime) {
            Integer count = 0;
            
            for(Book_Slot__c a : bookSlots ){
                System.debug((myTime >= a.Start_Time__c.time() && myTime <= a.End_Time__c.time() ));
                System.debug(a.Start_Time__c.time() +'   --  '+ myTime);
                if(myTime == a.Time__c || (myTime >= a.Start_Time__c.time() && myTime < a.End_Time__c.time() )  ){ // all value == book appointment
                    count++;
                }
                
            }
            
            if(count == 0){
                options.put(myTime, myTime);
            }
            myTime = myTime.addMinutes(15);
        }
        return options;
    }
    
    @AuraEnabled 
    Public static void CreateAppointment(Book_Slot__c app, Integer duration){
        
        Time t1 = app.Time__c;
        //system.debug(t1);
        //Time t = Time.newInstance(t1.hour(), t1.minute(), t1.second(), 0);
        //system.debug(t);
        //String t = t1.format('HH:mm:ss');
        TimeZone tz = UserInfo.getTimeZone();
        date dt = app.Date__c ;
        DateTime startDate = Datetime.newInstance(dt.year(),dt.month(),dt.day(),t1.hour(),t1.minute(),t1.second());
        //Datetime myDate = Datetime.parse(dt);
        //System.debug(myDate);
        app.Start_Time__c = startDate;
        app.End_Time__c = startDate.addMinutes(duration);
        app.Duration__c = duration;
        System.debug(app.Start_Time__c);
        try{
            
            insert app; 
            
        }catch(Exception e){
            System.debug(e.getMessage());
            System.debug(e.getLineNumber());
        }
        
    }
}