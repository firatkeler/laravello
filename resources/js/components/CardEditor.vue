<template>
    <div>
        <textarea
            class="rounded-md shadow-card py-1 px-2 outline-none w-full text-gray-900 text-sm bg-white h-16 resize-none"
            placeholder="Enter a title"
            :value="value"
            ref="card"
            @keyup.esc="close"
            @keyup.enter="saved"
            @input="$emit('input', $event.target.value)"
        ></textarea>
        <div class="flex">
            <button
                @click="saved"
                class="rounded-sm py-1 px-2 bg-indigo-700 text-white cursor-pointer hover:bg-indigo-600"
            >{{label}}</button>
            <button
                @click="close"
                class="rounded-md py-1 px-2 ml-1 text-gray-500 cursor-pointer hover:bg-gray-400"
            >Cancel</button>
        </div>
    </div>
</template>

<script>
export default {
    props: ['value', 'label'],
    data() {
        return {

        }
    },
    mounted() {
        this.$refs.card.focus()
    },
    methods: {
        saved() {
            this.$emit('saved');
        },
        close() {
            this.$emit('close')
        }
    }
}
</script>

