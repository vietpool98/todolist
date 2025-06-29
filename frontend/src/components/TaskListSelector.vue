<template>
  <div class="list-buttons">
    <div v-for="(list, index) in lists" :key="index" class="list-wrapper">
      <span class="delete-list-button" @click="$emit('delete-list', index)">x</span>
      <button
        @click="$emit('update:currentList', index)"
        :class="['list-button', currentList === index ? 'active' : '']"
      >
        {{ list.name }}
      </button>
    </div>
  </div>
</template>

<script setup>

defineProps({
  lists: Array,
  currentList: Number
})

defineEmits(['update:currentList', 'delete-list'])
</script>