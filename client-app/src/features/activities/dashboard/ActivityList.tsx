import { observer } from "mobx-react-lite";
import { Fragment, SyntheticEvent, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, Header, Item, ItemMeta, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import ActivityListItem from "./ActivityListItem";

export default observer(function ActivityList() {
    const { activityStore } = useStore();
    const { groupedActivites } = activityStore;

    return (
        <>
            {groupedActivites.map(([group, activities]) => (
                <Fragment key={group}>
                    <Header sub color="teal">
                        {group}
                    </Header>
                    {activities.map(activity => <ActivityListItem key={activity.id} activity={activity} />)}
                </Fragment>
            ))}

        </>
    )
})