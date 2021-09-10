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
      <!-- <pre>{{nft}}</pre> -->
    </div>
    <div v-if="!display" class="nftcard">
      <b-media no-body class="text-left">
        <a
          :href="'/#/nft/' + nft.contract + '/' + nft.tokenID"
          class="avatar avatar-sm rounded-circle"
        >
          <img
            class="bgim smallim"
            :style="{ backgroundImage: 'url(' + nft.tokenJSON.image + ')' }"
            alt=""
          /> </a
        >&nbsp;
        <b-media-body>
          <span
            :style="{ fontWeight: nft.owner === root.signeraddr ? 900 : 400 }"
            class="name mb-0 text-sm"
          >
            {{ nft.tokenJSON.name }}
          </span>
          <br />
          <account-card :address="nft.owner" :root="root" />
        </b-media-body>
      </b-media>
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
.bundleHeader {
  margin-left: 7px;
  margin-bottom: -35px;
}
.nftHolder {
}
.imgHolder {
  height: 150px;
  width: 150px;
  border-radius: 10px;
  padding: 5px;
}
.imgHolder.small {
  /* position: absolute; */
  height: 50px;
  width: 50px;
  float: left;
  margin-top: -76px;
  border: 2px solid #eee;
  /* margin-right: 5px; */
}
.nftcard {
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  /* font-size: 10px; */
  /* display: inline-block;
  line-height: 36px; */
}
.smallim {
  height: 100%;
  width: calc(36px);
  /* height: 36px;
  width: 36px; */
  /* border: 1px solid #000; */
  border-radius: 50%;
}
</style>
