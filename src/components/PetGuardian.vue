<template>
  <b-card no-body>
    <b-card-body>
      <h4 class="card-title">Current Guardian</h4>
      <div class="no-guardian-row" v-if="guardian === null">
        <div>This pet is not registered to a guardian.</div>
        <b-button
          v-if="userIsLoggedIn"
          class="register"
          variant="outline-primary"
          @click="registerUserToPet"
        >
          <span class="register-icon">
            <b-icon-shield-plus />
          </span>
          Register now!
        </b-button>
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
import gql from 'graphql-tag';
import { User } from '@/types';
import { getAvatarUrlFromID } from '@/utils';

export default Vue.extend({
  name: 'pet-guardian',
  props: {
    petID: { type: String, required: true },
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
    },
    userIsLoggedIn(): boolean {
      return this.$store.state.userID !== null;
    }
  },
  methods: {
    async registerUserToPet() {
      if (!this.userIsLoggedIn) return;

      const { userID } = this.$store.state;
      const { petID } = this;

      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation($petID: ID!, $userID: ID!) {
            registerUserToPet(petID: $petID, userID: $userID) {
              success
            }
          }
        `,
        variables: { petID, userID }
      });

      if (result?.data?.registerUserToPet?.success) {
        this.$bvToast.toast('You have been successfully registered', {
          title: 'Guardian',
          autoHideDelay: 5000,
          variant: 'primary'
        });

        this.$emit('update:guardian');
      } else {
        this.$bvToast.toast('An error has occurred during your registration', {
          title: 'Guardian',
          autoHideDelay: 5000,
          variant: 'danger'
        });
      }
    }
  }
});
</script>

<style scoped>
div.card {
  box-shadow: 1px 3px 8px -3px gray;
}

h4.card-title {
  margin-bottom: 16px;
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

.no-guardian-row {
  display: flex;
  flex-direction: column;
}

span.register-icon {
  padding-right: 10px;
}

button.register {
  align-self: center;
  background-color: transparent;
  border-color: var(--guardian-primary);
  color: var(--guardian-primary);
  max-width: 300px;
  width: 100%;
  margin-top: 16px;

  &:active,
  &:hover {
    background-color: var(--guardian-primary) !important;
    color: white !important;
  }

  &:focus {
    box-shadow: none; /* remove bootstrap style */
  }
}
</style>
