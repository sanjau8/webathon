const mysql=require("mysql")
const express = require('express');
const app = express()


// Prevent Server from Crashing
process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
  });


  // SQL Connection

const con=mysql.createConnection({
    host:"crowd.ciiyzqthmod9.us-east-1.rds.amazonaws.com",
    user:"admin",
    password:"garchomp",
    port:"3306",
    database:'webathon'
    
});

con.connect(function(err){
    if(err){
        console.log("connection failed"+err.stack)
        
    }
    else
    {
    console.log("connection successfull")    
    }
})



  //  Test URL
app.get("/",function(req,res){

    
    
    con.connect(function(err){
        if(err){
            console.log("connection failed"+err.stack)
            res.end("connection failed")
        }
        else{
        console.log("connection successfull")
        res.end("connection successful")
        }
    })
    
    

})


// Patient Signup

app.get("/Psignup",function(req,res){

    
    const query=req.query
    var name=query['name']    
    var phoneNo=query['pno']
    
    var pass=query['pass']

    
    
    const sql=`insert into patients values ('${name}','${phoneNo}','${pass}')`;
    con.query(sql, function (err, result) {
    if (err) {
        console.log("connection failed"+err.stack)
        let temp={'action':'data-wrong-format'}
        res.end(JSON.stringify(temp))
            }
        else{
            console.log("1 record inserted");
            let temp={'action':'record-inserted-successfully'}
            res.end(JSON.stringify(temp))
            }
              
        
    });   
    

})

// Patient Login
app.get("/Plogin",function(req,res){

    
    const query=req.query
    
    var pNo=query['pno']

    var pass=query['pass']

    

    
    
    const sql=`select * from patients where pno='${pNo}'`;
    con.query(sql, function (err, result) {
    if (err) {
        console.log("connection failed"+err.stack)
        let temp={'action':'error-loging-in'}
        res.end(JSON.stringify(temp))
            }
        else{
            if(result.length==0){
                let temp={'action':'wrong-user'}
                res.end(JSON.stringify(temp))   
            }
            else{
            var actPass=result[0]['pwd']
            if(pass==actPass){
            let temp=result[0]
            temp['action']="valid-user"
            delete temp['pwd']
            res.end(JSON.stringify(temp))
            }
            else{
                let temp={'action':'wrong-password'}
                res.end(JSON.stringify(temp))   
            }
        }
            }
              
        
    });   
    

})


//Insert hospital by admin to hospitals
app.get("/hospInsert",function(req,res){

    const query=req.query
    
    var hname=query.hname
    var haddress=query.haddress
    var hcity= query.hcity
    var hlat = query.hlat
    var hlong=query.hlong

    res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true);
    const sql=`insert into hospitals(hname,haddress,hcity,hlat,hlong) values ('${hname}','${haddress}','${hcity}','${hlat}','${hlong}')`;
    con.query(sql, function (err, result) {
    if (err) {
        console.log("connection failed"+err.stack)
        let temp={'action':'data-wrong-format'}
        res.end(JSON.stringify(temp))
            }
        else{
            console.log("1 record inserted");
            let temp={'action':'record-inserted-successfully'}
            res.end(JSON.stringify(temp))
            }
              
        
    });   

})


//Insert type by admin to dType
app.get("/typeInsert",function(req,res){

    const query=req.query

    var dtname=query.dtname
    var dtdesc=query.dtdesc

    res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true);
    const sql=`insert into dType(dtname,dtdesc) values ('${dtname}','${dtdesc}')`;
    con.query(sql, function (err, result) {
    if (err) {
        console.log("connection failed"+err.stack)
        let temp={'action':'data-wrong-format'}
        res.end(JSON.stringify(temp))
            }
        else{
            console.log("1 record inserted");
            let temp={'action':'record-inserted-successfully'}
            res.end(JSON.stringify(temp))
            }
              
        
    });   

})





// Patient Signup

app.get("/Hsignup",function(req,res){

    
    const query=req.query
    var name=query['name']    
    var phoneNo=query['pno']    
    var pass=query['pass']
    var hid=query['hid']
    var dtid=query['dtid']

    
    
    const sql=`insert into doctors values ('${name}','${phoneNo}','${pass}','${hid}','${dtid}')`;
    con.query(sql, function (err, result) {
    if (err) {
        console.log("connection failed"+err.stack)
        let temp={'action':'data-wrong-format'}
        res.end(JSON.stringify(temp))
            }
        else{
            console.log("1 record inserted");
            let temp={'action':'record-inserted-successfully'}
            res.end(JSON.stringify(temp))
            }
              
        
    });   
    

})

// Patient Login
app.get("/Hlogin",function(req,res){

    
    const query=req.query
    
    var pNo=query['pno']

    var pass=query['pass']
    var type=query['type']

    var sql="";


    if(type!=undefined){
        sql=`select * from doctors natural join dType natural join hospitals where dphone='${pNo}' and dtid = ${type}`;
    }
    else{
        sql=`select * from doctors natural join dType natural join hospitals where dphone='${pNo}' and dtid >2`;
    }
    
    
    con.query(sql, function (err, result) {
    if (err) {
        console.log("connection failed"+err.stack)
        let temp={'action':'error-loging-in'}
        res.end(JSON.stringify(temp))
            }
        else{
            if(result.length==0){
                let temp={'action':'wrong-user'}
                res.end(JSON.stringify(temp))   
            }
            else{
            var actPass=result[0]['dpass']
            if(pass==actPass){
            let temp=result[0]
            temp['action']="valid-user"
            delete temp['dpass']
            delete temp["hid"]
            delete temp["dtid"]
            
            res.end(JSON.stringify(temp))
            }
            else{
                let temp={'action':'wrong-password'}
                res.end(JSON.stringify(temp))   
            }
        }
            }
              
        
    });   
    

})


app.get("/viewStaff",function(req,res){

    const query=req.query
    var hid=query.hid
    var dtid=query.dtid


    
    
    

    var sql="";

    if(dtid==undefined){
        sql=`select * from doctors natural join dType where hid=${hid}`   
    }
    else{
        sql=`select * from doctors natural join dType where hid=${hid} and dtid=${dtid}`  
    }


    con.query(sql, function (err, result) {
        var items=[]
    if (err) {
        console.log("connection failed"+err.stack)
        
        res.end(JSON.stringify(items))
            }
        else{
            if(result.length==0){
                
                res.end(JSON.stringify(items))
            }
            
            else{
                
                result.forEach(function(row){
                    var dname=row['dname']
                    var dphone=row['dphone']
                    var dtname=row['dtname']
                    var dtdesc=row['dtdesc']

                    var tp={'dname':dname,'dphone':dphone,'dtname':dtname,'dtdesc':dtdesc}
                     
                    items.push(tp)
                })
             
                res.end(JSON.stringify(items))
                }
            }
              
        
    }); 


})

// book appoinment


app.get("/bAppoint",function(req,res){
    const query=req.query

    var ppno=query['ppno']
    var dpno=query['dphone']
    var reason=query['reason']
    var date=query['date']
    var time=query['time']
    var status=0

    var dateString = date+" "+time,
    dateTimeParts = dateString.split(' '),
    timeParts = dateTimeParts[1].split(':'),
    dateParts = dateTimeParts[0].split('-'),
    datee;

datee = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1]);

time=datee.getTime()

const sql=`insert into appointments (ppno, dphone, reason, timee, statuss) values ('${ppno}','${dpno}','${reason}','${time}',0)`;
    con.query(sql, function (err, result) {
    if (err) {
        console.log("connection failed"+err.stack)
        let temp={'action':'data-wrong-format'}
        res.end(JSON.stringify(temp))
            }
        else{
            console.log("1 record inserted");
            let temp={'action':'record-inserted-successfully'}
            res.end(JSON.stringify(temp))
            }
              
        
    });   


})

// view appointments

app.get("/viewAppoint",function(req,res){

const query=req.query

var hid=query.hid
var status= query.status
var dphone=query.dphone
var ppno=query.ppno


var sql= `select * from appointments NATURAL JOIN patients NATURAL JOIN doctors`;

if(dphone!=undefined){
    sql=sql+` where dphone='${dphone}'`
}
else{

    sql=sql+` where dphone in (select dphone from doctors where hid=${hid})`

}

if(ppno !=undefined){
    sql=sql+` where ppno='${ppno}'`
}

sql=sql+` status=${status} order by timee`

if(status==2){
    sql=sql+` desc`
}



con.query(sql, function (err, result) {
    var items=[]
if (err) {
    console.log("connection failed"+err.stack)
    
    res.end(JSON.stringify(items))
        }
    else{
        if(result.length==0){
            
            res.end(JSON.stringify(items))
        }
        
        else{
            
            result.forEach(function(row){
                var bid=row['bid']
                var dname=row['dname']
                var pname=row['namee']
                var reason=row['reason']
                var time= parseInt(row['timee'])
                

                var tp={'bid':bid,'dname':dname,'pname':pname,'reason':reason}
                 
                items.push(tp)
            })
         
            res.end(JSON.stringify(items))
            }
        }
          
    
}); 








})



//receptionsit acknowledges
app.get("/ackRecp",function(req,res){
    const query=req.query
    var bid=query.bid
    var date=query.date
    var time=query.time

    var dateString = date+" "+time,
    dateTimeParts = dateString.split(' '),
    timeParts = dateTimeParts[1].split(':'),
    dateParts = dateTimeParts[0].split('-'),
    datee;

datee = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1]);

time=datee.getTime()

    const sql=`update appointments set status=1, timee='${time}' where bid=${bid}`;
    con.query(sql, function (err, result) {
    if (err) {
        console.log("connection failed"+err.stack)
        let temp={'action':'data-wrong-format'}
        res.end(JSON.stringify(temp))
            }
        else{
            console.log("1 record changed");
            let temp={'action':'record-changed-successfully'}
            res.end(JSON.stringify(temp))
            }
              
        
    }); 
})


//get current crowd

app.get("/getCrowd",function(req,res){
    const query=req.query
    
       
    var hid=query.hid
    var status=query.status
    var dphone=query.dphone
    

    var sql=`select count(bid) as cnt from appointments where bid=${bid}`;

    if(status !=undefined){
        sql=sql+` and status=${status}`
    }
    if(dphone !=undefined){
        sql =sql+` and dphone=${dphone}`
    }

    con.query(sql, function (err, result) {
    if (err) {
        console.log("connection failed"+err.stack)
        let temp={'action':'some-error'}
        res.end(JSON.stringify(temp))
            }
        else{
            var count=result[0]['cnt']
            let temp={'action':count}
            res.end(JSON.stringify(temp))  
            
            }
              
        
    });   

    
})


app.listen(3000)
