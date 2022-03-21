import { arrayStore } from "./arrayStore.js";
import { writable, Writable } from "svelte/store";


const graphsViewStores = (initial) => {
    const store = arrayStore(initial)
    return store;
}

//display
export const tableViewState: () => Writable<boolean> = function () {return writable(true)}
export const selectedGraphs = graphsViewStores([])
