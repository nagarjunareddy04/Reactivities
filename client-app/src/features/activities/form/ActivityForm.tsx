import { observer } from "mobx-react-lite";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import {v4 as uuid} from 'uuid';
import { Link } from "react-router-dom";

export default observer(function ActivityForm() {
    const { activityStore } = useStore();
    // const { selectedActivity, closeForm, createActivity, updateActivity, loading } = activityStore;
    const { selectedActivity, createActivity, updateActivity, loading, loadActivity, loadingInitial } = activityStore;
    const {id} = useParams();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });

    useEffect(()=>{
        if(id) loadActivity(id).then(activity=> setActivity(activity!))
    }, [id, loadActivity]);

    function handleSubmit() {
        console.log(activity);
        if(!activity.id){
            activity.id = uuid();
            createActivity(activity).then(() => navigate(`/activities/${activity.id}`));
        }else{
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`));
        }
    }

    function handleInputChnage(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setActivity({ ...activity, [name]: value })
    }

    if(loadingInitial) <LoadingComponent content="Loading Activity..." />
    return (
        <>
            <Segment clearing>
                <Form onSubmit={handleSubmit} autoComplete="off">
                    <Form.Input placeholder="Title" value={activity.title} name="title" onChange={handleInputChnage} />
                    <Form.TextArea placeholder="Description" value={activity.description} name="description" onChange={handleInputChnage} />
                    <Form.Input placeholder="Category" value={activity.category} name="category" onChange={handleInputChnage} />
                    <Form.Input type="date" placeholder="Date" value={activity.date} name="date" onChange={handleInputChnage} />
                    <Form.Input placeholder="City" value={activity.city} name="city" onChange={handleInputChnage} />
                    <Form.Input placeholder="Venue" value={activity.venue} name="venue" onChange={handleInputChnage} />
                    <Button loading={loading} floated="right" positive type="submit" content="Submit" />
                    {/* <Button onClick={closeForm} floated="right" type="submit" content="Cancel" /> */}
                    <Button as={Link} to="/activities" floated="right" type="submit" content="Cancel" />
                </Form>
            </Segment>
        </>
    )
})