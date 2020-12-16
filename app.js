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

app.listen(3000)
