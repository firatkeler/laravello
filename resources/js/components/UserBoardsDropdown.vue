<template>
    <div>
        <button class="header-btn" @click="showBoards = !showBoards">Boards</button>
        <DropdownMenu :show="showBoards" @closed="showBoards = false">
            <div class="text-gray-600 text-xs font-semibold mb-2 ml-2">Boards</div>
            <router-link
                :to="{name: 'board', params: {id: board.id}}"
                v-for="board in userBoards"
                :key="board.id"
                :class="[`bg-${board.color}-100`]"
                class="m-2 rounded-sm opacity-100 hover:opacity-75 text-gray-700 font-gold cursor-pointer flex"
                @click.native="showBoards = false"
            >
                <div :class="[`bg-${board.color}-200`]" class="w-10 rounded-sm rounded-r-none"></div>
                <div class="p-2">{{board.title}}</div>
            </router-link>
        </DropdownMenu>
    </div>
</template>

<script>
import {mapState} from 'vuex';
import UserBoards from '../graphql/UserBoards.gql';
import DropdownMenu from '../components/DropdownMenu';
import {colorMap100} from "../utils";
export default {
    components: {
        DropdownMenu,
    },
    apollo: {
        userBoards: {
            query: UserBoards,
            variables() {
                return {
                    userId: this.id
                }
            },
            skip() {
                return !this.id;
            }
        }
    },
    data() {
        return {
            showBoards: false,
        }
    },
    computed: {
        ...mapState({
            id: (state) => state.user.id,
        }),
        colorMap100: () => colorMap100,
        colorMap200: () => colorMap200,
    }
}
</script>
