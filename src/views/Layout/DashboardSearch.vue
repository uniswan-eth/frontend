<template>
  <b-container v-if="root.showSearch === true && searchQuery.length > 0">
    <div class="searchPopUp">
      <card header-classes="bg-transparent">
        <h6 class="navbar-heading text-muted text-uppercase">Collections</h6>
        <div v-if="contracts">
          <contract-card
            v-for="(n, idx) in contracts"
            :key="'contract' + idx"
            :contract="n"
            :root="root"
          />
        </div>
      </card>
    </div>
  </b-container>
</template>
<script>
import ContractCard from "@/components/UniSwan/ContractCard";

export default {
  components: {
    ContractCard,
  },
  props: ["root", "searchQuery"],
  data() {
    return {
      contracts: [],
    };
  },
  async mounted() {},
  methods: {
    async search(searchWord) {
      if (searchWord.length < 3) {
        return;
      } else if (searchWord.length === 42) {
        // This is a users account
        this.$router.push("/account/" + searchWord);
      } else {
        this.contracts = await this.root.getContractsFromSubGraph(searchWord);
      }
    },
  },
  watch: {
    searchQuery: function (newVal, oldVal) {
      if (newVal && newVal.length === 0) {
        this.contracts = [];
      }
      this.root.showSearch = true;
      this.search(newVal);
    },
  },
};
</script>
<style lang="scss">
.searchPopUp {
  position: absolute;
  margin-top: 8px;
  width: 317px;
  margin-left: -15px;
}
</style>
