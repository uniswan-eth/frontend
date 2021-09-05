<template>
  <b-modal id="modalOffer"
    v-if="order"
    size="lg"
    modal-classes="modal-danger"
    modal-content-classes="bg-gradient-danger">
    <div class="py-3 text-center">
      <i class="ni ni-bell-55 ni-3x"></i>
      <h4 class="heading mt-4">Order details</h4>
      <p>The owner of the wish bundle can execute this order.</p>
    </div>
    <nfts-table :nfts="order.exchangeBundle">
      <template v-slot:unsHeader>
        <b-row align-v="center">
          <b-col>
            <h3 class="mb-0">Exchange</h3>
          </b-col>
        </b-row>
      </template>
    </nfts-table>
    <br>
    <nfts-table :nfts="order.wishBundle">
      <template v-slot:unsHeader>
        <b-row align-v="center">
          <b-col>
            <h3 class="mb-0">Wish</h3>
          </b-col>
        </b-row>
      </template>
    </nfts-table>
    <template slot="footer">
      <base-button type="white">Ok, Got it</base-button>
      <base-button type="link" class="text-white ml-auto" @click="modals.notice = false">Close</base-button>
    </template>
  </b-modal>
</template>
<script>
  import NftsTable from '@/views/Dashboard/NftsTable';

  export default {
    name: 'order-modal',
    props: ["order"],
    components: {
      NftsTable
    },
    data() {
      return {

      }
    }
  }
</script>
<style>
</style>
