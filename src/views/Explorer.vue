<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-warning">
      <b-row class="justify-content-center">
        <b-col lg="12">
          <card header-classes="bg-transparent">
            <h3 slot="header" class="mb-0">Featured collections</h3>
            <b-button
              v-for="(n, idx) in featuredCollections"
              :key="'collection' + idx"
              @click="$router.push('/explorer?contract=' + n.contract)"
              size="sm"
              variant="secondary"
            >
              {{ n.name }}
            </b-button>
            <br /><br />
            <div class="p-4 bg-secondary">
              <p>Enter NFT contract address</p>
              <form @submit="navContract">
                <b-input
                  v-model="currentContract"
                  placeholder="Enter NFT contract address"
                  class="form-control-alternative"
                />
                <br />
              </form>
            </div>
            <br />
          </card>
        </b-col>
      </b-row>
      <br />
      <br />
      <b-row v-if="contractData">
        <b-col xl="3" md="6">
          <stats-card
            title="Owners"
            type="gradient-red"
            :sub-title="
              $parent.$parent.formatNumberWithCommas(contractData.numOwners)
            "
            icon="ni ni-active-40"
            class="mb-4"
          >
            <template slot="footer"> </template>
          </stats-card>
        </b-col>
        <b-col xl="3" md="6">
          <stats-card
            title="Tokens"
            type="gradient-orange"
            :sub-title="
              $parent.$parent.formatNumberWithCommas(contractData.numTokens)
            "
            icon="ni ni-chart-pie-35"
            class="mb-4"
          >
            <template slot="footer"> </template>
          </stats-card>
        </b-col>
      </b-row>
    </base-header>
    <b-container fluid class="mt--7">
      <b-row class="justify-content-center">
        <b-col lg="12">
          <b-card-group deck>
            <nft-card2
              minWidth="20rem"
              maxWidth="30rem"
              display="card"
              v-for="(n, idx) in nfts"
              :key="'nft' + idx"
              :nft="n"
              :root="$parent.$parent"
            />
          </b-card-group>
          <br />
          <div class="text-center">
            <b-button
              @click="
                $router.push(
                  '/explorer?contract=' +
                    $route.query.contract +
                    '&page_num=' +
                    (currentPage + 1)
                )
              "
              v-b-modal.modalOffer
              size="lg"
              variant="success"
            >
              More
            </b-button>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import BaseHeader from "@/components/BaseHeader";
import {
  Table,
  TableColumn,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from "element-ui";
import Collection from "@/components/UniSwan/Collection";
import NftCard2 from "@/components/UniSwan/NftCard2";

Vue.use(VueClipboard);
export default {
  name: "explorer",
  components: {
    NftCard2,
    Collection,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    BaseHeader,
  },
  data() {
    return {
      currentPage: 1,
      test: [],
      offset: 0,
      contractData: null,
      currentContract: null,
      nfts: [],

      featuredCollections: [],
    };
  },
  async mounted() {
    document.title = "🦢 Explorer";
    this.$parent.$parent.routeName = "Explorer";
    this.featuredCollections = [
      {
        contract: "0x9498274b8c82b4a3127d67839f2127f2ae9753f4",
        name: "Polygon Punks",
      },
      {
        contract: "0xcda17cf2ac3cf8e6e818088f21ee9b52bf9e021f",
        name: "Matic Monkeys",
      },
      {
        contract: "0x36a8377e2bb3ec7d6b0f1675e243e542eb6a4764",
        name: "Non-Fungible Matic V2",
      },
      {
        contract: "0x76c52b2c4b2d2666663ce3318a5f35f912bd25c3",
        name: "MaticPunks",
      },
      {
        contract: "0xa5f1ea7df861952863df2e8d1312f7305dabf215",
        name: "Zed run",
      },
      {
        contract: "0x2cb9c915369747c228d087d6179a8ce7e114c011",
        name: "Loot",
      },
      {
        contract: "0x7227e371540cf7b8e512544ba6871472031f3335",
        name: "Neon District Season One",
      },
    ];
    this.loadPage();
  },
  methods: {
    async loadPage() {
      this.nfts = [];
      if (this.$route.query.contract) {
        if (this.$route.query.page_num)
          this.currentPage = parseInt(this.$route.query.page_num);

        this.getNFTs(this.$route.query.contract, this.currentPage);
      } else {
        // Show whats on UniSwan by user for now
        await Promise.all(
          this.$parent.$parent.uniSwanUsers.map(async (user) => {
            // Get Users NFTS
            var res = await this.$parent.$parent.getUserTokensFromSubGraph(
              user,
              10,
              0
            );
            this.nfts = this.nfts.concat(res.nfts);
          })
        );
      }
    },
    async getNFTs(collectionAddress, page = 1) {
      this.nfts = await this.$parent.$parent.getContractTokensFromNFTPort(
        collectionAddress,
        20,
        page
      );

      var res = await this.$parent.$parent.getContractFromSubGraph(
        collectionAddress
      );
      this.contractData = res.raw;

      this.$parent.$parent.routeName = this.contractData.name;
    },
    navContract(ev) {
      ev.preventDefault();
      this.$router.push("/explorer?contract=" + this.currentContract);
    },
  },
  watch: {
    async $route() {
      this.loadPage();
    },
  },
};
</script>
<style></style>
