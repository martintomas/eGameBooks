<template>

<dyn-modal ref='dynPageDetail'>
    <span slot='modalHeader'>
        <template v-if='pageData != null'>
            {{String.doTranslationEditor('page-zoom-modal-header',(pageData.data.pageNumber))}}&nbsp;
        </template>
        <i class="fa fa-edit unactive-icon tooltip" aria-hidden="true" slot='tooltip' @click='loadPage'></i>
    </span>
    <span slot='modalBody'>
        <div class='vertical-div float-left'>
            <span class='active-vertical-div' v-if="closestSmallerPage != null" @click='previousPage'>
                <span class='modal-middle-center'>
                    <i class="fa fa-chevron-left unactive-icon" aria-hidden="true"></i>
                </span>
            </span>
        </div>
        <div class="page-detail-text float-left" ref="pageDetailWrapper">
            <div class="page-detail-scroller" ref="pageDetailScroller">
                <dyn-text-renderer v-if='pageData != null' :page-data='pageData' render-type='pageDetail'></dyn-text-renderer>
            </div>
        </div>
        <div class='vertical-div float-right'>
            <span class='active-vertical-div' v-if="closestBiggerPage != null" @click='nextPage'>
                <span class='modal-middle-center'>
                    <i class="fa fa-chevron-right unactive-icon" aria-hidden="true"></i>
                </span>
            </span>
        </div>
    </span>
    <span slot='modalFooter'>
        <template v-if='pageData != null'>
            {{String.doTranslationEditor('page-num',(pageData.data.pageNumber))}}
        </template>
    </span>
</dyn-modal>
</template>

<script>
import IScroll from 'iscroll'
import DynTextRenderer from 'editor/components/page-main/page-main-text/dynTextRenderer.js'
import DynModal from 'editor/components/dyn-components/dynModal.vue'
import {bus} from 'app.js'
import {busEditor} from 'editor/services/defaults.js'

export default {
    components: {
        DynTextRenderer,
        DynModal
    },
    props: {
    },
    data() {
        return {
            scrollWrapper: 'pageDetailWrapper',
            scrollContainer: 'pageDetailScroller',
            scroller: null,
            pageId:0,
        }
    },
    computed: {
        pageData() {
            if(this.pageId in this.$store.state.editor.bookData.pages) return this.$store.state.editor.bookData.pages[this.pageId]
            else return null
        },
        closestSmallerPage() {
            if(this.pageId != null) {
                let indexActual = this.$store.state.editor.bookData.pagesOrder.indexOf(this.pageId)
                if(indexActual > 0) return this.$store.state.editor.bookData.pages[this.$store.state.editor.bookData.pagesOrder[indexActual-1]]
            }
            return null
        },
        closestBiggerPage() {
            if(this.pageId != null) {
                let indexActual = this.$store.state.editor.bookData.pagesOrder.indexOf(this.pageId)
                if(indexActual < this.$store.state.editor.bookData.pagesOrder.length - 1 && indexActual != -1) return this.$store.state.editor.bookData.pages[this.$store.state.editor.bookData.pagesOrder[indexActual+1]]
            }
            return null
        }
    },
    watch: {
        pageData(value) {
            setTimeout(() => {
                this.scroller.refresh() //actualize scroller based on new height
            }, 200)
        }
    },
    created() {
        busEditor.$on('show-page-detail',pageId => {
            this.pageId = pageId
            this.$refs.dynPageDetail.show()
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
            this.scroller.refresh() //actualize scroller based on new height
        }, 200)
    },
    methods: {
        previousPage() {
            this.pageId = this.closestSmallerPage.data.id
        },
        nextPage() {
            this.pageId = this.closestBiggerPage.data.id
        },
        loadPage() {
            this.$refs.dynPageDetail.close()
            this.$router.push({ name: 'editor-page-view', params: { pageId: this.pageId }})
        }
    }
}
</script>

<style>
.page-detail-text {
    margin:0 auto;
    padding: 1rem 1%;
    width: calc(98% - 4rem);
    overflow: hidden;
    box-sizing: border-box;
    height:100%;
        position: relative;
}
.page-detail-scroller {
    /*z-index: 1;*/
    width: calc(100% - 5px); /*left some place for scroller*/
    transform: translateZ(0);
    user-select: none;
    text-size-adjust: none;
    padding-bottom: 2rem;
}
.page-detail-text p{
    margin: 0;
}
.vertical-div {
    width:2rem;
    height: 100%;
}
.active-vertical-div {
    font-size:200%;
    display: table;
    text-align: center;
    cursor:pointer;
    height:100%;
    width:100%;
}
.active-vertical-div:hover {
    background-color: rgb(204, 204, 204);
}
.modal-page-body {
    height: calc(100% - 3.9rem);
    box-sizing: border-box;
}
.modal-page-content {
    width: 80%;
    min-width:6rem;
    height: 80vh;
    min-height:5rem;
}
.close {
    float: right;
    font-size: 28px;
    cursor:pointer;
}
</style>