<template>
    <CardEditor v-model="title" @close="close" @saved="addCard" label="Add Card"></CardEditor>
</template>

<script>
import {EVENT_CARD_ADDED} from "../constants";
import CardAdd from '../graphql/CardAdd.gql';
import CardEditor from "./CardEditor";

export default {
    components: {
        CardEditor
    },
    props: {
        list: Object
    },
    data() {
        return {
            title: null,
        }
    },
    methods: {
        addCard() {
            const self = this;
            this.$apollo.mutate({
                mutation: CardAdd,
                variables: {
                    title: this.title,
                    order: this.list.cards.length + 1,
                    list_id: this.list.id,
                },
                update(store, {data: {cardAdd}}) {
                    self.$emit('added', {
                        store,
                        data: cardAdd,
                        type: EVENT_CARD_ADDED,
                    });
                    self.close();
                }
            });
            // this.close();
        },
        close() {
            this.$emit('closed')
        }
    }
}
</script>
