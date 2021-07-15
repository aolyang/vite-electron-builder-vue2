<template>
  <div>
    <img alt="Vue logo" src="./assets/logo.png" />
    <h1>page-cases test title {{ msg }}</h1>
    <div id="cases"></div>
  </div>
</template>
<script>
import { ref }      from '@vue/composition-api'

export default {
  setup() {
    return {
      msg: ref('Composition-api Ref msg!')
    }
  }
}
</script>
<style>
</style>
