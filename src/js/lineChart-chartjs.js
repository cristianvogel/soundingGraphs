
// to cherry pick from Chart needs registerables and use of the register array
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

import { buildDatasetsForChartFromTTMetadata } from "./dataProcessingUtils.js";

const barChart = (ctx, metadataObject ) => {

    let data = buildDatasetsForChartFromTTMetadata( metadataObject );

    const barChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    return barChart};

export { barChart };
