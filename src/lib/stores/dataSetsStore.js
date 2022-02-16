// custom dataSetsStore by miu

import { arrayStore } from "./arrayStore.js";
import dataSetsIndex from "../../assets/dataSets/dataSetsIndex.js";
import { headedColumnsFrom, transposeRowsToColumns} from "$lib/DataUtils";

const dataSetsStore = (initial) => {
    const store = arrayStore(initial);
    const load = async ({ position, data_id, title, source, importDataFrom, dataType = 'json' }) => {
        let structuredData;
       // console.log('adding', position, data_id, title, source, importDataFrom, dataType);
        if(typeof importDataFrom === 'function') {
            // Handle async loading..
            const _data = await Promise.resolve(importDataFrom());
            structuredData = _data.default || _data; // importing a json file returns fields in both the root and under .default
        }
        if(dataType === 'csv') {
            // parse csv into json
            // data = parseCSV(data);
        }
        const fields = structuredData.fields;
        const columnData = transposeRowsToColumns(structuredData.rows);
        const columnsWithHeaders = headedColumnsFrom( 'name', fields, columnData)
        const normalized = structuredData.normalized;

        store.push({
            position,
            data_id,
            title,
            source,
            structuredData, // refactor: remove this and use the destructured refs below
            fields,
            columnsWithHeaders,
            normalized
        });
    }

    return {
        ...store,
        load,
        loadMany: async(items) => {
            return Promise.all(
                items.map(load)
            );
        }
    };
};

export const dataSets = dataSetsStore([]);

dataSets.loadMany(dataSetsIndex.map( ( dataset, index  ) =>
{
    return {
        position: index,
        data_id: dataset.id,
        title: dataset.metadata.title,
        source:  dataset.metadata.source,
        importDataFrom: dataset.attachments.data
    }
}));

