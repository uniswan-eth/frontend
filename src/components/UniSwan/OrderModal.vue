<template>
  <b-modal
    id="modalOffer"
    v-if="order"
    size="lg"
    modal-classes="modal-danger"
    modal-content-classes="bg-gradient-danger"
  >
    <div class="py-3 text-center">
      <i class="ni ni-bell-55 ni-3x"></i>
      <h4 class="heading mt-4">Order details</h4>
      <p>The owner of the wish bundle can execute this order.</p>
      <p>
        Wisher:
        <account-card
          :address="order.signedOrder.order.makerAddress"
          :root="$parent"
        />
      </p>
    </div>
    <nfts-table :nfts="order.wishBundle" :root="$parent">
      <template v-slot:unsHeader>
        <b-row align-v="center">
          <b-col>
            <h3 class="mb-0">Wish</h3>
          </b-col>
        </b-row>
      </template>
    </nfts-table>
    <nfts-table :nfts="order.exchangeBundle" :root="$parent">
      <template v-slot:unsHeader>
        <b-row align-v="center">
          <b-col>
            <h3 class="mb-0">Exchange</h3>
          </b-col>
        </b-row>
      </template>
    </nfts-table>
    <br />
    <template slot="modal-footer">
      <br />
    </template>
  </b-modal>
</template>
<script>
import NftsTable from "@/views/Dashboard/NftsTable";
import AccountCard from "@/components/UniSwan/AccountCard";

export default {
  name: "order-modal",
  props: ["order"],
  components: {
    AccountCard,
    NftsTable,
  },
  data() {
    return {};
  },
};
</script>
<style>
</style>
