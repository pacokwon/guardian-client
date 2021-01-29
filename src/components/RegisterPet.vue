<template>
  <section class="register-container">
    <div class="form-container">
      <div class="form">
        <b-input
          v-model="nickname"
          type="text"
          placeholder="Nickname"
          :state="validState.nickname && null"
          @blur="validateNickname"
        />
        <b-input
          v-model="imageUrl"
          type="text"
          placeholder="Image URL (Public)"
          :state="validState.imageUrl && null"
          @focus="$event.target.select()"
          @blur="validateURL"
        />
        <b-select
          v-model="species"
          :options="speciesOptions"
          :state="validState.species && null"
          @change="validateSpecies"
        />
        <b-button @click="handleRegister">Register!</b-button>
      </div>
    </div>
    <div class="preview">
      <b-img
        thumbnail
        :src="imageUrl"
        alt="Your pet's image here!"
        @error="setDefaultImage"
      />
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import gql from 'graphql-tag';
import { getAltImage, getRandomString } from '@/utils';

export default Vue.extend({
  name: 'register-pet',
  data() {
    return {
      nickname: '',
      imageUrl: getAltImage(getRandomString()),
      species: null as null | string,
      speciesOptions: [
        { value: null, text: 'Please select an option' },
        { value: 'dog', text: 'Dog' },
        { value: 'cat', text: 'Cat' }
      ],
      validState: {
        nickname: null,
        imageUrl: null,
        species: null
      } as { [key: string]: boolean | null }
    };
  },
  methods: {
    validateForm(): boolean {
      // NOTE: this function mutates data

      // returns true if fields are valid. false otherwise.
      this.validateNickname();
      this.validateURL();
      this.validateSpecies();

      // every errors field must be true
      return Object.values(this.validState).every(isValid => isValid);
    },
    validateNickname() {
      // NOTE: this function mutates data
      this.validState.nickname = this.nickname !== '';
    },
    validateURL() {
      // NOTE: this function mutates data

      // https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url#answer-43467144
      try {
        const url = new URL(this.imageUrl);
        this.validState.imageUrl =
          url.protocol === 'http:' || url.protocol === 'https:';
      } catch {
        this.validState.imageUrl = false;
      }
    },
    validateSpecies() {
      // NOTE: this function mutates data
      this.validState.species =
        this.species === 'dog' || this.species === 'cat';
    },
    async handleRegister() {
      if (!this.validateForm()) return;

      const { nickname, species, imageUrl } = this;
      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation($nickname: String!, $species: String!, $imageUrl: String!) {
            createPet(
              input: {
                nickname: $nickname
                species: $species
                imageUrl: $imageUrl
              }
            ) {
              id
            }
          }
        `,
        variables: { nickname, species, imageUrl }
      });

      if (result?.data?.createPet?.id) {
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
      this.imageUrl = getAltImage(getRandomString());
      this.species = null;
    },
    setDefaultImage(event: ErrorEvent) {
      (event.target as HTMLImageElement).src =
        'https://fakeimg.pl/400x300/282828/eae0d0/?retina=1&text=Your+Pet+Here';
    }
  }
});
</script>

<style scoped>
section.register-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}

div.form-container {
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
  display: flex;
  justify-content: center;
  align-items: center;

  & > img {
    max-width: 300px;
  }
}
</style>
