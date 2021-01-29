<template>
  <b-card no-body>
    <b-card-body>
      <b-img rounded="circle" :src="imageUrl" @error="setAltImage" />
      <h2 class="nickname">
        {{ nickname }}
      </h2>
      <species-badge :species="species" />
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue';
import SpeciesBadge from '@/components/SpeciesBadge.vue';
import { getAltImage } from '@/utils';

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
  },
  methods: {
    setAltImage(event: ErrorEvent) {
      (event.target as HTMLImageElement).src = getAltImage(this.id);
    }
  }
});
</script>

<style scoped>
img {
  object-fit: cover;
  width: 200px;
  height: 200px;
  margin-bottom: 20px;
}

/* b-card */
div.card {
  align-items: center;
  box-shadow: 1px 3px 8px -3px gray;
}

/* b-card-body */
div.card-body {
  display: flex;
  flex-direction: column;
  align-items: center;

  & .nickname {
    text-transform: capitalize;
  }
}
</style>
