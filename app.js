const express = require("express");
const session = require('express-session');
const app = express();

const crypto = require('crypto');
const secret = crypto.randomBytes(32).toString('hex');

app.set("view engine", "pug");

app.use(express.static(__dirname + '/frontend/public'));

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
}));
  
app.post('/login', (req, res) => {
    //add your login logic insha to authenticate and then set the user id = session id from database :)
    req.session.userId = 1;
    res.redirect('/');
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get("/", function (req, res) {
    if (req.session.userId) {
        const results = {
            data: [
                {
                    id:1,
                    name:"Organization 1"
                },
                {
                    id:2,
                    name:"Organization 2"
                }
            ]
        }
        res.render('home', { organizations: results });
    } else {
        res.sendFile(__dirname + "/frontend/index.html");
    }
});

app.get("/organization/:id", (req, res) => {
    if (!req.session.userId) {
        res.redirect('/');
    }

    // const query = 'SELECT * FROM organizations'; // Replace organizations with your actual table name
    // const { rows } = await pool.query(query);
    // const data = rows.map(({ id, name }) => ({ id, name }));

    const orgId = req.params.id;
    const results = {
        data: [
            {
                id:1,
                name:"Organization 1"
            },
            {
                id:2,
                name:"Organization 2"
            }
        ]
    }
    const orgDetails = {
      organizations: results,
      name: "Organization 1",
      id: orgId,
      projects: [
        {
          id: 1,
          name: "Project 1"
        },
        {
          id: 2,
          name: "Project 2"
        }
      ]
    };
    res.render("organization-details", { orgId: orgId, orgDetails: orgDetails });
});

app.get("/project/:id", (req, res) => {
    if (!req.session.userId) {
        res.redirect('/');
    }

    const projID = req.params.id;
    const projDetails = {
        name: "Project 1",
        id: projID,
        key: '123',
        members: [
          {
            id: 1,
            name: "Anjiya"
          },
          {
            id: 2,
            name: "Insha"
          }
        ]
    };

    //the role can be manager or member based on session.userID

    res.render("project-details", { projID: projID, projDetails: projDetails, role: "manager" });
});

app.get("/organization/:id/projects", (req, res) => {
    if (!req.session.userId) {
        res.redirect('/');
    }
    const orgId = req.params.id;

    const results = {
        data: [
            {
                id:1,
                name:"Organization 1"
            },
            {
                id:2,
                name:"Organization 2"
            }
        ]
    }
    const orgDetails = {
      organizations: results,
      name: "Organization 1",
      id: orgId,
      projects: [
        {
          id: 1,
          name: "Project 1"
        },
        {
          id: 2,
          name: "Project 2"
        }
      ]
    };
    res.render("organization-details", { orgId: orgId, orgDetails: orgDetails });
});

app.get("/organization/:id/workitems", (req, res) => {
    if (!req.session.userId) {
        res.redirect('/');
    }
    const orgId = req.params.id;
   
    const results = {
        data: [
            {
                id:1,
                name:"Organization 1"
            },
            {
                id:2,
                name:"Organization 2"
            }
        ]
    }

    const workitemsDetails = {
      organizations: results,
      name: "Organization 1",
      orgid: orgId,
      id: orgId,
      workitems: [
        {
          id: 1,
          name: "work item 1",
          project: "Project 1"
        },
        {
          id: 2,
          name: "work item 2",
          project: "Project 2"
        }
      ]
    };
    res.render("items-details", { orgId: orgId, workitemsDetails: workitemsDetails });
});

app.get("/workitems/:id", (req, res) => {
    if (!req.session.userId) {
        res.redirect('/');
    }
    const projID = req.params.id;

    //only those items whose nature is task or bug

    const workDetails = {
        name: "Project 1",
        id: projID,
        key: '123',
        items: [
          {
            id: 1,
            name: "work item 1",
            state: "New",
            start_date: "12/2/2023",
            assign_to: "Anjiya"
          }
        ]
    };

    res.render("items-listing", { projID: projID, workDetails: workDetails });
});

app.get("/backlog/:id", (req, res) => {
    if (!req.session.userId) {
        res.redirect('/');
    }
    const projID = req.params.id;

    //only those items whose nature is user story

    const workDetails = {
        name: "Project 1",
        id: projID,
        key: '123',
        items: [
          {
            id: 1,
            name: "work item 1",
            state: "New",
          }
        ]
    };

    res.render("backlog", { projID: projID, workDetails: workDetails });
});

app.get("/delete_item/:projid/:id", (req, res) => {
    if (!req.session.userId) {
        res.redirect('/');
    }
    const itemID = req.params.id;
    const projID = req.params.projid;

    //delete krdena is begairat item ko database se


    res.redirect(`/workitems/${projID}`);
});

app.get("/delete_member/:projid/:id", (req, res) => {
    if (!req.session.userId) {
        res.redirect('/');
    }
    const memberID = req.params.id;
    const projID = req.params.projid;

    //delete krdena is begairat item ko database se


    res.redirect(`/project/${projID}`);
});


app.listen(3000, function () {
    console.log("Server is running on localhost3000");
});
