const pageData = require('./mock-page-data')
const LATENCY = 300

export function getInitialBookData(bookName) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(pageData)
        }, LATENCY)
    })
}