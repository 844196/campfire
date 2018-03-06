<template lang="pug">
#login.md-layout.md-alignment-center-center
  md-card.md-layout-item.md-size-33.md-small-size-66
    form(@submit.prevent="onSubmit")
      md-card-content
        md-field
          label Email
          md-input(v-model="email", autocomplete="username email", :disabled="connecting")
        md-field
          label Password
          md-input(v-model="password", type="password", autocomplete="current-password", :disabled="connecting")
      md-card-actions
        md-button.md-raised.md-primary(type="submit", :disabled="!canSubmit") LOGIN
</template>

<script>
import Vue from 'vue'

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
    canSubmit () {
      return this.email !== '' && this.password !== '' && this.connecting === false
    }
  },
  methods: {
    onSubmit () {
      this.connecting = true
      this.$store.dispatch('auth/login', { email: this.email, password: this.password })
        .then(() => {
          this.$router.push(this.$route.query.redirect || '/')
        })
        .catch(e => {
          this.$store.dispatch('snackbar/show', {
            message: e.message,
            duration: 4000
          })
          this.connecting = false
          console.error(e)
        })
    }
  }
})
</script>

<style lang="stylus">
body
  height: 100%
</style>

<style lang="stylus" scoped>
#login
  height: 100%
</style>
