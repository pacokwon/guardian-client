<template>
  <b-card
    :title="nickname"
    :img-src="imageUrl"
    :img-alt="species"
    img-top
    style="max-width: 300px;"
  >
    This pet is a {{ species }}, and its name is {{ nickname }}
  </b-card>
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
    guardian: Object as PropType<User | null>
  }
});
</script>

<style></style>
