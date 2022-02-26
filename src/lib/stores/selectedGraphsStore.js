import { arrayStore } from "./arrayStore.js";


const selectedGraphsStore = (initial) => {
    const store = arrayStore(initial)
    return store;
}

export let selectedGraphs = selectedGraphsStore([])
