<template>
    <div class="h-full flex flex-col items-stretch" :class="bgColor">
        <div class="header text-white flex justify-between items-center mb-2">
            <div class="ml-2 w-1/3">
                <UserBoardsDropdown v-if="isLoggedIn" />
            </div>
            <div class="text-lg opacity-50 cursor-pointer hover:opacity-75">Laravello</div>
            <div class="mr-2 w-1/3 flex justify-end">
                <div v-if="isLoggedIn" class="flex items-center">
                    <div class="text-sm mr-2">
                        {{name}}
                    </div>
                    <button class="header-btn" @click="signOut">Log Out</button>
                </div>
                <div v-else>
                    <button class="header-btn" @click="$router.push({name: 'login'})">Sign In</button>
                    <button class="header-btn" @click="$router.push({name: 'register'})">Register</button>
                </div>
            </div>
        </div>

        <div class="h-full flex flex-1 flex-col items-stretch">
            <div class="mx-4 mb-2 text-white font-bold text-lg">
                <span v-if="$apollo.queries.board.loading">Loading...</span>
                <span v-else>{{board.title}}</span>
            </div>
            <div class="flex flex-1 items-start overflow-x-auto mx-2" v-if="board">
                <List v-for="list in board.lists" :key="list.id" :list="list" @card-added="updateQueryCache($event)" @card-updated="updateQueryCache($event)" @card-deleted="updateQueryCache($event)"></List>

                <AddListEditor :board="board" @added="updateQueryCache($event)"></AddListEditor>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import AddListEditor from "./components/AddListEditor";
import List from './components/List';
import UserBoardsDropdown from './components/UserBoardsDropdown';
import BoardQuery from './graphql/BoardWithListsAndCards.gql';
import Logout from './graphql/Logout.gql';
import {colorMap500} from './utils';
import {EVENT_CARD_ADDED, EVENT_CARD_UPDATED, EVENT_CARD_DELETED, EVENT_CARD_LIST_ADDED} from "./constants";

export default {
    components: {
        List,
        UserBoardsDropdown,
        AddListEditor,
    },
    apollo: {
        board: {
            query: BoardQuery,
            // variables: {
            //     id: 1,
            // }
            variables() {
                return {
                    id: Number(this.$route.params.id)
                }
            }
        }
    },
    // computed: {
    //     isLoggedIn() {
    //         return this.$store.state.isLoggedIn;
    //     },
    //     name() {
    //         return this.$store.state.user.name;
    //     }
    // },
    // computed: mapState({
    //     isLoggedIn: "isLoggedIn",
    //     // isLoggedIn: state => state.isLoggedIn,
    //     // name: state => state.user.name,
    //     name: (state) => state.user.name,
    //
    // }),
    computed: {
        bgColor() {
            return {
                "bg-gray-500": this.$apollo.loading,
                [colorMap500[this.board?.color]]: !this.$apollo.loading
            }
        },
        ...mapState({
         isLoggedIn: "isLoggedIn",
         // isLoggedIn: state => state.isLoggedIn,
         // name: state => state.user.name,
         name: (state) => state.user.name
        })
    },
    methods: {
        async signOut() {
            const response = await this.$apollo.mutate({
                mutation: Logout,
            });

            if (response.data?.logout.id) {
                this.$store.dispatch('logout');
            }
        },
        updateQueryCache(event) {
            const data = event.store.readQuery({
                query: BoardQuery,
                variables: {
                    id: Number(this.board.id)
                }
            });

            const listById = () => data.board.lists.find(list => (list.id == event.list_id));

            console.log('event');
            console.log(event);
            switch (event.type) {
                case EVENT_CARD_ADDED:
                    listById().cards.push(event.data);
                    break;
                case EVENT_CARD_UPDATED:
                    listById().cards.find(card => card.id == event.data.id).title = event.data.title;
                    break;
                case EVENT_CARD_DELETED:
                    listById().cards = listById().cards.filter(card => card.id != event.data.id);
                    break;
                case EVENT_CARD_LIST_ADDED:
                    data.board.lists.push(event.data);
                    break;
            }

            event.store.writeQuery({
                query: BoardQuery,
                data,
                variables: {
                    id: Number(this.board.id)
                }
            });
        }
    }
}
</script>

<style scoped>
.header {
    height: 40px;
    background-color: rgba(0,0,0,0.2);
}
</style>
