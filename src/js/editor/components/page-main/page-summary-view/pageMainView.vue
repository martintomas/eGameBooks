<template>
    <div class="page-main-root">
        <div class='page-main-container'>
            <div class='page-main-view'>
                <div class='scroller-wrapper' ref="pageMiniMainWrapper">
                    <div class='scroller-box'>
                        <page-main-text class='page-main-text' :page-data='pageData'></page-main-text>
                    </div>
                </div>
                <span class='page-main-errors-box' :style='errorBoxStyle'>
                    <div class='scroller-wrapper' ref="pageMiniMainErrorsWrapper">
                        <div class='scroller-error-box' >
                            <ul v-if='isSevereError'>
                                <li v-for="(model,index) in severeErrors" :key='index'>
                                    <i class="fa fa-exclamation-circle error-color" aria-hidden="true"></i>&nbsp;{{String.doTranslationEditor(model.text,model.args)}}
                                </li>
                            </ul>
                            <ul v-if='isMinorError'>
                                <li v-for="(model,index) in minorErrors" :key='index'>
                                    <i class="fa fa-warning warning-color" aria-hidden="true"></i>&nbsp;{{String.doTranslationEditor(model.text,model.args)}}
                                </li>
                            </ul>
                        </div>
                    </div>
                </span>
                <span class='page-main-page-number'>
                    {{String.doTranslationEditor('page-num',(pageNumber))}}
                    <span class='float-right page-main-page-icons'>
                        <span class='unactive-icon' v-if='isSevereError' @click='toogleErrors'>{{severeErrors.length}}x&nbsp;<i class="fa fa-exclamation-circle error-color" aria-hidden="true"></i>&nbsp;</span>  
                        <span class='unactive-icon' v-if='isMinorError' @click='toogleErrors'>{{minorErrors.length}}x&nbsp;<i class="fa fa-warning warning-color" aria-hidden="true"></i></span>
                    </span>
                </span>
            </div>
            <div class='page-main-buttons text-center'>
                <ul>
                    <li><span class='page-main-button'>{{String.doTranslationEditor('edit')}}</span></li>
                    <li><span class='page-main-button' @click='changeSettings'>{{String.doTranslationEditor('settings')}}</span></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>

import IScroll from 'iscroll'
import {busEditor} from 'editor/services/defaults.js'

import PageMainText from 'editor/components/page-main/page-main-text/pageMainText.vue'

export default {
    components: {
        PageMainText
    },
    props: {
        pageId: 0,
        pageData: null,
    },
    data() {
        return {
            scroller: null,
            scrollerErrors: null,
            scrollWrapper: 'pageMiniMainWrapper',
            scrollErrorsWrapper:'pageMiniMainErrorsWrapper',
            showErrorsData: false,
            maxHeight: 10
        }
    },
    computed: {
        errorBoxStyle() {
            if((this.isSevereError || this.isMinorError) && this.showErrorsData) {
                let height = 0
                if(this.isSevereError) height += this.severeErrors.length * 1
                if(this.isMinorError) height += this.minorErrors.length * 1

                setTimeout(() => { //update scroller when height changes
                    if(this.scrollerErrors != null) this.scrollerErrors.refresh();
                },800) //wait for transition animation to end

                if(height > this.maxHeight) height = this.maxHeight //keep height reasonable
                return {height:height+'rem'}
            } else {
                return {height:'0%'}
            }
        },
        pageText() {
            return this.pageData.data.renderedText
        },
        pageNumber() {
            return this.pageData.data.pageNumber
        },
        isSevereError() {
            return this.pageId in this.$store.state.editor.bookData.pagesSevereError
        },
        severeErrors() {
            if(this.isSevereError) return this.$store.state.editor.bookData.pagesSevereError[this.pageId]
        },
        isMinorError() {
            return this.pageId in this.$store.state.editor.bookData.pagesMinorError
        },
        minorErrors() {
            if(this.isMinorError) return this.$store.state.editor.bookData.pagesMinorError[this.pageId]
        },
    },
    created() {
        busEditor.$on('editor-panel-resize', source => {
            if(this.scroller != null) {
                this.scroller.refresh()
            }
            if(this.scrollerErrors != null && this.showErrorsData && (this.isSevereError || this.isMinorError)) {
                this.scrollerErrors.refresh()
            }
        })
    },
    mounted() {
        this.scroller = new IScroll(this.$refs[this.scrollWrapper], {
            mouseWheel: true,
            bounce: false,
            interactiveScrollbars: true,
            shrinkScrollbars: 'clip',
            scrollbars: 'custom',
        })
        setTimeout(() => {
            this.scroller.refresh();
        }, 200);

        this.scrollerErrors = new IScroll(this.$refs[this.scrollErrorsWrapper], {
            mouseWheel: true,
            bounce: false,
            interactiveScrollbars: true,
            shrinkScrollbars: 'clip',
            scrollbars: 'custom',
        })
        setTimeout(() => {
            this.scrollerErrors.refresh();
        }, 200);
    },
    methods: {
        toogleErrors(event) {
            if(this.showErrorsData) this.showErrorsData = false
            else this.showErrorsData = true
        },
        changeSettings() {
            this.$router.push({ name: 'editor-settings-page', params: { pageId: this.pageId }})
        }
    }
}
</script>

<style>
    .page-main-root {
        position:relative;
        width: 80%;
        margin: 0% auto;
        height: 50%;
        min-height:15rem;
        border: black solid 1px;
        border-radius:1rem;
        min-width:15rem;
    }
    .page-main-container {
        display:flex;
        width:96%;
        height:100%;
    }
    .page-main-view {
        position:relative;
        flex-grow:2;
        height:96%; 
        top:2%;
        left:2%;
        right:2%;
        border-radius: 0.25rem;
        border: solid black 1px;
        z-index:2;
        background-color:white;
    }
    .page-main-text {
        position:relative;
        left:4%;
        height:96%;
        width:92%;
    }
    .scroller-wrapper {
        height: 100%;
        overflow: hidden;
    }
    .scroller-box {
        transform: translateZ(0);
        user-select: none;
        text-size-adjust: none;
        position: relative;
        top:2%;
    }
    .scroller-error-box {
        transform: translateZ(0);
        user-select: none;
        text-size-adjust: none;
    }
    .page-main-errors-box {
        display:block;
        width:100%;
        position:absolute;
        bottom: 1.7rem; /*same as page-main-page-number height */
        background-color:white;

        transition: height 0.1s ease-out;
    }
    .page-main-errors-box ul {
        list-style:none;
        padding:0.2rem 0.5rem 0 0.5rem;
        margin:0;
    }
    .page-main-errors-box li {
        padding:0.2rem 0 0.2 0;
    }
    .page-main-page-number {
        display:block;
        width:100%;
        height:1.7rem;
        position:absolute;
        bottom:0;
        background-color:rgb(128,128,128);
        background-color:rgba(128,128,128,0.95);
        line-height:1.7rem;
        vertical-align:middle;
        text-align:center;
        font-size:150%;
        font-weight: bold;
    }
    .page-main-page-icons {
        font-weight:normal;
        padding: 0 0.5rem 0 0.5rem;
    }
    .page-main-buttons {
        position:relative;
        top:2%;
        left:2%;
        right:2%;
        margin-left:-1rem;
        z-index:1;
    }
    .page-main-buttons ul {
        list-style:none;
        margin:0;
        padding:0;
        height:100%;
    }
    .page-main-buttons li {
        position:relative;
        display:table;
        min-width:7rem;
        min-height:1.5rem;
        max-height:3rem;
        max-width:12rem;
        height:15%;
        width:20%;
        top:2%;
        left:2%;
        right:2%;
        margin-top:2px;
    }
    .page-main-button {
        display:table-cell;
        vertical-align:middle;
        border:black solid 1px;
        border-top-right-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
        font-size: 130%;
        font-weight: bold;
        background-color: black;
        color: white;
        cursor:pointer;

        transition: color 0.3s, background-color 0.3s;
    }
    .page-main-button:hover {
        color:black;
        background-color:white;
    }
</style>