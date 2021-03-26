import React, {Component} from 'react';
import ValidationError from "../ValidationError/ValidationError";
import './AddFolder.css'
import {API_ENDPOINT} from '../config'
import ApiContext from '../ApiContext';
import ErrorBoundry from '../ErrorBoundry/ErrorBoundry'

class AddFolder extends Component {
    constructor(props) {
      super(props);
      
      this.state = {
        name: {
          value: "",
          touched: false
        },    
        error:null,   
      };
    }

    static contextType = ApiContext;
  
   
   updateName = (name)=> {
      this.setState({ name: { value: name, touched: true } });
    }

   handleSubmit = e => {
         e.preventDefault();
        const {name} = e.target;
        const folder = {
            name:name.value,
          }
        this.setState({ error: null })

        fetch(`${API_ENDPOINT}/folders`,{
            method: 'POST',
            body: JSON.stringify(folder),
            // mode: 'no-cors',
             headers: {
             'content-type': 'application/json',
             'Accept': 'application/json'
            },
        })
          .then(async res => {
            if (!res.ok) {
              const error = await res.json();
                throw error;
            }
            return res.json()
          })
          .then(data => {
            name.value = '';
            this.context.addFolder(data);
            console.log(this.props.history);
            this.props.history.push('/')

          })
          .catch(error => {
            this.setState({ error })
          })
      }
  
    validateName = () => {
      const name = this.state.name.value.trim();
      if (name.length === 0) {
        return "Name is required";
      } else if (name.length < 3) {
        return "Name must be at least 3 characters long";
      }
    }
  
    render() {

      const nameError = this.validateName();
      
      return (
        <form className="add-folder" onSubmit={e => this.handleSubmit(e)}>
         <ErrorBoundry>
          <h2>Add Folder</h2>
          <div className='Noteful__error' role='alert'>
             {this.state.error && <p>Something didn't work, please try again</p>}
          </div>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              className="form__input"
              name="name"
              id="name"
              required
              onChange={e => this.updateName(e.target.value)}
            />
            {this.state.name.touched && <ValidationError message={nameError} />}
          <button type="submit">Save</button>
                </div>
          </ErrorBoundry>
        </form>
      );
    }
  }

export default AddFolder;

