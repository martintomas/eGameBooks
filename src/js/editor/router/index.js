import MiniPageList from 'editor/components/page-list/miniPageList.vue'
import ElementsView from 'editor/components/page-elements/elementsView.vue'
import PageMainContainer from 'editor/components/page-main/pageMainContainer.vue'
import PageView from 'editor/components/page-main/page-summary-view/pageView.vue'
import PageEditorMain from 'editor/components/page-main/page-editor-view/pageEditorMain.vue'


export const editorRoutes = [{
    path: '',
    components: {
        'editor-mini-page': MiniPageList,
        'editor-page-view-container': PageMainContainer,
        'editor-elements-view': ElementsView
    },
    props: { 'editor-mini-page': true, 'editor-page-view-container': true, 'editor-elements-view': true },
    children: [{
        path: 'page/:pageId/edit',
        name: 'editor-page-view-edit',
        components: {
            'editor-page-view': PageEditorMain
        },
        props: { 'editor-page-view': true }
    }, {
        path: 'page/:pageId',
        name: 'editor-page-view',
        components: {
            'editor-page-view': PageView
        },
        props: { 'editor-page-view': true }
    }, {
        path: '',
        name: 'editor-page-view-default',
        components: {
            'editor-page-view': PageView
        },
        props: { 'editor-page-view': true }
    }]
}]