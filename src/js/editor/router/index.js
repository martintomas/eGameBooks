import MiniPageList from 'editor/components/page-list/miniPageList.vue'
import ElementsView from 'editor/components/page-elements/elementsView.vue'
import PageMainContainer from 'editor/components/page-main/pageMainContainer.vue'
import PageView from 'editor/components/page-main/page-summary-view/pageView.vue'
import PageEditorMain from 'editor/components/page-main/page-editor-view/pageEditorMain.vue'
import NewPage from 'editor/components/page-main/new-page/newPage.vue'
import EditPage from 'editor/components/page-main/new-page/editPage.vue'
import SettingsBook from 'editor/components/page-main/new-page/settingsBook.vue'

export const editorRoutes = [{
    path: '',
    components: {
        'editor-mini-page': MiniPageList,
        'editor-page-view-container': PageMainContainer,
        'editor-elements-view': ElementsView
    },
    props: { 'editor-mini-page': true, 'editor-page-view-container': true, 'editor-elements-view': true },
    children: [{
        path: 'settings',
        name: 'editor-edit-settings',
        components: {
            'editor-page-view': SettingsBook
        },
        props: { 'editor-page-view': true }
    },{
        path: 'new-page',
        name: 'editor-new-page-default',
        components: {
            'editor-page-view': NewPage
        },
        props: { 'editor-page-view': true }
    },{
        path: 'settings-page/:pageId',
        name: 'editor-settings-page',
        components: {
            'editor-page-view': EditPage
        },
        props: { 'editor-page-view': true }
    },{
        path: 'new-page/:pageId',
        name: 'editor-new-page',
        components: {
            'editor-page-view': NewPage
        },
        props: { 'editor-page-view': true }
    },{
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