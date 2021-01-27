<template>
  <b-badge pill :variant="variant">{{ species }}</b-badge>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'species-badge',
  props: {
    species: { type: String, required: true }
  },
  computed: {
    variant() {
      return this.species.toLowerCase() === 'dog' ? 'primary' : 'secondary';
    }
  }
});
</script>

<style scoped>
span.badge {
  text-transform: capitalize;
}
</style>
