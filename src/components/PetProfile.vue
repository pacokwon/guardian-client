<template>
  <b-card no-body>
    <b-img rounded="circle" :src="imageUrl" />
    <b-card-body>
      <div class="nickname">
        {{ nickname }}
      </div>
      <species-badge :species="species" />
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue';
import SpeciesBadge from '@/components/SpeciesBadge.vue';

export default Vue.extend({
  name: 'pet-profile',
  components: {
    SpeciesBadge
  },
  props: {
    id: { type: String, required: true },
    nickname: { type: String, required: true },
    species: { type: String, required: true },
    imageUrl: { type: String, required: true }
  }
});
</script>

<style scoped>
img {
  object-fit: cover;
  width: 200px;
  height: 200px;
}

/* b-card */
div.card {
  align-items: center;
  background-color: var(--guardian-grey-50);
}

/* b-card-body */
div.card-body {
  display: flex;
  flex-direction: column;
  align-items: center;

  & .nickname {
    font-weight: bold;
    font-size: 1.4rem;
    text-transform: capitalize;
  }
}
</style>
