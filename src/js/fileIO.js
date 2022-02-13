//todo: more file handling stuff here for browser based loading and server side remote loading

import FileSaver from 'file-saver';

const fileIO = {
    saveBlob: function (data = 'empty', format = 'json') {
        let blob,
            extension = format;
        const serialized = JSON.stringify( data );
        switch (format) {
            case "json": {
                blob = new Blob([serialized], {type: "application/json"});
                break
            }
            case "csv": {
                const csv = serialized // todo: csv export isn't really working yet, try to use d3 to format as CSV
                blob = new Blob( [...csv], {type: "text/csv"});
                break
            }
            default: {
                console.log('text default -> ' + serialized);
                blob = new Blob([serialized], {type: "text/plain"});
                extension = 'txt'
            }
        }
        FileSaver.saveAs(blob, "ExportedFile." + extension);
    }
}

export default fileIO;
