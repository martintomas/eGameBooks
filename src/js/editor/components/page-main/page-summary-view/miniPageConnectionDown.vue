<template>
    <li class='mini-page-connection-down-box' ref='miniPageBox' :style="styleMiniPageBox" @click="activeConnectionPage">
        <template v-if='page != null'>

            <div class='connection-icon' :style='styleMiniPageTextBox' @click='showConnectionText'>
                <dyn-tooltip class='dyn-tooltip' ref='tooltipTextMiniPage' :tooltip-id="generateHash('mini-page-down-text',index)" :allow-automatic-hidding="false" :react-to-hover='false' :left-right-orientation='true' :zIndex='500'>
                    <template v-if='existsInText'>
                        <i class="fa fa-square unactive-icon used" aria-hidden="true" slot='tooltip'></i>
                        <span slot='tooltipText' v-html='connectionText'></span>
                    </template>
                    <template v-else>
                        <i class="fa fa-square unactive-icon missing" aria-hidden="true" slot='tooltip'></i>
                        <span slot='tooltipText'>{{String.doTranslationEditor('unused-link')}}</span>
                    </template>
                </dyn-tooltip>
            </div>

            <dyn-tooltip ref='tooltipMiniPage' class='mini-page-down-connection-tooltip' :tooltip-id="generateHash('mini-page-down',index)" :allow-automatic-hidding="false" :left-right-orientation='true' :react-to-hover='false'>
                <div class="mini-page-connection" ref='miniPage' slot='tooltip'>
                    <div class="mini-page-connection-tittle">
                        {{String.doTranslationEditor('page-num',(pageNumber))}}
                    </div>
                    <div class="mini-page-connection-content" v-html="simpleText">
                    </div>
                </div>
                <span slot='tooltipText'>
                    <template v-if='active'>
                        <dyn-tooltip class='dyn-tooltip'>
                            <i class="fa fa-hand-o-right unactive-icon tooltip" aria-hidden="true" slot='tooltip' @click='goToMiniPage'></i>
                            <span slot='tooltipText'>{{String.doTranslationEditor('go-to-page')}}</span>
                        </dyn-tooltip>
                        <dyn-tooltip class='dyn-tooltip'>
                            <i class="fa fa-search unactive-icon tooltip" aria-hidden="true" slot='tooltip' @click='showPageDetail'></i>
                            <span slot='tooltipText'>{{String.doTranslationEditor('zoom-mini-page')}}</span>
                        </dyn-tooltip>
                        <dyn-tooltip class='dyn-tooltip'>
                            <i class="fa fa-edit unactive-icon tooltip" aria-hidden="true" slot='tooltip' @click='editMiniPage'></i>
                            <span slot='tooltipText'>{{String.doTranslationEditor('edit-page')}}</span>
                        </dyn-tooltip>
                        <template v-if='!existsInText'>
                            <dyn-tooltip class='dyn-tooltip'>
                                <i class="fa fa-trash unactive-icon tooltip" aria-hidden="true" slot='tooltip' @click='deleteLinkAction'></i>
                                <span slot='tooltipText'>{{String.doTranslationEditor('delete-link')}}</span>
                            </dyn-tooltip>
                        </template>
                    </template>
                </span>
            </dyn-tooltip>
        </template>

        <template v-else> <!-- take care of missing page -->
            <div class='connection-icon' :style='styleMiniPageTextBox' @click='showConnectionText'>
                <dyn-tooltip class='dyn-tooltip' ref='tooltipTextMiniPage' :tooltip-id="generateHash('mini-page-down-text',index)" :allow-automatic-hidding="false" :react-to-hover='false' :zIndex='500'>
                    <template v-if='existsInText'>
                        <i class="fa fa-square unactive-icon used" aria-hidden="true" slot='tooltip'></i>
                        <span slot='tooltipText' v-html='connectionText'></span>
                    </template>
                    <template v-else>
                        <i class="fa fa-square unactive-icon missing" aria-hidden="true" slot='tooltip'></i>
                        <span slot='tooltipText'>{{String.doTranslationEditor('unused-link')}}</span>
                    </template>
                </dyn-tooltip>
            </div>

            <div class="mini-page-connection empty-mini-page" ref='miniPage'>
                <div class="mini-page-connection-tittle">
                    {{String.doTranslationEditor('missing-page')}}
                </div>
                <div class="mini-page-connection-missing-buttons">
                    <span class='mini-page-connection-missing-button' @click='newPage'>{{String.doTranslationEditor('new-page-simple')}}</span>
                    <span class='mini-page-connection-missing-button' @click='editMiniPage'>{{String.doTranslationEditor('set-up-link')}}</span>
                    <span v-if='!existsInText' class='mini-page-connection-missing-button' @click='deleteLinkAction'>{{String.doTranslationEditor('delete-link-simple')}}</span>
                </div>
            </div>
        </template>

    </li>
</template>

<script>

import MiniPageConnections from 'editor/components/page-main/page-summary-view/miniPageConnections'
import * as mutationTypes from 'editor/store/mutationTypes'
import {messageBoxWrapper} from 'editor/services/defaults.js'

export default {
    mixins: [MiniPageConnections],
    props: {
        pageEditedId: 0,
    },
    computed: {
        page() {
            if(this.model.pageId in this.$store.state.editor.bookData.pages) {
                return this.$store.state.editor.bookData.pages[this.model.pageId]
            } else {
                //console.log('Page connection down warn: Page definition is missing')
                return null
            }
        },
        connectionText() {
            if(this.model.existsInText) { //should be possible to find this info in rendered info
                let text = document.getElementsByName('link-'+this.pageEditedId+'-'+this.model.id)
                if(text.length > 0) return String.shaveHTML(text[0].innerHTML,this.$store.state.editor.editorConfig.commentShaveHTMLPageConnection)
            }
            return ''
        },
        existsInText() {
            return this.model.existsInText
        }
    },
    methods: {
        newPage(event) {
            if (event) event.stopPropagation()

            this.$router.push({ name: 'editor-new-page-default', query: {page:this.pageEditedId,action:this.model.id} })
        },
        deleteLinkAction(event) {
            if (event) event.stopPropagation()

            messageBoxWrapper.showWarnMessageStorno(this.$store.commit,String.doTranslationEditor('message-delete-page-link'),() => {
                this.$store.dispatch('editor/deleteAction',{
                    actionType:'link',
                    pageId: this.pageEditedId,
                    actionId: this.model.id
                })
            })
        },
        editMiniPage(event) {
            if (event) event.stopPropagation()

            this.$emit('edit-link-action',this.model.id)
        }
    }
}


</script>

<style> 
.mini-page-connection-down-box {
    position: absolute;
    height:100%;
    
    transition: left 0.5s;
}
.mini-page-down-connection-tooltip {
    height:84%;
}
.mini-page-connection-down-box .active-page {
    border-color: blue;
}

.empty-mini-page {
    height:84%;
}

.mini-page-connection-missing-buttons {
    width:100%;
    height:85%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.mini-page-connection-missing-button {
    width:80%;
    height:2rem;
    border: 1px solid black;
    text-align:center;
    font-weight:bold;
    font-size:130%;
    cursor:pointer;
    line-height: 2rem;
    vertical-align: middle;
    margin: 0 auto;
    border-radius: 0.5rem;
}

.mini-page-connection-missing-button:hover {
    background-color: rgb(200, 200, 200);
    background-color: rgba(200, 200, 200,0.8);
}

</style>