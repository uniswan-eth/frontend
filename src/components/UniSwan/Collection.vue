<template>
  <div class="">
      <div class="collection" >
        <img class="bgim banner" :style="{backgroundImage: 'url('+collection.banner_image_url+')'}" alt=""/>
        <img class="bgim collectionimage" :style="{backgroundImage: 'url('+collection.image_url+')'}" alt=""/>
        <div class="colltitle">
          <h1>
              {{collection.name}}
          </h1>
          <p>
            {{collection.description}}
          </p>

        </div>
        <br>
        <div class="">
          <b-row v-if="collection.stats">
            <b-col xl="3" md="6">
              <stats-card title="Items"
              type="gradient-red"
              :sub-title="collection.stats.total_supply.toString()"
              icon=""
              class="mb-4">

              <template slot="footer">
              </template>
            </stats-card>
            </b-col>
            <b-col xl="3" md="6">
              <stats-card title="Owners"
              type="gradient-red"
              :sub-title="collection.stats.num_owners.toString()"
              icon=""
              class="mb-4">

              <template slot="footer">
              </template>
            </stats-card>
            </b-col>
            <b-col xl="3" md="6">
              <stats-card title="Price"
              type="gradient-red"
              :sub-title="'Ξ '+root.formatNum(collection.stats.average_price).toString()"
              icon=""
              class="mb-4">

              <template slot="footer">
              </template>
            </stats-card>
            </b-col>
            <b-col xl="3" md="6">
              <stats-card title="Volume"
              type="gradient-red"
              :sub-title="'Ξ '+root.formatNum(collection.stats.total_volume).toString()"
              icon=""
              class="mb-4">

              <template slot="footer">
              </template>
            </stats-card>
            </b-col>
          </b-row>

        </div>
        <!-- <div class="stats">
          <div class="stat">
            <div class="small">Items:</div>
            {{collection.stats.total_supply}}
          </div>
          <div class="stat">
            <div class="small">Owners:</div>
            {{collection.stats.num_owners}}
          </div>
          <div class="stat">
            <div class="small">Avg Price:</div>
            Ξ {{root.formatNum(collection.stats.average_price)}}
          </div>
          <div class="stat">
            <div class="small">Volume:</div>
            Ξ {{root.formatNum(collection.stats.total_volume)}}
          </div>
        </div> -->

        <div class="cb"></div>

        <!-- <div class="links">
          <span class="collweb" v-if="collection.external_url">
            <a target="_blank" :href="collection.external_url">Web</a>
          </span>
          <span class="colltwit" v-if="collection.twitter_username">
            <a target="_blank" :href="'https://www.twitter.com/'+collection.twitter_username">Twitter</a>
          </span>
          <span class="collinsta" v-if="collection.instagram_username">
            <a target="_blank" :href="'https://www.instagram.com/'+collection.instagram_username">Instagram</a>
          </span>
          <span class="colltele" v-if="collection.telegram_url">
            <a target="_blank" :href="''+collection.telegram_url">Telegram</a>
          </span>
          <span class="colldisco" v-if="collection.discord_url">
            <a target="_blank" :href="''+collection.discord_url">Discord</a>
          </span>
          <span class="collchat" v-if="collection.chat_url">
            <a target="_blank" :href="''+collection.chat_url">Chat</a>
          </span>
          <span class="collmedium" v-if="collection.medium_username">
            <a target="_blank" :href="'https://medium.com/'+collection.medium_username">Medium</a>
          </span>
        </div> -->
      </div>
    <!-- <pre>{{collection}}</pre> -->
  </div>
</template>
<script>
  // import { Table, TableColumn, DropdownMenu, DropdownItem, Dropdown} from 'element-ui'
  import NftCard from '@/components/UniSwan/NftCard';
  export default {
    name: 'collection',
    props: ["collection", "root"],
    components: {
      NftCard
      // [Table.name]: Table,
      // [TableColumn.name]: TableColumn,
      // [Dropdown.name]: Dropdown,
      // [DropdownItem.name]: DropdownItem,
      // [DropdownMenu.name]: DropdownMenu,
    },
    data() {
      return {

      }
    }
  }
</script>
<style>

  .banner {
    width: 100%;
    height:250px;
    border-radius: 20px 20px 0px 0px;
    /* background-color: purple; */
    background-color: #ccc;
  }
  .collectionimage {
    border-radius: 50%;
    background-color: #fff;

    height:150px;
    width: 150px;
    border:5px solid #fff;

    /* position: absolute; */
    margin-top: -75px;
    margin-left: calc(50% - 75px);

  }


  .links span {
    margin:5px;
  }
  .links {
    text-align: center;
    margin-bottom: 20px;
  }
  .description {
    padding: 20px 15%;
    text-align: center;
    /* background: gold; */
  }
  .stats {
    margin-left: calc(50% - 300px);
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .stat {
    width:100px;
    float:left;
    border: 1px solid #eee;
    padding: 10px 20px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
  .colltitle {
    font-size: 32px;
    text-align: center;
    font-weight: bold;
  }




</style>
