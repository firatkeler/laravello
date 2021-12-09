<template>
    <div>
        <div @click="showEditor" v-if="!editing" class="list bg-white hover:bg-gray-500 rounded-sm p-2 mr-2 opacity-75 text-black cursor-pointer">
            +&nbsp;Add List
        </div>

        <div v-else class="bg-gray-300 rounded-sm p-2 list" v-on-click-away="hideEditor">
            <input
                type="text"
                ref="title"
                placeholder="Enter list title"
                @keyup.esc="hideEditor"
                @keypress.enter="addList"
                v-model="title"
                class="rounded-sm border-blue-600 border-2 py-1 px-2 outline-none w-full text-gray-800 text-sm"
            />

            <div class="flex">
                <button class="mt-2 rounded-sm py-1 px-3 bg-blue-700 text-white cursor-pointer hover:bg-blue-500 outline-none" @click="addList">
                    Add List
                </button>
                <button @click="hideEditor" class="mt-2 ml-1 px-3 rounded-md hover:bg-gray-400 cursor-pointer text-gray-500 flex items-center justify-center">
                    <div>×</div>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import {directive as onClickAway} from 'vue-clickaway';
import CardListAdd from '../graphql/CardListAdd.gql';
import {EVENT_CARD_LIST_ADDED} from "../constants";

export default {
    props: {
        board: Object
    },
    data() {
        return {
            editing: false,
            title: null,
        }
    },
    directives: {
        onClickAway
    },
    methods: {
        hideEditor() {
            this.editing = false;
        },
        showEditor() {
            this.editing = true;

            this.$nextTick(() => {
                this.$refs.title.focus()
            })
        },
        addList() {
            const self = this;

            this.$apollo.mutate({
                mutation: CardListAdd,
                variables: {
                    title: this.title,
                    board_id: this.board.id
                },
                update(store, {data: {cardListAdd}}) {
                    self.$emit('added', {store, data: cardListAdd, type: EVENT_CARD_LIST_ADDED});

                    self.hideEditor();
                }
            });
        }
    }
}
</script>
