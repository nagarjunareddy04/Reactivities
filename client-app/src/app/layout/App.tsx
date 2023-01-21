import React, { useEffect, useState } from 'react';
import { Button, Container, Header, List } from 'semantic-ui-react'
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

import agent from '../api/Agent';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import { ToastContainer } from 'react-toastify';
import ModalContainer from '../common/modals/ModalContainer';

function App() {
  const location = useLocation();
  const {commonStore, userStore} = useStore();

  useEffect(()=> {
    if(commonStore.token){
      userStore.getUser().finally(()=>commonStore.setAppLoaded());
    }
    else{
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore])

  if(!commonStore.appLoaded){
    return <LoadingComponent content='Loading App...' />
  }
  return (
    <>
      <ModalContainer />
      <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
      {location.pathname === '/' ? <HomePage /> : (
        <>
          <NavBar />
          <Container style={{ marginTop: '7em' }}>
            <Outlet />
          </Container>
        </>
      )}
    </>
  );
}

export default observer(App);

// // import { ducks } from '../../demo';
// // import DuckItem from '../../DuckItem';
// // import axios from 'axios';
// // import { v4 as uuid } from 'uuid';

////const [loading, setLoading] = useState(true);
// const [selectedActivity, SetSelectedActivity] = useState<Activity | undefined>(undefined);
// const [editMode, setEditMode] = useState(false);
// const [activities, setActivities] = useState<Activity[]>([]);
// const [submitting, setSubmitting] = useState(false);

// // useEffect(() => {
// //   agent.Activities.list().then(res => {
// //     let activities: Activity[] = [];
// //     res.forEach(activity => {
// //       activity.date = activity.date.split('T')[0]
// //       activities.push(activity);
// //     })
// //     console.log(activities);
// //     setActivities(activities);
// //     setLoading(false);
// //   })
// // }, []);

// // function handleSelectActivity(id: string) {
// //   SetSelectedActivity(activities.find(x => x.id === id));
// // }

// // function handleCancelSelectedActivity() {
// //   SetSelectedActivity(undefined);
// // }

// // function handleFormOpen(id?: string) {
// //   id ? handleSelectActivity(id) : handleCancelSelectedActivity();
// //   setEditMode(true);
// // }

// // function handleFormClose() {
// //   setEditMode(false);
// // }

// // function handleCreateorEditActivity(activity: Activity) {
// //   setSubmitting(true);
// //   if (activity.id) {
// //     agent.Activities.update(activity).then(() => {
// //       setActivities([...activities.filter(x => x.id !== activity.id), activity]);
// //       SetSelectedActivity(activity);
// //       setEditMode(false);
// //       setSubmitting(false);
// //     })
// //   } else {
// //     activity.id = uuid();
// //     agent.Activities.create(activity).then(() => {
// //       setActivities([...activities, activity]);
// //       SetSelectedActivity(activity);
// //       setEditMode(false);
// //       setSubmitting(false);
// //     })
// //   }
// // }

// // function handleDeleteActivity(id: string) {
// //   setSubmitting(true);
// //   agent.Activities.delete(id).then(() => {
// //     setActivities([...activities.filter(x => x.id !== id)]);
// //     setSubmitting(false);
// //   })
// // }

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

{/* <h2>{activityStore.title}</h2>
        <Button content="Add exclamation!" positive onClick={activityStore.setTitle} /> */}

{/* <Header as='h2' icon='users' content='Reactivities'/> */ }