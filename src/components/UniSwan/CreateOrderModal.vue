<template>
  <b-modal id="modalCreateOffer"
    v-if="nft"
    size="lg"
    modal-classes="modal-danger"
    modal-content-classes="bg-gradient-danger">
    <div class="py-3 text-center">
      <i class="ni ni-bell-55 ni-3x"></i>
      <h4 class="heading mt-4">Make an order</h4>
      <br>
      <b-tabs pills style="zzbackground:#ccc;">
        <b-tab active>
          <template v-slot:title>
            <i class="ni ni-cloud-upload-96 mr-2"></i> Step 1 Enter your wish
          </template>
          <p class="p-3">
            Select one or several NFTs.
          </p>
          <b-card-group deck>
            <b-card
              v-for="(n,idx) in ownernfts"
              @click="addToWishBundle(n)"
              :key="'cp'+idx"
              :title="n.tokenJSON.name"
              :img-src="n.tokenJSON.image"
              img-alt="Image"
              img-top
              tag="article"
              style="max-width: 20rem;min-width: 10rem;"
              class="mb-2"
              >
            </b-card>
          </b-card-group>
        </b-tab>
        <b-tab>
          <template v-slot:title>
            <i class="ni ni-bell-55 mr-2"></i> Step 2 Enter exchange
          </template>
          <p class="p-3">
            Select one or several NFTs you are willing to give in return.
          </p>
          <b-card-group deck>
            <b-card
              v-for="(n,idx) in $parent.usernfts"
              @click="addToExchangeBundle(n)"
              :key="'cp'+idx"
              :title="n.tokenJSON.name"
              :img-src="n.tokenJSON.image"
              img-alt="Image"
              img-top
              tag="article"
              style="max-width: 20rem;"
              class="mb-2"
              >
            </b-card>
          </b-card-group>
        </b-tab>
      </b-tabs>

      <b-row class="mt-5">
        <b-col xl="6" class="mb-5 mb-xl-0">
          <h4>Wish</h4>
          <bundle :bundle="currentWishBundle" :root="$parent"/>
        </b-col>
        <b-col xl="6" class="mb-5 mb-xl-0">
          <h4>Exchange</h4>
          <bundle :bundle="currentExchangeBundle" :root="$parent"/>
        </b-col>
      </b-row>

    </div>
    <br>
    <template slot="modal-footer">
      <base-button
        :disabled="currentExchangeBundle.length > 0 && currentWishBundle.length > 0 ? false : true"
        @click="generateSignature"
        type="success">Make offer</base-button>
    </template>
  </b-modal>
</template>
<script>
  import NftsTable from '@/views/Dashboard/NftsTable';
  import Bundle from '@/components/UniSwan/Bundle';

  import Web3 from "web3";
  import {
    assetDataUtils,
    signatureUtils,
    orderHashUtils,
  } from "@0x/order-utils";
  import { BigNumber } from "@0x/utils";
  import { MetamaskSubprovider } from "@0x/subproviders";
  import axios from "axios";
  const DB_BASE_URL = "https://uns-backend.vercel.app/api/";

  export default {
    name: 'order-modal',
    props: ["nft", "ownernfts"],
    components: {
      Bundle,
      NftsTable
    },
    data() {
      return {
        initialWish:null,
        currentExchangeBundle: [],
        currentWishBundle: [],
        wishTokenId: null,
        exchangeTokenId: null,
      }
    },
    methods: {
      async loadPage() {
        if (this.initialWish) {
          this.addToWishBundle(this.initialWish.tokenID);

          // Get Counterpartys assets
          this.counterPartyNFTs = await this.root.getUserNFTsByCollection(
            this.root.nonFungibleMaticV2Address,
            this.initialWish.owner
          );
        }
      },
      async addToExchangeBundle(nft) {
        var test = this.currentExchangeBundle.filter(x => {return x.tokenID === nft.tokenID && x.contract === nft.contract})
        if (test.length === 0)
          this.currentExchangeBundle.push(nft)
      },
      async addToWishBundle(nft) {
        var test = this.currentWishBundle.filter(x => {return x.tokenID === nft.tokenID && x.contract === nft.contract})
        if (test.length === 0)
          this.currentWishBundle.push(
            nft
          )
      },
      async clearExchangeBundle() {
        this.currentExchangeBundle = [];
      },
      async clearWishBundle() {
        this.currentWishBundle = [];
      },
      encodeAssets(bundle) {
        let amounts = [];
        let assetDatas = [];
        for (let i = 0; i < bundle.length; i++) {
          let assetData = assetDataUtils.encodeERC721AssetData(
            bundle[i].contract,
            bundle[i].tokenID
          );
          amounts.push(new BigNumber(1));
          assetDatas.push(assetData);
        }
        return [amounts, assetDatas];
      },
      async generateSignature() {
        const [haveAmounts, haveAssetData] = this.encodeAssets(
          this.currentExchangeBundle
        );
        const [wantAmounts, wantAssetData] = this.encodeAssets(
          this.currentWishBundle
        );
        const salt = new BigNumber(new Date().getTime()).toString();
        const order = {
          exchangeAddress: "0x2682798109c35310B76db070b98Fc21833DCAA61",
          makerAddress: this.$parent.signeraddr,
          takerAddress: "0x0000000000000000000000000000000000000000",
          feeRecipientAddress: "0x0000000000000000000000000000000000000000",
          senderAddress: "0x0000000000000000000000000000000000000000",
          makerAssetAmount: "1",
          takerAssetAmount: "1",
          makerFee: "0",
          takerFee: "0",
          expirationTimeSeconds: "3620442933",
          salt: salt,
          makerAssetData: assetDataUtils.encodeMultiAssetData(
            haveAmounts,
            haveAssetData
          ),
          takerAssetData: assetDataUtils.encodeMultiAssetData(
            wantAmounts,
            wantAssetData
          ),
        };
        const provider = new MetamaskSubprovider(
          "ethereum" in window ? window["ethereum"] : Web3.givenProvider
        );
        const orderHashHex = orderHashUtils.getOrderHashHex(order);
        const signature = await signatureUtils.ecSignHashAsync(
          provider,
          orderHashHex,
          this.$parent.signeraddr
        );
        var self = this
        axios
          // .post(DB_BASE_URL + "preferences/add", { order, signature })
          .post(DB_BASE_URL + "orders/add", { order, signature })
          .then(async (res) => {
            self.$parent.userprefs = await self.$parent.getPreferences(self.$parent.signeraddr)
            console.log(res.data, self.$parent.userprefs);
            this.$bvModal.hide('modalCreateOffer')
            this.$notify({
              type: 'danger',
              message: 'Made new order'
            })
          });
      },
    }
  }
</script>
<style>
.btnDisabled {
  background: #333;
}
</style>
