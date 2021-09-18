<template>
  <div
    v-if="nft.tokenJSON"
    :style="{
      minWidth: minWidth ? minWidth : '10rem',
      maxWidth: maxWidth ? maxWidth : '15rem',
    }"
    class="nftCardHolder card"
  >
    <img
      class="nftCardImage"
      @click="$router.push('/nft/' + nft.contract + '/' + nft.tokenID)"
      fluid
      :src="nft.tokenJSON.image"
      :title="nft.tokenJSON.name"
      alt=""
    />
    <div class="nftCardBlockie" v-if="nft.owner">
      <router-link :to="'/account/' + nft.owner">
        <img
          :title="'Owner: ' + nft.owner"
          class="blockie"
          :src="root.makeBlockie(nft.owner)"
        />
      </router-link>
    </div>
    <div class="nftCardContract">
      <b-badge
        v-if="!saved.length || saved.length === 0"
        class="addFavBtn"
        @click="root.saveNFT(nft)"
        variant="default"
      >
        <i class="ni ni-favourite-28 text-danger"></i>
      </b-badge>
      <b-badge
        v-if="saved.length > 0"
        class="addFavBtn"
        @click="root.removeSavedNFT(nft)"
        variant="default"
      >
        <i class="ni ni-fat-remove text-warning"></i>
      </b-badge>
      <router-link :to="'/explorer?contract=' + nft.contract">
        <b-badge variant="default">
          {{ contractData.name.substr(0, 7) }}...
        </b-badge>
      </router-link>
    </div>
    <div class="nftCardFooter text-center">
      <b>
        {{ nft.tokenJSON.name }}
      </b>
    </div>
  </div>
</template>
<script>
import AccountCard from "@/components/UniSwan/AccountCard";
export default {
  name: "nft-card2",
  props: ["nft", "root", "minWidth", "maxWidth"],
  components: {
    AccountCard,
  },
  data() {
    return {
      saved: [],
      contractData: { name: "" },
    };
  },
  async mounted() {
    this.saved = await this.root.checkSaved(this.nft);

    this.contractData = await this.$props.root.getContractFromSubGraph(
      this.nft.contract
    );
  },
  methods: {},
};
</script>
<style>
.addFavBtn {
  margin-right: 5px;
  cursor: pointer;
}
.nftCardHolder {
  margin-bottom: 20px !important;
}
.nftCardFooter {
  padding: 10px 15px;
}
.nftCardImage {
  cursor: pointer;
  border-radius: 5px 5px 0px 0px;
}
.nftCardBlockie {
  position: absolute;
}
.nftCardHolder:hover .blockie {
  opacity: 100%;
}
.nftCardHolder:hover .nftCardContract {
  opacity: 100%;
}
.blockie {
  transition: opacity 0.6s;
  opacity: 50%;
  height: 1.5rem;
  border-radius: 50%;
  margin-top: 6px;
  margin-left: 6px;
}
.nftCardContract {
  opacity: 50%;
  transition: opacity 0.6s;
  position: absolute;
  text-align: right;
  margin-left: calc(100% - 125px);
  width: 125px;
  overflow: hidden;
  padding: 5px 10px;
}
.nftCardHolder img {
}
.nftCardHeader {
  background-color: purple;
  position: absolute;
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