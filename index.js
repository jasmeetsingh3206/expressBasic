const Joi= require('joi');
const { response } = require('express');
const express = require('express')
const app = express()
const port = 3000;

app.use(express.json());


const courses=[
    {id:1, nameis:'maths'},
    {id:2, nameis:'pps'},
    {id:3, nameis:'discretemaths'},
    {id:4, nameis:'thermodynamics'},
    {id:5, nameis:'digital signal processing'},
];

//function to apply the validation logic
function validatename(course)//recieving req.body from the calling function
{
  //defining schema using JOI
  const schema={
    nameis: Joi.string().min(3).required()
  };
  return Joi.validate(course, schema);
}


app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/courselist', (req, res) => {
    res.send(courses);

  });

  app.get('/course/:id', (req, res) => 
  {
    //getting a cource name from a specified id, if it's valid.
    const course=  courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send("No such course found broo!");
    else  res.send(course);
  });


  app.post('/addnewcourse', (req, res) => 
  {
    const result= validatename(req.body);
    if(result.error)
    {
      res.status(400).send(result.error.details[0].message);
      return;
    }
    //can be used to Create an entry in the database. using postman
    const course=
    {
      id: courses.length+1,
      nameis: req.body.nameis
    };
    courses.push(course);
    if(!req.body.nameis)    res.status(404).send("not a valid post request");
    else
    res.send(course);
   
  })


  //updating the records
  app.put('/updatecourse/:id', (req, res) => 
  {
    const course=  courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send("No such course found broo!");
   // res.send(course);
    const result= validatename(req.body);
    if(result.error)
    {
      res.status(400).send(result.error.details[0].message);
      return;
    }
    course.nameis= req.body.nameis;
    res.send(course);
  })

  app.get('/deletecourse/:id', (req, res) => 
  {
    const course=  courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send("No such course found broo!");
   // res.send(course);
    const index= courses.indexOf(course);
    courses.splice(index,1);
    res.send(course);
  });


  app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})