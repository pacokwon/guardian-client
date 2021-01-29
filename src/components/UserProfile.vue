<template>
  <b-card no-body>
    <div v-if="editing" class="control-group">
      <b-button
        class="complete"
        variant="outline-primary"
        pill
        @click="editing = !editing"
      >
        Save Changes
      </b-button>
      <b-button
        class="cancel"
        variant="outline-primary"
        pill
        @click="editing = !editing"
      >
        Cancel
      </b-button>
    </div>
    <b-button
      v-else
      class="edit"
      variant="outline-primary"
      @click="editing = !editing"
    >
      <b-icon-pencil-square />
    </b-button>
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
  data() {
    return {
      editing: false
    };
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
  position: relative;
}

div.card-body {
  padding-top: 0px;
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

button.edit {
  align-self: flex-end;
  background-color: transparent;
  border: none;
  color: var(--guardian-primary);

  margin-top: 10px;
  margin-right: 10px;
}

div.control-group {
  display: flex;
  align-self: flex-end;
  margin-top: 15px;
  align-items: center;

  & > * {
    margin-right: 10px;
  }

  & > button.complete {
    background-color: var(--guardian-primary);
    border: none;
    color: white;
    font-size: 0.8rem;
  }

  & > button.cancel {
    background-color: transparent;
    border: 1px solid var(--guardian-primary);
    color: var(--guardian-primary);
    font-size: 0.8rem;
  }
}
</style>
