const pageData = require('./mock-page-data')
const langData = require('./mock-lang-data')
const LATENCY = 300

export function getInitialPageData(cb, bookName) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            cb(pageData)
            resolve()
        }, LATENCY)
    })
}

export function getLangData(cb, lang) {
    //if (lang === 'en') cb(langData) //english is always prepared
    //else { //download other language
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            cb(langData)
            resolve()
        }, 150)
    })

    //}
}