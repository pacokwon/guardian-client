<template>
  <b-card no-body>
    <b-card-body>
      <h4 class="card-title">Current Guardian</h4>
      <div v-if="guardian === null">
        This pet is not registered to a guardian.
      </div>
      <div class="guardian-row" v-else>
        <b-img thumbnail rounded="circle" :src="guardianImageUrl" />
        <span>{{ nickname }}</span>
      </div>
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { User } from '@/types';
import { getAvatarUrlFromID } from '@/utils';

export default Vue.extend({
  name: 'pet-guardian',
  props: {
    guardian: {
      type: Object as PropType<User | null>,
      default: null
    }
  },
  computed: {
    id(): string {
      return this.guardian?.id || '';
    },
    nickname(): string {
      return this.guardian?.nickname || '';
    },
    guardianImageUrl(): string {
      return getAvatarUrlFromID(this.guardian?.id || 0);
    }
  }
});
</script>

<style scoped>
div.card {
  box-shadow: 1px 3px 8px -3px gray;
}

.guardian-row {
  align-items: center;
  display: flex;

  & > * {
    margin-right: 20px;
  }

  & > img {
    height: 50px;
    width: 50px;
  }

  & > span {
    font-size: 1.2rem;
    font-weight: bold;
    text-transform: capitalize;
  }
}

h4.card-title {
  margin-bottom: 16px;
}
</style>
