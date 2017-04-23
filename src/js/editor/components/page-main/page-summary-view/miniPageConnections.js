import DynTooltip from 'editor/components/dyn-components/dynTooltip.vue'
import { generateHash } from 'defaults.js'

//expect that page and connectionText variables are defined
export default {
    components: {
        DynTooltip
    },
    props: {
        model: null,
        modelLength: 0,
        index: 0,
        pageMiniWidth: 0,
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
        }
    },
    computed: {
        styleMiniPageBox() {
            let max = this.pageMiniWidth
            if (this.active) max = this.activeDistance - 0.2 //left some mini space between active and other component
            return {
                left: ((this.pageMiniDistance * this.index) + this.pageMiniDistanceMove) + 'rem',
                width: max + 'rem',
                minWidth: max + 'rem',
            }
        },
        styleMiniPage() {
            return {
                width: this.pageMiniWidth + 'rem',
                minWidth: this.pageMiniWidth + 'rem',
            }
        },
        styleMiniPageTextBox() { //keep area under mini page centered
            if (this.active || this.modelLength - 1 === this.index) {
                return {
                    width: this.pageMiniWidth + 'rem',
                }
            } else {
                let max = this.pageMiniWidth
                if (this.pageMiniDistance < max) max = this.pageMiniDistance
                return {
                    width: max + 'rem',
                }
            }
        },
        pageId() {
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
        showTooltip(tooltip) {
            setTimeout(() => {
                tooltip.show(this.$refs.miniPageBox)
            }, 50)

        },
        hideTooltip(tooltip) {
            tooltip.hide()
        }
    }

}