<template>
  <b-modal
    id="modalCreateOffer"
    style="background: #333"
    v-if="nft"
    size="lg"
    modal-classes="modal-danger"
    modal-content-classes="bg-gradient-danger"
  >
    <div class="py-3 text-center">
      <i class="ni ni-bell-55 ni-3x"></i>
      <h4 class="heading mt-4">Make an order</h4>
      <br />
      <b-tabs pills style="zzbackground: #ccc">
        <b-tab active>
          <template v-slot:title>
            <i class="ni ni-cloud-upload-96 mr-2"></i> Step 1 Enter your wish
          </template>
          <p class="p-3">Select one or several NFTs.</p>
          <b-card-group deck>
            <b-card
              v-for="(n, idx) in ownernfts"
              @click="addToWishBundle(n)"
              :key="'cp' + idx"
              :title="n.tokenJSON.name"
              :img-src="n.tokenJSON.image"
              img-alt="Image"
              img-top
              tag="article"
              style="max-width: 20rem; min-width: 10rem"
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
              v-for="(n, idx) in $parent.usernfts"
              @click="addToExchangeBundle(n)"
              :key="'cp' + idx"
              :title="n.tokenJSON.name"
              :img-src="n.tokenJSON.image"
              img-alt="Image"
              img-top
              tag="article"
              style="max-width: 20rem"
              class="mb-2"
            >
            </b-card>
          </b-card-group>
          <b-card-group deck>
            <b-card
              v-for="(n, idx) in $parent.userERC20s"
              @click="addToExchangeBundle(n)"
              :key="'cp' + idx"
              :title="n.symbol"
              tag="article"
              style="max-width: 20rem"
              class="mb-2"
            >
              <p>
                {{ parseInt(n.amount) / 10 ** parseInt(n.decimals) }}
              </p>
            </b-card>
          </b-card-group>
        </b-tab>
      </b-tabs>
      <hr />
      <b-row class="mt-5">
        <b-col xl="6" class="mb-5 mb-xl-0">
          <card header-classes="bg-transparent">
            <h3 slot="header" class="mb-0">
              You receive &nbsp;
              <b-button
                @click="clearWishBundle()"
                size="sm"
                variant="secondary"
              >
                Clear
              </b-button>
            </h3>
            <bundle :bundle="currentWishBundle" :root="$parent" />
          </card>
        </b-col>
        <b-col xl="6" class="mb-5 mb-xl-0">
          <card header-classes="bg-transparent">
            <h3 slot="header" class="mb-0">
              You give up&nbsp;
              <b-button
                @click="clearExchangeBundle()"
                size="sm"
                variant="secondary"
              >
                Clear
              </b-button>
            </h3>
            <bundle :bundle="currentExchangeBundle" :root="$parent" />
          </card>
        </b-col>
      </b-row>
    </div>
    <br />
    <template slot="modal-footer">
      <base-button
        :disabled="
          currentExchangeBundle.length > 0 && currentWishBundle.length > 0
            ? false
            : true
        "
        @click="generateSignature"
        type="success"
        >Make offer</base-button
      >
    </template>
  </b-modal>
</template>
<script>
import NftsTable from "@/views/Dashboard/NftsTable";
import { EXCHANGE_ADDRESS, DB_BASE_URL } from "@/views/Layout/DashboardLayout";
import Bundle from "@/components/UniSwan/Bundle";

import Web3 from "web3";
import { assetDataUtils, signatureUtils } from "@0x/order-utils";
import { BigNumber } from "@0x/utils";
import { MetamaskSubprovider } from "@0x/subproviders";
import { HttpClient } from "@0x/connect";

export default {
  name: "create-order-modal",
  props: ["nft", "ownernfts"],
  components: {
    Bundle,
    NftsTable,
  },
  data() {
    return {
      initialWish: null,
      currentExchangeBundle: [],
      currentWishBundle: [],
    };
  },
  methods: {
    async loadPage() {
      this.currentExchangeBundle = [];
      this.currentWishBundle = [];
      if (this.initialWish) {
        this.addToWishBundle(this.initialWish.tokenID);
      }
    },
    async addToExchangeBundle(asset) {
      if (asset.tokenJSON) {
        var alreadyAdded = this.currentExchangeBundle.find(
          (x) => x.tokenID === asset.tokenID && x.contract === asset.contract
        );
        if (!alreadyAdded) this.currentExchangeBundle.push(asset);
      } else {
        var alreadyAdded = this.currentExchangeBundle.find(
          (x) => x.address === asset.address
        );
        if (!alreadyAdded) this.currentExchangeBundle.push(asset);
      }
    },
    async addToWishBundle(asset) {
      if (asset.tokenJSON) {
        var alreadyAdded = this.currentWishBundle.find(
          (x) => x.tokenID === asset.tokenID && x.contract === asset.contract
        );
        if (!alreadyAdded) this.currentWishBundle.push(asset);
      } else {
        var alreadyAdded = this.currentWishBundle.find(
          (x) => x.address === asset.address
        );
        if (!alreadyAdded) this.currentWishBundle.push(asset);
      }
    },
    async clearExchangeBundle() {
      this.currentExchangeBundle = [];
    },
    async clearWishBundle() {
      this.currentWishBundle = [];
    },
    async generateSignature() {
      const [haveAmounts, haveAssetData] = this.$parent.bundleToData(
        this.currentExchangeBundle
      );
      const [wantAmounts, wantAssetData] = this.$parent.bundleToData(
        this.currentWishBundle
      );

      const salt = new BigNumber(new Date().getTime()).toString();
      const order = {
        chainId: 137,
        exchangeAddress: EXCHANGE_ADDRESS,
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
        makerFeeAssetData: "0x",
        takerFeeAssetData: "0x",
      };
      const provider = new MetamaskSubprovider(
        "ethereum" in window ? window["ethereum"] : Web3.givenProvider
      );
      const signedOrder = await signatureUtils.ecSignOrderAsync(
        provider,
        order,
        this.$parent.signeraddr
      );

      console.log("order", signedOrder);

      var self = this;

      var c = new HttpClient(DB_BASE_URL);
      await c.submitOrderAsync(signedOrder).then(async (res) => {
        self.$parent.userprefs = await self.$parent.getOrdersFromDB({
          makerAddress: self.$parent.signeraddr,
        });

        this.$bvModal.hide("modalCreateOffer");
        this.$notify({
          type: "danger",
          message: "Made new order",
        });
      });
    },
  },
  watch: {
    nft: function () {
      this.loadPage();
    },
  },
};
</script>
<style>
#modalCreateOffer .modal-content {
  background: #eee;
}
.btnDisabled {
  background: #333;
}
</style>
