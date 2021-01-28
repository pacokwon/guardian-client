<template>
  <b-card no-body>
    <b-card-body>
      <b-img rounded="circle" :src="avatarURL(id)" />
      <h2 class="nickname">
        {{ nickname }}
      </h2>
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { getAvatarUrlFromID } from '@/utils';

export default Vue.extend({
  name: 'user-profile',
  props: {
    id: { type: String, required: true },
    nickname: { type: String, required: true }
  },
  methods: {
    avatarURL(id: string) {
      return getAvatarUrlFromID(id);
    }
  }
});
</script>

<style scoped>
img {
  min-width: 144px;
  min-height: 144px;
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
