<template>
  <div class="wrapper" v-if="pageloaded">
    <notifications></notifications>
    <order-modal :order="currentOrder"></order-modal>
    <create-order-modal
      :nft="orderToDeleteNFT"
      :ownernfts="orderToDeleteOwnerNFTs"
    ></create-order-modal>
    <swap-chain-modal
      :chain="currentSwapChain"
      :receiveBundle="currentReceiveBundle"
    ></swap-chain-modal>
    <side-bar>
      <template slot="links">
        <sidebar-item
          :link="{
            name: 'Dashboard',
            path: '/dashboard',
            icon: 'ni ni-tv-2 text-primary',
          }"
        ></sidebar-item>
        <sidebar-item
          :link="{
            name: 'NFTs',
            path: '/account/' + signeraddr + '?tab=nfts',
            icon: 'ni ni-ui-04 text-primary',
          }"
        ></sidebar-item>
        <sidebar-item
          :link="{
            name: 'Orders',
            path: '/account/' + signeraddr + '?tab=offers',
            icon: 'ni ni-single-02 text-primary',
          }"
        ></sidebar-item>
        <sidebar-item
          :link="{
            name: 'Options',
            path: '/account/' + signeraddr + '?tab=options',
            icon: 'ni ni-ui-04 text-primary',
          }"
        ></sidebar-item>
        <sidebar-item
          :link="{
            name: 'Activity',
            path: '/account/' + signeraddr + '?tab=history',
            icon: 'ni ni-calendar-grid-58 text-primary',
          }"
        ></sidebar-item>
        <sidebar-item
          :link="{
            name: 'Explorer',
            path: '/explorer',
            /* path: '/explorer?contract=0x9498274b8c82b4a3127d67839f2127f2ae9753f4', */
            icon: 'ni ni-world-2 text-warning',
          }"
        ></sidebar-item>
        <sidebar-item
          :link="{
            name: 'Latest orders',
            path: '/orders',
            icon: 'ni ni-atom text-success',
          }"
        ></sidebar-item>
      </template>
    </side-bar>
    <div class="main-content">
      <dashboard-navbar :type="$route.meta.navbarType"></dashboard-navbar>
      <div @click="$sidebar.displaySidebar(false)">
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <router-view></router-view>
        </fade-transition>
      </div>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<script>
import ERC20ABI from "@/abis/erc20.json";
import ERC721ABI from "@/abis/erc721.json";
import EXCHANGEABI from "@/abis/Exchange.json";

import { gql } from "apollo-boost";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import { assetDataUtils } from "@0x/order-utils";
import { BigNumber } from "@0x/utils";
import { HttpClient } from "@0x/connect";

/* eslint-disable no-new */
import DashboardNavbar from "./DashboardNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";

import OrderModal from "@/components/UniSwan/OrderModal";
import CreateOrderModal from "@/components/UniSwan/CreateOrderModal";
import SwapChainModal from "@/components/UniSwan/SwapChainModal";
import makeBlockie from "ethereum-blockies-base64";

import Datastore from "nedb";

import { FadeTransition } from "vue2-transitions";
import { ethers } from "ethers";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

const SUBGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/tranchien2002/eip721-matic";

export const DB_BASE_URL = "https://uns-backend.vercel.app/api/v3";
export const EXCHANGE_ADDRESS = "0x1f98206be961f98d0c2d2e5f7d965244b2f2129a";
export const ERC20_PROXY_ADDRESS = "0x66421DB72AeDF7ab6e75Ab05b7A0031E017Aa64B";
export const ERC721_PROXY_ADDRESS =
  "0x7931459d633a9639F26e851c9E63D30388957B60";
export const MULTI_ASSET_PROXY_ADDRESS =
  "0xdd718b40c72dc397a90cfac32c5c1ea8556928ba";

const client = new ApolloClient({
  link: createHttpLink({
    uri: SUBGRAPH_URL,
  }),
  cache: new InMemoryCache(),
});

function hasElement(className) {
  return document.getElementsByClassName(className).length > 0;
}
function initScrollbar(className) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`);
  } else {
    // try to init it later in case this component is loaded async
    setTimeout(() => {
      initScrollbar(className);
    }, 100);
  }
}

export default {
  components: {
    SwapChainModal,
    CreateOrderModal,
    OrderModal,
    DashboardNavbar,
    ContentFooter,
    DashboardContent,
    FadeTransition,
  },
  data() {
    return {
      nedbSaved: null,
      routeName: null,
      showSearch: false,

      nonFungibleMaticV2Address: "0x36a8377e2bb3ec7d6b0f1675e243e542eb6a4764",
      access: false,
      allowList: [
        "0x51e8d87A76c4A2528b2500c5a757157E577CcDCF",
        "0xF0f85AcE70e9a3a20ec9825eFc1C9da8B1Ee391A",
        "0x0CC1ff47849C626Fce6946eb9Ecb1eF4ab8dE728",
        "0xb19BC46C52A1352A071fe2389503B6FE1ABD50Ff",
        "0x75a0bB47c44898ed558b63536EeD082016F16790",
        "0x60c54576173E5B2791A7359bE7285F275488A3dC",
        "0x7b358DE6237deDf79ad102f3d55a1cC8EaD89677",
      ],

      orderbook: [],
      savedNFTs: [],
      usernfts: [],
      userERC20s: [],
      userOrders: [],
      userSwapOptions: [],
      fillEvents: [],
      currentOrder: null,
      orderToDeleteNFT: null,
      orderToDeleteOwnerNFTs: null,
      currentSwapChain: null,
      currentReceiveBundle: null,

      provider: null,
      network: null,
      blockNumber: null,
      signer: null,
      signeraddr: null,
      signerblockie: null,
      makeBlockie: makeBlockie,
      pageloaded: false,
      uniSwanUsers: new Set(),
    };
  },
  async mounted() {
    document.title = "🦢 UniSwan";
    var self = this;
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.provider.on("requestAccounts", (blockNumber) => {
      // Emitted on every block change
      this.blockNumber = blockNumber;
    });
    this.provider.on("block", (blockNumber) => {
      // Emitted on every block change
      this.blockNumber = blockNumber;
    });
    window.ethereum.on("accountsChanged", async function (accounts) {
      // Time to reload your interface with accounts[0]!
      self.pageloaded = false;
      await self.loadApp();
      self.pageloaded = true;
    });
    window.ethereum.on("chainChanged", function (networkId) {
      // Time to reload your interface with the new networkId
      self.loadNetwork();
    });
    this.loadApp();
  },
  methods: {
    async getUserTokens(userAddress, limit = 20, offset = 0) {
      const tokensQuery = `
        {
          owner(id:"${userAddress.toLowerCase()}") {
            tokens(first:${limit}, skip:${offset}) {
              contract {id}
              tokenID
            }
          }
        }
        `;
      const data = await client.query({
        query: gql(tokensQuery),
      });

      var nfts = [];
      await Promise.all(
        data.data.owner.tokens.map(async (x) => {
          const nft = await this.getTokenFromAPI(x.contract.id, x.tokenID);
          nfts.push(nft);
        })
      );
      return nfts;
    },
    async getContractsFromSubGraph(search, limit = 10) {
      const tokensQuery = `{
        tokenContracts(first:${limit}, where: {name_contains:"${search}"}) {
          id
          name
        }
      }`;

      const data = await client.query({
        query: gql(tokensQuery),
      });

      return data.data.tokenContracts;
    },
    async getContractFromSubGraph(contract_address) {
      const tokensQuery = `
        {
          tokenContract(id:"${contract_address.toLowerCase()}") {
            id
            name
            numTokens
            numOwners
          }
        }
      `;
      const data = await client.query({
        query: gql(tokensQuery),
      });
      return data.data.tokenContract;
    },
    async getOwnerFromSubgraph(contract_address, tokenId) {
      const id = contract_address.toLowerCase() + "_" + tokenId;

      const tokensQuery = `
      query {
        token(id:"${id}") {
          owner {
            id
          }
        }
      }
      `;
      const data = await client.query({
        query: gql(tokensQuery),
      });

      return data.data.token.owner.id;
    },
    async getTokenFromAPI(contract_address, token_id) {
      var res = await this.NFTPortAPI(
        "nfts/" + contract_address + "/" + token_id
      );
      if (res && res.nft) {
        var out = res.nft;

        if (res.nft.cached_image_url)
          out.metadata.image = res.nft.cached_image_url;

        return out;
      } else {
        // Get metadata from SubGraph
        const id = contract_address.toLowerCase() + "_" + token_id;
        const tokensQuery = `
        {
          token(id:"${id}") {
            tokenURI
          }
        }
        `;
        const data = await client.query({
          query: gql(tokensQuery),
        });
        var res = await fetch(data.data.token.tokenURI);
        var metadata = await res.json();

        return {
          contract_address: contract_address,
          token_id: token_id,
          metadata: metadata,
        };
      }
    },
    async getContractTokensFromAPI(
      contract_address,
      pageSize = 10,
      pageNumber = 1
    ) {
      var res = await this.NFTPortAPI(
        "nfts/" + contract_address,
        "",
        pageSize,
        pageNumber
      );

      var nfts = [];
      if (res) {
        await Promise.all(
          res.nfts.map(async (x) => {
            var nft = await this.getTokenFromAPI(
              x.contract_address,
              x.token_id
            );
            nfts.push(nft);
          })
        );
      }
      return nfts;
    },
    async getTokenExtra(contract, tokenId) {
      const nft = await this.getTokenFromAPI(contract, tokenId);

      nft.contractName = (await this.getContractFromSubGraph(contract)).name;

      nft.owner = await this.getOwnerFromSubgraph(contract, tokenId);

      return nft;
    },
    async NFTPortAPI(addUrl, urlParams, pageSize = 10, pageNumber = 1) {
      try {
        var url =
          "https://api.nftport.xyz/" +
          addUrl +
          "?chain=polygon&page_number=" +
          pageNumber +
          "&page_size=" +
          pageSize +
          urlParams;
        var resp = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "150f5df4-cf22-4bbd-9c58-93e4cac2582b",
          },
        });
        var toret = await resp.json();
        if (!toret.error) {
          return toret;
        } else {
          return null;
        }
      } catch (e) {
        console.log(e);
        return [];
      }
    },

    async loadApp() {
      this.signer = this.provider.getSigner();
      this.signeraddr = await this.signer.getAddress();
      var access = this.allowList.includes(this.signeraddr);
      if (access) {
        this.buildNEDB();
        await this.loadNetwork();
        await this.loadUser();
        this.pageloaded = true;
      }
    },
    async loadNetwork() {
      this.network = await this.provider.getNetwork();
      this.blockNumber = await this.provider.getBlockNumber();
      this.orderbook = await this.getOrdersFromDB();
      this.orderbook.map((x) =>
        this.uniSwanUsers.add(x.signedOrder.makerAddress.toLowerCase())
      );
    },
    async loadUser() {
      this.savedNFTs = await this.queryNEDB({}, this.nedbSaved);
      this.userERC20s = await this.getUserERC20s(this.signeraddr);
      this.usernfts = await this.getUserTokens(this.signeraddr);
      this.userOrders = await this.getOrdersFromDB({
        makerAddress: this.signeraddr.toLowerCase(),
      });
      this.userSwapOptions = await this.getSwapOptions(this.usernfts);

      const exchange = new ethers.Contract(
        EXCHANGE_ADDRESS,
        EXCHANGEABI,
        this.signer
      );
      var blockNumber = await this.provider.getBlockNumber();
      this.fillEvents = await exchange.queryFilter(
        exchange.filters.Fill(),
        blockNumber - 10000
      );
    },
    buildNEDB() {
      this.nedbSaved = new Datastore({ filename: "Saved", autoload: true });
    },
    insertNEDB(x, db) {
      var self = this;
      return new Promise(function (resolve) {
        db.update({ _id: x._id }, x, { upsert: true }, () => {
          resolve(true);
        });
      });
    },
    queryNEDB(sea, db) {
      var self = this;
      return new Promise(function (resolve) {
        db.find(sea)
          .sort()
          .skip(0)
          .limit(100)
          .exec(function (err, docs) {
            resolve(docs);
          });
      });
    },
    async checkSaved(nft) {
      var saved = await this.queryNEDB(
        {
          token_id: nft.token_id,
          contract_address: nft.contract_address,
        },
        this.nedbSaved
      );

      return saved;
    },
    async removeSavedNFT(nft) {
      var self = this;
      var id = ethers.utils.id(
        "nft/" + nft.contract_address + "/" + nft.token_id
      );
      this.nedbSaved.remove({ _id: id }, {}, async () => {
        self.savedNFTs = await self.queryNEDB({}, self.nedbSaved);
      });
    },
    async saveNFT(nft) {
      var toInsert = { ...nft };
      toInsert._id = ethers.utils.id(
        "nft/" + nft.contract_address + "/" + nft.token_id
      );
      await this.insertNEDB(toInsert, this.nedbSaved);
      this.savedNFTs = await this.queryNEDB({}, this.nedbSaved);
    },
    async getOrdersFromDB(requestOpts) {
      var orderClient = new HttpClient(DB_BASE_URL);

      var json = await orderClient.getOrdersAsync(requestOpts);
      var orders = await this.getOrders(json.records.map((r) => r.order));

      return orders;
    },
    async getSwapOptions(bundle) {
      let [amounts, assetDatas] = this.bundleToData(bundle);

      var encodedData = assetDataUtils.encodeMultiAssetData(
        amounts,
        assetDatas
      );
      const bundlesDBURI = DB_BASE_URL + "/options/" + encodedData;
      var res = await fetch(bundlesDBURI);
      var options = await res.json();
      var newChains = [];
      await Promise.all(
        options.map(async (chain) => {
          var orders = await this.getOrders(chain);
          newChains.push(orders);
        })
      );
      return newChains;
    },
    async getOrders(chain) {
      var orders = [];
      await Promise.all(
        chain.map(async (order) => {
          const exchangeBundle = await this.dataToBundle(order.makerAssetData);
          const wishBundle = await this.dataToBundle(order.takerAssetData);

          orders.push({
            signedOrder: order,
            exchangeBundle: exchangeBundle,
            wishBundle: wishBundle,
          });
        })
      );

      return orders;
    },
    executeOrder(ourAssetsEncoded, order) {
      const takerAssets = assetDataUtils.decodeAssetDataOrThrow(
        order.takerAssetData
      );

      const ourAssets = assetDataUtils.decodeAssetDataOrThrow(ourAssetsEncoded);

      for (let i = 0; i < takerAssets.nestedAssetData.length; i++) {
        const index = ourAssets.nestedAssetData.indexOf(
          takerAssets.nestedAssetData[i]
        );
        if (index > -1) {
          ourAssets.amounts[index] = ourAssets.amounts[index].minus(
            takerAssets.amounts[i]
          );
          if (ourAssets.amounts[index].toNumber() < 0) return null;
        } else return null;
      }

      const makerAssets = assetDataUtils.decodeAssetDataOrThrow(
        order.makerAssetData
      );

      for (let i = 0; i < makerAssets.nestedAssetData.length; i++) {
        var index = ourAssets.nestedAssetData.indexOf(
          makerAssets.nestedAssetData[i]
        );
        if (index === -1) {
          index = ourAssets.nestedAssetData.length;
          ourAssets.nestedAssetData.push(makerAssets.nestedAssetData[i]);
          ourAssets.amounts.push(new BigNumber(0));
        }
        ourAssets.amounts[index] = ourAssets.amounts[index].plus(
          makerAssets.amounts[i]
        );
      }

      const newOurAssetsEncoded = assetDataUtils.encodeMultiAssetData(
        ourAssets.amounts,
        ourAssets.nestedAssetData
      );

      return newOurAssetsEncoded;
    },
    async getUserERC20s(userAddress) {
      var collection = new ethers.Contract(
        "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", // WETH
        ERC20ABI,
        this.signer
      );

      return [
        {
          address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
          name: await collection.name(),
          symbol: await collection.symbol(),
          decimals: await collection.decimals(),
          amount: await collection.balanceOf(userAddress),
        },
      ];
    },
    bundleToData(bundle) {
      let amounts = [];
      let assetDatas = [];
      for (let i = 0; i < bundle.length; i++) {
        let assetData;
        if (bundle[i].metadata) {
          assetData = assetDataUtils.encodeERC721AssetData(
            bundle[i].contract_address,
            new BigNumber(bundle[i].token_id)
          );
          amounts.push(new BigNumber(1));
        } else {
          assetData = assetDataUtils.encodeERC20AssetData(bundle[i].address);
          amounts.push(new BigNumber(bundle[i].amount.toNumber()));
        }
        assetDatas.push(assetData);
      }
      return [amounts, assetDatas];
    },
    async dataToBundle(assetData) {
      const assetDatas =
        assetDataUtils.decodeMultiAssetDataRecursively(assetData);
      var bundle = [];

      await Promise.all(
        assetDatas.nestedAssetData.map(async (n, i) => {
          if (assetDatas.amounts[i] > 0) {
            if (n.assetProxyId === "0xf47261b0") {
              var collection = new ethers.Contract(
                n.tokenAddress,
                ERC20ABI,
                this.signer
              );
              bundle.push({
                address: n.tokenAddress,
                name: await collection.name(),
                symbol: await collection.symbol(),
                decimals: await collection.decimals(),
                amount: assetDatas.amounts[i],
              });
            } else if (n.assetProxyId === "0x02571792") {
              const nft = await this.getTokenFromAPI(n.tokenAddress, n.tokenId);

              bundle.push(nft);
            }
          }
        })
      );

      return bundle;
    },
    async isApproved(contract, user) {
      var collection = new ethers.Contract(contract, ERC721ABI, this.signer);

      return await collection.isApprovedForAll(user, ERC721_PROXY_ADDRESS);
    },
    async approveTransfers(collectionAddress) {
      var collection = new ethers.Contract(
        collectionAddress,
        ERC721ABI,
        this.signer
      );

      collection.setApprovalForAll(ERC721_PROXY_ADDRESS, true);
    },
    async executeSwap(ringswap) {
      const exchange = new ethers.Contract(
        EXCHANGE_ADDRESS,
        EXCHANGEABI,
        this.signer
      );
      console.log("Executing", exchange, ringswap);

      console.log(ringswap);

      exchange.batchFillOrders(
        ringswap.map((b) => b.signedOrder),
        ringswap.map((b) => b.signedOrder.takerAssetAmount),
        ringswap.map((b) => b.signedOrder.signature),
        {
          gasLimit: 1000000,
        }
      );
      this.loadApp();
    },
    async deleteOrder(order) {
      const exchange = new ethers.Contract(
        EXCHANGE_ADDRESS,
        EXCHANGEABI,
        this.signer
      );
      const orderToDelete = {
        exchangeAddress: order.exchangeAddress,
        makerAddress: order.makerAddress,
        takerAddress: order.takerAddress,
        feeRecipientAddress: order.feeRecipientAddress,
        senderAddress: order.senderAddress,
        makerAssetAmount: order.makerAssetAmount.toNumber(),
        takerAssetAmount: order.takerAssetAmount.toNumber(),
        makerFee: order.makerFee.toNumber(),
        takerFee: order.takerFee.toNumber(),
        expirationTimeSeconds: order.expirationTimeSeconds.toNumber(),
        salt: order.salt.toNumber(),
        makerAssetData: order.makerAssetData,
        takerAssetData: order.takerAssetData,
        makerFeeAssetData: order.makerFeeAssetData,
        takerFeeAssetData: order.takerFeeAssetData,
      };
      await exchange.cancelOrder(orderToDelete);
      this.$notify({
        type: "danger",
        message: "Deleted order",
      });
      this.$bvModal.hide("modalOffer");
      this.loadApp();
    },
    viewSwapChain(chain, receiveBundle) {
      this.currentSwapChain = chain;
      this.currentReceiveBundle = receiveBundle;
    },
    viewOrder(order) {
      this.currentOrder = order;
    },
    createOrder(nft, ownerNFTs) {
      this.orderToDeleteNFT = nft;
      this.orderToDeleteOwnerNFTs = ownerNFTs;
    },
    formatNum(num, leading = 2) {
      return this.formatNumberWithCommas(
        Number.parseFloat(num).toFixed(leading)
      );
    },
    formatNumberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    initScrollbar() {
      let isWindows = navigator.platform.startsWith("Win");
      if (isWindows) {
        initScrollbar("sidenav");
      }
    },
  },
};
</script>
<style lang="scss">
.cb {
  clear: both;
}
.swapBtn {
  float: left;
  margin-right: -30px !important;
}
.bgim {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
