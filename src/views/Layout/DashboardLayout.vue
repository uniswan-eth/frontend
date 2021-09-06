<template>
  <div class="wrapper" v-if="pageloaded">
    <notifications></notifications>
    <order-modal :order="currentOrder"></order-modal>
    <create-order-modal
      :nft="newOrderNFT"
      :ownernfts="newOrderOwnerNFTs"
    ></create-order-modal>
    <swap-chain-modal :chain="currentSwapChain"></swap-chain-modal>
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
            name: 'My NFTs',
            path: '/account/' + signeraddr + '',
            icon: 'ni ni-ui-04 text-primary',
          }"
        ></sidebar-item>
        <sidebar-item
          :link="{
            name: 'My offers',
            path: '/account/' + signeraddr + '?tab=offers',
            icon: 'ni ni-single-02 text-primary',
          }"
        ></sidebar-item>
        <sidebar-item
          :link="{
            name: 'My swap options',
            path: '/account/' + signeraddr + '?tab=options',
            icon: 'ni ni-ui-04 text-success',
          }"
        ></sidebar-item>
        <!-- <sidebar-item
          :link="{
            name: 'My offers',
            path: '/account?tab=offers',
            icon: 'ni ni-planet text-primary',
          }"
        ></sidebar-item> -->
        <sidebar-item
          :link="{
            name: 'My swap history',
            path: '/account/' + signeraddr + '?tab=history',
            icon: 'ni ni-calendar-grid-58 text-primary',
          }"
        ></sidebar-item>
        <sidebar-item
          :link="{
            name: 'NFT Explorer',
            path: '/explorer',
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
import ERC721ABI from "@/abis/erc721.json";
import EXCHANGEABI from "@/abis/Exchange.json";

import { gql } from "apollo-boost";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import { assetDataUtils, orderHashUtils } from "@0x/order-utils";
import { BigNumber } from "@0x/utils";

/* eslint-disable no-new */
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

const DB_BASE_URL = "https://uns-backend.vercel.app/api/";
const SUBGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/zapaz/eip721-matic";

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

import DashboardNavbar from "./DashboardNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import { FadeTransition } from "vue2-transitions";
import { ethers } from "ethers";
import makeBlockie from "ethereum-blockies-base64";

import OrderModal from "@/components/UniSwan/OrderModal";
import CreateOrderModal from "@/components/UniSwan/CreateOrderModal";
import SwapChainModal from "@/components/UniSwan/SwapChainModal";

const httpLink = createHttpLink({
  uri: SUBGRAPH_URL,
});
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

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
      ERC721_PROXY_ADDRESS: "0x7931459d633a9639F26e851c9E63D30388957B60",
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

      tempnfts: [],
      usernfts: [],
      userprefs: [],
      userSwapOptions: [],
      userHistory: [],
      currentOrder: null,
      newOrderNFT: null,
      newOrderOwnerNFTs: null,
      currentSwapChain: null,

      provider: null,
      network: null,
      blockNumber: null,
      signer: null,
      signeraddr: null,
      signerblockie: null,
      makeBlockie: makeBlockie,
      pageloaded: false,
    };
  },
  async mounted() {
    document.title = "🦢 UniSwan";
    await window.ethereum.enable();
    var self = this;
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
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
    window.ethereum.on("networkChanged", function (networkId) {
      // Time to reload your interface with the new networkId
      self.loadNetwork();
    });
    this.loadApp();
  },
  methods: {
    async constructBundle(tokenData) {
      var bundle = [];
      await Promise.all(
        tokenData.map(async (d) => {
          var collection = new ethers.Contract(
            d.contract.id,
            ERC721ABI,
            this.signer
          );

          // If the subgraph doesn't give us the metadata, retrieve it manually
          var tokenJSON;
          if (d.metadata) {
            tokenJSON = JSON.parse(d.metadata);
          } else {
            var tokenURI = await collection.tokenURI(d.tokenID);
            var res = await fetch(tokenURI);
            tokenJSON = await res.json();
          }
          var signerApprovedForCollection = await collection.isApprovedForAll(
            this.signeraddr,
            this.ERC721_PROXY_ADDRESS
          );
          const nft = {
            contract: d.contract.id,
            tokenID: d.tokenID,
            owner: d.owner.id,
            tokenJSON: tokenJSON,
            signerApprovedForCollection: signerApprovedForCollection,
          };
          bundle.push(nft);
        })
      );
      return bundle;
    },
    async getUserTokensFromSubGraph(userAddress) {
      const tokensQuery = `
          query {
          owners(where:{id:"${userAddress.toLowerCase()}"}) {
            id
            tokens {
              id,
              contract {
                id
              },
              owner {
                id
              }
              tokenID
              metadata
            }
          }
        }
        `;
      const data = await client.query({
        query: gql(tokensQuery),
      });
      const tokenData = data.data.owners[0].tokens;
      const output = await this.constructBundle(tokenData);
      return output;
    },
    async getContractTokensFromSubGraph(contractAddress, startIndex, amount) {
      const tokensQuery = `
          query {
          tokenContracts(where:{id:"${contractAddress.toLowerCase()}"}) {
            id
            tokens(first:${amount}, skip:${startIndex}) {
              id,
              contract {
                id
              },
              owner {
                id
              }
              tokenID
              metadata
            }
          }
        }
        `;
      const data = await client.query({
        query: gql(tokensQuery),
      });
      const tokenData = data.data.tokenContracts[0].tokens;
      const output = await this.constructBundle(tokenData);
      return output;
    },
    async getTokenFromSubgraph(contractAddress, tokenId) {
      const id = contractAddress.toLowerCase() + "_" + tokenId;
      const tokensQuery = `
          query {
  tokens(where:{id:"${id}"}) {
    id
    contract {
      id
    }
    owner {
      id
    }
    tokenID
    metadata
  }
}
        `;
      const data = await client.query({
        query: gql(tokensQuery),
      });
      const tokenData = data.data.tokens;
      const output = await this.constructBundle(tokenData);
      return output[0];
    },
    async getTokenByName(name) {
      const tokensQuery = `
          query {
  tokens(where:{name:"${name}"}) {
    id
    contract {
      id
    }
    owner {
      id
    }
    tokenID
    metadata
  }
}
        `;
      const data = await client.query({
        query: gql(tokensQuery),
      });
      const tokenData = data.data.tokens;
      const output = await this.constructBundle(tokenData);
      return output;
    },
    async loadApp() {
      this.signer = this.provider.getSigner();
      this.signeraddr = await this.signer.getAddress();

      var access = this.allowList.includes(this.signeraddr);
      if (access) {
        await this.loadNetwork();
        await this.loadUser();

        this.pageloaded = true;
      }
    },
    async loadUser() {
      this.usernfts = await this.getUserTokensFromSubGraph(this.signeraddr);

      this.userprefs = await this.getPreferences(this.signeraddr);
      this.userSwapOptions = await this.getSwapOptions(this.usernfts);
    },
    async loadNetwork() {
      this.network = await this.provider.getNetwork();
      this.blockNumber = await this.provider.getBlockNumber();
    },
    async getSwapOptions(NFTs) {
      let wantAssetData = [];
      let wantAssetAmounts = [];
      for (let i = 0; i < NFTs.length; i++) {
        let assetData = assetDataUtils.encodeERC721AssetData(
          NFTs[i].contract,
          NFTs[i].tokenID
        );
        wantAssetData.push(assetData);
        wantAssetAmounts.push(new BigNumber(1));
      }
      var encodedData = assetDataUtils.encodeMultiAssetData(
        wantAssetAmounts,
        wantAssetData
      );
      const bundlesDBURI = DB_BASE_URL + "options/" + encodedData;
      var res = await fetch(bundlesDBURI);
      var options = await res.json();
      const exchange = new ethers.Contract(
        "0x2682798109c35310B76db070b98Fc21833DCAA61",
        EXCHANGEABI,
        this.signer
      );
      // TODO: This should check that the maker of deal still owns everything they are offering.
      var newChains = [];
      await Promise.all(
        options.map(async (chain) => {
          var preferences = [];
          for (let i = 0; i < chain.length; i++) {
            // Check that the order is valid.
            // This should really be checked by the backend, but it doesn't have an Ethereum node to get on-chain data.
            const orderHashHex = orderHashUtils.getOrderHashHex(chain[i].order);
            const cancelled = await exchange.cancelled(orderHashHex);
            const filledStatus = await exchange.filled(orderHashHex);
            if (filledStatus.toNumber() > 0 || cancelled) return;

            var inter = assetDataUtils.decodeMultiAssetData(
              chain[i].order.makerAssetData
            );
            const exchangeBundle = [];
            for (let i = 0; i < inter.nestedAssetData.length; i++) {
              var bytes = assetDataUtils.decodeERC721AssetData(
                inter.nestedAssetData[i]
              );
              exchangeBundle.push(
                await this.getNFT(bytes.tokenAddress, bytes.tokenId.toNumber())
              );
            }
            inter = assetDataUtils.decodeMultiAssetData(
              chain[i].order.takerAssetData
            );
            const wishBundle = [];
            for (let i = 0; i < inter.nestedAssetData.length; i++) {
              bytes = assetDataUtils.decodeERC721AssetData(
                inter.nestedAssetData[i]
              );
              wishBundle.push(
                await this.getNFT(bytes.tokenAddress, bytes.tokenId.toNumber())
              );
            }
            preferences.push({
              wisher: chain[i].order.makerAddress,
              exchangeBundle: exchangeBundle,
              wishBundle: wishBundle,
              makerAssetData: chain[i].order.makerAssetData,
              takerAssetData: chain[i].order.takerAssetData,
              signedOrder: chain[i],
            });
          }
          newChains.push(preferences);
        })
      );
      return newChains;
    },
    async approveTransfers(collectionAddress) {
      var collection = new ethers.Contract(
        collectionAddress,
        ERC721ABI,
        this.signer
      );

      collection.setApprovalForAll(this.ERC721_PROXY_ADDRESS, true);
    },
    async unApproveTransfers(collectionAddress) {
      var collection = new ethers.Contract(
        collectionAddress,
        ERC721ABI,
        this.signer
      );

      collection.setApprovalForAll(this.ERC721_PROXY_ADDRESS, false);
    },
    formatAsset(nft) {
      return {
        token_id: nft.tokenID,
        image_url: nft.tokenJSON.image,
        image_preview_url: nft.tokenJSON.image,
        name: nft.tokenJSON.name,
        description: nft.tokenJSON.description,
        signerApprovedForCollection: nft.signerApprovedForCollection,
        asset_contract: {
          address: nft.contract,
        },
        owner: {
          address: nft.owner,
        },
      };
    },
    viewSwapChain(chain) {
      console.log("Modal chin", chain);
      this.currentSwapChain = chain;
    },
    async executeSwap(ringswap) {
      const exchange = new ethers.Contract(
        "0x2682798109c35310B76db070b98Fc21833DCAA61",
        EXCHANGEABI,
        this.signer
      );
      console.log("Executing", exchange, ringswap);
      exchange.batchFillOrders(
        ringswap.map((b) => b.signedOrder.order),
        ringswap.map((b) => b.signedOrder.order.takerAssetAmount),
        ringswap.map((b) => b.signedOrder.signature)
      );
      console.log("Notify and refresh user NFTs", exchange);
      // this.$parent.currentRingSwap = null;
    },
    viewOrder(order) {
      console.log("Modal", order);
      this.currentOrder = order;
    },
    createOrder(nft, ownerNFTs) {
      console.log("Modal", nft);
      this.newOrderNFT = nft;
      this.newOrderOwnerNFTs = ownerNFTs;
    },
    initScrollbar() {
      let isWindows = navigator.platform.startsWith("Win");
      if (isWindows) {
        initScrollbar("sidenav");
      }
    },
    async getNFT(collectionAddress, tokenId) {
      // See if we have in temp
      var toret = this.tempnfts.filter((x) => {
        // FIXME: Does properly compare tokenIDs!!
        return x.contract === collectionAddress && x.tokenID === tokenId;
      })[0];
      if (!toret) {
        var prov = this.signer ? this.signer : this.provider;
        var collection = new ethers.Contract(
          collectionAddress,
          ERC721ABI,
          prov
        );
        var owner = await collection.ownerOf(tokenId);
        var signerApprovedForCollection = await collection.isApprovedForAll(
          this.signeraddr,
          this.ERC721_PROXY_ADDRESS
        );
        var tokenURI = await collection.tokenURI(tokenId);
        var res = await fetch(tokenURI);
        var tokenJSON = await res.json();
        toret = {
          contract: collectionAddress,
          tokenID: tokenId,
          owner: owner,
          tokenJSON: tokenJSON,
          signerApprovedForCollection: signerApprovedForCollection,
        };
        this.tempnfts.push(toret);
      }
      return toret;
    },
    async getPreferences(user) {
      var bundlesDBURI = DB_BASE_URL + "orders";
      var res = await fetch(bundlesDBURI);
      var json = await res.json();
      const exchange = new ethers.Contract(
        "0x2682798109c35310B76db070b98Fc21833DCAA61",
        EXCHANGEABI,
        this.signer
      );
      var preferences = [];
      await Promise.all(
        json.map(async (preference) => {
          const orderHashHex = orderHashUtils.getOrderHashHex(preference.order);
          const cancelled = await exchange.cancelled(orderHashHex);
          const filledStatus = await exchange.filled(orderHashHex);
          if (
            (!user || user === preference.order.makerAddress) &&
            filledStatus.toNumber() === 0 &&
            !cancelled
          ) {
            var inter = await assetDataUtils.decodeMultiAssetData(
              preference.order.makerAssetData
            );
            const exchangeBundle = [];
            for (let i = 0; i < inter.nestedAssetData.length; i++) {
              var bytes = assetDataUtils.decodeERC721AssetData(
                inter.nestedAssetData[i]
              );
              exchangeBundle.push(
                await this.getNFT(bytes.tokenAddress, bytes.tokenId.toNumber())
              );
            }
            inter = await assetDataUtils.decodeMultiAssetData(
              preference.order.takerAssetData
            );
            const wishBundle = [];
            for (let i = 0; i < inter.nestedAssetData.length; i++) {
              bytes = assetDataUtils.decodeERC721AssetData(
                inter.nestedAssetData[i]
              );
              wishBundle.push(
                await this.getNFT(bytes.tokenAddress, bytes.tokenId.toNumber())
              );
            }
            preferences.push({
              wisher: preference.order.makerAddress,
              exchangeBundle: exchangeBundle,
              wishBundle: wishBundle,
              makerAssetData: preference.order.makerAssetData,
              takerAssetData: preference.order.takerAssetData,
              signedOrder: preference,
            });
          }
        })
      );
      return preferences;
    },

    formatNum(num, leading = 2) {
      return this.formatNumberWithCommas(
        Number.parseFloat(num).toFixed(leading)
      );
    },
    formatNumberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    async fetchOpenSea(searchObj) {
      // if (searchObj.offset === -1) {searchObj.offset = this.currentOSOffSet + searchObj.limit} // Next
      // if (searchObj.offset === -2) {searchObj.offset = this.currentOSOffSet - searchObj.limit} // Prev

      var url = "https://api.opensea.io/api/v1/assets?";
      if (searchObj.urlcollection) {
        url = "https://api.opensea.io/api/v1/collections?";
      }
      if (searchObj.urlcontract) {
        url =
          "https://api.opensea.io/api/v1/asset_contract/" +
          searchObj.contractaddress;
      }
      if (searchObj.urlorders) {
        url =
          "https://api.opensea.io/wyvern/v1/orders?bundled=false&include_bundled=false&include_invalid=false";
      }
      if (searchObj.urlasset) {
        url =
          "https://api.opensea.io/api/v1/asset/" +
          searchObj.contractaddress +
          "/" +
          searchObj.token_id;
      }
      if (searchObj.urlhistory) {
        url =
          "https://api.opensea.io/api/v1/events?only_opensea=false&asset_contract_address=" +
          searchObj.contractaddress +
          "&token_id=" +
          searchObj.token_id;
      }
      if (searchObj.urlcollections) {
        url = "https://api.opensea.io/api/v1/collections?";
      }
      if (searchObj.urlevents) {
        url = "https://api.opensea.io/api/v1/events?";
      }

      if (searchObj.offset) {
        url += "&offset=" + searchObj.offset;
      }
      if (searchObj.limit) {
        url += "&limit=" + searchObj.limit;
      }
      if (searchObj.contract) {
        url += "&asset_contract_address=" + searchObj.contract;
      }
      if (searchObj.slug) {
        url += "&collection_slug=" + searchObj.slug;
      }
      if (searchObj.owner) {
        url += "&owner=" + searchObj.owner;
      }
      if (searchObj.asset_owner) {
        url += "&asset_owner=" + searchObj.asset_owner;
      }
      if (searchObj.side) {
        url += "&side=" + searchObj.side;
      }
      if (searchObj.is_english) {
        url += "&is_english=true";
      }
      if (searchObj.order) {
        url += "&order_by=" + searchObj.order;
      }
      console.log("OpenSea Fetch: " + url, searchObj);

      const response = await fetch(url);
      const res = await response.json();
      // console.log('OpenSea', res);
      return res;
    },
    rnd(n) {
      return Math.floor(Math.random() * n);
    },
  },
};
</script>
<style lang="scss">
.cb {
  clear: both;
}

.bgim {
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  background-size: cover;
}
</style>
