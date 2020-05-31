import React, { Component } from 'react';
import axios from 'axios';
import './index.css';
import  'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min';

class App extends Component {
  constructor(props)
  {
    super(props);
  this.state = {
    search: null,
   object: [],
   id : 0,
   check: false,
   name: "",
   phoneNumber: "",
   email: "",
   dateOfBirth: "",
   showMe: false,
   val: "Add Contacts",
   show: false,
   visible:3
  }
  }
componentDidMount = () => {
   this.print();
}

// get data from the database
print = () => 
{
  axios.get('/home').then((response) =>
  {
    const data = response.data;
    this.setState(
      {
        object: data ,
         id: 0,
        name: "",
        phoneNumber: "",
        email: "",
        dateOfBirth: ""
      }
    );
    console.log("recieved");
  }).catch (() => {
    console.log('not received');
  });
}

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };


      //insert data and update data
  handleSubmit (event,id) {
    event.preventDefault();

  if(id === 0 )
  {
    axios.post('/home',{name:this.state.name,phoneNumber:this.state.phoneNumber,email:this.state.email, dateOfBirth:this.state.dateOfBirth})
      .then(() => {
        console.log('Data has been sent to the server');
         this.componentDidMount();
        this.resetUserInputs();
      })
      .catch(() => {
        console.log('Internal server error');
      });
  }
  else{
    console.log("here");
    axios.put(`/home/${id}`,{name:this.state.name,phoneNumber:this.state.phoneNumber,email:this.state.email,dateOfBirth:this.state.dateOfBirth})
    .then(() => {
         this.componentDidMount();
           this.resetUserInputs();
        console.log('Data has been updated to the server');
      })
      .catch(() => {
        console.log('Internal server error');
      });
  }
  };

     //reset input fields
   resetUserInputs= () =>{
     this.setState({
       name: "",
     phoneNumber: "",
     email: "",
     dateOfBirth: ""
   });
   }

   //delete data from database
deleteContact = (id) =>{
  axios.delete(`/home/${id}`).then((response)=>
  {
    this.componentDidMount();
  console.log("deleted");
  }).catch(()=> {
    console.log("not deleted");
  });
}
 //edit function
 editContact = (id) => 
 {
   axios.get(`/home/${id}`).then((response)=>
   {
     this.setState({
       id: response.data._id,
       name:response.data.name,
       phoneNumber:response.data.phoneNumber,
       email: response.data.email,
       dateOfBirth:response.data.dateOfBirth,
       show : true,
     })
   });
 }

  //details of the contact 
  detailContact =(id) =>
  {
    axios.get(`/home/${id}`).then((response)=>
   {
     this.setState({
       id: response.data._id,
       name:response.data.name,
       phoneNumber:response.data.phoneNumber,
       email: response.data.email,
       dateOfBirth:response.data.dateOfBirth,
       check : true,
       visible: 3
     })
   });

   this.loadMore = this.loadMore.bind(this);
  }

   //to show Add form
 handleModal= (event)=>{
   this.resetUserInputs();
   this.setState({
     showMe: !this.state.showMe
   });
 }

 handleModal2= (event)=>{
   this.setState({
     show: !this.state.show
   });
 }

handleModal3= (event)=>{
   this.setState({
     check: !this.state.check
   });
 }

  //search contacts
searchContact=(event) =>
{
   event.preventDefault();
    let name1 = event.target.value;
   this.setState({
    search: name1.toLowerCase()
   })
}

  //load more contacts

loadMore= (event) =>
{
 this.setState({
   visible: this.state.visible + 1
 })
}

showLess= (event) =>
{
 this.setState({
   visible: this.state.visible - 1
 })
}
render()
{
  
  return (
     <div class = "conatiner">
      {this.state.showMe === false  && this.state.show === false  && this.state.check === false?
     <div class="jumbotron">
      <input type = "text" className = "form-control" placeholder="Search Contacts...." id="search" 
      onChange={(e)=>this.searchContact(e)}/>
      <h2>Contacts</h2>
      <div class="row">
            <div class="col-md-12">
                <div class="pull-right">
                    <button className="btn btn-primary" onClick={(e)=>this.handleModal(e)}>Add New Contacts</button>
                </div>
            </div>
        </div> <br/>
  <table className="table table-striped" style ={{ border: "3px solid gray"}}>
  <thead>
  <th>Name</th>
  <th>MobileNo.</th>
  <th>Edit</th>
  <th>Delete</th></thead>
  <tbody>
  {
    this.state.object.filter((object) =>{
      if(this.state.search === null)
      return object
      else if(object.name.toLowerCase().includes(this.state.search))
      return object
    }).splice(0,this.state.visible).map((each) =>
       <tr key= {each._id}>
  <td><button onClick={(e)=>this.detailContact(each._id)}> + </button> {each.name} </td>
  <td>{each.phoneNumber}</td>
  <td><button className="btn btn-success" onClick={(e)=>this.editContact(each._id)}>Edit</button></td>
  <td><button className="btn btn-danger"  onClick={(e)=>this.deleteContact(each._id)}>Delete</button></td>
  </tr>
    )
  }
  </tbody>
  </table>
  <div class="row">
            <div class="col-md-12">
                <div class="pull-right">
                   
              <button className="btn btn-outline-secondary" onClick={this.loadMore}>Load More...</button>
                <button className="btn btn-outline-secondary" onClick={this.showLess}>Show Less...</button>
                </div>
            </div>
        </div>
   </div>: (this.state.show === false && this.state.showMe === true && this.state.check === false) ? 
   
   <div className="form">
    
    <form onSubmit={(e)=>this.handleSubmit(e,this.state.id)} className="add">
     <h5>Add Contacts<button className="close" onClick={(e)=>{this.handleModal(e)}}>X</button></h5><br/>
       <p> <label>
          Name:<br/>
          <input type="text" placeholder="Name" className="form-control" name ="name" value={this.state.name} onChange={this.handleChange} required/>
        </label></p>
        <p><label>
          Mobile Number:<br/>
          <input type="text" placeholder="+91 XXXXXXXXXX"  className="form-control" name="phoneNumber" value={this.state.phoneNumber} onChange={this.handleChange} required/>
        </label></p>
        <p><label>
          Email:<br/>
          <input type="email" placeholder="abc@gmail.com"  className="form-control" name = "email" value={this.state.email} onChange={this.handleChange}/>
        </label></p>
        <p><label>
          DOB:<br/>
          <input type="text" placeholder="dd/mm/yyyy"  name="dateOfBirth" className="form-control"  value={this.state.dateOfBirth}  onChange={this.handleChange}/>
        </label></p>
        <p><input type="submit" value="Submit"  className="btn btn-success"/></p>
      </form>
    </div>:   (this.state.showMe === false && this.state.show === true && this.state.check === false)?
   < div className="form">
    
    <form onSubmit={(e)=>this.handleSubmit(e,this.state.id)} className="add">
     <h5>Update Contacts<button className="close" onClick={(e)=>{this.handleModal2(e)}}>X</button></h5><br/>
       <p> <label>
          Name:<br/>
          <input type="text" placeholder="Name" className="form-control" name ="name" value={this.state.name} onChange={this.handleChange} required/>
        </label></p>
        <p><label>
          Mobile Number:<br/>
          <input type="text" placeholder="+91 XXXXXXXXXX"  className="form-control" name="phoneNumber" value={this.state.phoneNumber} onChange={this.handleChange} required/>
        </label></p>
        <p><label>
          Email:<br/>
          <input type="email" placeholder="abc@gmail.com"  className="form-control" name = "email" value={this.state.email} onChange={this.handleChange}/>
        </label></p>
        <p><label>
          DOB:<br/>
          <input type="text" placeholder="dd/mm/yyyy"  name="dateOfBirth" className="form-control"  value={this.state.dateOfBirth}  onChange={this.handleChange}/>
        </label></p>
        <p><input type="submit" value="Submit"  className="btn btn-success"/></p>
      </form>
    </div>:(this.state.show === false && this.state.showMe === false && this.state.check === true)
? < div className="form">
    
    <form className="add">
     <h5>Details of Contact<button className="close" onClick={(e)=>{this.handleModal3(e)}}>X</button></h5><br/>
       <p>Name: {this.state.name}</p>
        <p>MobileNumber: {this.state.phoneNumber}</p>
        <p>Email: {this.state.email}</p>
        <p>DOB: {this.state.dateOfBirth}</p>
      </form>
    </div>
    :null}
   </div>
  );   
} 
}
export default App;
