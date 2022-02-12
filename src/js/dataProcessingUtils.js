import  * as aq from 'arquero'

export function columnCount( dataColumns ) {
    const arqueroTable = aq.table(dataColumns)
    return  arqueroTable.numCols()
}

export function rowCount( dataColumns  ){
    const arqueroTable = aq.table(dataColumns)
    return  arqueroTable.numRows()
}

/**
 *
 * @param m Array containing array of data interpreted as being elements in a row
 * @returns {*} Rows transposed to being Columns
 */
export function transposeRowsToColumns( m = [] ) { return m[0].map((x,i) => m.map(x => x[i])) }

/**
 * Wrapper to conform the old TT data types into something more JSON and graph friendly
 *
 * @param metaKey a Key to use as header , read from
 * @param metaData an object which should contain some data for prop defined as metaKey
 * @param columnData this data array will be the value of the metaKey prop
 * @returns {{}} remapped object  eg: { Hour: [ 0, 1, 2 ], DOF: [ 89, 97, 69 ], NYPD: [ 767, 524, 355 ] }
 */
export function headedColumnsFrom( metaKey = 'name', metaData = [], columnData = [] ) {
    let propNames = metaData.map( metaObject => metaObject[metaKey] );
    let result = {};
    propNames.map( (l, i) => { Object.assign( result, { [l]: columnData[i] } ) })
    return result;
}

/**
 *
 * @param dataColumns data, will be converted to Arquero table inside this function
 *          adds a column tracking the rowNumber and uses that as a generic X-axis for plots
 *          todo: actually parse dates, times and hours and use those instead
 * @returns {*[]}  Array of data objects, no longer in Arquero table format
 */

export function mapDataToXYPoints( dataColumns = aq.table( { "Year" : [], "value" : [] })) {
    const arqueroTable =  aq.table(dataColumns)
    const tableWithIndex = arqueroTable.assign({ rowNumber: arqueroTable.indices() })
    let options = {}
    let xy = []

    const justNames = tableWithIndex.columnNames()

        justNames.forEach( (e, i) => {
            options = {}
            options = {rowNumber: 'x', [e]: 'y'}
            xy.push(tableWithIndex.select(options))
        })
    let result = []
    xy.forEach(t => result.push(t.objects()))
    return result
}


