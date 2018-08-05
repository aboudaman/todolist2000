import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Name from './Name';

class App extends Component {

  state = {
    tasks: [],
    color: "",
    newItem: '',
    status: 'pending'
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    fetch('http://localhost:4000/tasks')
    .then(data => data.json())
    .then(tasks => this.setState({tasks: tasks}))
    .catch(error => console.error({error}))
  }

  // Update task in array
  // handleTaskCompletion(task, i) {
    
  //   //get copy of task object 
  //   const { completed } = task

  //   //Get copy of task array
  //   const [...taskCopy] = this.state.tasks 
  //   taskCopy[i] = {...task, completed: !completed}

  //   //Update the array
  //   this.setState({tasks: taskCopy})
  // }

  handleTaskCompletion(task) {
    const {id, completed} = task;

    fetch(`http://localhost:4000/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        completed: !completed
      })
    })
    .then(() => this.getData())

  }


  handleNewTask(event) {
    const newTask = event.target.value;
    this.setState({newItem: newTask})
  }

  handleKeyDown(event) {
    const keyPressed = event.keyCode;

    // Get existing copy of tasks and newItem

    const {newItem} = this.state
    const value =  newItem.trim()

    if (keyPressed === 13) {
      if (value.length === 0) {
        return
      } else {

      //Add to the array
      // this.setState({
      //   tasks: [...tasks, {title: value, completed: false}],
      //   newItem: ''
      // })

      // POST to the database
        fetch('http://localhost:4000/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: value,
            completed: false,
          }),
        })
        .then(() => this.setState({newItem: ''}))
        .catch(error => console.error({error}))
        .then((() => this.getData()))
      }
    }
    
  }

  // Filtering data through an array
  // handleDelete(task, index) {

  //   const {tasks} = this.state
  //   const excludeTask = tasks.filter((task, i) => {
  //     return i !== index
  //   }) 
  //   this.setState({
  //     tasks: excludeTask
  //   });

  // }

  // Handle delete from backend

  handleDelete(id) {
    fetch(`http://localhost:4000/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(() => this.getData())

  }

//on local array leveEdit() {

  //   //Set all to complete
  //   const [...tasksCopy] = this.state.tasks
  //   const allToggled = tasksCopy.every(task => task.completed)

  //   const toggleAllTasks = tasksCopy.map(task => 
  //     ({...task, completed: !allToggled})
  //   )

  //   const checkBoxes = document.querySelectorAll('input[type="checkbox"]')

  //   for (let i=0; i<checkBoxes.length; i++) {
  //       if (!allToggled)
  //         checkBoxes[i].checked = "checked"
  //       else
  //       checkBoxes[i].checked = ""

  //   }
  //   this.setState({
  //     tasks: toggleAllTasks
  //   })
  // }

  // Handle Toggle All on backend

handleEditAll() {
  const {tasks} = this.state

  Promise.all(
    tasks.map(task => fetch(`http://localhost:4000/tasks/${task.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        completed: !task.completed
      })
    })
  
  ) //close map

  )//end promise
  .then(() => this.getData())
}




  // Filters all data from array
  // handleDeleteAll() {
  //   // const {tasks} = this.state
  //   const [...tasksCopy] = this.state.tasks

  //   const allDeletedTasks = tasksCopy.filter(task => !task.completed)

  //   console.log('hi ', allDeletedTasks)

  //   this.setState({
  //     tasks: allDeletedTasks
  //   })
  // }

  //DeleteAll
  handleDeleteAll() {

    const {tasks} = this.state

    const completedTasks = tasks.filter(task => task.completed)

    Promise.all(completedTasks.map(task =>     
      fetch(`http://localhost:4000/tasks/${task.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
        }
      })  
      )
    )
    .then(() => this.getData())
  }


  sayHello(name) {
    alert('Hello!!! ' + name);
    const newStatus = "Completed"
    this.setState({
      status: newStatus
    })
  }
  render() {
    // const {tasks} = this.state

    let num = 0
    // const allToggled = tasks.every(task => task.completed)

    const listItems = this.state.tasks.map((task, i) => 
      <tr key={i}>
        <td> {num++}</td>
        <td style={{color: task.completed? "green":""}}>  {task.title} </td>
        <td><input type="checkbox" className="form-check-input"
          onChange={() => this.handleTaskCompletion(task)}/> 
        </td>
        <td> {this.state.status} </td>
        <td> edit | <span onClick = {() => this.handleDelete(task.id) }>delete</span> </td>
      </tr>
  )
    return (
      <div className="row">
          <div className="col-sm"> 
            <Name 
              nameProps = "Abou"
              sayHelloProps = {() => this.sayHello('abou')}
              
            />
            <h2> Task Manager </h2><br /><br />
            <input onChange = {(event) => this.handleNewTask(event)}
              onKeyDown={(event) => this.handleKeyDown(event)}
              value = {this.state.newItem}
              style = {{marginRight: "20px"}}
            />
            <button type="button" className="btn btn-danger" onClick={() => this.handleDeleteAll()}>Delete ALL</button>
            <br /> <br />
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Task</th>
                  <th scope="col"><input type="checkbox" className="form-check-input" 
                    onChange={() => this.handleEditAll()}/> Check Complete </th>
                  <th scope="col">Status</th>
                  <th scope="col">Admin</th>
                </tr>
              </thead>
              <tbody>
                {listItems}
              </tbody>
            </table>
        
      </div>

    </div>
    );
  }
}

export default App;
