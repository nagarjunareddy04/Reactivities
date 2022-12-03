import React, { useEffect, useState } from 'react';
import { ducks } from '../../demo';
import DuckItem from '../../DuckItem';
import axios from 'axios';
import { Container, Header, List } from 'semantic-ui-react'
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';
//import { randomUUID } from 'crypto';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, SetSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/Activities').then(res => {
      console.log(res.data);
      setActivities(res.data);
    })
  }, []);

  function handleSelectActivity(id: string) {
    SetSelectedActivity(activities.find(x => x.id === id));
  }

  function handleCancelSelectedActivity() {
    SetSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelSelectedActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  function handleCreateorEditActivity(activity: Activity) {
    activity.id
      ? setActivities([...activities.filter(x => x.id !== activity.id), activity])
      : setActivities([...activities, { ...activity, id: uuid() }])

    setEditMode(false);
    SetSelectedActivity(activity);
  }

  function handleDeleteActivity(id: string) {
    setActivities([...activities.filter(x => x.id !== id)]);
  }

  return (
    <>
      {/* <Header as='h2' icon='users' content='Reactivities'/> */}
      <NavBar openForm={handleFormOpen} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectedActivity={handleCancelSelectedActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateorEditActivity}
          deleteActivity={handleDeleteActivity} />
      </Container>

      {/* {ducks.map(duck => (
          <DuckItem duck={duck} key={duck.name} />
        ))} */}

      {/* <p style={{color : 'red'}}>
          Edit <code>src/App.tsx</code> and save to reload!!
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}

    </>
  );
}

export default App;
