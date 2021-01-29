<template>
  <transition name="fade-move" appear>
    <section>
      <h1>Sign Up</h1>
      <div class="register-container">
        <div class="form-container">
          <div class="form">
            <b-row class="my-2">
              <b-col sm="2" md="3" class="label-container">
                <label for="pet-nickname">Nickname</label>
              </b-col>
              <b-col sm="10" md="9">
                <b-input
                  id="pet-nickname"
                  v-model="nickname"
                  type="text"
                  placeholder="Nickname"
                  :state="isValidNickname && null"
                  @blur="validateNickname"
                />
              </b-col>
            </b-row>
            <b-button class="submit-button" @click="handleRegister">
              Register!
            </b-button>
          </div>
        </div>
        <div class="preview">
          <div v-if="loadState === LoadState.NOT_SENT" class="placeholder">
            Your avatar will be shown here!
          </div>
          <b-spinner
            v-else-if="loadState === LoadState.LOADING"
            variant="primary"
            type="grow"
          />
          <transition v-else>
            <div class="img-container">
              <b-img
                class="user-avatar"
                thumbnail
                rounded="circle"
                :src="avatarURL(id)"
              />
              <span>
                User Registration Complete!<br />This is your avatar,
                {{ createdNickname }}
              </span>
            </div>
          </transition>
        </div>
      </div>
    </section>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import gql from 'graphql-tag';
import { getAvatarUrlFromID } from '@/utils';

enum LoadState {
  NOT_SENT = 'NOT_SENT',
  LOADING = 'LOADING',
  FINISHED = 'FINISHED'
}

export default Vue.extend({
  name: 'user-register',
  data() {
    return {
      id: null as null | string,
      nickname: '',
      createdNickname: '',
      isValidNickname: null as null | boolean,
      loadState: LoadState.NOT_SENT,
      LoadState
    };
  },
  methods: {
    validateNickname() {
      // NOTE: this function mutates data
      const isValid = this.nickname !== '';
      return isValid;
    },
    async handleRegister() {
      if (!this.validateNickname()) return;

      const { nickname } = this;
      this.loadState = LoadState.LOADING;
      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation($nickname: String!) {
            createUser(input: { nickname: $nickname }) {
              id
            }
          }
        `,
        variables: { nickname }
      });

      if (result?.data?.createUser?.id) {
        await new Promise(res => setTimeout(res, 1000));

        this.loadState = LoadState.FINISHED;
        this.id = result.data.createUser.id;
        this.createdNickname = result.data.createUser.nickname;

        this.$bvToast.toast('Your pet has been successfully created', {
          title: 'Guardian',
          autoHideDelay: 5000,
          variant: 'primary'
        });

        this.clearForm();
      } else {
        this.$bvToast.toast('An error has occurred while creating your pet', {
          title: 'Guardian',
          autoHideDelay: 5000,
          variant: 'danger'
        });
      }
    },
    clearForm() {
      this.nickname = '';
    },
    avatarURL(id: string) {
      return getAvatarUrlFromID(id);
    }
  }
});
</script>

<style scoped>
h1 {
  padding: 0 20px 20px 20px;
}

div.register-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: 'register-form preview';
  align-items: center;
  max-width: 900px;
  padding: 0 20px 20px 20px;
  margin: 0 auto;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'preview'
      'register-form';

    & > div.preview {
      margin-bottom: 32px;
    }
  }
}

div.form-container {
  grid-area: register-form;

  display: flex;
  justify-content: center;
  align-items: center;
}

div.form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 480px;
}

div.preview {
  grid-area: preview;

  display: flex;
  justify-content: center;
  align-items: center;

  & > img {
    max-width: 300px;
  }
}

div.label-container {
  display: flex;
  align-items: center;
  justify-content: center;

  & > label {
    margin: 0;
    text-align: center;
  }
}

button.submit-button {
  align-self: center;
  margin-top: 12px;
  background-color: var(--guardian-primary);

  max-width: 500px;
  width: 100%;
}

div.placeholder {
  height: 200px;
  width: 200px;
  background-color: var(--guardian-grey-200);
  color: var(--guardian-grey-700);

  text-align: center;
  font-size: 1.3rem;
  border-radius: 50%;
  padding: 10px;

  display: flex;
  justify-content: center;
  align-items: center;
}

img.user-avatar {
  height: 200px;
  width: 200px;
}

div.img-container {
  display: flex;
  flex-direction: column;

  & span {
    color: var(--guardian-primary);
    font-weight: bold;
    text-align: center;
  }
}
</style>
