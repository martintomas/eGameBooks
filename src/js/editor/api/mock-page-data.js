module.exports = {
    main: {
        id:120565,
        saveId:10,
        saveName:'interesting test',
        saveType:'save',
        name: 'Testing book',
        author: 'Martin Tomas',
        published: '10. 1. 2017',
        lastSave: '10. 2. 2017',
        usedModules: [
            'item',
        ],
        startingPage: 1,
    },
    pages: [{
        id: 1,
        pageNumber: 1,
        pageType: 'text',
        pageTittle: null,
        text: "This is text for *testing* pur<span>poses</span>. Pokračujte na :::link:1:další stránku:::. Tohle je :::link:5:nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link::: :::link:3:chybejici stranka:::. A mame tady dalsi :::item:1:tohle je super item::: a :::item:2:super dalsi item:::",
        actions: {
            'link': [{
                'id': 1,
                'pageId': 2,
                'condition': '',
                'required':true,
            }, {
                'id': 2,
                'pageId': 2,
                'condition': '',
                'required':false,
            }, {
                'id': 3,
                'pageId': null,
                'condition': '',
                'required':true,
            }, {
                'id': 4,
                'pageId': null,
                'condition': '',
                'required':false,
            }],
            'item': [{
                'id':1,
                'ref':1,
                'action':'add',
                'condition':'',
                'required':false,
            },{
                'id':2,
                'ref':2,
                'action':'remove',
                'condition':'',
                'required':false,
            }],
            'journal': [{
                'id':1,
                'ref':1,
                'condition':'',
                'required':false,
            }]
        }
    }, {
        id: 2,
        pageNumber: 2,
        pageType: 'text',
        pageTittle: null,
        text: "This is text for **testing** pur :::item:1:item::: poses. Pokračujte na :::link:1:další stránku::: nebo na :::link:2:předchozí stránku:::. This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.",
        actions: {
            'link': [{
                'id': 1,
                'pageId': 3,
                'condition': '',
                'required':false,
            }, {
                'id': 2,
                'pageId': 1,
                'condition': '',
                'required':false,
            }, {
                'id': 3,
                'pageId': 1,
                'condition': '',
                'required':false,
            }, {
                'id': 4,
                'pageId': 1,
                'condition': '',
                'required':false,
            }, {
                'id': 5,
                'pageId': 1,
                'condition': '',
                'required':false,
            }, {
                'id': 6,
                'pageId': 1,
                'condition': '',
                'required':false,
            }],
            'item': [{
                'id':1,
                'ref':1,
                'action':'add',
                'condition':'',
                'required':false,
            },{
                'id':2,
                'ref':2,
                'action':'remove',
                'condition':'',
                'required':false,
            }],
        }
    }, {
        id: 3,
        pageNumber: 3,
        pageType: 'text',
        pageTittle: null,
        text: "This is text for testing purposes. Jdi na :::link:1:začátek This is text for **testing** purposes This is text for **testing** purposes This is text for **testing** purposes::: nebo na :::link:2:předchozí stránku:::.",
        actions: {
            'link': [{
                'id': 1,
                'pageId': 1,
                'condition': '',
                'required':false,
            }, {
                'id': 2,
                'pageId': 2,
                'condition': '',
                'required':false,
            }]
        },
    }, {
        id: 4,
        pageNumber: 4,
        pageType: 'text',
        pageTittle: null,
        text: "This is text for testing purposes. Jdi na :::link:1:začátek This is text for **testing** purposes This is text for **testing** purposes This is text for **testing** purposes::: nebo na :::link:2:předchozí stránku:::.",
        actions: {
            'link': [{
                'id': 1,
                'pageId': 1,
                'condition': '',
                'required':false,
            }, {
                'id': 2,
                'pageId': 2,
                'condition': '',
                'required':false,
            }]
        },
    }, {
        id: 5,
        pageNumber: 5,
        pageType: 'text',
        pageTittle: null,
        text: "This is text for testing purposes. Jdi na :::link:1:začátek This is text for **testing** purposes This is text for **testing** purposes This is text for **testing** purposes::: nebo na :::link:2:předchozí stránku:::.",
        actions: {
            'link': []
        },
    }, {
        id: 6,
        pageNumber: 6,
        pageType: 'text',
        pageTittle: null,
        text: "This is text for testing purposes. Jdi na :::link:1:začátek This is text for **testing** purposes This is text for **testing** purposes This is text for **testing** purposes::: nebo na :::link:2:předchozí stránku:::.",
        actions: {
            'link': [{
                'id': 1,
                'pageId': 1,
                'condition': '',
                'required':false,
            }, {
                'id': 2,
                'pageId': 2,
                'condition': '',
                'required':false,
            }]
        },
    }, {
        id: 7,
        pageNumber: 7,
        pageType: 'text',
        pageTittle: null,
        text: "This is text for testing purposes. Jdi na :::link:1:začátek This is text for **testing** purposes This is text for **testing** purposes This is text for **testing** purposes::: nebo na :::link:2:předchozí stránku:::.",
        actions: {
            'link': [{
                'id': 1,
                'pageId': 1,
                'condition': '',
                'required':false,
            }, {
                'id': 2,
                'pageId': 2,
                'condition': '',
                'required':false,
            }]
        },
    }, {
        id: 8,
        pageNumber: 8,
        pageType: 'text',
        pageTittle: null,
        text: "This is text for testing purposes. Jdi na :::link:1:začátek This is text for **testing** purposes This is text for **testing** purposes This is text for **testing** purposes::: nebo na :::link:2:předchozí stránku:::.",
        actions: {
            'link': [{
                'id': 1,
                'pageId': 1,
                'condition': '',
                'required':false,
            }, {
                'id': 2,
                'pageId': 2,
                'condition': '',
                'required':false,
            }]
        },
    }, {
        id: 9,
        pageNumber: 9,
        pageType: 'text',
        pageTittle: null,
        text: "This is text for testing purposes. Jdi na :::link:1:začátek This is text for **testing** purposes This is text for **testing** purposes This is text for **testing** purposes::: nebo na :::link:2:předchozí stránku:::.",
        actions: {
            'link': [{
                'id': 1,
                'pageId': 1,
                'condition': '',
                'required':false,
            }, {
                'id': 2,
                'pageId': 2,
                'condition': '',
                'required':false,
            }]
        },
    }, {
        id: 10,
        pageNumber: 10,
        pageType: 'text',
        pageTittle: null,
        text: "This is text for testing purposes. Jdi na :::link:1:začátek This is text for **testing** purposes This is text for **testing** purposes This is text for **testing** purposes::: nebo na :::link:2:předchozí stránku:::.",
        actions: {
            'link': [{
                'id': 1,
                'pageId': 1,
                'condition': '',
                'required':false,
            }, {
                'id': 2,
                'pageId': 2,
                'condition': '',
                'required':false,
            }]
        },
    }, {
        id: 11,
        pageNumber: 11,
        pageType: 'text',
        pageTittle: null,
        text: "This is text for testing purposes. Jdi na :::link:1:začátek This is text for **testing** purposes This is text for **testing** purposes This is text for **testing** purposes::: nebo na :::link:2:předchozí stránku:::.",
        actions: {
            'link': [{
                'id': 1,
                'pageId': 1,
                'condition': '',
                'required':false,
            }, {
                'id': 2,
                'pageId': 2,
                'condition': '',
                'required':false,
            }]
        },
    }, {
        id: 12,
        pageNumber: 12,
        pageType: 'text',
        pageTittle: null,
        text: "This is text for testing purposes. Jdi na :::link:1:začátek This is text for **testing** purposes This is text for **testing** purposes This is text for **testing** purposes::: nebo na :::link:2:předchozí stránku:::.",
        actions: {
            'link': [{
                'id': 1,
                'pageId': 1,
                'condition': '',
                'required':false,
            }, {
                'id': 2,
                'pageId': 2,
                'condition': '',
                'required':false,
            }]
        },
    }],
    modules: {
        item: [{
            'id':null,
            'localId':1,
            'name':'Sword of truth',
            'description': 'Super mega sword'
        }, {
            'id':2,
            'localId':2,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':null,
            'localId':3,
            'name':'Potion of health super super super super super super super super',
            'description': 'Can restore health Can restore health Can restore health Can restore health Can restore health'
        }, {
            'id':4,
            'localId':4,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':5,
            'localId':5,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':6,
            'localId':6,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':7,
            'localId':7,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':8,
            'localId':8,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':9,
            'localId':9,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':10,
            'localId':10,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':11,
            'localId':11,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':12,
            'localId':12,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':13,
            'localId':13,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':14,
            'localId':14,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':15,
            'localId':15,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':16,
            'localId':16,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':17,
            'localId':17,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':18,
            'localId':18,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':19,
            'localId':19,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':20,
            'localId':20,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':21,
            'localId':21,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':22,
            'localId':22,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':23,
            'localId':23,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':24,
            'localId':24,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':25,
            'localId':25,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':26,
            'localId':26,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':27,
            'localId':27,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':28,
            'localId':28,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':29,
            'localId':29,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':30,
            'localId':30,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':31,
            'localId':31,
            'name':'Potion of health',
            'description': 'Can restore health'
        }],
        journal: [{
            'id':1,
            'localId':1,
            'name':'Visit of Holdbarg',
            'date':'1.1289',
            'text':'This rainy day, You have visited Holdbarg'
        },{
            'id':2,
            'localId':2,
            'name':'password to doors',
            'date':null,
            'text':'You have learned that password to doors is 98785'
        }]
    }

}