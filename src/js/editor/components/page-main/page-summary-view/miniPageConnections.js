import DynTooltip from 'editor/components/dyn-components/dynTooltip.vue'
import { generateHash } from 'defaults.js'
import {busEditor} from 'editor/defaults.js'

//expect that page and connectionText variables are defined
export default {
    components: {
        DynTooltip
    },
    props: {
        model: null,
        modelLength: 0,
        index: 0,
        pageMiniDistance: 0,
        activeDistance: 0,
    },
    data() {
        return {
            miniPageRef: null,
            active: false,
            tooltipMiniPage: null,
            tooltipTextMiniPage: null,
            tooltipTextMiniPageActive: false,
            pageMiniDistanceMove: 0,
            pageMiniWidth: 200,
        }
    },
    computed: {
        styleMiniPageBox() {
            let style = {}
            style.left = ((this.pageMiniDistance * this.index) + this.pageMiniDistanceMove) + 'px'
            if (this.active && this.tooltipMiniPage != null) { //make area bigger only when there is tooltip to be shown
                style.width = this.activeDistance - 5 + 'px'
                style.minWidth = this.activeDistance - 5 + 'px'
            }
            return style
        },
        styleMiniPageTextBox() { //keep area under mini page centered
            if (this.active || this.modelLength - 1 === this.index) {
                return {
                    width: this.pageMiniWidth + 'px',
                }
            } else {
                let max = this.pageMiniWidth
                if (this.pageMiniDistance < max) max = this.pageMiniDistance
                return {
                    width: max + 'px',
                }
            }
        },
        pageId() {
            if (this.page === null) return null
            return this.page.data.id
        },
        pageNumber() {
            return this.page.data.pageNumber
        },
        simpleText() {
            return this.page.data.renderedText
        },
    },
    watch: {
        page() {
            if (this.active) this.hideMiniPageEvent() //when changed --> hide active page
        }
    },
    mounted() {
        this.miniPageRef = this.$refs.miniPage
        this.tooltipMiniPage = this.$refs.tooltipMiniPage
        this.tooltipTextMiniPage = this.$refs.tooltipTextMiniPage
        this.pageMiniWidth = this.$refs.miniPage.clientWidth

        if (this.index === 0) this.$emit('mini-page-update-width', this.pageMiniWidth)
    },
    methods: {
        generateHash,
        moveDistanceLeft(distance) {
            this.pageMiniDistanceMove = distance
        },
        activeConnectionPage(event) {
            if (this.active) {
                this.hideMiniPageEvent()
                this.$emit('hide-connection-page', this) //let othet components know
            } else {
                this.showMiniPageEvent()
                this.$emit('show-connection-page', this)
            }
        },
        showMiniPageEvent() {
            console.log('Mini pages - showing page number: ' + this.pageId);

            this.active = true
            this.miniPageRef.classList.add('active-page')
            this.showTooltip(this.tooltipMiniPage)
        },
        hideMiniPageEvent() {
            console.log('Mini pages - hiding page number: ' + this.pageId)

            this.active = false
            this.miniPageRef.classList.remove('active-page')
            this.hideTooltip(this.tooltipMiniPage)
            this.tooltipTextMiniPageActive = false
            this.hideTooltip(this.tooltipTextMiniPage)
        },
        editMiniPage(event) {
            if (event) event.stopPropagation()

            this.$router.push({ name: 'page-view', params: { pageId: this.pageId } })
        },
        showConnectionText(event) {
            if (this.active) {
                if (event) event.stopPropagation() // it is not needed to propagate event

                if (this.tooltipTextMiniPageActive) { //enable to toogle text tooltip
                    this.tooltipTextMiniPageActive = false
                    this.hideTooltip(this.tooltipTextMiniPage)
                } else {
                    this.tooltipTextMiniPageActive = true
                    this.showTooltip(this.tooltipTextMiniPage)
                }
            } else {
                this.tooltipTextMiniPageActive = true
                setTimeout(() => { //wait a bit before animation of activation is finished
                    this.showTooltip(this.tooltipTextMiniPage)
                }, 350)
            }
        },
        showPageDetail(event) {
            console.log('Mini pages - showing detail of page number: ' + this.pageId)

            if (event) event.stopPropagation()

            busEditor.$emit('show-page-detail',this.pageId)
        },
        showTooltip(tooltip) {
            if (tooltip) { //show tooltip only when tooltip is defined
                setTimeout(() => {
                    tooltip.show(this.$refs.miniPageBox)
                }, 50)
            }

        },
        hideTooltip(tooltip) {
            if (tooltip) {
                tooltip.hide()
            }
        }
    }

}