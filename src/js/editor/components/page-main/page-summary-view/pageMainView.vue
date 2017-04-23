<template>
    <div class="page-main-root">
        <div class='page-main-container'>
            <div class='page-main-view'>
                <div class='scroller-wrapper' ref="page-mini-main-wrapper">
                    <div class='scroller-box' ref="page-mini-main-scroller">
                        <div v-html='pageText' class='page-main-text'></div>
                    </div>
                </div>
            </div>
            <div class='page-main-buttons text-center'>
                <ul>
                    <li><span class='page-main-button'>{{String.doTranslationEditor('edit')}}</span></li>
                    <li><span class='page-main-button'>{{String.doTranslationEditor('settings')}}</span></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>

import IScroll from 'iscroll'
import {bus} from 'app.js'

export default {
    props: {
        pageId: 0,
        pageData: null,
    },
    data() {
        return {
            scroller: null,
            scrollWrapper: 'page-mini-main-wrapper',
            scrollContainer: 'page-mini-main-scroller',
        }
    },
    created() {
        bus.$on('editor-panel-resize', source => {
            if(this.scroller != null) {
                this.scroller.refresh()
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
    },
    computed: {
        pageText() {
            return this.pageData.data.renderedText
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
        min-height:13rem;
        border: black solid 1px;
        border-radius:1rem;
        display:block;
        top: 4%;
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
        top:2%;
        left:5%;
        right:2%;
        bottom:2;
        height:96%;
        width:93%;
    }
    .scroller-wrapper {
        height: 100%;
        overflow: hidden;
    }
    .scroller-box {
        transform: translateZ(0);
        user-select: none;
        text-size-adjust: none;
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