import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import AddFolder from '../AddFolder/AddFolder'
import ErrorBoundry from '../ErrorBoundry/ErrorBoundry'
import AddNote from "../AddNote/AddNote"
import ApiContext from '../ApiContext';
import config from '../config';
import {findNote,getNotesForFolder} from '../notes-helpers'
import './App.css';


class App extends Component {
    state = {
        notes: [],
        folders: []
    };

    componentDidMount() {
        fetch(`${config.API_ENDPOINT}/notes`).then((response) => response.json()).then((json)=> this.setState({notes: json}))
        
        fetch(`${config.API_ENDPOINT}/folders`).then((response) => response.json()).then((json)=> this.setState({folders:  json}))
   

     }


    handleDeleteNote = noteId => {
        this.setState({
            notes: this.state.notes.filter(note => note.id !== noteId)
        });
    };
    handleAddFolder = folder => {
        this.setState({
            folders: [...this.state.folders, folder]
        });
    }
    handleAddNote = note => {
        this.setState({
            notes: [...this.state.notes, note]
        })
    }

    newMethod(error) {
        console.log(error);
    }

    renderNavRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListNav}
                    />
                ))}
                <Route path="/note/:noteId" component={NotePageNav} />
                <Route path="/add-folder" component={AddFolder} />
                <Route path="/add-note" component={AddNote} />
            </>
        );
    }

    renderMainRoutes() {
        const { notes, folders } = this.state
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (

                <Route
                exact
                key={path}
                path={path}
                render={routeProps => {
                const { folderId } = routeProps.match.params
                const notesForFolder = getNotesForFolder(notes, folderId)
                return (
                    <NoteListMain
                    {...routeProps}
                    notes={notesForFolder}
                    />
              )
            }}
            />
                              
                    // <Route
                    //     exact
                    //     key={path}
                    //     path={path}
                    //     component={NoteListMain}
                    // />


                ))}

                {/* <Route 
                path="/note/:noteId" 
                component={NotePageMain} /> */}

          <Route
          path='/note/:noteId'
          render={routeProps => {
            const { noteId } = routeProps.match.params
            const note = findNote(notes, noteId)
            return (
              <NotePageMain
                {...routeProps}
                note={note}
              />
            )
          }}
        />
         <Route
          path='/add-folder'
          component={AddFolder}
        />
        <Route
          path='/add-note'
          render={routeProps => {
            return (
              <AddNote
                {...routeProps}
                folders={folders}
              />
            )
          }}
        />
            </>
        );
    }
updateNote = () =>{};

    render() {
        const value = {
            notes: this.state.notes,
            folders: this.state.folders,
            deleteNote: this.handleDeleteNote,
            addFolder: this.handleAddFolder,
            addNote: this.handleAddNote,
            updateNote: this.updateNote,
        };
        
        return (
            <ErrorBoundry>
            <ApiContext.Provider value={value}>
                <div className="App">
                    <nav className="App__nav">{this.renderNavRoutes()}</nav>
                    <header className="App__header">
                        <h1>
                            <Link to="/">Noteful</Link>{' '}
                            <FontAwesomeIcon icon="check-double" />
                        </h1>
                    </header>
                    <main className="App__main">
                        {this.renderMainRoutes()}
                    </main>
                </div>
            </ApiContext.Provider>
            </ErrorBoundry>
        );
    }
}

export default App;

//fetch(`${config.API_ENDPOINT}/notes`),
//fetch(`${config.API_ENDPOINT}/folders`),

// fetch(`${API_ENDPOINT}/notes`).then((response) => response.json()).then((json)=> this.setState({notes: json}))
        // fetch(`${API_ENDPOINT}/folders`).then((response) => response.json()).then((json)=> this.setState({folders:json}))