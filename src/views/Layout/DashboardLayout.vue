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
import ERC20ABI from "@/abis/erc20.json";
import ERC721ABI from "@/abis/erc721.json";
import EXCHANGEABI from "@/abis/Exchange.json";

import { gql } from "apollo-boost";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import { assetDataUtils } from "@0x/order-utils";
import { BigNumber } from "@0x/utils";

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

import { HttpClient } from "@0x/connect";
const DB_BASE_URL = "https://uns-backend.vercel.app/api/v3";
const SUBGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/zapaz/eip721-matic";
const SUBGRAPH_URL2 =
  "https://api.thegraph.com/subgraphs/name/tranchien2002/eip721-matic";

const EXCHANGE_ADDRESS = "0x1f98206be961f98d0c2d2e5f7d965244b2f2129a";

const httpLink = createHttpLink({ uri: SUBGRAPH_URL });
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
const client2 = new ApolloClient({
  link: createHttpLink({
    uri: SUBGRAPH_URL2,
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
      nedbNFTs: null,
      routeName: null,
      showSearch: false,

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

      orderbook: [],
      tempnfts: [],
      usernfts: [],
      userERC20s: [],
      userprefs: [],
      userSwapOptions: [],
      fillEvents: [],
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

    this.buildNEDB();
    console.log(this.nedbNFTs);

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
    buildNEDB() {
      this.nedbNFTs = new Datastore({ filename: "NFTs", autoload: true });
    },
    insertNEDB(x) {
      var self = this;
      return new Promise(function (resolve) {
        self.nedbNFTs.update({ _id: x._id }, x, { upsert: true }, () => {
          resolve(true);
        });
      });
    },
    queryNEDB(sea) {
      var self = this;
      return new Promise(function (resolve) {
        // console.log('SEA', sea);
        self.nedbNFTs
          .find(sea)
          .sort()
          .skip(0)
          .limit(100)
          .exec(function (err, docs) {
            resolve(docs);
          });
      });
    },
    async getContractTokensFromSubGraph2(
      contractAddress,
      limit = 10,
      offset = 0
    ) {
      const tokensQuery = `
        {
          tokenContract(id:"${contractAddress.toLowerCase()}") {
            id
            name
            numTokens
            numOwners
            tokens(first:${limit}, skip:${offset}) {
              id,
              contract {id, name, numTokens, numOwners, symbol}
              tokenID
              owner {id, numTokens}
              tokenURI
              mintTime
            }
          }
        }
      `;

      console.log(tokensQuery);
      const data = await client2.query({
        query: gql(tokensQuery),
      });
      console.log("Data: ", data);
      const tokenData = data.data.tokenContract.tokens;
      const nfts = await this.constructBundle2(tokenData);
      return {
        nfts: nfts,
        raw: data.data.tokenContract,
      };
    },
    async getUserTokensFromSubGraph2(userAddress, limit = 20, offset = 0) {
      const tokensQuery = `
        {
          owner(id:"${userAddress.toLowerCase()}") {
            id
            numTokens
            tokens(first:${limit}, skip:${offset}) {
              id,
              contract {id, name, numTokens, numOwners, symbol}
              tokenID
              owner {id, numTokens}
              tokenURI
              mintTime
            }
          }
        }
        `;
      console.log(tokensQuery);
      const data = await client2.query({
        query: gql(tokensQuery),
      });
      const tokenData = data.data.owner.tokens;
      const nfts = await this.constructBundle2(tokenData);
      return {
        nfts: nfts,
        raw: data.data.tokenContract,
      };
    },
    async constructBundle2(tokenData) {
      var bundle = [];
      await Promise.all(
        tokenData.map(async (d) => {
          var nft;
          // Check If we have it in cach
          var test = await this.queryNEDB({
            tokenID: d.tokenID,
            contract: d.contract.id,
          });
          if (test.length > 0) {
            nft = {
              contract: d.contract.id,
              tokenID: d.tokenID,
              owner: d.owner.id,
              tokenJSON: test[0].tokenJSON,
            };
          } else {
            console.log("New JSON Look Up");
            // If the subgraph doesn't give us the metadata, retrieve it manually
            var collection = new ethers.Contract(
              d.contract.id,
              ERC721ABI,
              this.signer
            );

            var tokenURI = await collection.tokenURI(d.tokenID);
            var res = await fetch(tokenURI);
            var tokenJSON = await res.json();

            nft = {
              contract: d.contract.id,
              tokenID: d.tokenID,
              owner: d.owner.id,
              tokenJSON: tokenJSON,
            };
            var toInsert = { ...nft };
            toInsert._id = ethers.utils.id(nft.contract + "/" + nft.tokenID);
            this.insertNEDB(toInsert);
          }
          bundle.push(nft);
        })
      );
      return bundle;
    },

    async getContract(collectionAddress) {
      // console.log('hello', );
      var collection = new ethers.Contract(
        collectionAddress,
        ERC721ABI,
        this.signer
      );
      var collectionName = await collection.name();
      var toret = {
        name: collectionName,
      };
      return toret;
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
    async loadNetwork() {
      this.network = await this.provider.getNetwork();
      this.blockNumber = await this.provider.getBlockNumber();

      this.orderbook = await this.getPreferences();
    },
    async loadUser() {
      this.userERC20s = await this.getUserERC20s(this.signeraddr);
      this.usernfts = await this.getUserTokensFromSubGraph(this.signeraddr);
      this.userprefs = this.queryOrderBook({
        makerAddress: this.signeraddr.toLowerCase(),
      });
      this.userSwapOptions = await this.getSwapOptions(this.usernfts);

      const exchange = new ethers.Contract(
        EXCHANGE_ADDRESS,
        EXCHANGEABI,
        this.signer
      );

      this.fillEvents = await exchange.queryFilter(
        exchange.filters.Fill(this.signeraddr),
        18900000
      );
      console.log(this.fillEvents);
    },
    async getContractsFromSubGraph(search, limit = 10) {
      const tokensQuery = `{
        alls(first: 5) {
          id
          numTokenContracts
          numTokens
          numOwners
        }
        tokenContracts(first:${limit}, where: {name_contains:"${search}"}) {
          id
          name
          numTokens
          numOwners
        }
      }`;
      console.log(tokensQuery);

      const data = await client2.query({
        query: gql(tokensQuery),
      });
      console.log("Graph2 res", data);
      return data;
    },
    async getCollectionFromSubGraph(
      contractAddress,
      startIndex = 0,
      amount = 5
    ) {
      const tokensQuery = `
          query {
          tokenContracts(where:{id:"${contractAddress.toLowerCase()}"}) {
            id
            name
            symbol
            tokens(first:${amount}, skip:${startIndex}) {
              id,
              contract {
                id
              },
              owner {
                id
              }
              tokenID
              tokenURI
            }
          }
        }
      `;

      const data = await client.query({
        query: gql(tokensQuery),
      });
      const tokenData = data.data.tokenContracts[0].tokens;

      const output = await this.constructBundle(tokenData);

      return {
        name: data.data.tokenContracts[0].name,
        symbol: data.data.tokenContracts[0].symbol,
        tokens: output,
      };
    },
    async getTokenFromSubgraph(contractAddress, tokenId) {
      const id = contractAddress.toLowerCase() + "_" + tokenId;

      const tokensQuery = `
          query {
            tokens(where:{ id:"${id}"}) {
              id
              contract {
                id
              }
              owner {
                id
              }
              tokenURI
            }
          }
        `;
      const data = await client.query({
        query: gql(tokensQuery),
      });
      const d = data.data.tokens[0];
      var res = await fetch(d.tokenURI);
      var tokenJSON = await res.json();

      const nft = {
        contract: d.contract.id,
        tokenID: tokenId,
        owner: d.owner.id,
        tokenJSON: tokenJSON,
      };

      return nft;
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
          decimals: await collection.decimals(),
          balance: await collection.balanceOf(userAddress),
        },
      ];
    },
    async getTokenFromSubgraph2(contractAddress, tokenId) {
      const id = contractAddress.toLowerCase() + "_" + tokenId;
      const tokensQuery = `
          query {
            tokens(where:{ id:"${id}"}) {
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
      console.log("ZZZ", output, data);
      console.log(tokensQuery);
      return output;
    },
    async getUserTokensFromSubGraph(userAddress, limit = 20, offset = 0) {
      const tokensQuery = `
          query {
          owners(where:{id:"${userAddress.toLowerCase()}"}) {
            id
            tokens(first:${limit}, skip:${offset}) {
              id,
              contract {
                id
              },
              owner {
                id
              }
              tokenID
              tokenURI
            }
          }
        }
        `;
      const data = await client.query({
        query: gql(tokensQuery),
      });

      return await this.constructBundle(data.data.owners[0].tokens);
    },
    async constructBundle(tokenData) {
      var bundle = [];
      await Promise.all(
        tokenData.map(async (d) => {
          var res = await fetch(d.tokenURI);
          var tokenJSON = await res.json();

          const nft = {
            contract: d.contract.id,
            tokenID: d.tokenID,
            owner: d.owner.id,
            tokenJSON: tokenJSON,
          };
          bundle.push(nft);
        })
      );
      return bundle;
    },

    queryOrderBook(requestOpts) {
      const addr = requestOpts.makerAddress.toLowerCase();
      var toret = this.orderbook.filter(
        (x) => x.signedOrder.makerAddress.toLowerCase() === addr
      );

      return toret;
    },
    async dataToBundle(assetData) {
      var inter = assetDataUtils.decodeMultiAssetData(assetData);
      const bundle = [];
      Promise.all(
        inter.nestedAssetData.map(async (x) => {
          if (x.slice(0, 10) === "0x02571792") {
            const bytes = assetDataUtils.decodeERC721AssetData(x);
            bundle.push(
              await this.getTokenFromSubgraph(
                bytes.tokenAddress,
                bytes.tokenId.toNumber().toString()
              )
            );
          } else {
            const bytes = assetDataUtils.decodeERC20AssetData(x);
            var collection = new ethers.Contract(
              "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", // WETH
              ERC20ABI,
              this.signer
            );
            bundle.push({
              address: bytes.tokenAddress,
              name: await collection.name(),
              decimals: await collection.decimals(),
              balance: await collection.balanceOf(this.signeraddr),
            });
          }
        })
      );

      return bundle;
    },
    queryOrderBook(owner) {
      var toret = this.orderbook.filter((x) => {
        return x.signedOrder.makerAddress.toLowerCase() === owner;
      });
      return toret;
    },
    async getPreferences(requestOpts) {
      var client = new HttpClient(DB_BASE_URL);
      var json = await client.getOrdersAsync(requestOpts);

      var orders = [];
      await Promise.all(
        json.records.map(async (signedOrder) => {
          const exchangeBundle = await this.dataToBundle(
            signedOrder.order.makerAssetData
          );
          const wishBundle = await this.dataToBundle(
            signedOrder.order.takerAssetData
          );

          orders.push({
            signedOrder: signedOrder.order,
            exchangeBundle: exchangeBundle,
            wishBundle: wishBundle,
          });
        })
      );

      return orders;
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
      const bundlesDBURI = DB_BASE_URL + "/options/" + encodedData;

      var res = await fetch(bundlesDBURI);
      var options = await res.json();

      var newChains = [];
      await Promise.all(
        options.map(async (chain) => {
          var orders = [];
          for (let i = 0; i < chain.length; i++) {
            var exchangeBundle = await this.dataToBundle(
              chain[i].makerAssetData
            );
            var wishBundle = await this.dataToBundle(chain[i].takerAssetData);

            orders.push({
              exchangeBundle: exchangeBundle,
              wishBundle: wishBundle,
              signedOrder: chain[i],
            });
          }
          newChains.push(orders);
        })
      );
      return newChains;
    },

    async signerIsApproved(contract) {
      var collection = new ethers.Contract(contract, ERC721ABI, this.signer);

      return await collection.isApprovedForAll(
        this.signeraddr,
        this.ERC721_PROXY_ADDRESS
      );
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
    async executeSwap(ringswap) {
      const exchange = new ethers.Contract(
        EXCHANGE_ADDRESS,
        EXCHANGEABI,
        this.signer
      );
      console.log("Executing", exchange, ringswap);

      exchange.batchFillOrders(
        ringswap.map((b) => b.signedOrder),
        ringswap.map((b) => b.signedOrder.takerAssetAmount),
        ringswap.map((b) => b.signedOrder.signature),
        {
          gasLimit: 10000000,
        }
      );
      console.log("Notify and refresh user NFTs", exchange);
      this.loadApp();
    },
    async deleteOrder(order) {
      const exchange = new ethers.Contract(
        EXCHANGE_ADDRESS,
        EXCHANGEABI,
        this.signer
      );
      const newOrder = {
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
      await exchange.cancelOrder(newOrder);
      this.$notify({
        type: "danger",
        message: "Deleted order",
      });
      this.$bvModal.hide("modalOffer");
      this.loadApp();
    },

    viewSwapChain(chain) {
      this.currentSwapChain = chain;
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

    formatAsset(nft) {
      return {
        token_id: nft.tokenID,
        image_url: nft.tokenJSON.image,
        image_preview_url: nft.tokenJSON.image,
        name: nft.tokenJSON.name,
        description: nft.tokenJSON.description,
        asset_contract: {
          address: nft.contract,
        },
        owner: {
          address: nft.owner,
        },
      };
    },
    formatAsset2(nft) {
      return {
        token_id: nft.tokenID,
        image_url: nft.tokenJSON.image,
        image_preview_url: nft.tokenJSON.image,
        name: nft.tokenJSON.name,
        description: nft.tokenJSON.description,
        asset_contract: {
          address: nft.contract,
        },
        owner: {
          address: nft.owner,
        },
      };
    },
    formatNum(num, leading = 2) {
      return this.formatNumberWithCommas(
        Number.parseFloat(num).toFixed(leading)
      );
    },
    formatNumberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    rnd(n) {
      return Math.floor(Math.random() * n);
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

.bgim {
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  background-size: cover;
}
</style>
