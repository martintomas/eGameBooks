const pageData = require('./mock-page-data')
const modulesWorkspace = require('./mock-modules-workspace-data')
const editorLimits = require('./mock-editor-limits-data')
const bookSaves = require('./mock-book-saves-data')
const itemWorkspaceData = require('./mock-item-workspace-data')
const LATENCY = 300

export function getInitialBookData(args) {
    //args should contain bookId and saveId for same cases
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

export function getEditorLimits() {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(editorLimits)
        }, LATENCY)
    })
}

export function isBookNameUnique(bookName) {
    //can reject with no-unique-name string
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve()
        }, LATENCY)
    })
}

export function savePage(pageData,bookId,saveId) {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve()
        }, LATENCY)
    })
}

export function saveBook(saveType,bookData) {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve()
            //reject('bla')
        }, LATENCY)
    })
}

export function updateBookName(args) {
    //args shoudl contain bookId and bookName
    //can reject with no-unique-name string
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve()
        }, LATENCY)
    })
}

export function getBookSaves(bookId) {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(bookSaves)
        }, LATENCY)
    })
}

export function getWorkspaceItems(moduleType,workspaceName) {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(itemWorkspaceData)
        }, LATENCY)
    })
}