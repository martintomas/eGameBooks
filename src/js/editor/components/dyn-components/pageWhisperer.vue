<template>
    <div class='page-whisperer-root'>
        <input class="modalInput whisperer" :component-id="componentId" v-model.number="pageNumberLocal" type="number" :id="inputId" @focus='showWhisperer' @input='showWhisperer'>
        <div class="whisperer-content" ref="dropdownWhisperer">
            <div class="page-whisperer-scroller" ref="page-whisperer-scroller">
                <ul>
                    <li v-for="(model,index) in pagesLocal" @click="selectPage(model.pageNumber)">
                        <span class='bold'>{{String.doTranslationEditor('page')}}  {{model.pageNumber}}</span>:
                        <span v-html="model.text"></span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>

import {bus} from 'app.js'
import IScroll from 'iscroll'
import {generateHash} from 'defaults'

export default {
    props: {
        pageNumber: null,
        editedPage: null,
        inputId: ''
    },
    data() {
        return {
             componentId:this.generateHash('page-con-down',0),
             dropdownWhisperer: null,
             pageNumberLocal: '',
             scrollWrapper: 'dropdownWhisperer',
        }
    },
    computed: {
        pages() {
            return this.$store.state.editor.bookData.pages
        },
        pagesOrder() {
            return this.$store.state.editor.bookData.pagesOrder
        },
        whispererLimit() {
            return this.$store.state.editor.editorConfig.whispererLimit
        },
        whispererShaveHTML() {
            return this.$store.state.editor.editorConfig.whispererShaveHTML
        },
        pagesLocal() {
            let temp = [], key, i, text
            let pageNumberLocalStr = String(this.pageNumberLocal)
            if(pageNumberLocalStr === '' || pageNumberLocalStr === null) {
                for(i=0;i<this.pagesOrder.length;i++) {
                    if(this.editedPage != this.pages[this.pagesOrder[i]].data.pageNumber) {
                        if(this.pages[this.pagesOrder[i]].data.pageTittle != '' && this.pages[this.pagesOrder[i]].data.pageTittle != null) text = this.pages[this.pagesOrder[i]].data.pageTittle
                        else text = String.sanitizeHTML(String.shaveHTML(this.pages[this.pagesOrder[i]].data.renderedText,this.whispererShaveHTML))

                        temp.push({
                            'pageNumber': this.pages[this.pagesOrder[i]].data.pageNumber,
                            'text': text
                        })
                        if(i>this.whispererLimit) break
                    }
                }
            } else {
                i=0
                for(key in this.pages) {
                     if (this.pages[key].data.pageNumber != this.editedPage && String(this.pages[key].data.pageNumber).substr(0,pageNumberLocalStr.length) === pageNumberLocalStr) {
                        i++

                        if(this.pages[key].data.pageTittle != '' && this.pages[key].data.pageTittle != null) text = this.pages[key].data.pageTittle
                        else text = String.sanitizeHTML(String.shaveHTML(this.pages[key].data.renderedText,this.whispererShaveHTML))

                        temp.push({
                            'pageNumber': this.pages[key].data.pageNumber,
                            'text':text
                        })
                     }
                     if(i>this.whispererLimit) break
                }
            }

            if(this.scroller) {
                setTimeout(() => {
                    this.scroller.refresh(); //actualize scroller based on new height (changed when new page number is used)
                }, 200);
            }

            return temp
        },
    },
    watch: {
        pageNumber(val) { //be sure that when pageNumber prop changes, it has always top priority to be shown
            if(val === null) this.pageNumberLocal = ''
            else this.pageNumberLocal = val
        }
    },
    mounted() {
        if(this.pageNumber === null) this.pageNumberLocal = ''
        else this.pageNumberLocal = this.pageNumber

        this.dropdownWhisperer = this.$refs.dropdownWhisperer
        bus.$on('automatic-hide', source => {
            if (!source.target.matches('.whisperer')) {
                this.hideWhisperer()
            } else {
                let componentId = source.target.getAttribute('component-id')
                if(componentId && this.componentId != null) {
                    if(componentId != this.componentId) {
                        this.hideWhisperer()
                    }
                }
            }
        })
        this.scroller = new IScroll(this.$refs[this.scrollWrapper], {
            mouseWheel: true,
            bounce: false,
            interactiveScrollbars: true,
            shrinkScrollbars: 'clip',
            scrollbars: 'custom',
        })
    },
    methods: {
        generateHash,
        showWhisperer() {
            if(!this.dropdownWhisperer.classList.contains("show-block")) {
                this.dropdownWhisperer.classList.add("show-block")
                setTimeout(() => { //actualize scroller based on new height (whisperer have to be shown)
                    this.scroller.refresh(); 
                }, 200);
            }
        },
        hideWhisperer() {
            if(this.dropdownWhisperer.classList.contains("show-block")) {
                this.dropdownWhisperer.classList.remove("show-block")
            }
        },
        selectPage(pageNumber) {
            this.pageNumberLocal = pageNumber
            this.hideWhisperer()
        },
        clear() {
            if(this.pageNumber === null) this.pageNumberLocal = ''
            else if(this.pageNumber != this.pageNumberLocal) this.pageNumberLocal = this.pageNumber
        },
    }
}
</script>

<style>
.page-whisperer-root {
    display:inline-block;
}
.whisperer-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    max-height:15rem;
    max-width:25rem;
    overflow:hidden;
}

.page-whisperer-scroller {
    z-index: 1;
    transform: translateZ(0);
    user-select: none;
    text-size-adjust: none;
}
.whisperer-content ul{
    list-style-type: none;
    padding-left: 0;
    margin:0;
}
.whisperer-content li {
    float: none;
    color: black;
    padding: 0.2rem 0.7rem 0.2rem 0.7rem;
    text-decoration: none;
    display: block;
    text-align: left;
    cursor:pointer;
}
.whisperer-content li:hover {
    background-color: #ddd;
}
</style>