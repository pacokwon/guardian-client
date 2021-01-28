<template>
  <transition name="fade-move" appear>
    <b-card no-body :title="nickname" class="pet-card">
      <b-card-img :src="imageUrl" :alt="`image of ${nickname}`" top />
      <b-card-body @click="navigateToDetail">
        <div v-if="guardian !== null">
          This pet is a {{ species }}, and its name is {{ nickname }}, and its
          guardian is {{ guardian.nickname }}
        </div>
        <div v-else>
          This pet is a {{ species }}, and its name is {{ nickname }}, and it
          does not have a guardian
        </div>
      </b-card-body>
    </b-card>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { User } from '@/types';

export default Vue.extend({
  name: 'pet-card',
  props: {
    id: { type: String, required: true },
    nickname: { type: String, required: true },
    species: { type: String, required: true },
    imageUrl: { type: String, required: true },
    guardian: {
      type: Object as PropType<User | null>
    }
  },
  methods: {
    navigateToDetail() {
      this.$router.push(`/pets/${this.id}`);
    }
  }
});
</script>

<style scoped>
.pet-card {
  max-width: 300px;

  & .card-body:hover {
    cursor: pointer;
  }
}
</style>
