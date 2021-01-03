import React, {Component} from 'react';
import ValidationError from "../ValidationError/ValidationError";
import ApiContext from '../ApiContext'
import './AddNote.css'
import {API_ENDPOINT}  from '../config.js'
import ErrorBoundry from '../ErrorBoundry/ErrorBoundry'


class AddNote extends Component {
    constructor(props) {
      super(props);
      this.state = {
         name: {
          value: "",
          touched: false
        }, 
        content: {
            value: "",
            touched: false
        },  
        folderChoice:{
            value: "",
            touched:false  
        }    ,
        error:null,  
      };
    }

   static contextType = ApiContext;

   updateName = (name) => {
      this.setState({ name: { value: name, touched: true } });
    }

   updateContent = (content) => {
      this.setState({ content: { value: content, touched: true } });
    }

    updateFolderSelected= (folder) => {
       this.setState({ folderChoice: { value: folder, touched: true } });
    }


   handleSubmit = e => {
        e.preventDefault();
        // get the form fields from the event
        const {name, content, folderChoice} = e.target;
        

        const note = {
            name:name.value,
            content:content.value,
            folderId:folderChoice.value,
           
          }
       
      this.setState({ error: null })

      fetch(`${API_ENDPOINT}/notes/`,{
            method: 'POST',
            body: JSON.stringify(note),
            headers: {
             'content-type': 'application/json',
              'Accept': 'application/json'
            }
        })
          .then(async res => {
            if (!res.ok) {
             
              return res.json().then(error => {
              
                throw error
              })
            }
            return res.json()
          })
          .then(data => {
            name.value = '';
            content.value='';
            folderChoice.value='';
            this.props.history.push('/')
            this.context.addNote(data);
            
          })
          .catch(error => {
              this.setState({ error })
          })
      }
   


    validateName() {
      const name = this.state.name.value.trim();
      if (name.length === 0) {
        return "Name is required";
      } else if (name.length < 3) {
        return "Name must be at least 3 characters long";
      }
    }

    validateContent() {
        const content = this.state.content.value.trim();
        if (content.length === 0) {
            return "Content is required";
        } 
      }

    validateFolderSelected() {
        const folderChoice = this.state.foldervalue;
        
        if (!folderChoice) {
          
            return "Please choose a folder to put your new note in";
        } 
      }
  
    
    render() {
        const nameError = this.validateName();
        const contentError = this.validateContent();
  
        
        const foldersObj = this.context.folders;
        const folderOptions = foldersObj.map((folder,i)=>
              <option value={folder.id} key={i}>{folder.name}</option>);

        
      
      return (
        <form className="add-note-form" onSubmit={e => this.handleSubmit(e)}>
          <ErrorBoundry>
          <h2>Add Note</h2>
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
              onChange={e => this.updateName(e.target.value)}
            />
            {this.state.name.touched && <ValidationError message={nameError} />}
          </div>
          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              type="textarea"
              className="form__input"
              name="content"
              id="content"
              onChange={e => this.updateContent(e.target.value)}
            />
           {this.state.content.touched && <ValidationError message={contentError} />}
          </div>
          <div className="form-group">
            <label htmlFor="folder-options"> Select Folder *</label>
            <select
                id="folderChoice"
                name="folderChoice"
                onChange={e => this.updateFolderSelected(e.target.value)}>
                 <option value="">Select one...</option>
                {folderOptions}
                ))
            </select>
           
          </div>
         <div className="form__button__group">
            
            <button
              type="submit"
              className="form__button"
              disabled={
                this.validateName() ||
                this.validateContent() 
                // this.validateFolderSelected()        
              }
            >
              Create Note
            </button>
            <button type="reset" className="form__button"
              onClick={this.handleClickCancel}
            >
              Cancel
            </button>
          </div>
          </ErrorBoundry>
        </form>
      );
    }
  }

export default AddNote;