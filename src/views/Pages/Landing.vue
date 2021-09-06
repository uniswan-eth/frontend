<template>
  <div>
    <div class="header bg-gradient-warning py-7 py-lg-8 pt-lg-9">
      <b-container>
        <div class="header-body text-center mb-7">
          <b-row class="justify-content-center">
            <b-col xl="5" lg="6" md="8" class="px-5">
              <h1 class="text-white">UniSwan</h1>
              <p class="text-lead text-white">
                An NFT bartering protocol, allowing any number of parties to swap ERC721’s without the use of money.
                To increase the chances of a successful swap, we allow for n-party trades.
              </p>
            </b-col>
          </b-row>
        </div>
      </b-container>
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1"
             xmlns="http://www.w3.org/2000/svg">
          <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div>
    </div>
    <b-container class="mt--8 pb-5">
      <b-row class="justify-content-center">
        <b-col lg="10">
          <b-card
            v-if="$route.query.tab === 'about'"
            no-body class="bg-secondary border-0 mb-0">
            <b-card-header class="bg-transparent"  >
              <h2>About</h2>
            </b-card-header>
            <b-card-body class="px-lg-5 py-lg-5">
              <b-tabs pills style="zzbackground:#ccc;">
                <b-tab>
                  <template v-slot:title>
                    <i class="ni ni-bell-55 mr-2"></i> Protocol
                  </template>
                  <br>
                  <h2>The protocol</h2>
                  <br>
                  <p>
                    UniSwan is an n-party bartering protocol for NFT's. That sounds
                    complicated, so it's best to give an example:
                  </p>
                  <p>
                    Imagine that there are three NFT collectors: Alice, Bob, and Charlie.
                  </p>
                  <p>
                    Each of them has an NFT that they don't want. Alice was airdropped a
                    UniSock; but hates it. Bob’s bought a CryptoKitty a long time ago, but
                    never got it to breed successfuly. Charlie has a HashMask, but would
                    prefer something more useful.
                  </p>
                  <p>
                    In addition, each of them desires another collectors NFT. Alice wants
                    Bob’s CryptoKitty, Bob wants Charlie’s Hashmask, and Charlie wants
                    Alice’s UniSock.
                  </p>
                  <p>
                    With just two of the collectors, there is no way that they can trade.
                    However, with the three collectors, they can trade in a 'ring'.
                  </p>
                  <p>
                    However, the three of them have never met. And even if they knew there
                    was a coincidence of wants, they might not trust eachother. UniSwan
                    allows Alice, Bob, and Charlie to easily broadcast their preferences,
                    then enact a single, atomic ‘ring’ swap.
                  </p>
                </b-tab>
                <!-- <b-tab>
                  <template v-slot:title>
                    <i class="ni ni-cloud-upload-96 mr-2"></i> FAQ
                  </template>
                  <br>
                  <h2>FAQ</h2>
                  <br>
                  <h4><i>How is this free?</i></h4>
                  <p>
                    When you create a swap preference, you generate a digital signature,
                    indicating which NFTs you would be happy to swap. When your swap is
                    executed, we supply the signature to the UniSwan smart contract, which
                    verifies that you agreed to the swapping those NFTs. All the security
                    of Ethereum, but half of the gas costs!
                  </p>
                  <h4><i>Removing an offer</i></h4>
                  <p>
                    If you changed your mind, and want to remove an offer.
                    Simply head to <b>My Account</b>, then find offer in the <b>Offers</b> tab.
                    Click <span class="highlight">Remove offer</span>,
                    then sign the transaction.
                  </p>
                  <h4>
                    <i>Why does removing a preference costs ETH?</i>
                  </h4>
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
                </b-tab> -->
              </b-tabs>
            </b-card-body>
          </b-card>

          <b-card
            v-if="!$route.query.tab"
            no-body class="bg-secondary border-0 mb-0">
            <b-card-header class="bg-transparent"  >
              <h2>How it works</h2>
              <p>Some explainer.</p>
            </b-card-header>
            <b-card-body class="px-lg-5 py-lg-5">
              <b-tabs pills style="zzbackground:#ccc;">
                <b-tab active>
                  <template v-slot:title>
                    <i class="ni ni-cloud-upload-96 mr-2"></i> Find an NFT or a trader
                  </template>
                  <p class="p-3">
                    Find an NFT using the explorer.
                  </p>
                  <b-img src="img/screenshots/screennft.png" fluid/>
                </b-tab>
                <b-tab>
                  <template v-slot:title>
                    <i class="ni ni-bell-55 mr-2"></i> Make an offer
                  </template>
                  <p class="p-3">
                    Select the NFTs you want and what you're willing to give in return.
                  </p>
                  <b-img src="img/screenshots/screenneworder.png" fluid/>
                </b-tab>
                <b-tab>
                  <template v-slot:title>
                    <i class="ni ni-bell-55 mr-2"></i> Your options
                  </template>
                  <p class="p-3">
                    Consider your options.
                  </p>
                  <b-img src="img/screenshots/screendash.png" fluid/>
                </b-tab>
                <b-tab>
                  <template v-slot:title>
                    <i class="ni ni-bell-55 mr-2"></i> Execute
                  </template>
                  <p class="p-3">
                    Once you've found a good swap. Press the execute function.
                  </p>
                  <b-img src="img/screenshots/screenexecute.png" fluid/>
                </b-tab>
              </b-tabs>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
  export default {
    data() {
      return {
      };
    },
    methods: {
    }
  };
</script>
