import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import AddFolder from '../AddFolder/AddFolder'
import ErrorBoundry from '../ErrorBoundry/ErrorBoundry'
//import Note from './note/note'
import AddNote from "../AddNote/AddNote"
import ApiContext from '../ApiContext';
import {API_ENDPOINT} from '../config';
import './App.css';


class App extends Component {
    state = {
        notes: [],
        folders: []
    };

    componentDidMount() {
        fetch(`${API_ENDPOINT}/notes`).then((response) => response.json()).then((json)=> this.setState({
            notes: json
        }))
        fetch(`${API_ENDPOINT}/folders`).then((response) => response.json()).then((json)=> this.setState({folders:json}))
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
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListMain}
                    />
                ))}
                <Route path="/note/:noteId" component={NotePageMain} />
            </>
        );
    }

    render() {
        const value = {
            notes: this.state.notes,
            folders: this.state.folders,
            deleteNote: this.handleDeleteNote,
            addFolder: this.handleAddFolder,
            addNote: this.handleAddNote
        };
        console.log(this.state)
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