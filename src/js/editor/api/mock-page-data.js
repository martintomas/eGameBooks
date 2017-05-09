module.exports = {
    main: {
        name: 'Testing book',
        author: 'Martin Tomas',
        published: '10. 1. 2017',
        usedModules: [
            'item',
            'journal'
        ]
    },
    pages: [{
        id: 1,
        pageNumber: 1,
        type: 'text',
        tittlePage: null,
        text: "This is text for *testing* pur<span>poses</span>. Pokračujte na :::link:1:další stránku:::. Tohle je :::link:5:nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link nikam nevedouci link::: :::link:3:chybejici stranka:::.",
        actions: {
            'link': [{
                'id': 1,
                'pageId': 2,
                'condition': ''
            }, {
                'id': 2,
                'pageId': 2,
                'condition': ''
            }, {
                'id': 3,
                'pageId': null,
                'condition': ''
            }, {
                'id': 4,
                'pageId': null,
                'condition': ''
            }],
            'item': [{
                'id':1,
                'ref':1,
                'condition':''
            },{
                'id':2,
                'ref':2,
                'condition':''
            }],
            'journal': [{
                'id':1,
                'ref':1,
                'condition':''
            }]
        }
    }, {
        id: 2,
        pageNumber: 2,
        type: 'text',
        tittlePage: null,
        text: "This is text for **testing** purposes. Pokračujte na :::link:1:další stránku::: nebo na :::link:2:předchozí stránku:::. This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.This is text for testing purposes.",
        actions: {
            'link': [{
                'id': 1,
                'pageId': 3,
                'condition': ''
            }, {
                'id': 2,
                'pageId': 1,
                'condition': ''
            }, {
                'id': 3,
                'pageId': 1,
                'condition': ''
            }, {
                'id': 4,
                'pageId': 1,
                'condition': ''
            }, {
                'id': 5,
                'pageId': 1,
                'condition': ''
            }, {
                'id': 6,
                'pageId': 1,
                'condition': ''
            }]
        }
    }, {
        id: 3,
        pageNumber: 3,
        type: 'text',
        tittlePage: null,
        text: "This is text for testing purposes. Jdi na :::link:1:začátek This is text for **testing** purposes This is text for **testing** purposes This is text for **testing** purposes::: nebo na :::link:2:předchozí stránku:::.",
        actions: {
            'link': [{
                'id': 1,
                'pageId': 1,
                'condition': ''
            }, {
                'id': 2,
                'pageId': 2,
                'condition': ''
            }]
        },
    }, {
        id: 4,
        pageNumber: 4,
        type: 'text',
        tittlePage: null,
        text: "This is text for testing purposes. Jdi na :::link:1:začátek This is text for **testing** purposes This is text for **testing** purposes This is text for **testing** purposes::: nebo na :::link:2:předchozí stránku:::.",
        actions: {
            'link': [{
                'id': 1,
                'pageId': 1,
                'condition': ''
            }, {
                'id': 2,
                'pageId': 2,
                'condition': ''
            }]
        },
    }, {
        id: 5,
        pageNumber: 5,
        type: 'text',
        tittlePage: null,
        text: "This is text for testing purposes. Jdi na :::link:1:začátek This is text for **testing** purposes This is text for **testing** purposes This is text for **testing** purposes::: nebo na :::link:2:předchozí stránku:::.",
        actions: {
            'link': []
        },
    }, {
        id: 6,
        pageNumber: 6,
        type: 'text',
        tittlePage: null,
        text: "This is text for testing purposes. Jdi na :::link:1:začátek This is text for **testing** purposes This is text for **testing** purposes This is text for **testing** purposes::: nebo na :::link:2:předchozí stránku:::.",
        actions: {
            'link': [{
                'id': 1,
                'pageId': 1,
                'condition': ''
            }, {
                'id': 2,
                'pageId': 2,
                'condition': ''
            }]
        },
    }, {
        id: 7,
        pageNumber: 7,
        type: 'text',
        tittlePage: null,
        text: "This is text for testing purposes. Jdi na :::link:1:začátek This is text for **testing** purposes This is text for **testing** purposes This is text for **testing** purposes::: nebo na :::link:2:předchozí stránku:::.",
        actions: {
            'link': [{
                'id': 1,
                'pageId': 1,
                'condition': ''
            }, {
                'id': 2,
                'pageId': 2,
                'condition': ''
            }]
        },
    }, {
        id: 8,
        pageNumber: 8,
        type: 'text',
        tittlePage: null,
        text: "This is text for testing purposes. Jdi na :::link:1:začátek This is text for **testing** purposes This is text for **testing** purposes This is text for **testing** purposes::: nebo na :::link:2:předchozí stránku:::.",
        actions: {
            'link': [{
                'id': 1,
                'pageId': 1,
                'condition': ''
            }, {
                'id': 2,
                'pageId': 2,
                'condition': ''
            }]
        },
    }, {
        id: 9,
        pageNumber: 9,
        type: 'text',
        tittlePage: null,
        text: "This is text for testing purposes. Jdi na :::link:1:začátek This is text for **testing** purposes This is text for **testing** purposes This is text for **testing** purposes::: nebo na :::link:2:předchozí stránku:::.",
        actions: {
            'link': [{
                'id': 1,
                'pageId': 1,
                'condition': ''
            }, {
                'id': 2,
                'pageId': 2,
                'condition': ''
            }]
        },
    }, {
        id: 10,
        pageNumber: 10,
        type: 'text',
        tittlePage: null,
        text: "This is text for testing purposes. Jdi na :::link:1:začátek This is text for **testing** purposes This is text for **testing** purposes This is text for **testing** purposes::: nebo na :::link:2:předchozí stránku:::.",
        actions: {
            'link': [{
                'id': 1,
                'pageId': 1,
                'condition': ''
            }, {
                'id': 2,
                'pageId': 2,
                'condition': ''
            }]
        },
    }, {
        id: 11,
        pageNumber: 11,
        type: 'text',
        tittlePage: null,
        text: "This is text for testing purposes. Jdi na :::link:1:začátek This is text for **testing** purposes This is text for **testing** purposes This is text for **testing** purposes::: nebo na :::link:2:předchozí stránku:::.",
        actions: {
            'link': [{
                'id': 1,
                'pageId': 1,
                'condition': ''
            }, {
                'id': 2,
                'pageId': 2,
                'condition': ''
            }]
        },
    }, {
        id: 12,
        pageNumber: 12,
        type: 'text',
        tittlePage: null,
        text: "This is text for testing purposes. Jdi na :::link:1:začátek This is text for **testing** purposes This is text for **testing** purposes This is text for **testing** purposes::: nebo na :::link:2:předchozí stránku:::.",
        actions: {
            'link': [{
                'id': 1,
                'pageId': 1,
                'condition': ''
            }, {
                'id': 2,
                'pageId': 2,
                'condition': ''
            }]
        },
    }],
    modules: {
        item: [{
            'id':1,
            'name':'Sword of truth',
            'description': 'Super mega sword'
        }, {
            'id':2,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':3,
            'name':'Potion of health super super super super super super super super',
            'description': 'Can restore health Can restore health Can restore health Can restore health Can restore health'
        }, {
            'id':4,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':5,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':6,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':7,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':8,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':9,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':10,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':11,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':12,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':13,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':14,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':15,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':16,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':17,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':18,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':19,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':20,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':21,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':22,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':23,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':24,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':25,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':26,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':27,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':28,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':29,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':30,
            'name':'Potion of health',
            'description': 'Can restore health'
        }, {
            'id':31,
            'name':'Potion of health',
            'description': 'Can restore health'
        }],
        journal: [{
            'id':1,
            'name':'Visit of Holdbarg',
            'date':'1.1289',
            'text':'This rainy day, You have visited Holdbarg'
        },{
            'id':2,
            'name':'password to doors',
            'date':null,
            'text':'You have learned that password to doors is 98785'
        }]
    }

}