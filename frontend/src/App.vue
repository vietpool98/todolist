<template>
  <div class="app-container">
    <h1 class="title">TO-DO LIST</h1>

    <!-- Ajout liste -->
    <div class="add-list">
      <input v-model="new_list" class="form-input" placeholder="Ajouter une liste de tâches" />
      <button @click="add_list" class="add-button-list">Ajouter</button>
    </div>

    <!-- Sélecteur des listes -->
    <TaskListSelector
      :lists="lists"
      :currentList="currentList"
      @update:currentList="val => currentList = val"
      @delete-list="deleteList"
    />

    <!-- Formulaire nouvelle tâche -->
    <TaskForm
      :canAdd="currentList !== null"
      :taskToEdit="taskBeingEdited"
      @add-task="addTask"
      @update-task="updateTask"
    />

    <!-- Sélecteur tri -->
    <TaskTri :sortCriteria="sortCriteria" @update:sortCriteria="val => sortCriteria = val" />

      

    <!-- Tâches à faire -->
    <div class="task-column">
      <div class="task-list task-todo">
        <h1 class="title-todo">TO DO</h1>
        <TaskCard
          v-for="task in sortTasks(lists[currentList]?.tasks.filter(t => !t.completed))"
          :key="task.title + task.date"
          :task="task"
          @toggle-task="toggleTask"
          @delete-task="deleteTask"
          @edit-task="startEditTask"
        />
      </div>

      <!-- Tâches terminées -->
      <div class="task-list task-done">
        <h1 class="title-todo">DONE</h1>
        <TaskCard
          v-for="task in lists[currentList]?.tasks.filter(t => t.completed)"
          :key="task.title + task.date"
          :task="task"
          @toggle-task="toggleTask"
          @delete-task="deleteTask"
          
        />
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, computed,onMounted } from 'vue'
import TaskListSelector from './components/TaskListSelector.vue'
import TaskForm from './components/TaskForm.vue'
import TaskCard from './components/TaskCard.vue'
import TaskTri from './components/TaskTri.vue'
import axios from 'axios'


/**
 * Liste des listes de tâches, chaque liste contient un nom et un tableau de tâches.
 * Initialisé avec deux listes par défaut : Travail et Personnel.
 */
const lists = ref([])
 


const fetchLists = async () => {
  try {
    const response = await axios.get('http://localhost:3000/lists')
    console.log('Listes reçues:', response.data)
    lists.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement des listes:', error)
  }
}

onMounted(fetchLists)

/** 
 * Valeur liée à l’input pour ajouter une nouvelle liste de tâches.
 */
const new_list = ref('')

/**
 * Index de la liste de tâches sélectionnée actuellement.
 * Initialisé sur la première liste si elle existe, sinon null.
 */
const currentList = ref(lists.value.length > 0 ? 0 : null)

/**
 * Critère de tri sélectionné pour afficher les tâches.
 * Peut être "priority" (priorité) ou "date" (date d’échéance).
 */
const sortCriteria = ref('priority')

/**
 * Ordre numérique utilisé pour trier les tâches selon leur priorité.
 * Plus la valeur est élevée, plus la priorité est haute.
 */
const priorityOrder = {
  haute: 3,
  moyenne: 2,
  basse: 1,
}

/**
 * Ajoute une nouvelle liste de tâches avec le nom contenu dans new_list.
 * Ignore si le nom est vide.
 * Met à jour currentList pour sélectionner cette nouvelle liste.
 * Vide le champ new_list après ajout.
 */
const add_list = async() => {
  const name = new_list.value.trim()
  if (name === '') return

  try{
    const response = await axios.post('http://localhost:3000/lists', { name })
    lists.value.push({ ...response.data, tasks: [] })
    currentList.value = lists.value.length - 1
    new_list.value = ''
  }
  catch(error){
    console.error('Erreur lors de l\'ajout de la liste:', error)
  }
}


/**
 * Supprime une liste de tâches selon son index.
 * Ajuste currentList pour rester sur un index valide après suppression.
 * Si toutes les listes sont supprimées, currentList devient null.
 */
const deleteList = async (index) => {
  const list = lists.value[index]
  
  if (!list) return
  try {
    await axios.delete(`http://localhost:3000/lists/${list.id}`)
    lists.value.splice(index, 1)
    if (currentList.value >= lists.value.length) {
      currentList.value = lists.value.length - 1
    }
    if (lists.value.length === 0) {
      currentList.value = null
    } else if (currentList.value < 0) {
      currentList.value = 0
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de la liste:', error)
  }
}

/**
 * Ajoute une nouvelle tâche à la liste actuellement sélectionnée.
 * Ignore si aucune liste n’est sélectionnée.
 */
const addTask = async(task) => {
  if (currentList.value === null) return
  const list = lists.value[currentList.value]
  try{
    const response = await axios.post(`http://localhost:3000/tasks`, {...task, list_id: list.id})
    lists.value[currentList.value].tasks.push(response.data)
  }catch (error) {
    console.error('Erreur lors de la suppression de la liste:', error)
  }
  
  
}

/**
 * Change le statut de la tâche (complétée ou non).
 * La tâche est modifiée directement (réactive).
 */
const toggleTask = async (task) => {
  try {
    // Inverse le statut localement
    task.completed = !task.completed

    // Envoie la mise à jour au backend
    await axios.patch(`http://localhost:3000/tasks/${task.id}`, {
      completed: task.completed
    })
  } catch (error) {
    console.error('Erreur lors du changement d\'état', error)
  }
}


/**
 * Supprime une tâche de la liste actuellement sélectionnée.
 * Ignore si aucune liste n’est sélectionnée.
 */
const deleteTask = async(task) => {
  if (currentList.value === null) return
  try {
    // Envoie la mise à jour au backend
    await axios.delete(`http://localhost:3000/tasks/${task.id}`)
    const tasks = lists.value[currentList.value].tasks
    const index = tasks.indexOf(task)

    if (index > -1) tasks.splice(index, 1)
  } catch (error) {
    console.error('erruer lors de suppression de la tache', error)
  }
}


const taskBeingEdited = ref(null)

const startEditTask = (task) => {
  taskBeingEdited.value = { ...task } // On clone pour ne pas modifier directement
}


const updateTask =async(updatedTask) =>{
  try {
    await axios.patch(`http://localhost:3000/tasks/${updatedTask.id}`, {
      ...updatedTask
    })

    const tasks = lists.value[currentList.value].tasks
    const index = tasks.findIndex(t => t.id === updatedTask.id)
    if (index !== -1) {
      tasks[index] = updatedTask
    }

    taskBeingEdited.value = null
  } catch (err) {
    console.error('Erreur lors de la mise à jour', err)
  }
}
/**
 * Trie un tableau de tâches selon le critère sélectionné.
 * Par défaut trie par priorité (ordre décroissant).
 * Sinon trie par date (ordre chronologique).
 */
const sortTasks = (tasks) => {
  if (!tasks) return []
  if (sortCriteria.value === 'priority') {
    return [...tasks].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
  }
  if (sortCriteria.value === 'date') {
    return [...tasks].sort((a, b) => new Date(a.date) - new Date(b.date))
  }
  return tasks
}

</script>




