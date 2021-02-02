<template>
  <b-card no-body>
    <b-card-body>
      <h4 class="card-title">Current Pets</h4>
      <div v-if="currentPets.length === 0">
        This user is currently not registered to any pets.
      </div>
      <div v-else>
        <div
          class="current-pet-row"
          v-for="{
            id,
            nickname,
            imageUrl,
            species,
            registeredAt
          } in currentPets"
          :key="id"
        >
          <b-img
            thumbnail
            rounded="circle"
            class="pet-image"
            :src="imageUrl"
            @error="setAltImage(id)"
          />
          <div class="info">
            <div>
              <router-link class="link" :to="'/pets/' + id">
                {{ nickname }}
              </router-link>
            </div>
            <species-badge :species="species" />
          </div>
          <div class="register-date">Since {{ registeredAt }}</div>
        </div>
      </div>
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Pet } from '@/types';
import SpeciesBadge from '@/components/SpeciesBadge.vue';
import { getAltImage } from '@/utils';

type PetWithRegisteredAt = Pet & { registeredAt: string };

export default Vue.extend({
  name: 'user-current-pets',
  components: {
    SpeciesBadge
  },
  props: {
    currentPets: {
      type: Array as PropType<PetWithRegisteredAt[]>,
      default: []
    }
  },
  methods: {
    setAltImage(id: string) {
      return (event: ErrorEvent) => {
        (event.target as HTMLImageElement).src = getAltImage(id);
      };
    }
  }
});
</script>

<style scoped>
div.card {
  box-shadow: 1px 3px 8px -3px gray;
}

div.current-pet-row {
  display: grid;
  grid-template-columns: 1fr 3fr 2fr;
  align-items: center;
  column-gap: 5px;
  transition: transform 0.2s ease;

  & > .info {
    text-transform: capitalize;
    font-size: 1.1rem;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  & > .pet-image {
    object-fit: cover;
    height: 50px;
    width: 50px;
  }

  & > .register-date {
    font-size: 0.9rem;
    text-align: center;
  }

  &:hover {
    background-color: #f9f9f9;
    transform: translate(0, -3px);
  }
}

a.link {
  color: inherit;
}
</style>
