import PageHtmlEditorParser from 'editor/components/page-main/page-main-text/pageHtmlEditorParser.js'

import PageTextActionLink from 'editor/components/page-main/page-main-text/pageTextActionLink.vue'

export default {
    props: {
        pageData: null,
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
                    pageData: self.pageData
                }
            },
        }
        return h(dynComponent)
    }
}