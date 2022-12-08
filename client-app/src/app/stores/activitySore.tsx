import { action, makeAutoObservable, makeObservable, observable, runInAction } from "mobx";
import agent from "../api/Agent";
import { Activity } from "../models/activity";
import { v4 as uuid } from 'uuid';

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
        return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
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
        }else{
            this.setLoadingInitial(true);
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(()=>this.selectedActivity = activity);
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setActivity = (activity: Activity) =>{
        activity.date = activity.date.split('T')[0]
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

    createActivity = async (activity: Activity) => {
        this.loading = true;
        activity.id = uuid();
        try {
            await agent.Activities.create(activity);
            ////this.activities.push(activity);
            this.activityRegistry.set(activity.id, activity);
            this.selectedActivity = activity;
            this.editMode = false;
            this.loading = false;
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            ////this.activities = [...this.activities.filter(a=>a.id!==activity.id), activity];
            this.activityRegistry.set(activity.id, activity);
            this.selectedActivity = activity;
            this.editMode = false;
            this.loading = false;
        } catch (error) {
            console.log(error);
            this.loading = false;
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