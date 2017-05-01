<template>
    <div ref="dynModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <span class="close" @click='close'><i class="fa fa-close unactive-icon" aria-hidden="true" @click='close'></i></span>
                <slot name='modalHeader'></slot>
            </div>
            <div class="modal-body">
                <slot name='modalBody'></slot>
            </div>
            <div class="modal-footer">
                <slot name='modalFooter'></slot>
            </div>
        </div>
    </div>
</template>

<script>

import {bus} from 'app.js'

export default {
    created() {
        bus.$on('automatic-hide',source => { //listen for indirect event for hidding modal
            if(source.target == this.$refs.dynModal) {
                this.close()
            }
        })
    },
    methods: {
        show() {
            this.$refs.dynModal.style.display = "block"
        },
        close() {
            this.$refs.dynModal.style.display = "none"
        }
    }
}
</script>

<style>
.modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1000000; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}
.modal-header {
    padding: 2px 16px;
    background-color: gray;
    font-size:120%;
    font-weight:bold;
}
.modal-body {padding: 2px 16px;}
.modal-footer {
    padding: 2px 16px;
    background-color: gray;
}

.modal-content {
    position: relative;
    background-color: #fefefe;
    margin: auto;
    padding: 0;
    border: 1px solid #888;
    width: 80%;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
    -webkit-animation-name: animatetop;
    -webkit-animation-duration: 0.4s;
    animation-name: animatetop;
    animation-duration: 0.4s
}
.close {
    float: right;
    font-size: 28px;
    cursor:pointer;
}

@-webkit-keyframes animatetop {
    from {top: -300px; opacity: 0}
    to {top: 0; opacity: 1}
}

@keyframes animatetop {
    from {top: -300px; opacity: 0}
    to {top: 0; opacity: 1}
}
</style>