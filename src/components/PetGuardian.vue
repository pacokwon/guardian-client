<template>
  <b-card no-body>
    <b-modal id="unregister-modal" title="Unregister?" ref="unregister-modal">
      Are you sure you want to unregister from this pet?
      <template #modal-footer="{ cancel }">
        <div>
          <b-button
            class="modal-unregister"
            variant="outline-primary"
            @click="handleUnregister"
          >
            Unregister
          </b-button>
          <b-button
            class="modal-cancel"
            variant="outline-primary"
            @click="cancel()"
          >
            Cancel
          </b-button>
        </div>
      </template>
    </b-modal>
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
        <span class="nickname">
          <router-link class="link" :to="'/users/' + guardian.id">
            {{ nickname }}
          </router-link>
        </span>
        <b-button
          v-if="currentUserIsGuardian"
          class="unregister"
          variant="outline-primary"
          v-b-modal.unregister-modal
        >
          <b-icon-shield-x />
        </b-button>
      </div>
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import gql from 'graphql-tag';
import { BvEvent } from 'bootstrap-vue';
import { BModal } from 'bootstrap-vue/src/components/modal';
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
    },
    currentUserIsGuardian() {
      return this.$store.state.userID === this.guardian?.id;
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
    },
    async handleUnregister(bvModalEvent: BvEvent) {
      bvModalEvent.preventDefault();

      if (!this.userIsLoggedIn || !this.currentUserIsGuardian) return;

      const { userID } = this.$store.state;
      const { petID } = this;

      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation($petID: ID!, $userID: ID!) {
            unregisterUserFromPet(petID: $petID, userID: $userID) {
              success
            }
          }
        `,
        variables: { petID, userID }
      });

      (this.$refs['unregister-modal'] as BModal).hide();

      if (result?.data?.unregisterUserFromPet?.success) {
        this.$bvToast.toast('You have been successfully unregistered', {
          title: 'Guardian',
          autoHideDelay: 5000,
          variant: 'primary'
        });

        this.$emit('update:guardian');
      } else {
        this.$bvToast.toast(
          'An error has occurred during your unregistration',
          {
            title: 'Guardian',
            autoHideDelay: 5000,
            variant: 'danger'
          }
        );
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
  transition: transform 0.2s ease;

  & > * {
    margin-right: 20px;
  }

  & > img {
    height: 50px;
    width: 50px;
  }

  & > span.nickname {
    font-size: 1.2rem;
    font-weight: bold;
    text-transform: capitalize;
  }

  &:hover {
    background-color: #f9f9f9;
    transform: translate(0, -3px);
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

button.unregister {
  /* https://stackoverflow.com/questions/35269947/css-align-one-item-right-with-flexbox */
  margin-left: auto;

  background-color: transparent;
  border: none;
  color: var(--guardian-red-400);

  &:hover,
  &:active {
    background-color: var(--guardian-red-400) !important;
    color: white !important;
  }

  &:focus {
    box-shadow: none; /* remove bootstrap style */
  }
}

#unregister-modal {
  & button.modal-unregister {
    color: var(--guardian-red-400);
    border: none;

    &:hover,
    &:active {
      background-color: var(--guardian-red-400);
      color: white;
    }
  }

  & button.modal-cancel {
    border: none;
  }
}

a.link {
  color: inherit;
}
</style>
