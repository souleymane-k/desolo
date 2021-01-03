import React from 'react'

class ErrorBoundry extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            hasError:false
        };
    }
    static getDerivvedStateFromError(){
        return {hasError:true}
    }
    render(){
        if(this.state.hasError){
            return (
                <h2>Could not add this input</h2>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundry;