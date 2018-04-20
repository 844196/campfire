<template lang="pug">
#login
  form(@submit.prevent="onSubmit")
    input(v-model="email", autocomplete="username email", :disabled="connecting")
    input(v-model="password", type="password", autocomplete="current-password", :disabled="connecting")
    button(type="submit", :disabled="!canSubmit") Login
</template>

<script lang="ts">
import Vue from 'vue'
import { authHelpers } from '@/store/auth'

export default Vue.extend({
  name: 'Login',
  data () {
    return {
      email: '',
      password: '',
      connecting: false
    }
  },
  computed: {
    canSubmit (): boolean {
      return this.email !== '' && this.password !== '' && this.connecting === false
    }
  },
  methods: {
    ...authHelpers.mapActions({
      '_login': 'login'
    }),
    async onSubmit () {
      this.connecting = true
      try {
        await this._login({ email: this.email, password: this.password })
        this.$router.push(this.$route.query.redirect || '/')
      } catch (e) {
        console.error(e)
        this.connecting = false
      }
    }
  }
})
</script>
