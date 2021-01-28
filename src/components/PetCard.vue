<template>
  <transition name="fade" appear>
    <b-card no-body :title="nickname" class="pet-card">
      <b-card-img :src="imageUrl" :alt="`image of ${nickname}`" top />
      <b-card-body @click="navigateToDetail">
        <h3>{{ nickname }}</h3>
        <div class="pet-info-row">
          <species-badge :species="species" />
          <b-img
            v-if="guardian !== null"
            thumbnail
            rounded="circle"
            :src="avatarURL(guardian.id)"
          />
        </div>
      </b-card-body>
    </b-card>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { User } from '@/types';
import { getAvatarUrlFromID } from '@/utils';
import SpeciesBadge from '@/components/SpeciesBadge.vue';

export default Vue.extend({
  name: 'pet-card',
  components: {
    SpeciesBadge
  },
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
    },
    avatarURL(id: string) {
      return getAvatarUrlFromID(id);
    }
  }
});
</script>

<style scoped>
.pet-card {
  box-shadow: 1px 3px 8px -3px gray;
  width: 300px;
  transition: transform 0.4s ease;

  &:hover {
    transform: translate(0, -8px);
  }

  & .card-body:hover {
    cursor: pointer;
  }

  & .card-body > h3 {
    text-transform: capitalize;
    text-align: center;
  }
}

.pet-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;

  & > img {
    height: 40px;
    width: 40px;
    margin-left: 12px;
  }
}
</style>
