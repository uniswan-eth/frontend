<template>
  <div class="">
    <div v-if="display === 'card'" class="nftcard">
      <b-card
        :title="nft.tokenJSON.image"
        :img-src="nft.tokenJSON.image"
        :img-alt="nft.tokenJSON.image"
        img-top
        tag="article"
        style="max-width: 20rem"
        class="mb-2"
      >
        <b-card-text>
          {{ nft.tokenJSON.description }}
        </b-card-text>
        <b-button href="javascript:;" variant="primary">Go somewhere</b-button>
      </b-card>
    </div>
    <div class="nftHolder" v-if="display === 'medium'">
      <div
        v-if="!idx || idx === 0"
        class=""
        style="font-size: 12px; padding-bottom: 10px; padding-left: 5px"
      >
        {{ nft.tokenJSON.name }}
      </div>
      <div v-if="!idx || idx === 0" class="bundleHeader">
        <slot v-if="!idx || idx === 0" name="nftHeader"></slot>
      </div>
      <router-link :to="'/nft/' + nft.contract + '/' + nft.tokenID">
        <div
          :style="{
            marginLeft:
              idx > 1 ? (idx - 1) * 30 + 'px' : idx === 1 ? '5px' : '0px',
            backgroundImage: 'url(' + nft.tokenJSON.image + ')',
          }"
          :class="['imgHolder', 'bgim', idx > 0 ? 'small' : '']"
        ></div>
      </router-link>
      <div
        v-if="!idx || idx === 0"
        class=""
        style="font-size: 12px; padding-top: 3px; padding-left: 5px"
      >
        <account-card :address="nft.owner" :root="root" />
      </div>
    </div>
    <div v-if="!display" class="nft1Holder">
      <div
        @click="$router.push('/nft/' + nft.contract + '/' + nft.tokenID)"
        :key="'wish' + idx"
        :style="{
          height: '50px',
          width: '50px',
          backgroundImage: 'url(' + nft.tokenJSON.image + ')',
        }"
        class="img1Holder"
      ></div>
      <div style="float: left">
        <b>
          {{ nft.tokenJSON.name }}
        </b>
      </div>
      <div class="cb"></div>
    </div>
  </div>
</template>
<script>
import AccountCard from "@/components/UniSwan/AccountCard";
export default {
  name: "nft-card",
  props: ["nft", "display", "root", "idx"],
  components: {
    AccountCard,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style>
.blockie2 {
  margin-top: -4px !important;
  margin-right: 5px;
}

.innerBody {
  padding: 6px;
}
.bundleHeader {
  margin-left: 7px;
  margin-bottom: -35px;
}
.nft1Holder {
  background: #eee;
  padding: 7px;
  padding-right: 10px;
  margin-bottom: 5px;
  border-radius: 5px;
  /* margin-left: 0px; */
}
.img1Holder {
  float: left;
  margin-right: 5px;
  height: 150px;
  width: 150px;
  border: 3px solid #fff;
  border-radius: 8px;
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  background-size: cover;
  cursor: pointer;
}
.imgHolder.small {
  height: 50px;
  width: 50px;
  float: left;
  margin-top: -76px;
  border: 2px solid #eee;
}
.nftcard {
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
}
.smallim {
  height: 100%;
  width: calc(36px);
  border-radius: 50%;
}
</style>
