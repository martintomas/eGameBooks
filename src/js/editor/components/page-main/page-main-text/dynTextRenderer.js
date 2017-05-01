import PageHtmlEditorParser from 'editor/services/pageHtmlEditorParser.js'

import PageTextActionLink from 'editor/components/page-main/page-main-text/pageTextActionLink.vue'

export default {
    props: {
        pageData: null,
        renderType: {
            default: 'main', //can have values main and pageDetail
            type: String
        }
    },
    data() {
        return {
            pageHtmlEditorParser: new PageHtmlEditorParser()
        }
    },
    computed: {
        pageText() {
            return this.pageData.data.renderedText
        },
        parsedHtmlText() {
            return this.pageHtmlEditorParser.parseHtmlText(this.pageText)
        }
    },
    render(h) {
        let self = this

        const dynComponent = {
            template: '<div>'+self.parsedHtmlText+'</div>',
            components: {
                PageTextActionLink
            },
            data() {
                return {
                    pageData: self.pageData,
                    renderType: self.renderType,
                }
            },
        }
        return h(dynComponent)
    }
}