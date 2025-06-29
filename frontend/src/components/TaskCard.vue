<template>
  <div :class="task.completed ? 'task-card-done' : 'task-card'">
    <div>
      <h2 :class="['task-title', task.completed ? 'completed' : '']">{{ task.title }}</h2>
      <p class="task-info">Échéance : {{ task.date }}</p>
      <p class="task-info">
        Priorité :
        <span :class="getPriorityClass(task.priority)">{{ task.priority }}</span>
      </p>
      <div v-if="task.tags && task.tags.length" class="tag-container">
        <span v-for="(tag, i) in task.tags" :key="i" class="tag">{{ tag }}</span>
      </div>
    </div>
    <div class="task-actions">
      <button @click="$emit('toggle-task', task)" class="action-button">
        {{ task.completed ? 'Annuler' : 'Valider' }}
      </button>
      <button @click="$emit('delete-task', task)" class="delete-button">Supprimer</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  task: Object
})

const emit = defineEmits(['toggle-task', 'delete-task'])

const getPriorityClass = (priority) => {
  switch (priority) {
    case 'haute':
      return 'priority-high'
    case 'moyenne':
      return 'priority-medium'
    case 'basse':
      return 'priority-low'
    default:
      return ''
  }
}
</script>