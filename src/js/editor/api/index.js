const pageData = require('./mock-page-data')
const modulesWorkspace = require('./mock-modules-workspace-data')
const LATENCY = 300

export function getInitialBookData(bookId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(pageData)
        }, LATENCY)
    })
}

export function getModulesWorkspace(usedModules) {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(modulesWorkspace)
        }, LATENCY)
    })
}

export function isBookNameUnique(bookName) {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(true)
        }, LATENCY)
    })
}

export function savePage(pageData) {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve()
        }, LATENCY)
    })
}

export function saveBook(bookData) {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve()
        }, LATENCY)
    })
}