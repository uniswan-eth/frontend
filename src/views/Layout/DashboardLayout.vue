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
            name: 'My NFTs',
            path: '/account/'+signeraddr+'',
            icon: 'ni ni-ui-04 text-primary',
          }"
        ></sidebar-item>
        <sidebar-item
        :link="{
          name: 'My offers',
          path: '/account/'+signeraddr+'?tab=offers',
          icon: 'ni ni-single-02 text-primary',
          }"
          ></sidebar-item>
        <sidebar-item
          :link="{
            name: 'My swap options',
            path: '/account/'+signeraddr+'?tab=options',
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
            path: '/account/'+signeraddr+'?tab=history',
            icon: 'ni ni-calendar-grid-58 text-primary',
          }"
        ></sidebar-item>
        <sidebar-item
        :link="{
          name: 'NFT Exlorer',
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


        <!-- <sidebar-item
            :link="{
              name: 'Icons',
              path: '/icons',
              icon: 'ni ni-planet text-blue'
              }"
            >
        </sidebar-item> -->

        <!-- <sidebar-item
              :link="{
                name: 'Maps',
                path: '/maps',
                icon: 'ni ni-pin-3 text-orange'
              }">
        </sidebar-item>

        <sidebar-item
              :link="{
                name: 'User Profile',
                path: '/profile',
                icon: 'ni ni-single-02 text-yellow'
                }">
        </sidebar-item>

        <sidebar-item
                :link="{
                  name: 'Tables',
                  path: '/tables',
                  icon: 'ni ni-bullet-list-67 text-red'
                }">
        </sidebar-item>

        <sidebar-item
                  :link="{
                    name: 'Login',
                    path: '/login',
                    icon: 'ni ni-key-25 text-info'
                  }">
        </sidebar-item>
        <sidebar-item
                  :link="{
                    name: 'Register',
                    path: '/register',
                    icon: 'ni ni-circle-08 text-pink'
                  }">
        </sidebar-item> -->
      </template>

      <!-- <template slot="links-after">
        <hr class="my-3">
        <h6 class="navbar-heading p-0 text-muted">dfddffdDocumentation</h6>

        <b-nav class="navbar-nav mb-md-3">
          <b-nav-item>
            <router-link :to="'/about'">
              <i class="ni ni-spaceship"></i>
              <b-nav-text class="p-0">Getting started</b-nav-text>
            </router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link :to="'/about'">
              FAQ
            </router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link :to="'/about'">
              How it works
            </router-link>
          </b-nav-item>
          <b-nav-item href="https://www.creative-tim.com/learning-lab/bootstrap-vue/colors/argon-dashboard">
              <i class="ni ni-palette"></i>
              <b-nav-text class="p-0">Foundation</b-nav-text>
          </b-nav-item>
          <b-nav-item href="https://www.creative-tim.com/learning-lab/bootstrap-vue/avatar/argon-dashboard">
              <i class="ni ni-ui-04"></i>
              <b-nav-text class="p-0">Components</b-nav-text>
          </b-nav-item>
        </b-nav>
      </template> -->
    </side-bar>
    <div class="main-content">
      <dashboard-navbar :type="$route.meta.navbarType"></dashboard-navbar>

      <div @click="$sidebar.displaySidebar(false)">
        <!-- <div style="background:#ccc;height:200px;">
          <br><br><br><br>
          <pre>{{currentOrder}}</pre>
        </div> -->
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <!-- your content here -->
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
  import UNISWANABI from "@/abis/uniswan.json";

  import { assetDataUtils, orderHashUtils } from "@0x/order-utils";
  import { BigNumber } from "@0x/utils";
  import EXCHANGEABI from "@/abis/Exchange.json";
  const DB_BASE_URL = "https://uns-backend.vercel.app/api/";

  /* eslint-disable no-new */
  import PerfectScrollbar from 'perfect-scrollbar';
  import 'perfect-scrollbar/css/perfect-scrollbar.css';

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

  import DashboardNavbar from './DashboardNavbar.vue';
  import ContentFooter from './ContentFooter.vue';
  import DashboardContent from './Content.vue';
  import { FadeTransition } from 'vue2-transitions';
  import { ethers } from "ethers";
  import makeBlockie from 'ethereum-blockies-base64';

  import OrderModal from '@/components/UniSwan/OrderModal';
  import CreateOrderModal from '@/components/UniSwan/CreateOrderModal';
  import SwapChainModal from '@/components/UniSwan/SwapChainModal';

  export default {
    components: {
      SwapChainModal,
      CreateOrderModal,
      OrderModal,
      DashboardNavbar,
      ContentFooter,
      DashboardContent,
      FadeTransition
    },
    data() {
      return {
        ERC721_PROXY_ADDRESS: "0x7931459d633a9639F26e851c9E63D30388957B60",
        UniSwanContractAddressV2: "0x451A66fe66495A36973Bb8FA181AE1214Cac492f",
        nonFungibleMaticV2Address: "0x36a8377e2bb3ec7d6b0f1675e243e542eb6a4764",
        access: false,
        acl: [
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
        currentOrder: null,
        newOrderNFT: null,
        newOrderOwnerNFTs: null,
        currentSwapChain: null,
        preferences: [],
        // dummyMainUser: '0x1ed72df72bbc87406d66659d5f7b8dc3c4dcfb5a',

        currentNftSwapOptions: [],

        provider: null,
        network:null,
        blockNumber:null,
        signer: null,
        signeraddr: null,
        signerblockie: null,
        makeBlockie: makeBlockie,
        pageloaded: false,
      }
    },
    async mounted() {
      // this.initScrollbar()
      await window.ethereum.enable();
      var self = this
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.provider.on("block", (blockNumber) => {
        // Emitted on every block change
        // console.log('New Block', blockNumber);
        this.blockNumber = blockNumber
      })
      window.ethereum.on('accountsChanged', function (accounts) {
        // Time to reload your interface with accounts[0]!
        // console.log('New Account', accounts);
        self.loadUser()
      })
      window.ethereum.on('networkChanged', function (networkId) {
            // Time to reload your interface with the new networkId
            // console.log('New Network', networkId);
            self.loadNetwork()
          })
      this.loadApp()
    },
    methods: {
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
          }
        }
      },
      nftSwapOptions(nft) {
        this.currentNftSwapOptions = []
        // const bundle = [nfts[i]];
        const bundle = [nft];
        console.log('hello', nft, bundle);
        let wantAssetData = [];
        let wantAssetAmounts = [];
        for (let i = 0; i < bundle.length; i++) {
          let assetData = assetDataUtils.encodeERC721AssetData(
            bundle[i].contract,
            bundle[i].tokenID
          );
          wantAssetData.push(assetData);
          wantAssetAmounts.push(new BigNumber(1));
        }
        var encodedData = assetDataUtils.encodeMultiAssetData(
          wantAssetAmounts,
          wantAssetData
        );
        for (let j = 0; j < this.preferences.length; j++) {
          if (this.preferences[j].takerAssetData === encodedData) {
            var chain = [this.preferences[j]];
            // this.userSwapOptions.push(chain);
            this.currentNftSwapOptions.push(chain);
            this.buildSwapChain(chain);
          }
        }
        return {...this.currentNftSwapOptions}
      },
      async buildSwapChain(chain) {
        for (let i = 0; i < this.preferences.length; i++) {
          if (
            this.preferences[i].signedOrder.order.takerAssetData ===
            chain[chain.length - 1].signedOrder.order.makerAssetData
          ) {
            var newChain = [...chain, this.preferences[i]];
            this.currentNftSwapOptions.push(chain);
            // this.userSwapOptions.push(newChain);
            if (newChain.length <= 4) this.buildSwapChain(newChain);
          }
        }
      },
      viewSwapChain(chain) {
        console.log('Modal chin', chain);
        this.currentSwapChain = chain
      },
      async executeSwap(ringswap) {
        const exchange = new ethers.Contract(
          "0x2682798109c35310B76db070b98Fc21833DCAA61",
          EXCHANGEABI,
          this.signer
        );
        console.log('Executing', exchange, ringswap);
        exchange.batchFillOrders(
          ringswap.map((b) => b.signedOrder.order),
          ringswap.map((b) => b.signedOrder.order.takerAssetAmount),
          ringswap.map((b) => b.signedOrder.signature)
        );
        // this.$parent.currentRingSwap = null;
      },
      viewOrder(order) {
        console.log('Modal', order);
        this.currentOrder = order
      },
      createOrder(nft, ownerNFTs) {
        console.log('Modal', nft);
        this.newOrderNFT = nft
        this.newOrderOwnerNFTs = ownerNFTs
      },
      async loadApp() {
        this.access = false;
        this.signer = this.provider.getSigner();
        this.signeraddr = await this.signer.getAddress();

        if (this.acl.includes(this.signeraddr)) {
          this.access = true;
        }
        console.log(this.access);
        if (this.access) {

          this.preferences = await this.getPreferences()
          await this.loadUser()
          await this.loadNetwork()
          this.pageloaded = true
        }
      },
      initScrollbar() {
        let isWindows = navigator.platform.startsWith('Win');
        if (isWindows) {
          initScrollbar('sidenav');
        }
      },
      async loadUser() {
        this.signerblockie = makeBlockie("0x4f5F6D3c7e8aDef6be8e51288F098d440bAc12ec")

        // this.UniSwanContractV2 = new ethers.Contract(
        //   this.UniSwanContractAddressV2,
        //   UNISWANABI,
        //   this.signer
        // );

        this.usernfts = await this.getUserNFTsByCollection(this.nonFungibleMaticV2Address, this.signeraddr)
        this.userprefs = await this.getPreferences(this.signeraddr)
        // console.log(this.userprefs);
      },
      async loadNetwork() {
        this.network = await this.provider.getNetwork()
        this.blockNumber = await this.provider.getBlockNumber()
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
          var signerApprovedForCollection;
          var owner = await collection.ownerOf(tokenId);
          signerApprovedForCollection = await collection.isApprovedForAll(
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
      async OLDgetNFT(contractAddress, tokenId) {
        // See if we have in temp
        var toret = this.tempnfts.filter((x) => {
          // console.log('Test Temp Match', x.contract === collectionAddress && x.tokenID === tokenId.toNumber(), x.tokenID, tokenId);
          // FIXME: Does properly compare tokenIDs!!
          return x.contract === contractAddress && x.tokenID === tokenId;
        })[0];
        if (!toret) {
          var prov = this.signer ? this.signer : this.provider;
          var collection = new ethers.Contract(
            contractAddress,
            ERC721ABI,
            prov
          );

          // FIXME: Is this correct?
          var signerApprovedForCollection
          var owner = await collection.ownerOf(tokenId);
          // if (this.signeraddr === owner) {
            signerApprovedForCollection = await collection.isApprovedForAll(
              this.signeraddr,
              this.UniSwanContractAddressV2
            );
          // } else {signerApprovedForCollection = null}

          var tokenURI = await collection.tokenURI(tokenId);
          var res = await fetch(tokenURI);
          var tokenJSON = await res.json();

          toret = {
            contract: contractAddress,
            tokenID: tokenId,
            owner: owner,
            tokenJSON: tokenJSON,
            signerApprovedForCollection: signerApprovedForCollection,
          };
          // console.log('New NFT in temp: '+toret.tokenJSON.name +' #'+toret.tokenID);
          this.tempnfts.push(toret);
        }

        return toret;
      },
      async getUserNFTsByCollection(contractAddress, user) {
        this.userNFTs = [];

        var collection = new ethers.Contract(
          contractAddress,
          ERC721ABI,
          this.signer
        );

        var nfts = [];
        var tokenIndexes = await collection.balanceOf(user);
        var results = tokenIndexes > 19 ? 20 : tokenIndexes;
        var loop = [];
        for (var i = 0; i < results; i++) {
          loop.push(i);
        }

        await Promise.all(
          loop.map(async (x) => {
            var tokenId = await collection.tokenOfOwnerByIndex(user, x);
            nfts.push(await this.getNFT(contractAddress, tokenId));
          })
        );

        return nfts;
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
        return this.formatNumberWithCommas(Number.parseFloat(num).toFixed(leading))
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
        return Math.floor(Math.random()*n)
      },

    }
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
