import { action, makeAutoObservable, makeObservable, observable, runInAction } from "mobx";
import agent from "../api/Agent";
import { Activity, ActivityFormValues } from "../models/activity";
import { v4 as uuid } from 'uuid';
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/profile";

export default class ActivityStore {
    ////activities: Activity[] = [];
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode: boolean = false;
    loading: boolean = false;
    loadingInitial: boolean = false;

    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => a.date!.getTime() - b.date!.getTime());
    }

    get groupedActivites() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date!, 'dd MMM yyyy');
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as { [key: string]: Activity[] })
        )
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.Activities.list();
            activities.forEach(activity => {
                this.setActivity(activity);
            })
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity;
            return activity;
        } else {
            this.setLoadingInitial(true);
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => this.selectedActivity = activity);
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setActivity = (activity: Activity) => {
        const user = store.userStore.user;
        if (user) {
            activity.isGoing = activity.attendees!.some(a => a.username === user.username);
            activity.isHost = activity.hostUsername === user.username;
            activity.Host = activity.attendees?.find(x => x.username === activity.hostUsername);
        }
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    // // selectActivity = (id: string) => {
    // //     ////this.selectedActivity = this.activities.find(a => a.id === id);
    // //     this.selectedActivity = this.activityRegistry.get(id);
    // // }

    // // cancelSelectedActivity = () => {
    // //     this.selectedActivity = undefined;
    // // }

    // // openForm = (id?: string) => {
    // //     id ? this.selectActivity(id) : this.cancelSelectedActivity();
    // //     this.editMode = true;
    // // }

    // // closeForm = () => {
    // //     this.editMode = false;
    // // }

    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);

        ////this.loading = true;
        ////activity.id = uuid();
        try {
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);
            newActivity.hostUsername = user!.username;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);

            ////this.activityRegistry.set(activity.id, activity);
            this.selectedActivity = newActivity;
            ////this.editMode = false;
            ////this.loading = false;
        } catch (error) {
            console.log(error);
            ////this.loading = false;
        }
    }

    updateActivity = async (activity: ActivityFormValues) => {
        ////this.loading = true;
        try {
            await agent.Activities.update(activity);
            if(activity.id){
                let updatedActivity = {...this.getActivity(activity.id), ...activity};
                this.activityRegistry.set(activity.id, updatedActivity as Activity);
                this.selectedActivity = updatedActivity as Activity;
            }
            
            ////this.editMode = false;
            ////this.loading = false;
        } catch (error) {
            console.log(error);
            ////this.loading = false;
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            ////this.activities = [...this.activities.filter(a=>a.id!==id)];
            this.activityRegistry.delete(id);
            // // if (this.selectedActivity?.id === id) {
            // //     this.cancelSelectedActivity();
            // // }
            this.loading = false;
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    }

    updateAttendance = async () => {
        const user = store.userStore.user;
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity!.attendees = this.selectedActivity?.attendees?.filter(a => a.username !== user?.username);
                    this.selectedActivity!.isGoing = false;
                } else {
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    cancelActivityToggle = async ()=>{
        this.loading  = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() =>{
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled; 
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!)
            })
        } catch (error) {
            console.log(error)
        }finally{
            runInAction(()=> this.loading = false);
        }
    }

    clearSelectedActivity = async () => {
        this.selectedActivity = undefined;
    }
}

// title = "Hello from MobX!";
// makeObservable(this, {
        //     title: observable,
        //     ////setTitle: action.bound
        //     setTitle: action
        // })
// setTitle = () => {
    //     this.title = this.title + "!";
    // }