const { DateTime, Interval } = require('luxon');
const luxon = require('luxon');


const generateTimesInInterval = (interval, delta_duration) => {
    let times = []
    let cursor = interval.start
    while (cursor < interval.end) {
        times.push(cursor.toHTTP())
        cursor = cursor.plus(delta_duration)
    }
    return times
}

const getDaysInIntervalFromStart = interval => {
    let days = []
    let cursor = interval.start
    while (cursor < interval.end) {
        days.push(cursor)
        cursor = cursor.plus({ days: 1 })
    }
    return days
}

const getDaysInIntervalFromEnd = interval => {
    let days = []
    let cursor = interval.end
    while (cursor > interval.start) {
        days.push(cursor);
        cursor = cursor.minus({ days: 1 })
    }
    days.reverse()
    return days
}

/*
 * start - start of first day in range
 * end - end of last day in range
 * delta_duration - length of each time slot
 */
exports.generateDateTimeArray = (start, end, delta_duration) => {
    const interval = Interval.fromDateTimes(start, end)
    const dayStarts = getDaysInIntervalFromStart(interval)
    const dayEnds = getDaysInIntervalFromEnd(interval)
    const times = [];
    for (let i = 0; i < dayEnds.length; i++) {
        const interval = Interval.fromDateTimes(dayStarts[i], dayEnds[i])
        const arr = generateTimesInInterval(interval, delta_duration)
        times.push(arr)
    }
    return times
}

// const logDateTimeArr = arr => console.log(arr.map(time => time.toHTTP()))

// const start = DateTime.fromObject({year: 2022, month: 4, day: 3, hour: 8})
// const end = DateTime.fromObject({year: 2022, month: 4, day: 7, hour: 21})
// const delta_duration = luxon.Duration.fromObject({minutes: 60})

// const dateTimes = exports.generateDateTimeArray(start, end, delta_duration)
// console.log("DATETIME ARRAY")
// dateTimes.forEach(col => {logDateTimeArr(col)})
