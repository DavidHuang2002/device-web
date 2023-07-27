export function formatDateFromStr(dateStr, format) {
    if (dateStr == null) return null;
    return formatDate(new Date(dateStr), format);
}

/**
 * Format date and time
 * @param date The current date, in the format of new Date()
 * @param format The desired date format string
 * @description The format string can be flexible, e.g., `YYYY-mm`, `YYYY-mm-dd`
 * @description For quarter: "YYYY-mm-dd HH:MM:SS QQQQ"
 * @description For weekday: "YYYY-mm-dd HH:MM:SS DDD"
 * @description For weeks: "YYYY-mm-dd HH:MM:SS WWWW"
 * @description For quarter + weekday + weeks: "YYYY-mm-dd HH:MM:SS DDD QQQQ WWWW"
 * @returns The formatted date string
 */
export function formatDate(date, format) {
    // handle null date
    if(date == null) return null;

    let weekday = date.getDay(); // Weekday
    let week = getWeek(date); // Week
    let quarter = Math.floor((date.getMonth() + 3) / 3).toString(); // Quarter
    const opt = {
        'Y+': date.getFullYear().toString(), // Year
        'm+': (date.getMonth() + 1).toString(), // Month
        'd+': date.getDate().toString(), // Day
        'H+': date.getHours().toString(), // Hour
        'M+': date.getMinutes().toString(), // Minute
        'S+': date.getSeconds().toString(), // Second
        'q+': quarter, // Quarter
    };
    // weekdays
    const weekdays = {
        '0': 'Sun',
        '1': 'Mon',
        '2': 'Tue',
        '3': 'Wed',
        '4': 'Thu',
        '5': 'Fri',
        '6': 'Sat',
    };
    // quarters
    const quarters = {
        '1': 'First',
        '2': 'Second',
        '3': 'Third',
        '4': 'Fourth',
    };
    if (/(D+)/.test(format))
        format = format.replace(RegExp.$1, RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? 'Day ' + weekdays[weekday] : 'Week ' + weekdays[weekday]) : weekdays[weekday]);
    if (/(Q+)/.test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 4 ? quarters[quarter] + ' Quarter' : quarters[quarter]);
    if (/(W+)/.test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 4 ? 'Week ' + week : week.toString());
    for (let k in opt) {
        let r = new RegExp('(' + k + ')').exec(format);
        // If the input length is not 1, pad with zero
        if (r) format = format.replace(r[1], RegExp.$1.length == 1 ? opt[k] : opt[k].padStart(RegExp.$1.length, '0'));
    }
    return format;
}

/**
 * Get the week number for a date.
 * @param dateTime The date to get the week for.
 * @returns The week number.
 */
function getWeek(dateTime) {
    let temptTime = new Date(dateTime.getTime());
    // Day of the week
    let weekday = temptTime.getDay() || 7;
    // Weekday + 5 days = Saturday
    temptTime.setDate(temptTime.getDate() - weekday + 1 + 5);
    let firstDay = new Date(temptTime.getFullYear(), 0, 1);
    let dayOfWeek = firstDay.getDay();
    let spendDay = 1;
    if (dayOfWeek != 0) spendDay = 7 - dayOfWeek + 1;
    firstDay = new Date(temptTime.getFullYear(), 0, 1 + spendDay);
    let d = Math.ceil((temptTime.valueOf() - firstDay.valueOf()) / 86400000);
    let result = Math.ceil(d / 7);
    return result;
}
