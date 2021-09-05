<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-info">
      <b-row>
        <b-col xl="6" md="6">
        </b-col>
      </b-row>
    </base-header>

    <b-container fluid class="mt--7">
      <b-row class="justify-content-center">
        <b-col lg="12">
          <card header-classes="bg-transparent">
            <h1 slot="header" class="mb-0">
              How it works
            </h1>
            <p>
              Swapping NFTs on UniSwan has three stages: <b>broadcast</b>,
              <b>identify</b>, and <b>execute</b>.
            </p>
            <div class="slide" style="background:#eee;">
              <h2>1. Broadcast your preferences</h2>
              <p>
                Do you want to swap one of your NFTs?
                Find the NFT you would like using the <b>explorer</b> or other means and press
                <span class="highlight">Make offer</span>.
                <br>
                Or you can go to a specific account (someone you know or discovered) and propose a swap.
                You can swap many NFTs to receive many back. Once you described your offer press the <span class="highlight">Sign and confirm</span> button.
              </p>
              <div class="cb"/>
            </div>
            <div class="slide" style="background:#eee;">
              <h2>2. Identify a good swap</h2>
              <p>
                While you’ve been making your offers, some other people may have
                made an offer on one of your NFTs. Head to the <b>My swap options</b> to see your swaps options.
                You also see this information by visiting an individual NFT page.
              </p>
            </div>
            <div class="slide" style="background:#eee;">
              <h2>3. Execute the swap</h2>
              <p>If one of your offers have been accepted and executed, you will be alerted and transaction can be viewed on the My account page in <b>swap history</b> tab</p>
              <p>
                Otherwise you can choose to execute any of your current <b>Swap options</b> by pressing the
                <br>
                <span class="highlight">View swap details</span>.
                Here you can see the parties involved in the swap, and the bundle of NFTs each will receive.
                And the fee.
                If you’re happy to cover the gas costs, go ahead and press
                <span class="highlight">Execute swap</span>
                to do the swap.
              </p>
            </div>
          </card>
          <br>
          <card header-classes="bg-transparent">
            <h1 slot="header" class="mb-0">
              FAQ
            </h1>
            <div class="slide" style="background:#eee;">
              <h2><i>Minting your own NFT</i></h2>
              <p>
                UniSwan is still in development and NFT’s can be expensive! Mint your
                own MATIC NFT's at:
                <a href="https://mintnft.today/">https://mintnft.today/</a>
              </p>
            </div>
            <div class="slide" style="background:#eee;">
              <h2><i>How is this free?</i></h2>
              <p>
                When you create a swap preference, you generate a digital signature,
                indicating which NFTs you would be happy to swap. When your swap is
                executed, we supply the signature to the UniSwan smart contract, which
                verifies that you agreed to the swapping those NFTs. All the security
                of Ethereum, but half of the gas costs!
              </p>
            </div>
            <div class="slide" style="background:#eee;">
              <h2><i>Removing an offer</i></h2>
              <p>
                If you changed your mind, and want to remove an offer.
                Simply head to <b>My Account</b>, then find offer in the <b>Offers</b> tab.
                Click <span class="highlight">Remove offer</span>,
                then sign the transaction.
              </p>
            </div>
            <div class="slide" style="background:#eee;">
              <h2>
                <i>Why does removing a preference costs ETH?</i>
              </h2>
              <p>
                When you create a swap preference, you generate a digital signature,
                indicating which NFTs you would be happy to swap. However, once the
                signature is out in the world, there's no way for you to delete it,
                and anyone could use it to swap your NFTs!
              </p>
              <p>
                To solve this problem, the UniSwan smart contract contains a set
                counters, indicating how many times a preference has been deleted.
                When you create a preference, we include this counter in the
                signature. Then, to invalidate a preference, simply incremement the
                value of the counter. If someone tries to use an old signature, the
                contract will compare the two counter values, notice that they are
                different, and the transaction will fail.
              </p>
            </div>

          </card>
          <br>
          <card header-classes="bg-transparent">
            <h1 slot="header" class="mb-0">
              What people may say about UniSwan
            </h1>
            <p>Mockup user stories</p>
            <div class="slide" style="background:#eee;">
              <h2>An art collector</h2>
              <p>
                I use UniSwan as my swapping interface to make bundle to bundle proposals to different users.
                If unable to find a coincidents of wants,
                the proposal is stored as a preference
                and can be leveraged in a Ring swap in the future.
                Let's say a preference was stored after a previous proposal' failure of a direct match e.g. 3 hashmasks for 1 Punk.
                The next time the user proposes a Punk in exchange, the other side will have the option of the punk AND 3 hashmasks.
                This increases the possibility of a successful direct swap, and in the process, triggers other peoples's preferences to be executed.

              </p>
            </div>
            <div class="slide" style="background:#eee;">
              <h2>An Artist</h2>
              <p>
                Alice, A digital graphical artist has created 200 unique NFTs.
                She would like to continue to build her NFT collection and knows many NFT artists in the space.
                She broadcasts her exchange preferences for 50 artworks from 20 different artists.
                These 20 artists will see Alice appreciation of their artworks, and what she is willing to give up in return.
                Even if the sentiment is not always mutual,
                Alice's preferences will increase their NFTs value when put up in return for something else.
                A good way for artists to swap, appreciate, and distribute each others works.
              </p>
            </div>
            <div class="slide" style="background:#eee;">
              <h2>Holiday exchange service</h2>
              <p>
                HomeExchange is running a community of home owners
                wanting to exchange their homes for specific time periods during the year.
                <br>
                Each home during a specific duration has been "minted" as an NFT.
                HomeExchange used to run their own order book matching, but has now migrated to the UNiSwan API.
                <br>
                They have since show a great increase in the number of successful home exchanges,
                thanks to the UniSwans ring swapping protocol.
              </p>
            </div>
            <div class="slide" style="background:#eee;">
              <h2>Any Minter</h2>
              <p>
                Great way of distributing / dropping things of value for something in return.
              </p>
            </div>
            <div class="slide" style="background:#eee;">
              <h2>Other use cases</h2>
              <p>
                Physical goods, financial products, real estate, services, event tickets.
              </p>
              <p>
                ... and many more to discover.
              </p>
            </div>
          </card>
          <br>
          <card header-classes="bg-transparent">
            <h1 slot="header" class="mb-0">
              Roadmap past
            </h1>
            <ul class="simplelist">
              <li>
                Mar -  First POC of a ring trade protocol
              </li>
              <li>
                May - Protocol expressed in a smart contract
              </li>
              <li>
                Jul -  ETHCC hackathon 3rd prize.
              </li>
              <li>
                Aug - Non custodial architecture, offchain orderbook, bundle swaps
              </li>
            </ul>
          </card>
          <br>
          <card header-classes="bg-transparent">
            <h1 slot="header" class="mb-0">
              Roadmap future
            </h1>
            <ul class="simplelist">
              <li>
                Widen the scope for preferences e.g. any of my Punks for an three HashMasks
              </li>
              <li>
                Ring swaps to include normal fungible to NFT swaps. Preferences aggregated with order books from OpenSea, Genie and other markets .
              </li>
              <li>
                Bundles to allow fungible tokens e.g. 2 HashMasks and 5 ETH for one Punk. (Rounding off an offer) (Already possible with 0x?)
              </li>
              <li>
                Frontend - APIs from OpenSea, Genie
              </li>
              <li>
                Deploy on main net
              </li>
              <li>
                Private beta testing
              </li>
              <li>
                Evolve UX / UI to better accomodate different use cases
              </li>
              <li>
                UniSwan API for developers wishing to offer ring swaps to their users.
              </li>
            </ul>
          </card>

          <br>
          <card header-classes="bg-transparent">
            <h1 slot="header" class="mb-0">
              People
            </h1>
            <div v-for="(n,idx) in people" :key="'p'+idx">
              <h2>{{n.name}}</h2>
              <div class="">
                {{n.bio}}
              </div>
            </div>
          </card>
          <br>
        </b-col>
      </b-row>

    </b-container>
  </div>
</template>
<script>
  import Vue from 'vue'
  import VueClipboard from 'vue-clipboard2'
  import BaseHeader from '@/components/BaseHeader';

  Vue.use(VueClipboard)
  export default {
    name: 'about',
    components: {
      BaseHeader
    },
    data() {
      return {
        people: [
        {
          name:"Fraser",
          bio:`
          `,
        },
        {
          name:"Henrik",
          bio:`
          `,
        },
        {
          name:"Developer",
          bio:`

          `,
        },
        {
          name:"Community and Coordinator",
          bio:`
          `,
        },
      ]
      }
    },
    async mounted() {
      document.title ="🦢 About"

      // this.loadPage()
    },
    methods: {
      async loadPage() {
      },
    },
    watch: {
      async $route () {
        // this.assets = []
        this.orders = []
        // this.collection = null
        // this.offset = 0
        this.loadPage()
      },
    }

  };
</script>
<style>
p {
  font-size: 18px;
}
.slide {
  background: #fff;
  padding: 20px 50px;
  padding-top: 30px;
  border-radius: 20px;
  margin-bottom: 50px;
  /* border: 1px solid */
}
</style>
