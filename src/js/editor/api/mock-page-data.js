module.exports = {
    main: {},
    pages: [{
        id: 1,
        pageNumber: 1,
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
            }]
        }
    }, {
        id: 2,
        pageNumber: 2,
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
    items: {},
    logs: {}

}