

<template>
  <div class="app-container">
    <h1 class="title">TO-DO LIST</h1>

    <div class="add-list">
        <input v-model="new_list"  class="form-input" placeholder="Ajouter une liste de tâches">

        <button @click="add_list()"  class="add-button-list">Ajouter</button>

    </div>

    <div class="list-buttons">
      <div
        v-for="(list, index) in lists"
        :key="index"
        class="list-wrapper"
      >

        <span class="delete-list-button" @click="(deleteList(index))"
        >
          x
        </span>

        <button

        @click="currentList = index"
        :class="['list-button', currentList === index ? 'active' : '']"
        >
        {{ list.name }}
        </button>

      </div>
    </div>

    <div class="form-card">
      <input v-model="newTask.title" placeholder="Titre de la tâche" class="form-input" />
      <input v-model="newTask.date" type="date" class="form-input" />
      <select v-model="newTask.priority" class="form-input">
        <option value="basse">Basse</option>
        <option value="moyenne">Moyenne</option>
        <option value="haute">Haute</option>
      </select>
      <textarea
        v-model="newTask.tags"
        placeholder="Étiquettes (séparées par des virgules)"
        class="form-input"
      ></textarea>
      <button v-if="lists[currentList]" @click="handleAddTask" class="add-button">Ajouter la tâche</button>
    </div>



    <div class="sort-container">
      <label >Trier par : </label>
      <select id="sort" v-model="sortCriteria" class="form-input">
        <option value="priority">Priorité</option>
        <option value="date">Date d’échéance</option>
      </select>
    </div>

    

    <div class="task-column">


        <div class="task-list task-todo"><h1 class="title-todo">TO DO</h1>
          <div
          v-if="currentList !== null && lists[currentList]" 
          v-for="(task, index) in SortBy(lists[currentList].tasks.filter(t => !t.completed))"
          :key="index"
          class="task-card"
          >
            <div>
              <h2 :class="['task-title', task.completed ? 'completed' : '']">{{ task.title }}</h2>
              <p class="task-info">Échéance : {{ task.date }}</p>
              <p class="task-info">Priorité : <span :class="getPriority(task.priority)">{{ task.priority }}</span></p>
              <div v-if="task.tags && task.tags.length > 0"  class="tag-container">
                {{ console.log(task.tags.length) }}
                <span
                  v-for="(tag, i) in task.tags"
                  :key="i"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            <div class="task-actions">
              <button @click="toggleTask(task)" class="action-button">
                {{ task.completed ? 'Annuler' : 'Valider' }}
              </button>
              <button @click="deleteTask(index)" class="delete-button">Supprimer</button>
            </div>
          </div>
        </div>


      <div class="task-list task-done"><h1 class="title-todo">DONE</h1> 
        
        <div
          v-if="currentList !== null && lists[currentList]" 
          v-for="(task, index) in lists[currentList].tasks.filter(t => t.completed)"
          :key="index"
          class="task-card-done"
          >
            <div>
              <h2 :class="['task-title', task.completed ? 'completed' : '']">{{ task.title }}</h2>
              <p class="task-info">Échéance : {{ task.date }}</p>
              <p class="task-info">Priorité : <span :class="capitalize">{{ task.priority }}</span></p>
              <div v-if="task.tags && task.tags.length > 0"  class="tag-container">
                
                <span
                  v-for="(tag, i) in task.tags"
                  :key="i"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            <div class="task-actions">
              <button @click="toggleTask(task)" class="action-button">
                {{ task.completed ? 'Annuler' : 'Valider' }}
              </button>
              <button @click="deleteTask(index)" class="delete-button">Supprimer</button>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Les listes (Travail, Personnel...)
const lists = ref([
  { name: 'Travail', tasks: [] },
  { name: 'Personnel', tasks: [] },


])


//retourne une classe selon la priorité
const getPriority = (priority) =>{

  switch(priority){
    case "haute" : return 'priority-high'
    case "moyenne" : return 'priority-medium'
    case "basse" : return 'priority-low'
  }
}

//ajouter une liste de tache
const new_list = ref('')


const  add_list = () => {
    const list = new_list.value.trim()
    if (list != '') {
        lists.value.push({
            name : list,
            tasks:[]
        })
    }
    currentList.value = lists.value.length - 1
    new_list.value =''
}

// supprimer une liste de tâches
const deleteList = (index) =>{
  lists.value.splice(index,1)
  if (currentList.value >= lists.value.length) {
    currentList.value = lists.value.length - 1; // aller à la dernière liste dispo
  }
  
  currentList.value = lists.value.length >= 0 ? 0 : null; // évite les valeurs négatives
  
}


// Index de la liste sélectionnée
const currentList = ref(lists.value.length >= 0 ? 0 : null)

// Formulaire de nouvelle tâche
const newTask = ref({
  title: '',
  date: '',
  priority: 'moyenne',
  tags: ''
})

// Ajouter une tâche
const handleAddTask = () => {

  console.log(newTask.value.tags)

  // Vérification des champs obligatoires
  if (
    !newTask.value.title.trim() ||
    !newTask.value.date ||
    !newTask.value.priority.trim()
  ) {
    alert('Veuillez remplir tous les champs obligatoires (titre, date, priorité).')
    return // On arrête l'ajout de la tâche
  }

  const task = {
    title: newTask.value.title,
    date: newTask.value.date,
    priority: newTask.value.priority,
    completed: false,
    tags: newTask.value.tags.split(',').map(t => t.trim()).filter(f => f !== "")
  }


  lists.value[currentList.value].tasks.push(task)
  newTask.value = { title: '', date: '', priority: 'moyenne', tags: '' }
}

//Triage
// par defaut on sort par priorité
const sortCriteria = ref('priority')

//création d'un objet assigant a chaque priorité une valeur pour pouvoir trier plus facilement 
const priorityOrder={
  haute:3,
  moyenne:2,
  basse:1
}


//fonction triage priorité
const SortByPriority = (tasks) =>{
  if (!tasks) return []
  
  return tasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
}


//fonction triage par date d'echeance
const SortByDate = (tasks) => {

  if (!tasks) return []
  return tasks.sort((a, b) => new Date(a.date) - new Date(b.date))
}

//fonction permettant de choisir la methode de tri
const SortBy = (tasks) =>{
  if (sortCriteria.value === 'priority') {return SortByPriority(tasks)}
  if (sortCriteria.value === 'date') {return SortByDate(tasks)}
}


//affiche une tâche comme étant validée
const toggleTask = (task) =>{
  task.completed = !task.completed
}

// Supprimer une tâche
function deleteTask(index) {
  lists.value[currentList.value].tasks.splice(index, 1)
}
</script>