<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-warning">
      <b-row v-if="contractData">
        <b-col xl="3" md="6">
          <stats-card title="Owners"
            type="gradient-red"
            :sub-title="contractData.numOwners"
            icon="ni ni-active-40"
            class="mb-4">

            <template slot="footer">
            </template>
          </stats-card>
        </b-col>
        <b-col xl="3" md="6">
          <stats-card title="Tokens"
            type="gradient-orange"
            :sub-title="contractData.numTokens"
            icon="ni ni-chart-pie-35"
            class="mb-4">

            <template slot="footer">
            </template>
          </stats-card>
        </b-col>
      </b-row>
    </base-header>
    <b-container fluid class="mt--7">
      <b-row class="justify-content-center">
        <b-col lg="12">
          <!-- <pre>{{nfts}}</pre> -->
          <!-- <card header-classes="bg-transparent" v-if="nfts && contractData">
            <h1 slot="header" class="mb-0">
              {{ contractData.name }}
            </h1> -->
            <b-card-group deck>
              <nft-card2
                display="card"
                v-for="(n,idx) in nfts"
                :key="'nft'+idx"
                :nft="n"
                :root="$parent.$parent"
                />
            </b-card-group>
            <!-- <router-link :to="$router.currentRoute+'&'">
              Next
            </router-link> -->
            <b-button
              @click="offset += 10;getNFTs(contractData.id, offset)"
              v-b-modal.modalOffer
              size="sm"
              variant="secondary"
            >
              More
            </b-button>
            <!-- <div
              class="actions">
              <a :href="baselink0 + ''" class="btn btn-sm btn-primary">
                Default
              </a>
              <a
                :href="baselink0 + '&order=sale_date'"
                class="btn btn-sm btn-primary">
                Last sale
              </a>
              <a
                :href="baselink0 + '' + 'order=visitor_count'"
                class="btn btn-sm btn-primary">
                Most viewed
              </a>
              <a
                :href="baselink0 + '&order=sale_price'"
                class="btn btn-sm btn-primary">
                Buy Now
              </a>
              <a
                :href="baselink0 + '&auction=1'"
                class="btn btn-sm btn-primary">
                On auction
              </a>
            </div> -->
            <!-- <el-table
              class="table-responsive table"
              :data="nfts"
              header-row-class-name="thead-light"
            >
              <el-table-column label="NFT" min-width="130px" prop="page">
                <template v-slot="{ row }">
                  <nft-card :nft="row" :root="$parent.$parent" />
                </template>
              </el-table-column>
            </el-table>
            <br /> -->
            <!-- <div class="p-4 bg-secondary">
              <form @submit="navNFT($event)">
                <b-input
                  v-model="currentTokenID"
                  placeholder="Enter Token ID"
                  class="form-control-alternative"
                />
                <br />
              </form>
            </div> -->
          <!-- </card> -->
        </b-col>
      </b-row>
      <br />
      <br>
      <b-row class="justify-content-center">
        <b-col lg="12">
          <card header-classes="bg-transparent">
            <h3 slot="header" class="mb-0">Featured collections</h3>
            <b-button
              v-for="(n,idx) in featuredCollections"
              @click="$router.push('/explorer?contract='+n.contract)"
              size="sm"
              variant="secondary">
              {{n.name}}
            </b-button>
            <br><br>
            <div class="p-4 bg-secondary">
              <p>Enter NFT contract address</p>
              <!-- <form @submit="$event.preventDefault;getNFTs(currentContract)"> -->
              <form @submit="navContract">
                <b-input
                v-model="currentContract"
                placeholder="Enter NFT contract address"
                class="form-control-alternative"
                />
                <br />
              </form>
            </div>

            <!-- <form @submit="searchCollections">
            <b-input
            v-model="contractSearchWord"
            placeholder="Seacrh collections"
            class="form-control-alternative"
            />
            <br />
            </form> -->
            <!-- <el-table
            v-if="contracts"
            class="table-responsive table"
            :data="contracts.data.tokenContracts"
            header-row-class-name="thead-light">
            <el-table-column label="Name" min-width="130px" prop="page">
              <template v-slot="{ row }">
                <h4 :title="row.name">
                  <b-button
                  @click="getNFTs(row.id)"
                  size="sm"
                  variant="secondary"
                  >
                  See collection
                  </b-button>
                  &nbsp;
                  {{ row.name !== '' ? row.name : row.id.substr(0,6) }}
                </h4>
              </template>
            </el-table-column>
          </el-table> -->
          <br />
          </card>
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
      offset:0,
      contractData: null,
      baselink0: '',
      contractSearchWord:'',
      currentTokenID: null,
      currentContract: null,
      nfts: [], // Uniswan format
      assets: [], // OpenSea Format
      orders: [],
      collection: null,

      featuredCollections: [],
      contracts:null,
    };
  },
  async mounted() {
    document.title = "🦢 Explorer";
    this.loadPage();
  },
  methods: {
    navContract(ev) {
      ev.preventDefault;
      this.$router.push('/explorer?contract='+this.currentContract)
    },
    async loadPage() {
      this.assets = [];
      this.nfts = [];
      if (this.$parent.$parent.network.chainId === 137) {
        // Matic
        this.featuredCollections = [
          {
            contract: "0x36a8377e2bb3ec7d6b0f1675e243e542eb6a4764",
            name: "Non-Fungible Matic V2",
          },
          // {
          //   contract: "0xd35147be6401dcb20811f2104c33de8e97ed6818",
          //   name: "Decentraland Wearables",
          // },
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
          // {
          //   contract: "0x8634666ba15ada4bbc83b9dbf285f73d9e46e4c2",
          //   name: "Chicken derby",
          // },
          // {
          //   contract: "0x8b8407c6184f1f0fd1082e83d6a3b8349caced12",
          //   name: "Emblem vault",
          // },
        ];
        if (this.$route.query.contract) {
          this.getNFTs(this.$route.query.contract);
        } else {
          this.getNFTs(this.featuredCollections[0].contract);
        }
      } else if (this.$parent.$parent.network.chainId === 1) {
        // Main net
        this.featuredCollections = [
          { slug: "0xmons-xyz", name: "0xmons" },
          { slug: "hd-punk", name: "HD Punks" },
          { slug: "autoglyphs", name: "Autoglyphs" },
          { slug: "cryptopunks", name: "Cryptopunks" },
          { slug: "eulerbeats", name: "Eulerbeats" },
          { slug: "ens", name: "ENS" },
          { slug: "hashmasks", name: "HashMasks" },
          { slug: "meebits", name: "Meebits" },
          { slug: "cryptoanarchists", name: "Crypto Anarchists" },
        ];
        this.loadOS(0);
      }
    },
    async searchCollections(ev) {
      ev.preventDefault()
      this.contracts = await this.$parent.$parent.getContractsFromSubGraph(this.contractSearchWord);
    },
    navNFT(ev) {
      if (ev) {
        ev.preventDefault();
      }
      this.$router.push(
        "/nft/" + this.currentContract + "/" + this.currentTokenID
      );
    },
    async getNFTs(collectionAddress, offset = 0) {
      this.nfts = null
      this.contractData = null

      this.currentContract = collectionAddress;
      var res = await this.$parent.$parent.getContractTokensFromSubGraph2(
        collectionAddress,
        10,
        offset
      );
      this.nfts = res.nfts
      this.contractData = res.raw
      this.$parent.$parent.routeName = this.contractData.name;
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
    onCopy() {
      this.$notify({
        type: "info",
        message: "Copied to clipboard",
      });
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
