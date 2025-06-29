<template>
  <div class="sort-container">
    <label>Trier par : </label>
    <select :value="sortCriteria" @change="$emit('update:sortCriteria', $event.target.value)" class="form-input">
      <option value="priority">Priorité</option>
      <option value="date">Date d’échéance</option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  sortCriteria: String
})
</script>