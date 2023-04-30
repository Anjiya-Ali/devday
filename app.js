const express = require("express");
const session = require('express-session');
var mysql = require('mysql');
const app = express();
const fs = require('fs');
var nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const secret = crypto.randomBytes(32).toString('hex');

var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: 'Systems'
  });
  
con.connect(function(err){
    if (err) throw err;
    console.log("Connected!");
});

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "pug");

app.use(express.static(__dirname + '/frontend/public'));

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
}));

function generateUniqueRandomNumber() {
    const randomBytes = crypto.randomBytes(3);
    const randomNumber = parseInt(randomBytes.toString('hex'), 16) % 100000;
    const filePath = './used-random-numbers.txt';
  
    let usedNumbers = [];
    if (fs.existsSync(filePath)) {
      usedNumbers = fs.readFileSync(filePath, 'utf8').split(',');
    }
  
    while (usedNumbers.includes(randomNumber.toString())) {
      const randomBytes = crypto.randomBytes(3);
      const randomNumber = parseInt(randomBytes.toString('hex'), 16) % 100000;
    }
  
    usedNumbers.push(randomNumber.toString());
    fs.writeFileSync(filePath, usedNumbers.join(','));
  
    return randomNumber.toString().padStart(5, '0');
  }

  app.post('/login', (req, res) => {
    var emaill=req.body.email;
    var passwordd=req.body.password;
    
    var sql= `SELECT * from users where email = '${emaill}' AND password = '${passwordd}'`;
    
    con.query(sql, function (err, result, fields){
        if (result.length<=0){
            res.status(200).render('index1.pug',{message1: '* Email/Password is invalid'});
        }
        else{
            req.session.userId = result[0].Id;
            res.redirect('/');
        }
    });
    
});
app.post('/signup', (req, res) => {
    var emaill=req.body.email;
    var fnamee=req.body.fname;
    var lnamee=req.body.lname;
    var passwordd=req.body.password;
    if(passwordd.length===0 || emaill.length===0||fnamee.length===0||lnamee.length===0)
    {
        res.status(200).render('index1.pug',{message1:'',message2: '*Please provide all fields'});
    }
    else{
        var sql= `SELECT * from users where email = '${emaill}'`;
        con.query(sql, function (err, result, fields){
            if(result.length>0)
            {
                res.status(200).render('index1.pug',{message1:'',message2: '*Email already exists'});
            }
            else{
                var sql= `Insert into users(FirstName,LastName,Email,Password) values('${fnamee}','${lnamee}','${emaill}','${passwordd}')`;
                con.query(sql, function (err, result, fields){
                    console.log("users data has been inserted");
                    res.status(200).render('index1.pug',{message1:'',message2: '*Account has been created please login'});
                });
            }
        });
        
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get("/", function (req, res) {
    if (req.session.userId) {
        var sql= `SELECT * FROM organization`;
        con.query(sql, function (err, result){
            const results = {
                data: []
              };
              
              for (let i = 0; i < result.length; i++) {
                results.data.push({
                  id: result[i].Id,
                  name: result[i].Name
                });
              }
        res.render('home', { organizations: results , errorMsg: ""});
    });
    } else {
        res.sendFile(__dirname + "/frontend/index.html");
    }
});

app.get("/organization/:id", (req, res) => {
    if (!req.session.userId) {
        res.redirect('/');
    }

    var sql= `SELECT * FROM organization`;
        con.query(sql, function (err, result){
            const results = {
                data: []
              };
              
              for (let i = 0; i < result.length; i++) {
                results.data.push({
                  id: result[i].Id,
                  name: result[i].Name
                });
              }
        const orgId = req.params.id;
        const orgDetails = {
        organizations: results,
        name: "",
        id: orgId,
        projects: [
        ]
        };
        var sql1= `SELECT * FROM organizationprojects join projects on organizationprojects.ProjectId = projects.Id where OrganizationId = ${orgId}`;
        con.query(sql1, function (err, result1){
            for (let i = 0; i < result1.length; i++) {
                orgDetails.projects.push({
                id: result1[i].Id,
                name: result1[i].Name
                });
            }
            var sql2= `SELECT * FROM organization where Organizationid = ${req.params.id}`;
            con.query(sql1, function (err, result2){
                orgDetails.name = result2.Name
            });

            res.render("organization-details", { orgId: orgId, orgDetails: orgDetails });
        });
    });
});

app.get("/project/:id", (req, res) => {
    if (!req.session.userId) {
        res.redirect('/');
    }

    const projID = req.params.id;
    var sql= `SELECT * FROM projects where Id = ${projID}`;
        con.query(sql, function (err, result){
            const projDetails = {
                name: result[0].Name,
                id: projID,
                key: result[0].Key,
                members: [
                ]
            };
            var sql1= `SELECT * FROM userprojects join users on userprojects.UserId = users.Id where projectId = ${projID}`;
            con.query(sql1, function (err, result1){
                for (let i = 0; i < result1.length; i++) {
                    projDetails.members.push({
                    id: result1[i].Id,
                    name: result1[i].FirstName
                    });
                }
            });

    useridd = req.session.userId
    var sql4= `SELECT * FROM managers where UserId = ${useridd}`;
        con.query(sql4, function (err, result4){
            if (result4.length < 0){
                res.render("project-details", { projID: projID, projDetails: projDetails, role: "member" });
            }
            else{
                res.render("project-details", { projID: projID, projDetails: projDetails, role: "manager" });
            }
    });
    });
});

app.get("/organization/:id/projects", (req, res) => {
    if (!req.session.userId) {
        res.redirect('/');
    }
    const orgId = req.params.id;

    con.query(sql, function (err, result){
        const results = {
            data: []
          };
          
          for (let i = 0; i < result.length; i++) {
            results.data.push({
              id: result[i].Id,
              name: result[i].Name
            });
          }
    const orgId = req.params.id;
    const orgDetails = {
    organizations: results,
    name: "",
    id: orgId,
    projects: [
    ]
    };
    var sql1= `SELECT * FROM organizationprojects join projects on organizationprojects.ProjectId = projects.Id where OrganizationId = ${orgId}`;
    con.query(sql1, function (err, result1){
        for (let i = 0; i < result1.length; i++) {
            orgDetails.projects.push({
            id: result1[i].Id,
            name: result1[i].Name
            });
        }
        var sql2= `SELECT * FROM organization where Organizationid = ${req.params.id}`;
        con.query(sql1, function (err, result2){
            orgDetails.name = result2.Name
        });

        res.render("organization-details", { orgId: orgId, orgDetails: orgDetails });
    });
    });
});

app.get("/organization/:id/workitems", (req, res) => {
    if (!req.session.userId) {
        res.redirect('/');
    }
    const orgId = req.params.id;
    const userr=req.session.userId;
    const sql = `SELECT * FROM projectwork pw INNER JOIN userprojects up ON pw.ProjectId = up.ProjectId INNER JOIN organizationprojects op ON pw.ProjectId = op.ProjectId WHERE up.UserId = ${userr} AND op.OrganizationId = ${orgId}`;
    con.query(sql, function (err, result, fields){
        if(result === null || result === undefined || result.length <= 0){
            res.render("items-details", { msg:'No Work Item Due' });
        }
        else{
            const results = { data: [] };
            var que=`SELECT * from organization`;
            con.query(que, function (err, result1, fields){
                if (result1.length>0){
                    for (let i = 0; i < result1.length; i++) {
                        const organization = result1[i];
                        const orgObject = {
                          id: organization.Id,
                          name: organization.Name
                        };
                        results.data.push(orgObject);
                      }
                   
                }
            });
            
            var que=`SELECT * from organization WHERE Id=${orgId}`;
            con.query(que,function(err,result2,fields)
            {
                var que=`SELECT * from workitems WHERE Id=${result[0].UserId}`;
                con.query(que,function(err,result3,fields)
                {
                    var que=`SELECT * from projects WHERE Id=${result[0].ProjectId}`;
                    con.query(que,function(err,result4,fields)
                    {
                        
                        for (var i = 0; i < result3.length; i++) {
                            console.log(result3[i].Id)
                            console.log(result3[i].Name)
                            console.log(result4[0].Name)
                            console.log(results)
                            console.log(result2[0])
                        };
                        let workitems = [];

                        for (let i = 0; i < result3.length; i++) {
                            let workitem = {
                                id: result3[i].Id,
                                name: result3[i].Name,
                                project: result4[0].Name
                            };

                            workitems.push(workitem);
                        }

                        const workitemsDetails = {
                            organizations: results,
                            name: result2[0].Name,
                            orgid: orgId,
                            id: orgId,
                            workitems: workitems
                        };

                          res.render("items-details", { orgId: orgId, workitemsDetails: workitemsDetails });       
                    });
                }); 
            });
        }
    });
});

app.get("/workitems/:id", (req, res) => {
    if (!req.session.userId) {
        res.redirect('/');
    }
    const projID = req.params.id;

    var sql3 = `SELECT * FROM projects where Id = ${projID}`;
    con.query(sql3, function (err, result3){
        if (err) throw err;
    var workDetails = {
        name: result3[0].Name,
        id: projID,
        key: result3[0].Key,
        items: [
        ]
    };
    var sql2 = `SELECT * FROM workitems join projectwork on workitems.Id = projectwork.WorkitemId where ProjectId = '${projID}' and Nature = 'bug' or Nature = 'task'`;
    con.query(sql2, function (err, result2){
            for (let i = 0; i < result2.length; i++) {
                work_id = result2[i].Id
                var sql120 = `Select FirstName from userwork uw, users u where u.Id = uw.userId and uw.WorkitemId = '${work_id}'`;
                con.query(sql120, function (err, result120){
                    console.log(result120[0].FirstName)
                    workDetails.items.push({
                        id: result2[i].Id,
                        name: result2[i].Name,
                        state: result2[i].State,
                        start_date: result2[i].Start_Date,
                        assign_to: result120[0].FirstName,
                    });
                });
            }
    });
    res.render("items-listing", { projID: projID, workDetails: workDetails });
    });

});

app.get("/backlog/:id", (req, res) => {
    if (!req.session.userId) {
        res.redirect('/');
    }
    const projID = req.params.id;

    //only those items whose nature is user story
    var sql3 = `SELECT * FROM projects where Id = '${projID}'`;
    con.query(sql3, function (err, result3){
        if (err) throw err;
    const workDetails = {
        name: result3[0].Name,
        id: projID,
        key: result3[0].Key,
        items: [
        ]
    };
    var sql2 = `SELECT * FROM workitems join projectwork on workitems.Id = projectwork.WorkitemId where ProjectId = '${projID}' and Nature = 'story'`;
    con.query(sql2, function (err, result2){
            for (let i = 0; i < result2.length; i++) {
            workDetails.items.push({
                id: result2[i].Id,
                name: result2[i].Name,
                state: result2[i].State,
            });
            }
    res.render("backlog", { projID: projID, workDetails: workDetails });
    });
    });
});

app.get("/delete_item/:projid/:id", (req, res) => {
    if (!req.session.userId) {
        res.redirect('/');
    }
    const itemID = req.params.id;
    const projID = req.params.projid;

    var sql= `DELETE from userwork where WorkitemId = '${itemID}'`;
    con.query(sql, function (err, result, fields){
        console.log("userwork data has been deleted");
    });
    var sql= `DELETE from projectwork where WorkitemId = '${itemID}'`;
    con.query(sql, function (err, result, fields){
        console.log("userwork data has been deleted");
    });
    var sql= `DELETE from workitems where Id = '${itemID}'`;
    con.query(sql, function (err, result, fields){
        console.log("userwork data has been deleted");
    });


    res.redirect(`/workitems/${projID}`);
});

app.get("/delete_member/:projid/:id", (req, res) => {
    if (!req.session.userId) {
        res.redirect('/');
    }
    const memberID = req.params.id;
    const projID = req.params.projid;

    var sql= `DELETE from userprojects where UserId = '${memberID}' AND ProjectId = '${projID}'`;
    con.query(sql, function (err, result, fields){
        console.log("userprojects data has been deleted");
    });

    res.redirect(`/project/${projID}`);
});


app.post('/create-organization',(req, res)=>{
    var namee=req.body.name;
    var countryy=req.body.country;
    var sql1 = `INSERT INTO organization (Name,Country) VALUES ('${namee}', '${countryy}')`;
    con.query(sql1, function (err, result){
        if (err) throw err;
        console.log("Organization Data Has Been Inserted");
    });
    res.redirect("/");
});

app.post('/create-project',(req, res)=>{
    var namee=req.body.name;
    var key = generateUniqueRandomNumber()
    var sql1 = `INSERT INTO projects (Name,\`Key\`) VALUES ('${namee}', '${key}')`;
    con.query(sql1, function (err, result){
        if (err) throw err;
        console.log("Project Data Has Been Inserted");
    });
    var sql2 = `SELECT * FROM projects where \`Key\` = ${key}`;
    con.query(sql2, function (err, result2){
        if (err) throw err;
        var projectid = result2[0].Id
    var id = req.session.userId;
    var idd = req.body.idd;
    var sql3 = `INSERT INTO organizationprojects (OrganizationId, ProjectId) VALUES ('${idd}', '${projectid}')`;
    con.query(sql3, function (err, result3){
        if (err) throw err;
        console.log("organizationprojects Data Has Been Inserted");
    });
    var sql1 = `INSERT INTO managers (UserId,ProjectId) VALUES ('${id}', '${projectid}')`;
    con.query(sql1, function (err, result){
        if (err) throw err;
        console.log("managers Data Has Been Inserted");
    });
    var sql1 = `INSERT INTO userprojects (ProjectId,UserId) VALUES ('${projectid}', '${id}')`;
    con.query(sql1, function (err, result){
        if (err) throw err;
        console.log("userprojects Data Has Been Inserted");
    });

    res.redirect(`/organization/${idd}`);
});
});

app.post('/join-project',(req, res)=>{
    var keyy = req.body.keyy
    var sql1 = `SELECT * FROM projects where \`Key\` = ${keyy}`;
    con.query(sql1, function (err, result){
        if (err) throw err;
        if (result.length <= 0){
            if (req.session.userId) {
                var sql= `SELECT * FROM organization`;
                con.query(sql, function (err, result){
                    const results = {
                        data: []
                      };
                      
                      for (let i = 0; i < result.length; i++) {
                        results.data.push({
                          id: result[i].Id,
                          name: result[i].Name
                        });
                      }
                    errorMsg = "No Such Projects"
                res.render('home', { organizations: results , errorMsg: errorMsg});
            });
            } else {
                res.sendFile(__dirname + "/frontend/index.html");
            }
        }
        else{
            var id = req.session.userId;
            var sql2 = `SELECT * FROM projects where \`Key\` = ${keyy}`;
            con.query(sql2, function (err, result2){
                if (err) throw err;
                var projectid = result2[0].Id
            var sql1 = `INSERT INTO userprojects (ProjectId,UserId) VALUES ('${projectid}', '${id}')`;
            con.query(sql1, function (err, result){
                if (err) throw err;
                console.log("userprojects Data Has Been Inserted");
            });
        });
        }
    var idd = req.body.idd;
    res.redirect(`/organization/${idd}`);
    });
});

app.post('/invite-member',(req, res)=>{
    var namee = req.body.name
    var id = req.body.id
    var sql2= `SELECT * FROM projects where Id = '${id}'`;
    con.query(sql2, function (err, result2){
    var keyyy = result2[0].Key
    var sql4= `SELECT * FROM users where FirstName = '${namee}'`;
    con.query(sql4, function (err, result){
        console.log(result[0].FirstName)
        console.log(result[0].Email)
        if (result.length <= 0){
            res.render("/");
        }
        else{
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                user: 'advancetourguides@gmail.com',
                pass: 'crbvfzyiabzawftb'
                }
            });
            var mailOptions = {
                from: 'advancetourguides@gmail.com',
                to: `${result[0].Email}`,
                subject: 'PROJECT INVITATION',
                text: `Please join the project having project key: ${keyyy}`
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent: ' + info.response);
                res.render('/');
                }
            });
            res.redirect(`/project/${id}`);
        }
    });
    });
});

app.post('/add-item',(req, res)=>{
    var name = req.body.name
    var nature = req.body.nature
    var sdate = req.body.sdate
    var edate = req.body.edate
    var assign = req.body.assign
    var project_id = req.body.project_id
    var sql= `Insert into workitems(Name,Nature,State,StartDate) values('${name}','${nature}','New','${sdate}')`;
    con.query(sql, function (err, result, fields){
        console.log("workitems data has been inserted");
    });
    var idd = req.session.userId
    var sql2 = `SELECT * FROM workitems where Name = '${name}'`;
    con.query(sql2, function (err, result2){
        if (err) throw err;
        var work_id = result2[0].Id
    var sql= `Insert into userwork(UserId,WorkitemId) values('${idd}','${work_id}')`;
    con.query(sql, function (err, result, fields){
        console.log("workitems data has been inserted");
    });
    var sql= `Insert into projectwork(ProjectId,WorkitemId) values('${project_id}','${work_id}')`;
    con.query(sql, function (err, result, fields){
        console.log("workitems data has been inserted");
    });
    res.redirect(`/workitems/${project_id}`);
    });
});

app.post('/updatingStatus', (req, res) => {
    if (!req.session.userId) {
        res.redirect('/');
    }
    var task=req.body.task;
    var status=req.body.status;
    if(status.length===0 || task.length===0)
    {
        res.status(200).render('backlog.pug',{msg:'*Please provide all fields'});
    }
    else{
        var sql= `SELECT * from workitems where Id = '${task}'`;
        con.query(sql, function (err, result, fields){
            if(result.length>0)
            {
                var sql= `UPDATE workitems SET state = '${status}' WHERE id = ${task}`;
                con.query(sql, function (err, result, fields){
                    console.log("Updation has been done sucessfully");
                });
            }
            else{

            }
        res.redirect(`/backlog/${task}`);
    });
    }
});

app.listen(3000, function () {
    console.log("Server is running on localhost3000");
});
