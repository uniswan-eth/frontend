<template>
  <div v-if="asset">
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
      <b-row>
        <b-col xl="6" md="6">
          <!-- Image -->
          <!-- <stats-card title="Featured"
                      type="gradient-red"
                      sub-title="Punks"
                      icon="ni ni-active-40"
                      class="mb-4">

            <template slot="footer">
              <span class="text-success mr-2">3.48%</span>
              <span class="text-nowrap">Since last month</span>
            </template>
          </stats-card> -->
        </b-col>
        <b-col xl="6" md="6">
          <!-- <stats-card title="Featured"
                      type="gradient-orange"
                      sub-title="HashMask"
                      icon="ni ni-chart-pie-35"
                      class="mb-4">

            <template slot="footer">
              <span class="text-success mr-2">12.18%</span>
              <span class="text-nowrap">Since last month</span>
            </template>
          </stats-card> -->
        </b-col>
      </b-row>
    </base-header>

    <b-container fluid class="mt--7">
      <b-row class="">
        <b-col lg="6">
          <card header-classes="bg-transparent">
            <b-img :src="asset.image_url" alt="" fluid rounded/>
          </card>
          <br>
          <card header-classes="bg-transparent">
            <h1 slot="header" class="mb-0">
              {{asset.name}}
            </h1>
            <p>
              {{asset.description}}
            </p>
            <!-- <pre>{{asset}}</pre> -->
            <!-- v-if="
            $parent.$parent.signeraddr === asset.owner.address &&
            !asset.signerApprovedForCollection
            " -->
            <!-- <div
              class="btn purple"
              @click="$parent.$parent.approveTransfers(asset.asset_contract.address)"
            >
              Approve transfers
            </div>
            <div
              class="btn"
              v-if="
                $parent.$parent.signeraddr === asset.owner &&
                asset.signerApprovedForCollection
              "
            >
              Remove approval
            </div> -->

            <!-- <pre>{{asset}}</pre> -->
          </card>
          <br>
          <card header-classes="bg-transparent">
            <h2 slot="header" class="mb-0">Chain Info</h2>
            <div>
              Address:
              <a target="_blank" rel="noreferrer" :href="'https://etherscan.io/address/'+asset.asset_contract.address">
                {{asset.asset_contract.address}}
              </a>
            </div>
            <div :title="asset.token_id">
              TokenID: {{asset.token_id.substr(0,10)}}{{asset.token_id.length > 10 ? '...'+asset.token_id.substr(asset.token_id.length - 5) : ''}}
            </div>
            <div>
              Type: {{asset.asset_contract.schema_name}}
            </div>
          </card>
        </b-col>
        <b-col lg="6">
          <!-- <pre>{{validSwaps}}</pre> -->
          <options-table
            :root="$parent.$parent"
            :options="validSwaps">
            <template v-slot:unsHeader>
              <b-row align-v="center">
                <b-col>
                  <h3 class="mb-0">Offers</h3>
                </b-col>
                <b-col class="text-right">
                  <b-button
                    :disabled="$parent.$parent.signeraddr === asset.owner.address"
                    @click="$parent.$parent.createOrder(asset, ownerAssets)"
                    v-b-modal.modalCreateOffer size="lg" variant="success">
                    Make offer
                  </b-button>
                </b-col>
              </b-row>
            </template>
          </options-table>
          <!-- <card header-classes="bg-transparent">
            <template v-slot:header>
              <b-row align-v="center">
                <b-col>
                  <h3 class="mb-0">Offers</h3>
                </b-col>
                <b-col class="text-right">
                  <b-button
                    :disabled="$parent.$parent.signeraddr === asset.owner.address"
                    @click="$parent.$parent.createOrder(asset, ownerAssets)"
                    v-b-modal.modalCreateOffer size="lg" variant="success">
                    Make offer
                  </b-button>
                </b-col>
              </b-row>
            </template>
            <div class="">
            </div>
            <div v-for="(chain, idx) in validSwaps" :key="'chain' + idx">
              <b-button
                @click="$parent.$parent.viewSwapChain(chain)"
                v-b-modal.modalSwapChain size="sm" variant="secondary">
                Details
              </b-button>
              <div v-for="(n, idy) in chain" :key="'wnft' + idy">
                <bundle :bundle="n.exchangeBundle" />
              </div>
              <hr>
            </div>
          </card> -->
          <br>
          <card header-classes="bg-transparent">
            <h3 slot="header" class="mb-0">
              Get it now!
            </h3>
          </card>
          <br>
          <nfts-table :nfts="ownerAssets">
            <template v-slot:unsHeader>
              <h3>Owner</h3>
              <br>
              <b-row align-v="center">
                <b-col>
                  <b-media no-body class="align-items-center">
                      <span class="avatar avatar-sm rounded-circle">
                        <a :href="'/#/account/'+asset.owner.address">
                          <img :src="$parent.$parent.makeBlockie(asset.owner.address)">
                        </a>
                      </span>
                      <b-media-body class="ml-2 d-none d-lg-block">
                        <span class="mb-0 text-sm  font-weight-bold">{{asset.owner.address.substr(0,6)}}</span>
                      </b-media-body>
                  </b-media>
                </b-col>
                <b-col class="text-right">
                  <a :href="'/#/account/'+asset.owner.address" class="btn btn-sm btn-secondary">See all owners NFTs</a>
                </b-col>
              </b-row>
            </template>
          </nfts-table>
        </b-col>
      </b-row>
      <br>
      <b-row class="justify-content-center" v-if="asset.collection">
        <b-col lg="12">
          <card header-classes="bg-transparent">
            <h3 slot="header" class="mb-0">
              Collection
            </h3>
            <collection :collection="asset.collection"/>
          </card>
        </b-col>
      </b-row>
      <br>
    </b-container>
  </div>
</template>
<script>
  import Vue from 'vue'
  import VueClipboard from 'vue-clipboard2'
  import BaseHeader from '@/components/BaseHeader';
  import Collection from '@/components/UniSwan/Collection';
  import NftsTable from './Dashboard/NftsTable';
  import OptionsTable from './Dashboard/OptionsTable';
  import NftCard from '@/components/UniSwan/NftCard';
  import Bundle from '@/components/UniSwan/Bundle';


  Vue.use(VueClipboard)
  export default {
    name: 'nft',
    components: {
      OptionsTable,
      Bundle,
      NftCard,
      NftsTable,
      Collection,
      BaseHeader
    },
    data () {
      return {
        asset: null,
        ownerAssets: null,
        validSwaps:[],
        swapOptions:[],
        wwasset: {
            "id": 41672780,
            "token_id": "14116440693855325289559048931953562559472802221804805915629551086540188286977",
            "num_sales": 1,
            "background_color": null,
            "image_url": "https://lh3.googleusercontent.com/PAXYtMG63n9xeZJyXv9UCQO0KQluKu9iBo9plA_d38D3ZoVxVWE0k2tnNgUHYcyorAAyxKVCMVRhPN-JBnajZX_CXaYYTUxjMaEqfw",
            "image_preview_url": "https://lh3.googleusercontent.com/PAXYtMG63n9xeZJyXv9UCQO0KQluKu9iBo9plA_d38D3ZoVxVWE0k2tnNgUHYcyorAAyxKVCMVRhPN-JBnajZX_CXaYYTUxjMaEqfw=s250",
            "image_thumbnail_url": "https://lh3.googleusercontent.com/PAXYtMG63n9xeZJyXv9UCQO0KQluKu9iBo9plA_d38D3ZoVxVWE0k2tnNgUHYcyorAAyxKVCMVRhPN-JBnajZX_CXaYYTUxjMaEqfw=s128",
            "image_original_url": null,
            "animation_url": null,
            "animation_original_url": null,
            "name": "CryptoAnarchists #219/250",
            "description": "Beneath this mask there is an idea... and ideas are bulletproof.\n\nCryptoAnarchists #219/250\n\nSupply for each Anarchists 1/1\n\nTotal Supply 250 Anarchists",
            "external_link": null,
            "asset_contract": {
                "address": "0x495f947276749ce646f68ac8c248420045cb7b5e",
                "asset_contract_type": "semi-fungible",
                "created_date": "2020-12-02T17:40:53.232025",
                "name": "OpenSea Collection",
                "nft_version": null,
                "opensea_version": "2.0.0",
                "owner": 102384,
                "schema_name": "ERC1155",
                "symbol": "OPENSTORE",
                "total_supply": null,
                "description": "",
                "external_link": null,
                "image_url": null,
                "default_to_fiat": false,
                "dev_buyer_fee_basis_points": 0,
                "dev_seller_fee_basis_points": 0,
                "only_proxied_transfers": false,
                "opensea_buyer_fee_basis_points": 0,
                "opensea_seller_fee_basis_points": 250,
                "buyer_fee_basis_points": 0,
                "seller_fee_basis_points": 250,
                "payout_address": null
            },
            "permalink": "https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/14116440693855325289559048931953562559472802221804805915629551086540188286977",
            "collection": {
                "banner_image_url": "https://lh3.googleusercontent.com/cIhK-b_H9M1VyXHs7cB5bA3suprUI5swCLoYbKsq1M1babZJhYU4PO5NegPKfOV2lCoA4CXopbjsLwdI9Vd_y8g0BjZs8H4H8WBNZg=s2500",
                "chat_url": null,
                "created_date": "2021-03-17T20:04:59.242063",
                "default_to_fiat": false,
                "description": " All CryptoAnarchists are unique 3D model, 1/1 rare collectibles. Only 250 different will be available.\n\n___________\n\nEvery 50th CryptoAnarchists are LEGENDARY #50 #100 #150 #200 #250 = Ξ0.5",
                "dev_buyer_fee_basis_points": "0",
                "dev_seller_fee_basis_points": "1000",
                "discord_url": "https://discord.gg/VfXc3gw3vW",
                "display_data": {
                    "card_display_style": "contain"
                },
                "external_url": "https://xn--h4h6120on8a2yfda.y.at",
                "featured": false,
                "featured_image_url": "https://lh3.googleusercontent.com/DIZ1MYntu9Th1eIcqlTpzNADiJz6GF82t85qjtp4B0ZEI5JGn5EOkFjY61UDaHFJDBR0P-nhyPBUxU4vI6qPBAwTUgx0uy1SCr4_=s300",
                "hidden": false,
                "safelist_request_status": "not_requested",
                "image_url": "https://lh3.googleusercontent.com/0sC00RRcuDmu8yz4KPZkUregqTbSKJ5YAE7tV4m-mC6Vwa1lM02fSGZsQZRDNhwOJTJKzjP5-naj_opFksh-ao5eKWVC4ozpWad4=s120",
                "is_subject_to_whitelist": false,
                "large_image_url": "https://lh3.googleusercontent.com/DIZ1MYntu9Th1eIcqlTpzNADiJz6GF82t85qjtp4B0ZEI5JGn5EOkFjY61UDaHFJDBR0P-nhyPBUxU4vI6qPBAwTUgx0uy1SCr4_=s300",
                "medium_username": null,
                "name": "CryptoAnarchists",
                "only_proxied_transfers": false,
                "opensea_buyer_fee_basis_points": "0",
                "opensea_seller_fee_basis_points": "250",
                "payout_address": "0x1f359f4e7980f283a6c5b018915447ce782927eb",
                "require_email": false,
                "short_description": null,
                "slug": "cryptoanarchists",
                "telegram_url": null,
                "twitter_username": "anarhysts",
                "instagram_username": null,
                "wiki_url": null
            },
            "decimals": null,
            "token_metadata": null,
            "owner": {
                "user": {
                    "username": "NullAddress"
                },
                "profile_img_url": "https://storage.googleapis.com/opensea-static/opensea-profile/1.png",
                "address": "0x0000000000000000000000000000000000000000",
                "config": ""
            },
            "sell_orders": null,
            "creator": {
                "user": {
                    "username": "CryptoAnarchists"
                },
                "profile_img_url": "https://storage.googleapis.com/opensea-static/opensea-profile/18.png",
                "address": "0x1f359f4e7980f283a6c5b018915447ce782927eb",
                "config": ""
            },
            "traits": [],
            "last_sale": {
                "asset": {
                    "token_id": "14116440693855325289559048931953562559472802221804805915629551086540188286977",
                    "decimals": null
                },
                "asset_bundle": null,
                "event_type": "successful",
                "event_timestamp": "2021-08-29T18:17:44",
                "auction_type": null,
                "total_price": "264600000000000000",
                "payment_token": {
                    "id": 2,
                    "symbol": "WETH",
                    "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                    "image_url": "https://storage.opensea.io/files/accae6b6fb3888cbff27a013729c22dc.svg",
                    "name": "Wrapped Ether",
                    "decimals": 18,
                    "eth_price": "1.000000000000000",
                    "usd_price": "3774.969999999999800000"
                },
                "transaction": {
                    "block_hash": "0x2095a288816518115751837e519de7bbb30266c14e6f5bae901cca889fac1179",
                    "block_number": "13121949",
                    "from_account": {
                        "user": {
                            "username": "CryptoAnarchists"
                        },
                        "profile_img_url": "https://storage.googleapis.com/opensea-static/opensea-profile/18.png",
                        "address": "0x1f359f4e7980f283a6c5b018915447ce782927eb",
                        "config": ""
                    },
                    "id": 155653233,
                    "timestamp": "2021-08-29T18:17:44",
                    "to_account": {
                        "user": {
                            "username": "OpenSea-Orders"
                        },
                        "profile_img_url": "https://storage.googleapis.com/opensea-static/opensea-profile/22.png",
                        "address": "0x7be8076f4ea4a4ad08075c2508e481d6c946d12b",
                        "config": "verified"
                    },
                    "transaction_hash": "0xe72d1cc7ef0d94908835a307dcd409d6514984391bd2cf8ef2b3654d5bc5659e",
                    "transaction_index": "127"
                },
                "created_date": "2021-08-29T18:18:07.804147",
                "quantity": "1"
            },
            "top_bid": null,
            "listing_date": null,
            "is_presale": true,
            "transfer_fee_payment_token": null,
            "transfer_fee": null
        }
      }
    },
    async mounted() {
      document.title ="🦢 NFT"
      this.loadPage()
    },
    methods: {
      async loadPage() {
        this.ownerAssets = []
        this.asset = null
        var nft = await this.$parent.$parent.getNFT(
          this.$route.params.contract,
          this.$route.params.tokenid
        )

        // Use same fromat as OpenSea API
        this.asset = this.$parent.$parent.formatAsset(nft)

        // Swap Options
        // this.validSwaps = this.$parent.$parent.nftSwapOptions(nft);
        this.validSwaps = await this.$parent.$parent.getSwapOptions([nft]);
        console.log('Yohoo Swaps', this.validSwaps);


        // Owner Assets - Matic / OpenSea?
        this.ownerAssets = await this.$parent.$parent.getUserNFTsByCollection(
          this.$route.params.contract,
          nft.owner
        )
      },
      onCopy() {
        this.$notify({
          type: 'info',
          message: 'Copied to clipboard'
        })
      }
    },
    watch: {
      $route: function () {
        this.loadPage();
      },
    },

  };
</script>
<style></style>
