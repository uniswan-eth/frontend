<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-warning">
      <b-row class="justify-content-center">
        <b-col lg="12">
          <card header-classes="bg-transparent">
            <h3 slot="header" class="mb-0">Featured collections</h3>
            <b-button
              v-for="(n, idx) in featuredCollections"
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
            :sub-title="$parent.$parent.formatNumberWithCommas(contractData.numOwners)"
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
            :sub-title="$parent.$parent.formatNumberWithCommas(contractData.numTokens)"
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
                $router.push('/explorer?contract='+$route.query.contract+'&page_num='+(currentPage + 1))
                /* currentPage += 1;
                getNFTs($route.query.contract, currentPage); */
              "
              v-b-modal.modalOffer
              size="lg"
              variant="success"
            >
              More
            </b-button>
            <!-- <pre>{{test}}</pre> -->
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
import ERC721ABI from "@/abis/erc721.json";
import { ethers } from "ethers";

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
      currentPage:1,
      test:[],
      offset: 0,
      contractData: null,
      baselink0: "",
      contractSearchWord: "",
      currentTokenID: null,
      currentContract: null,
      nfts: [], // Uniswan format
      assets: [], // OpenSea Format
      orders: [],
      collection: null,

      featuredCollections: [],
      contracts: null,
    };
  },
  async mounted() {
    document.title = "🦢 Explorer";
    this.$parent.$parent.routeName = "Explorer";
    this.featuredCollections = [

        // {
        //   contract: "0x22dd2d9e9a4279834c928e2e71c68a17d1d09f12",
        //   name: "Emojibotos",
        // },
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
      this.assets = [];
      this.nfts = [];
      if (this.$route.query.contract) {
        if (this.$route.query.page_num) {this.currentPage = parseInt(this.$route.query.page_num)}
        this.getNFTs(this.$route.query.contract, this.currentPage);
      } else {
        // Show whats on UniSwan by user for now
        await Promise.all(
          this.$parent.$parent.uniSwanUsers.map(async user => {
            // Get Users NFTS
            var res = await this.$parent.$parent.getUserTokensFromSubGraph(
              user,
              10,
              0
            );
            this.nfts = this.nfts.concat(res.nfts);
          })
        )
      }
    },
    async getNFTs(collectionAddress, page = 1) {
      // console.log('Page ', page);
      this.nfts = await this.$parent.$parent.getContractTokensFromNFTPort(
        this.$route.query.contract,
        20,
        page
      )
      var res = await this.$parent.$parent.getContractFromSubGraph(
        this.$route.query.contract
      )
      // console.log(res);
      this.contractData = res.raw;
      this.$parent.$parent.routeName = this.contractData.name;
    },
    navContract(ev) {
      ev.preventDefault();
      this.$router.push("/explorer?contract=" + this.currentContract);
    },
    async searchCollections(ev) {
      ev.preventDefault();
      this.contracts = await this.$parent.$parent.getContractsFromSubGraph(
        this.contractSearchWord
      );
    },
    async loadOS(offset) {
      if (!this.$route.query.slug) {
        return;
      }
      this.isLoading = true;

      var address = this.$route.query.address;
      var slug = this.$route.query.slug;
      var order = this.$route.query.order ? this.$route.query.order : "";
      var buynow = this.$route.query.buynow;
      var auction = this.$route.query.auction;
      this.contractaddress = address;
      this.slug = slug;
      var res;
      var sea = { offset: 0, limit: 20 };
      if (address) {
        this.baselink0 = "/explorer/?contract=" + address + "?";
        this.baselink = "/explorer/?contract=" + address + "?";
        sea.contract = address;
        // Fetch Contract Info
        if (!this.contract) {
          res = await this.$parent.$parent.fetchOpenSea({
            urlcontract: true,
            contractaddress: address,
            limit: this.limit,
          });
          this.contract = res;
        }
      } else if (slug) {
        this.baselink0 = "/explorer/?slug=" + slug + "?";
        this.baselink = "/explorer/?slug=" + slug + "?";
        sea.slug = slug;
      }
      if (order) {
        this.baselink += "&order=" + order;
      }
      if (buynow) {
        this.baselink += "&buynow=1";
      }
      if (auction) {
        this.baselink += "&auction=1";
      }

      if (order) {
        sea.order = order;
      }
      if (offset) {
        sea.offset = offset;
      }
      if (buynow || auction) {
        sea.urlorders = true;
        if (buynow) {
          sea.side = 0;
          sea.sale_kind = 1;
        }
        if (auction) {
          sea.is_english = true;
        }
        res = await this.$parent.$parent.fetchOpenSea(sea);
        if (res.orders.length < this.limit) {
          this.offset = -1;
        }
        this.orders = this.orders.concat(res.orders);
      } else {
        res = await this.$parent.$parent.fetchOpenSea(sea);
        if (res.assets.length < this.limit) {
          this.offset = -1;
        }
        this.assets = this.assets.concat(res.assets);
      }

      // if (!this.collection && (this.assets.length > 0 || this.orders.length > 0)) {
      if (this.assets.length > 0 || this.orders.length > 0) {
        var firstasset =
          this.orders.length > 0 ? this.orders[0].asset : this.assets[0];
        // Get First Asset to get full collections info
        res = await this.$parent.$parent.fetchOpenSea({
          urlasset: true,
          contractaddress: firstasset.asset_contract.address,
          token_id: firstasset.token_id,
        });
        this.collection = res.collection;
        document.title = this.collection.name;
      }

      this.isLoading = false;
    },
  },
  watch: {
    async $route() {
      this.assets = [];
      this.orders = [];
      this.collection = null;
      this.loadPage(0);
    },
  },
};
</script>
<style></style>
