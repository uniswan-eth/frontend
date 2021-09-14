<template>
  <div class="contract">
    <h4 >
      <router-link :to="'/explorer?contract='+contract.id">
        {{contract.name}}
      </router-link>
    </h4>
  </div>
</template>
<script>
  export default {
    name: 'contract-card',
    props: ["contract", "root"],
    components: {
    },
    data() {
      return {
      }
    }
  }
</script>
<style>
</style>
