<template>
  <b-container v-if="root.showSearch === true && searchQuery.length > 0">
  <!-- <b-container v-if="$parent.searchQuery.length > 0"> -->
    <div class="searchPopUp">
      <card header-classes="bg-transparent">
        <!-- <h1>ss{{searchQuery}}</h1> -->
        <h6 class="navbar-heading text-muted text-uppercase">
          Collections
        </h6>
        <div v-if="contracts && contracts.data.tokenContracts">
          <!-- <h2 slot="header" class="mb-0">Search</h2> -->
          <contract-card
            v-for="(n,idx) in contracts.data.tokenContracts"
            :key="'contract'+idx"
            :contract="n"
            :root="root"
          />
        </div>
        <!-- <el-table
          class="table-responsive table"
          :data="contracts"
          header-row-class-name="thead-light"
        >
          <el-table-column label="Wisher" min-width="130px" prop="page">
            <template v-slot="{ row }">
            </template>
          </el-table-column>
        </el-table> -->
      </card>
    </div>
  </b-container>
</template>
<script>
import ContractCard from "@/components/UniSwan/ContractCard";

export default {
  components: {
    ContractCard
  },
  props: ["root", "searchQuery"],
  data() {
    return {
      contracts: null,
    };
  },
  async mounted() {
    this.search('');
  },
  methods: {
    async search(searchWord) {
      if (searchWord.length < 3) {return}

      if (searchWord.length === 42) {
          this.$parent.closeSearch()
          //Redirect to Account Page
          this.$router.push("/account/"+searchWord)
      } else {
        this.contracts = await this.root.getContractsFromSubGraph(searchWord);
        console.log('Searching', this.contracts, this.root);
      }
    }
  },
  watch: {
    searchQuery: function (newVal, oldVal) {
      if (newVal && newVal.length === 0) {this.contracts = []}
      // if (this.$parent.searchQuery.length === 0) {this.contracts = []}
      this.root.showSearch = true
      this.search(newVal);
      // this.search(this.$parent.searchQuery);
      console.log('GHGHGHGHG', newVal, oldVal);
    },
  },

};
</script>
<style lang="scss">
.searchPopUp {
  // background-color: purple;
  position: absolute;
  margin-top: 8px;
  width: 317px;
  margin-left:-15px;
}
</style>
