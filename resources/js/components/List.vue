<template>
    <div class="list bg-gray-300 rounded-sm p-2 mr-2">
        <div class="flex justify-between">
            <div class="text-gray-800 pl-2 pb-2 font-bold">{{list.title}}</div>
        </div>

        <Card v-for="card in list.cards" :key="card.id" :card="card" @updated="$emit('card-updated', {...$event, list_id: list.id})" @deleted="$emit('card-deleted', {...$event, list_id: list.id})"></Card>

        <CardEditorAdd v-if="editing" @closed="editing=false" :list="list" @added="$emit('card-added', {...$event, list_id: list.id})"></CardEditorAdd>
        <AddCardButton v-else-if="!editing && list.board.owner.id === id" @click="editing=true"></AddCardButton>

    </div>
</template>

<script>
import Card from '../components/Card';
import CardEditorAdd from "./CardEditorAdd";
import AddCardButton from '../components/AddCardButton';
import {mapState} from 'vuex';

export default {
    components: {
        Card,
        CardEditorAdd,
        AddCardButton
    },
    computed: mapState({
        id: state => state.user.id,
    }),
    props: {
        list: Object
    },
    data() {
        return {
            editing: false,
        }
    }
}
</script>

<style scoped>
.list {
    width: 250px;
    min-width: 250px;
}
</style>
