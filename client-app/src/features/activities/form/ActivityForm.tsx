import { observer } from "mobx-react-lite";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, FormField, Header, Label, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import { v4 as uuid } from 'uuid';
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextAreaInput from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";

export default observer(function ActivityForm() {
    const { activityStore } = useStore();
    // const { selectedActivity, closeForm, createActivity, updateActivity, loading } = activityStore;
    const { selectedActivity, createActivity, updateActivity, loading, loadActivity, loadingInitial } = activityStore;
    const { id } = useParams();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: null,
        city: '',
        venue: ''
    });

    const validationSchema = Yup.object({
        title: Yup.string().required("The activity title is requied"),
        description: Yup.string().required("The activity description is requied"),
        category: Yup.string().required("The activity category is requied"),
        date: Yup.string().required("The activity date is requied").nullable(),
        city: Yup.string().required("The activity city is requied"),
        venue: Yup.string().required("The activity venue is requied"),
    });

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(activity!))
    }, [id, loadActivity]);

    function handleFormSubmit(activity: Activity) {
        console.log(activity);
        if(!activity.id){
            activity.id = uuid();
            createActivity(activity).then(() => navigate(`/activities/${activity.id}`));
        }else{
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`));
        }
    }

    if (loadingInitial) <LoadingComponent content="Loading Activity..." />
    return (
        <>
            <Segment clearing>
                <Header content="Activity Details" sub color="teal" />
                <Formik validationSchema={validationSchema} enableReinitialize initialValues={activity} onSubmit={values => handleFormSubmit    (values)}>
                    {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                        <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                            {/* <FormField>
                                <Field placeholder="Title" name="title" />
                                <ErrorMessage name="title" render={error => <Label color="red" content={error} />} />
                            </FormField> type="date" */}
                            <MyTextInput name="title" placeholder="Title" />
                            <MyTextAreaInput rows={3} placeholder="Description" name="description" />
                            <MySelectInput options={categoryOptions} placeholder="Category" name="category" />
                            <MyDateInput 
                                placeholderText="Date" 
                                name="date"
                                showTimeSelect
                                timeCaption="time"
                                dateFormat="MMMM d, yyyy h:mm aa"
                                /> 
                            <Header content="Location Details" sub color="teal" />
                            <MyTextInput placeholder="City" name="city" />
                            <MyTextInput placeholder="Venue" name="venue" />
                            <Button 
                                disabled={isSubmitting || !dirty || !isValid}
                                loading={loading} floated="right" positive type="submit" content="Submit" />
                            <Button as={Link} to="/activities" floated="right" type="submit" content="Cancel" />
                        </Form>
                    )}
                </Formik>
            </Segment>
        </>
    )
})