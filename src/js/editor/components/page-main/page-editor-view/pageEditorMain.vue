<template>
    <div class='editor-markdown-root'>
        <template v-if="editedPageExists">
            <editor-action-panel :page-id='pageId' class='editor-action-panel'></editor-action-panel>
            <markdown-toolbar :page-id='pageId' @add-simple-text-textarea='addSimpleTextTextarea' @hide-markdown-preview="hideMarkdownPreview" @show-markdown-preview="showMarkdownPreview" @change-preview-type='changePreviewType'></markdown-toolbar>
            <div class='editor-markdown-main-part'>
                <div class='div-markdown-textarea' ref='markdownTextareaRoot'><textarea class='markdown-textarea' ref='markdownTextarea' :value='editedText' @input="updateTextarea"></textarea></div>
                
                <div class='markdown-rendered-output' ref='markdownRenderedRoot'>
                    <div class='scroller-wrapper' ref="pageEditorMainWrapper">
                        <div class='scroller-box'>
                            <div v-if='simplePreview' class='' v-html="renderedText"></div>
                            <page-main-text v-else class='' :page-data='pageData'></page-main-text>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else-if="pagesExists">
            <div class='page-view-missing-page'>
                {{String.doTranslationEditor('missing-page-error',pageId)}}
                <span style='text-decoration:underline;cursor:pointer;' @click='createNewPage'>{{String.doTranslationEditor('missing-page-create-new')}}</span>
            </div>
        </template>
    </div>
</template>

<script>
import IScroll from 'iscroll'
import {busEditor} from 'editor/services/defaults.js'
import MarkdownToolbar from 'editor/components/page-main/page-editor-view/markdownToolbar.vue'
import EditorActionPanel from 'editor/components/page-main/page-editor-view/editorActionPanel.vue'
import {MarkdownComp} from 'editor/services/markdown-it/markdownComp.js'
import {AllowedActions} from 'editor/constants'
import {debounce,generateHash} from 'defaults.js'
import * as mutationTypes from 'editor/store/mutationTypes' 
import PageMainText from 'editor/components/page-main/page-main-text/pageMainText.vue'

var markdownItAllowedActions = []
for(let key in AllowedActions) markdownItAllowedActions.push(AllowedActions[key]) //provide array of allowed actions

var markdownItAnalysis = {}
markdownItAnalysis[AllowedActions.LINK] = []
markdownItAnalysis[AllowedActions.ITEM] = []

export default {
    components: {
        MarkdownToolbar,
        EditorActionPanel,
        PageMainText,
    },
    props: {
        pageId: 0
    },
    data() {
        return {
            markdownComp: new MarkdownComp(markdownItAnalysis), //local markdown
            markdownInputText: '',
            markdownTextarea: null,
            editedText: '',
            windowChangingTimeout: null,
            scrollWrapper: 'pageEditorMainWrapper',
            scroller: null,
        }
    },
    computed: {
        pages() {
            return this.$store.state.editor.bookData.pages
        },
        pageData() {
            return this.$store.state.editor.bookData.pages[this.pageId]
        },
        pagesExists() {
            return this.$store.state.editor.bookData.pagesOrder.length > 0
        },
        editedPageExists() {
            return this.pageId in this.$store.state.editor.bookData.pages
        },
        rawText() {
            if(this.pageId in this.pages) {
                return this.pages[this.pageId].data.text
            }
            return ''
        },
        renderedText() {
            if(this.pageId in this.pages) {
                return this.pages[this.pageId].data.renderedText
            }
            return ''
        },
        previewShown() {
            return this.$store.state.editor.editorStatus.editorShowPreview
        },
        simplePreview() {
            return this.$store.state.editor.editorStatus.editorSimplePreview
        }
    },
    watch: {
        rawText(value) {
            this.editedText = value
            if(this.markdownTextarea) this.markdownTextarea.focus()
        },
        editedPageExists(value) {
            if(value) {
                this.initializeEditor()
            }
        }
    },
    created() {
        busEditor.$on('editor-panel-resize', source => {
            if(this.scroller != null) {
                this.scroller.refresh()
            }
        })
    },
    mounted() {
        this.initializeEditor()
    },
    beforeRouteEnter (to, from, next) {
        next()
    },
    beforeRouteUpdate (to, from, next) {
        this.editedText = this.rawText
        next()
    },
    beforeRouteLeave (to, from, next) {
        this.editedText = this.rawText
        next()
    },
    methods: {
        generateHash,
        updateTextarea: debounce(function (e) {
            this.editedText = e.target.value
            this.$store.dispatch('editor/updatePageText', {
                pageId: this.pageId,
                text: e.target.value,
            })
            setTimeout(() => {
                this.scroller.refresh();
            }, 200)
        }, 500),
        initializeEditor() {
            this.$nextTick(() => {
                this.editedText = this.rawText
                this.markdownTextarea = this.$refs.markdownTextarea //create shortcut for markdown textarea
                if(this.markdownTextarea) this.markdownTextarea.focus()

                if(this.$refs[this.scrollWrapper]) {
                    this.scroller = new IScroll(this.$refs[this.scrollWrapper], {
                        mouseWheel: true,
                        bounce: false,
                        interactiveScrollbars: true,
                        shrinkScrollbars: 'clip',
                        scrollbars: 'custom',
                    })
                    setTimeout(() => {
                        this.scroller.refresh();
                    }, 200)
                }
            })
        },
        addSimpleTextTextarea(data) { //emited by markdown toolbar           
            this.markdownTextarea.focus()
            let selStart = this.markdownTextarea.selectionStart
            let selEnd = this.markdownTextarea.selectionEnd           

            this.editedText = this.editedText.substring(0, selStart) + data['before'] + this.editedText.substring(selStart, selEnd) + data['after'] + this.editedText.substring(selEnd)
            this.markdownTextarea.focus()

            this.$nextTick(() => { //wait for next tick --> so text inside textarea is already updated
                this.markdownTextarea.focus()
                if(selStart === selEnd) {
                    this.markdownTextarea.setSelectionRange(selStart+data['before'].length, selStart+data['before'].length) //move cursor inside markdown
                } else {
                    this.markdownTextarea.setSelectionRange(selEnd+data['before'].length+data['after'].length, selEnd+data['before'].length+data['after'].length) //move cursor behind markdown
                }
            })
        },
        hideMarkdownPreview() {
            //console.log('hidding markdown preview')

            this.$store.commit('editor/'+mutationTypes.CHANGE_EDITOR_SHOW_PREVIEW,false)

            this.$refs.markdownRenderedRoot.style.overflow = 'hidden'
            this.$refs.markdownRenderedRoot.style.width = '0%'
            this.$refs.markdownTextareaRoot.style.width = '100%'
            
            clearTimeout(this.windowChangingTimeout)
            this.windowChangingTimeout = setTimeout(() => {
                this.$refs.markdownRenderedRoot.style.display = 'none' //hide after transition is done
                setTimeout(() => {
                    this.scroller.refresh();
                }, 200)
            }, 500)
        },
        showMarkdownPreview() {
            //console.log('showing markdown preview')

            this.$store.commit('editor/'+mutationTypes.CHANGE_EDITOR_SHOW_PREVIEW,true)

            this.$refs.markdownTextareaRoot.style.width = 'calc(50% - 0.6rem)' 
            this.$refs.markdownRenderedRoot.style.width = 'calc(50% - 0.6rem)'
            this.$refs.markdownRenderedRoot.style.display = 'block'

            clearTimeout(this.windowChangingTimeout)
            this.windowChangingTimeout = setTimeout(() => {
                this.$refs.markdownRenderedRoot.style.overflow = 'auto'
                setTimeout(() => {
                    this.scroller.refresh();
                }, 200)
            },500)
        },
        changePreviewType(value) {
            this.$store.commit('editor/'+mutationTypes.CHANGE_EDITOR_SIMPLE_PREVIEW,value)

            setTimeout(() => {
                this.scroller.refresh();
            }, 200)
        },
        createNewPage() {
            this.$router.push({ name: 'editor-new-page', params: { pageId: this.pageId }})
        }
    }
}

</script>

<style>
.editor-markdown-root {
    display:flex;
    flex-direction:column;
    height:100%;
    border: black solid 1px;
    width:100%;
    min-width:15rem;
    padding: 1rem;
    box-sizing: border-box;
}
.editor-markdown-action-panel {
    /*border-bottom: 1px solid black;*/
    margin-bottom:1.5rem;
}
.editor-markdown-main-part {
    display:flex;
    flex-direction: row;
    flex-wrap: nowrap;
    height: 100%;
    width: 100%;
}
.div-markdown-textarea {
    margin: 0.1rem 0.5rem 0 0;
    width: calc(50% - 0.6rem);
    height: 100%;
    box-sizing: border-box;

    transition: width 0.3s
}
.markdown-textarea {
    resize: none;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}
.markdown-rendered-output {
    position:relative;
    padding: 0.2rem 0.2rem 0.2rem 0.2rem;
    margin: 0.1rem 0 0 0.5rem;
    width: calc(50% - 0.6rem);
    height: 100%;
    border: 1px black solid;
    box-sizing: border-box;
    border-radius: 0.5rem;
    overflow: auto;
    background-color: white;

    transition: width 0.3s
}
.markdown-rendered-output .item {
    text-decoration: underline;
    cursor:pointer;
}
.markdown-rendered-output .item:after {
    font-family: FontAwesome;
    content: " \f255";
}
.markdown-rendered-output .link {
    text-decoration: underline;
    cursor:pointer;
}
.markdown-rendered-output .link:after {
    font-family: FontAwesome;
    content: " \f0a4";
}
.markdown-toolbar-button {
    padding: 0.25rem 0.25rem 0.25rem 0.25rem;
    margin: 0.1rem 0.2rem 0.1rem 0.2rem;
    cursor: pointer;
    border-radius: 0.25rem;
    border: 1px solid #C8C8C8;
    font-size:125%;
}
.markdown-toolbar-button:hover {
    background-color: #C8C8C8;
    /*opacity: 0.7;*/
    /*filter: alpha(opacity=70);*/
}

</style>