<template>
  <div>
  <b-card no-body class="overflow-hidden" style="margin-bottom:20px;zzmax-width: 540px;">
    <b-row no-gutters>
      <b-col md="3" style="zzbackground:purple;">
        <div
          @click="$router.push('/nft/'+nft.contract+'/'+nft.tokenID)"
          class="bgim"
          :style="{
            cursor:'pointer',
            backgroundImage: 'url('+nft.tokenJSON.image+')',
            width:'100%',
            height:'100%',
            minHeight:'150px',
            }"
          :title="nft.tokenJSON.name"
          alt=""/>
        <!-- <b-card-img
          @click="$router.push('/nft/'+nft.contract+'/'+nft.tokenID)"
          fluid
          :src="nft.tokenJSON.image"
          :title="nft.tokenJSON.name"
          class="rounded-0"></b-card-img> -->
      </b-col>
      <b-col md="9">
        <b-card-body :title="nft.tokenJSON.name">
          <div class="nftHolder">
            <h6 class="text-muted text-uppercase">
              Want in exchange
            </h6>
            <div
              class="bundleHolder"
              v-for="(n,idx) in summary.orders"
              :key="'nftorder'+idx">
              <div
                @click="$router.push('/nft/'+nft.contract+'/'+nft.tokenID)"
                class="imgHolder"
                :style="{backgroundImage: 'url('+nft.tokenJSON.image+')'}"
                v-for="(nft,idx) in n.wishBundle"
                :key="'wish'+idx">
              </div>
            </div>
            <div class="cb"/>
          </div>
          <div class="nftHolder">
            <h6 class="text-muted text-uppercase">
              Current options
            </h6>
            <div v-for="(ring,idx) in summary.options"
              class="bundleHolder"
              :key="'swapop'+idx">
              <b-button
                class="swapBtn"
                @click="
                $event.preventDefault();
                root.viewSwapChain(ring);
                "
                v-b-modal.modalSwapChain size="sm" variant="secondary">
                <i class="ni ni-spaceship"></i>
              </b-button>
              <div
                @click="$router.push('/nft/'+nft.contract+'/'+nft.tokenID)"
                v-for="(nft,idx) in ring[ring.length - 1].exchangeBundle"
                :key="'wish'+idx"
                :style="{backgroundImage: 'url('+nft.tokenJSON.image+')'}"
                class="imgHolder">
              </div>
            </div>
            <div class="cb"/>
          </div>
        </b-card-body>
      </b-col>
    </b-row>
  </b-card>
</div>
  <!-- <div
    :style="{
      minWidth: minWidth ? minWidth : '10rem',
      maxWidth: maxWidth ? maxWidth : '15rem'
    }"
    class="card">
        <img
          class="nftCardImage"
          @click="$router.push('/nft/'+nft.contract+'/'+nft.tokenID)"
          fluid
          :src="nft.tokenJSON.image"
          :title="nft.tokenJSON.name"
          alt=""/>
      <div class="nftCardBlockie">
        <router-link :to="'/account/'+nft.owner">
          <img
            :title="'Owner: '+nft.owner"
            class="blockie"
            :src="
              root.makeBlockie(nft.owner)
            "
          />
        </router-link>
      </div>
      <div class="nftCardContract">
        <router-link :to="'/explorer?contract='+nft.contract">
          <b-badge variant="default">
              {{nft.contract.substr(0,6)}}
          </b-badge>
        </router-link>
      </div>
      <div class="nftCardFooter text-center">
        <b>
          {{nft.tokenJSON.name}}
        </b>
      </div>


  </div> -->
</template>
<script>
  import AccountCard from '@/components/UniSwan/AccountCard';
  import Bundle2 from '@/components/UniSwan/Bundle';
  export default {
    name: 'nft-summary',
    props: ["summary", "nft", "display", "root", "idx", "minWidth", "maxWidth"],
    components: {
      Bundle2,
      AccountCard
    },
    data() {
      return {
        // nft:null,
      }
    },
    mounted() {
      // console.log(this.summary);
      // this.nft = this.summary.nft
    },
    methods: {
    }
  }
</script>
<style>
.bundleHolder {
  float:left;
  background: #ccc;
  padding:5px;
  margin-right:10px;
  margin-bottom:5px;
  border-radius: 8px;

}
.imgHolder {
  float:left;
  /* margin-right:10px; */
  height:100px;
  width:100px;
  border:3px solid #fff;
  border-radius: 8px;

  /* text-align: center; */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  background-size: cover;
  /* max-height: 270px; */
  /* overflow: hidden;
  white-space: nowrap; */
  cursor: pointer;
  /* background: purple; */
}
.bundleImage {
  width: 100px;
}
.nftHolder {
  min-height:100px;
  /* background: purple; */
  /* height:5rem; */
}
</style>
