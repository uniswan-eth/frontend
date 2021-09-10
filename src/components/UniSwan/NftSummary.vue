<template>
  <div>
  <b-card no-body class="overflow-hidden" style="margin-bottom:20px;zzmax-width: 540px;">
    <b-row no-gutters>
      <b-col md="3" style="background:purple;">
        <b-card-img
          @click="$router.push('/nft/'+nft.contract+'/'+nft.tokenID)"
          fluid
          :src="nft.tokenJSON.image"
          :title="nft.tokenJSON.name"
          class="rounded-0"></b-card-img>
      </b-col>
      <b-col md="9">
        <b-card-body :title="nft.tokenJSON.name">
          <b-card-text>
            <div class="nftHolder">
              <h6 class="text-muted text-uppercase">
                Want in exchange
              </h6>
            </div>
            <div class="nftHolder">
              <h6 class="text-muted text-uppercase">
                Current options
              </h6>
            </div>
          </b-card-text>
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
  export default {
    name: 'nft-summary',
    props: ["nft", "display", "root", "idx", "minWidth", "maxWidth"],
    components: {
      AccountCard
    },
    data() {
      return {

      }
    },
    methods: {
    }
  }
</script>
<style>
.nftHolder {
  /* background: purple; */
  height:5rem;
}
</style>
