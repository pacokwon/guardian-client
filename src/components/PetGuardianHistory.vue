<template>
  <b-card no-body>
    <b-card-body>
      <h4 class="card-title">
        Guardian History of
        <span style="text-transform: capitalize;">{{ petNickname }}</span>
      </h4>
      <section>
        <div class="history-row-header">
          <b-button-group>
            <b-button class="pagination-button">
              <b-icon-chevron-left />
            </b-button>
            <b-button class="pagination-button">
              <b-icon-chevron-right />
            </b-button>
          </b-button-group>
          <div>Guardian</div>
          <div>Duration</div>
        </div>
        <div
          class="history-row"
          v-for="{ id, user, registeredAt, releasedAt, released } in history"
          :key="id"
        >
          <div class="avatar">
            <b-img thumbnail rounded="circle" :src="avatarURL(user.id)" />
          </div>
          <div class="nickname">
            {{ user.nickname }}
          </div>
          <div class="duration" v-if="released">
            {{ registeredAt.toISOString().slice(0, 10) }} ~
            {{ releasedAt.toISOString().slice(0, 10) }}
          </div>
          <div class="duration" v-else>
            {{ registeredAt.toISOString().slice(0, 10) }} ~
            <strong>Current</strong>
          </div>
        </div>
      </section>
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { getAvatarUrlFromID } from '@/utils';
import { UserPetHistory } from '@/types';

export default Vue.extend({
  name: 'pet-guardian-history',
  props: {
    petNickname: {
      type: String,
      required: true
    },
    history: {
      type: Array as PropType<UserPetHistory[]>,
      required: true,
      default: []
    }
  },
  methods: {
    avatarURL(id: string) {
      return getAvatarUrlFromID(id);
    }
  }
});
</script>

<style scoped>
h4.card-title {
  margin-bottom: 32px;
}

div.history-row,
div.history-row-header {
  font-size: 1.1rem;
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
  max-width: 600px;
  margin-bottom: 16px;
  align-items: center;
  justify-items: center;

  & .avatar {
    & > img {
      height: 50px;
      width: 50px;
    }
  }

  & .nickname {
    text-transform: capitalize;
  }
}

div.history-row-header {
  font-weight: bold;
}

div.history-row {
  &:hover {
    background-color: #f7f7f7;
  }
}

button.pagination-button {
  /* override bootstrap styles for reduced button size */
  --point-color: #8a90eb;
  --active-color: #767de8;

  padding: 0.2rem 0.5rem;
  font-size: 0.6rem;
  color: var(--point-color);
  border-color: var(--point-color);
  background-color: white;

  &:hover:enabled {
    background-color: var(--point-color);
    color: white;
  }

  &:active:enabled {
    background-color: var(--active-color) !important;
    border-color: var(--active-color) !important;
    color: white;
  }

  &[disabled],
  &:disabled {
    cursor: not-allowed;
  }
}
</style>
