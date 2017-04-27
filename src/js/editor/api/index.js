const pageData = require('./mock-page-data')
const langData = require('./mock-lang-data')
const LATENCY = 500

export function getInitialPageData(cb, bookName) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            cb(pageData)
        }, LATENCY)
        resolve()
    })
}

export function getLangData(cb, lang) {
    //if (lang === 'en') cb(langData) //english is always prepared
    //else { //download other language
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            cb(langData)
        }, LATENCY)
        resolve()
    })

    //}
}