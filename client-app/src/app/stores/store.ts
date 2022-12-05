import { createContext, useContext } from "react";
import ActivityStore from "./activitySore";

interface Store {
    activityStore: ActivityStore
}

export const store: Store = {
    activityStore: new ActivityStore()
}

export const SotreContext = createContext(store);

export function useStore(){
    return useContext(SotreContext);
}