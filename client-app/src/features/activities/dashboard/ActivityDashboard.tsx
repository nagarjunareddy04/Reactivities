import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Grid, List } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityFilters from "./ActivityFilters";
import ActivityList from "./ActivityList";

export default observer(function ActivityDashboard() {
    const { activityStore } = useStore();
    const { loadActivities, activityRegistry } = activityStore;

    useEffect(() => {
        if(activityRegistry.size <= 1){
            activityStore.loadActivities();
        }
    }, [activityRegistry.size]);

    if (activityStore.loadingInitial) return <LoadingComponent content="Loading App" />

    return (
        <>
            <Grid>
                <Grid.Column width='10'>
                    <ActivityList />
                </Grid.Column>
                <Grid.Column width='6'>
                    <ActivityFilters />
                    {/* {selectedActivity && !editMode &&
                        <ActivityDetails />}
                    {editMode &&
                        <ActivityForm />} */}
                </Grid.Column>
            </Grid>
        </>
    )
})