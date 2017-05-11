class ActionString {
    constructor() {}

    getMarkdownString(type,action,args) { //type can be open or close
        switch (action) {
            case 'link':
                if(type==='open') return "<span type='link' class='link' action-ref='{0}' name='link-{1}-{2}'>".format(args)
                else return '</span>'
            case 'item':
                if(type==='open') return "<span type='item' class='item' action-ref='{0}' name='item-{1}-{2}'>".format(args)
                else return '</span>'
        }
        return ''
    }

    getRegexString(action) {
        switch(action) {
            case 'link':
                return /<span type=\'link\' class=\'link\' action-ref=\'(\d)\' name=\'link\-([0-9\-]+)\'>(.*?)<\/span>/g
            case 'item':
                return /<span type=\'item\' class=\'item\' action-ref=\'(\d)\' name=\'item\-([0-9\-]+)\'>(.*?)<\/span>/g
        }
        return ''
    }
}

module.exports = new ActionString()