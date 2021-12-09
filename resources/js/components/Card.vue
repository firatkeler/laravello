<template>
    <div>
        <div v-if="!editing" class="group card bg-white shadow-card rounded-sm p-2 cursor-pointer text-sm hover:bg-gray-100 mb-2 flex justify-between">
            <div>{{card.title}}</div>
            <div class="flex font-bold opacity-0 group-hover:opacity-100 transition-opacity ease-out duration-500">
                <div v-show="card.owner_id === id" class="text-gray-400 pr-2 hover:text-yellow-700" @click="editing=true">Edit</div>
                <div v-show="card.owner_id === id" class="text-gray-400 hover:text-red-700" @click="deleteCard">Delete</div>
            </div>
        </div>
        <CardEditor v-model="title" v-else class="mb-2" label="Save Card" @close="editing=false" @saved="updateCard"></CardEditor>
    </div>
</template>

<script>
import {EVENT_CARD_UPDATED, EVENT_CARD_DELETED} from "../constants";
import CardUpdate from '../graphql/CardUpdate.gql';
import CardDelete from '../graphql/CardDelete.gql';
import CardEditor from "./CardEditor";

import {mapState} from 'vuex';

export default {
    components: {
        CardEditor
    },
    props: {
        card: Object
    },
    data() {
        return {
            editing: false,
            title: this.card.title,
        }
    },
    computed: mapState({
        id: state => state.user.id
    }),
    methods: {
        async updateCard() {
            const self = this;

            try {
                await this.$apollo.mutate({
                    mutation: CardUpdate,
                    variables: {
                        id: this.card.id,
                        title: this.title,
                    },
                    update(store, {data: {cardUpdate}}) {
                        self.$emit('updated', {
                            store,
                            data: cardUpdate,
                            type: EVENT_CARD_UPDATED,
                        });
                        self.editing = false;
                    }
                });
            }
            catch(error) {}
        },
        async deleteCard() {
            const self = this;

            try {
                await this.$apollo.mutate({
                    mutation: CardDelete,
                    variables: {
                        id: this.card.id,
                    },
                    update(store, {data: {cardDelete}}) {
                        self.$emit('deleted', {
                            store,
                            data: cardDelete,
                            type: EVENT_CARD_DELETED,
                        });
                    }
                });
            }
            catch (error) {}
        },
    }
}
</script>
