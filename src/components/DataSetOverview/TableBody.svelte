<script>/**
* Generates the table body for Table view
*/

import { formatDate, formatTime } from "../../js/dateUtils.js";
import { table } from "arquero";

export let page = {};
export let data = {};

const render = table(data)
                    .toHTML({
                    style: {
                        td: "font-size: smaller; text-align: center ",
                        th: "visibility: hidden; display: none",
                    },
                    limit: page.step,
                    format: {
                    Time: (d) => formatTime(d),
                    Date: (d) => formatDate(d)
                },
                    offset: page.offset
                })
</script>

{@html render}

<style>
</style>
