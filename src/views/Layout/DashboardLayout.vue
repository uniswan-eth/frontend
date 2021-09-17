<template>
  <div class="wrapper" v-if="pageloaded">
    <notifications></notifications>
    <order-modal :order="currentOrder"></order-modal>
    <create-order-modal :nft="newOrderNFT" :ownernfts="newOrderOwnerNFTs"></create-order-modal>
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

const DB_BASE_URL = "https://uns-backend.vercel.app/api/v3";
const SUBGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/tranchien2002/eip721-matic";
const EXCHANGE_ADDRESS = "0x1f98206be961f98d0c2d2e5f7d965244b2f2129a";
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
      savedNFTs: [],
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
      uniSwanUsers: [],
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
    async getContractTokensFromNFTPort(contractAddress, pageSize = 10, pageNumber = 1) {
      var nfts = await this.getNFTsFromAPI('nfts/'+contractAddress, pageSize, pageNumber)
      // console.log('By Contract', nfts);
      var res = await this.normalizeNFTs(nfts);
      return res
    },
    async getUserTokensFromNFTPort(accountAddress, pageSize = 10, pageNumber = 1) {
      var nfts = await this.getNFTsFromAPI('account/'+accountAddress+'/nfts', pageSize, pageNumber)
      console.log('User NFTs', accountAddress, nfts);
      var res = await this.normalizeNFTs(nfts);
      return res
    },
    // async getNFTsFromAPI(contract, tokenId, pageSize = 10, pageNumber = 1) {
    async getNFTsFromAPI(path, pageSize = 10, pageNumber = 1) {
      // console.log('Path', path);
      var res = await this.NFTPortAPI(
        // 'nfts/' + contract + (tokenId ? '/'+tokenId : ''),
        path,
        '', pageSize, pageNumber
      )
      if (!res || res.length === 0 || res.error) { return [] }
      var toret = []

      if (res.nft) {
        toret.push(res.nft)
      } else {
        await Promise.all(
          res.nfts.map(async x => {
            var nft = await this.NFTPortAPI(
              'nfts/'+x.contract_address + '/' + x.token_id,
              ''
            )
            if (nft) {
              toret.push(
                nft
              )
            } else {
              console.log('Err fetching', x);
            }
          })
        )
      }
      return toret
    },
    normalizeNFTs(nfts) {
      var toret = []
      nfts.map(x => {
        if (x) {
          if (!x.nft) {x.nft = x}
          var nft = {
            contract: x.nft.contract_address,
            tokenID: x.nft.token_id,
            owner: null, // x.owner.id,
            tokenJSON: x.nft.metadata,
          }
          if (x.nft.cached_image_url) {
            nft.tokenJSON.image = x.nft.cached_image_url
          }
          toret.push(nft)
        }
      })
      return toret;
    },
    async NFTPortAPI(addUrl, urlParams, pageSize = 10, pageNumber = 1) {
      try {
        var url = "https://api.nftport.xyz/"+addUrl+"?chain=polygon&page_number="+pageNumber+"&page_size="+pageSize+urlParams
        // console.log('NFTPort URL', url);
        var resp = await fetch(url, {
          "method": "GET",
          "headers": {
            "Content-Type": "application/json",
            "Authorization": "150f5df4-cf22-4bbd-9c58-93e4cac2582b"
          }
        })
        var toret = await resp.json()
        // console.log('RES', toret);
        if (!toret.error) {
          return toret
        } else {
          return null
        }
      } catch (e) {
        console.log(e);
        return []
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
      this.orderbook.map(x => {
        if (!this.uniSwanUsers.includes(x.signedOrder.makerAddress.toLowerCase())) {
          this.uniSwanUsers.push(x.signedOrder.makerAddress.toLowerCase())
        }
      })
    },
    async loadUser() {
      this.savedNFTs = await this.queryNEDB({}, this.nedbSaved)
      this.userERC20s = await this.getUserERC20s(this.signeraddr);
      this.usernfts = (
        await this.getUserTokensFromSubGraph(this.signeraddr)
      ).nfts;
      // console.log('User NFTS', this.usernfts);
      this.userprefs = await this.getOrdersFromDB({
        makerAddress: this.signeraddr.toLowerCase(),
      });
      await Promise.all(
        this.usernfts.map(async x => {
          var temp = await this.getSwapOptions([x])
          this.userSwapOptions.push(...temp)
        })
      )
      const exchange = new ethers.Contract(
        EXCHANGE_ADDRESS,
        EXCHANGEABI,
        this.signer
      );
      var blockNumber = await this.provider.getBlockNumber();
      this.fillEvents = await exchange.queryFilter(
        exchange.filters.Fill(),
        blockNumber - 990
        // 18900000
      );
    },
    buildNEDB() {
      this.nedbNFTs = new Datastore({ filename: "NFTs", autoload: true });
      this.nedbSaved = new Datastore({ filename: "Saved", autoload: true });
    },
    insertNEDB(x, db = this.nedbNFTs) {
      var self = this;
      return new Promise(function (resolve) {
        db.update({ _id: x._id }, x, { upsert: true }, () => {
          resolve(true);
        });
      });
    },
    queryNEDB(sea, db = this.nedbNFTs) {
      var self = this;
      return new Promise(function (resolve) {
        db
        .find(sea)
        .sort()
        .skip(0)
        .limit(100)
        .exec(function (err, docs) {
          resolve(docs);
        });
      });
    },
    async checkSaved(nft) {
      var saved = await this.queryNEDB({
        tokenID: nft.tokenID,
        contract: nft.contract,
      }, this.nedbSaved);
      return saved
    },
    async removeSavedNFT(nft) {
      var self = this
      var id = ethers.utils.id('nft/'+nft.contract + "/" + nft.tokenID);
      this.nedbSaved.remove({ _id: id }, {}, async () => {
        self.savedNFTs = await self.queryNEDB({}, self.nedbSaved)
      });
    },
    async saveNFT(nft) {
      var toInsert = { ...nft };
      toInsert._id = ethers.utils.id('nft/'+nft.contract + "/" + nft.tokenID);
      await this.insertNEDB(toInsert, this.nedbSaved)
      this.savedNFTs = await this.queryNEDB({}, this.nedbSaved)
    },
    async getOrdersFromDB(requestOpts) {
      var orderClient = new HttpClient(DB_BASE_URL);
      var json = await orderClient.getOrdersAsync(requestOpts);
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
          new BigNumber(NFTs[i].tokenID)
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
    async getContract(collectionAddress) {
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
          balance: await collection.balanceOf(userAddress),
        },
      ];
    },
    async getTokenFromSubgraph(contractAddress, tokenId) {
      const id = contractAddress.toLowerCase() + "_" + tokenId;

      const tokensQuery = `
      query {
        tokens(where:{ id:"${id}"}) {
          id
          contract {
            id
            name
            numTokens
            numOwners
          }
          owner {
            id
            numTokens
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

      return {
        nft:nft,
        raw:data
      }
    },
    async getContractFromSubGraph(
        contractAddress
      ) {
      const tokensQuery = `
        {
          tokenContract(id:"${contractAddress.toLowerCase()}") {
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
      return {
        raw: data.data.tokenContract,
      };
    },
    async getContractTokensFromSubGraph(
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
      const data = await client.query({
        query: gql(tokensQuery),
      });
      const tokenData = data.data.tokenContract.tokens;
      const nfts = await this.constructBundle(tokenData);
      return {
        nfts: nfts,
        raw: data.data.tokenContract,
      };
    },
    async getUserTokensFromSubGraph(userAddress, limit = 20, offset = 0) {
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
      const data = await client.query({
        query: gql(tokensQuery),
      });

      var nfts = []
      await Promise.all(
        data.data.owner.tokens.map(async x => {
          var nft = await this.getNFTsFromAPI('nfts/'+x.contract.id+'/'+x.tokenID)
          if (nft[0]) {
            nfts.push(
              this.normalizeNFTs(nft)[0]
            )
          } else {
            // FIXME: Need to get data an alternative way
            const nftAlt = await this.constructBundle([x]);
            if (nftAlt[0]) {
              nfts.push(
                nftAlt[0]
              )
            } else {
              console.log('Missing NFT', x);
            }
          }
        })
      )
      // const tokenData = data.data.owner.tokens;
      // const nfts = await this.constructBundle(tokenData);

      return {
        nfts: nfts,
        raw: data.data.owner,
      };
    },
    async getContractsFromSubGraph(search, limit = 10) {
      const tokensQuery = `{
        tokenContracts(first:${limit}, where: {name_contains:"${search}"}) {
          id
          name
          numTokens
          numOwners
        }
      }`;

      const data = await client.query({
        query: gql(tokensQuery),
      });
      return data;
    },
    async dataToBundle(assetData) {
      var inter = assetDataUtils.decodeMultiAssetDataRecursively(assetData);
      const bundle = [];

      for (let i = 0; i < inter.nestedAssetData.length; i++) {
        const bytes = inter.nestedAssetData[i];
        if (bytes.assetProxyId === "0x94cfcdd7") {
          var collection = new ethers.Contract(
            "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", // WETH
            ERC20ABI,
            this.signer
          );
          bundle.push({
            address: bytes.tokenAddress,
            name: await collection.name(),
            symbol: await collection.symbol(),
            decimals: await collection.decimals(),
            balance: inter.amounts[i],
          });
        } else {
          var result = await this.getTokenFromSubgraph(
           bytes.tokenAddress,
           bytes.tokenId.toNumber().toString()
          )
          bundle.push(
            result.nft
          );
        }
      }

      return bundle;
    },
    async constructBundle(tokenData) {
      var bundle = [];
      await Promise.all(
        tokenData.map(async (d) => {
          try {
            var nft;
            // Check If we have it in cach
            var test = await this.queryNEDB({
              tokenID: d.tokenID,
              contract: d.contract.id,
            });
            console.log(d, test);
            if (test.length > 0) {
              nft = {
                contract: d.contract.id,
                tokenID: d.tokenID,
                owner: d.owner.id,
                tokenJSON: test[0].tokenJSON,
              };
            } else {
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
          } catch (e) {
            console.log('err', e);
          }
        })
      );
      return bundle;
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
      this.currentOrder = order;
    },
    createOrder(nft, ownerNFTs) {
      this.newOrderNFT = nft;
      this.newOrderOwnerNFTs = ownerNFTs.nfts;
    },
    async fetchOpenSea(searchObj) {
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

      const response = await fetch(url);
      const res = await response.json();
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
