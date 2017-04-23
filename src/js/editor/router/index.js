import MiniPageList from 'editor/components/page-list/miniPageList.vue'
import ElementsView from 'editor/components/page-elements/elementsView.vue'
import PageMainContainer from 'editor/components/page-main/pageMainContainer.vue'
import PageView from 'editor/components/page-main/page-summary-view/pageView.vue'
import PageEditorMain from 'editor/components/page-main/page-editor-view/pageEditorMain.vue'


export const editorRoutes = [{
    path: '/',
    components: {
        'mini-page': MiniPageList,
        'page-view-container': PageMainContainer,
        'elements-view': ElementsView
    },
    props: { 'mini-page': true, 'page-view-container': true, 'elements-view': true },
    children: [{
        path: 'page/:pageId/edit',
        name: 'page-view-edit',
        components: {
            'page-view': PageEditorMain
        },
        props: { 'page-view': true }
    }, {
        path: 'page/:pageId',
        name: 'page-view',
        components: {
            'page-view': PageView
        },
        props: { 'page-view': true }
    }, {
        path: '',
        name: 'page-view',
        components: {
            'page-view': PageView
        },
        props: { 'page-view': true }
    }]
}]