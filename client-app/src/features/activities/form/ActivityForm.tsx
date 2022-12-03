import { ChangeEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props {
    activity: Activity | undefined;
    closeForm: () => void;
    createOrEdit: (activity: Activity) => void;
}

export default function ActivityForm({ closeForm, activity: selectActivity, createOrEdit}: Props) {
    const initialState = selectActivity ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    };

    const [activity, setActivity] = useState(initialState);

    function handleSubmit() {
        //console.log(activity);
        createOrEdit(activity);
    }

    function handleInputChnage(event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) {
        const {name, value} = event.target;
        setActivity({...activity, [name]: value})
    }

    return (
        <>
            <Segment clearing>
                <Form onSubmit={handleSubmit} autoComplete="off">
                    <Form.Input placeholder="Title" value={activity.title} name="title" onChange={handleInputChnage} />
                    <Form.TextArea placeholder="Description" value={activity.description} name="description" onChange={handleInputChnage} />
                    <Form.Input placeholder="Category" value={activity.category} name="category" onChange={handleInputChnage} />
                    <Form.Input placeholder="Date" value={activity.date} name="date" onChange={handleInputChnage} />
                    <Form.Input placeholder="City" value={activity.city} name="city" onChange={handleInputChnage} />
                    <Form.Input placeholder="Venue" value={activity.venue} name="venue" onChange={handleInputChnage} />
                    <Button floated="right" positive type="submit" content="Submit" />
                    <Button onClick={closeForm} floated="right" type="submit" content="Cancel" />
                </Form>
            </Segment>
        </>
    )
}