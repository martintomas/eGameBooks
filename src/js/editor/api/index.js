const pageData = require('./mock-page-data')
const langData = require('./mock-lang-data')
const LATENCY = 500

export function getInitialPageData(cb) {
    setTimeout(() => {
        cb(pageData)
    }, LATENCY)
}

export function getLangData(cb, lang) {
    if (lang === 'en') cb(langData) //english is always prepared
    else { //download other language
        setTimeout(() => {
            cb(langData)
        }, LATENCY)
    }
}