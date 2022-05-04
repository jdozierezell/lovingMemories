import React from 'react'
import { BrowserRouter as Router, Route } from "react-router-dom";

import AddMemoryDetails from '../components/AddMemory/AddMemoryDetails'
import UpdateMemoryOf from '../components/AddMemory/UpdateMemoryOf'
import AddMedia from '../components/AddMemory/AddMedia'
import AddMoreMedia from '../components/AddMemory/pictureWall'
import AddDescription from '../components/AddMemory/AddDescription'
import AddMemories from '../components/AddMemory/AddMemories'
import AddDates from '../components/AddMemory/AddDates'

import { StateMachineProvider, createStore } from "little-state-machine";
import { DevTool } from 'little-state-machine-devtools';

import "../components/AddMemory/memory.css"


const AddMemory = () => {

    return (
        <StateMachineProvider>
            <DevTool />
            <Router>               
                <Route exact path="/add-memory" component={AddMemoryDetails} />
                <Route path="/app/add-memory/in-memory-of" component={UpdateMemoryOf} />
                <Route path="/app/add-memory/add-media" component={AddMedia} />
                <Route path="/app/add-memory/add-more-media" component={AddMoreMedia} />
                <Route path="/app/add-memory/add-description" component={AddDescription} />
                <Route path="/app/add-memory/add-memories" component={AddMemories} />
                <Route path="/app/add-memory/add-dates" component={AddDates} />
            </Router>
        </StateMachineProvider>
    )
}

export default AddMemory
