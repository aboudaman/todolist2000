import React from 'react';



const Name = (props) => {

    return(
        <div>
            <br />
            <h2>This is Testing Name Props called {props.nameProps} </h2>
            <button type="button" className="btn btn-success" onClick = {props.sayHelloProps}  >Click Me</button>
            <br /><br />
        </div>
    )

}

export default Name

