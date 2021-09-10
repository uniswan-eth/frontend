<template>
  <b-card
    :img-src="nft.tokenJSON.image"
    :img-alt="nft.tokenJSON.name"
    img-top
    tag="article"
    :style="{
      minWidth: minWidth ? minWidth : '10rem',
      maxWidth: maxWidth ? maxWidth : '15rem',
    }"
    class="nftCardHolder mb-2"
  >
    <b-card-text>
      <small class="navbar-heading text-muted text-uppercase">
        <router-link :to="'/explorer?contract=' + nft.contract">
          {{ nft.contractName }}
        </router-link>
      </small>
      <br />
      <router-link :to="'/nft/' + nft.contract + '/' + nft.tokenID">
        <b>
          {{ nft.tokenJSON.name }}
        </b>
      </router-link>
      <br />
      <i>
        <router-link :to="'/account/' + nft.owner">
          <img
            :title="'Owner: ' + nft.owner"
            class="blockie"
            :src="root.makeBlockie(nft.owner)"
          />
        </router-link>
      </i>
    </b-card-text>
  </b-card>
</template>
<script>
import AccountCard from "@/components/UniSwan/AccountCard";
export default {
  name: "nft-card2",
  props: ["nft", "display", "root", "idx", "minWidth", "maxWidth"],
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
.nftCardHolder img {
  /* object-fit: cover;
  width:100%;
  height:20rem; */
}
.nftCardHeader {
  background-color: purple;
  position: absolute;
  /* height:30px; */
  width: 50%;
  padding: 5px 10px;
  border-radius: 10px;
}
.blockie {
  height: 20px;
  border-radius: 50%;
}
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
