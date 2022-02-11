
import {isoParse, timeFormat, timeParse} from "d3-time-format";

/**
 *
 * @param dateString
 * @param returnFormat
 * %a - abbreviated weekday name.*
 * %A - full weekday name.*
 * %b - abbreviated month name.*
 * %B - full month name.*
 * %Y - year with century as a decimal number, such as 1999.
 * %M - minute as a decimal number [00,59].
 * %H - hour (24-hour clock) as a decimal number [00,23].
 * full list https://github.com/d3/d3-time-format
 * @returns {*}
 */
export function formatDate (dateString, returnFormat = "%B %d, %Y" ) {

    const formatTime = timeFormat(returnFormat);
    const formattedDate = formatTime(isoParse(timeParse(dateString)))
    return formattedDate
}

export function formatTime (timeString, returnFormat = "%H:%M" ) {

    const formatTime = timeFormat(returnFormat);
    const formattedDate = formatTime(isoParse(timeParse(timeString)))
    return formattedDate
}

