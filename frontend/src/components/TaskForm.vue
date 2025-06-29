<template>
  <div class="form-card">
    <input v-model="title" placeholder="Titre de la tâche" class="form-input" />
    <input v-model="date" type="datetime-local" class="form-input" />
    <select v-model="priority" class="form-input">
      <option value="basse">Basse</option>
      <option value="moyenne">Moyenne</option>
      <option value="haute">Haute</option>
    </select>
    <textarea
      v-model="tags"
      placeholder="Étiquettes (séparées par des virgules)"
      class="form-input"
    ></textarea>
    <button
      v-if="canAdd"
      @click="handleAddTask"
      class="add-button"
    >
      Ajouter la tâche
    </button>
  </div>
</template>

<script setup>
import { ref,watch } from 'vue'

const props = defineProps({
  canAdd: Boolean
})

const emit = defineEmits(['add-task'])

const title = ref('')
const date = ref('')
const priority = ref('moyenne')
const tags = ref('')

// fonction permettant d'afficher la date et heure actuelle sans avoir besoin d'interaction humaine
watch(
  () => props.canAdd,
  (newVal) => {
    if (newVal) {
      console.log('date initialisée', date.value)
      const now = new Date()
      const offset = now.getTimezoneOffset()
      const localDate = new Date(now.getTime() - offset * 60000)
      date.value = localDate.toISOString().slice(0, 16)
    }
  },
  { immediate: true }
)

const handleAddTask = () => {
  if (!title.value.trim() || !date.value || !priority.value.trim()) {
    alert('Veuillez remplir tous les champs obligatoires (titre, date, priorité).')
    return
  }

  const task = {
    title: title.value.trim(),
    date: date.value,
    priority: priority.value,
    completed: false,
    tags: tags.value.split(',').map(t => t.trim()).filter(t => t !== '')
  }

  emit('add-task', task)

  // Reset form
  title.value = ''
  date.value = ''
  priority.value = 'moyenne'
  tags.value = ''
}
</script>