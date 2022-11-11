<template>
    <Card class="inputs mb-3 card">
        <template #header>
            <h1>Shorter Flight Finder</h1>
        </template>

        <template #subtitle>
            <Button id="toggle" class="google toogle-button p-0" aria-label="Google">
                <i class="pi pi-unlock px-2"></i>
                <span class="px-3">Toggle Map</span>
            </Button>
        </template>

        <template #content>
            <div class="grid">
                <Card class="card col-7 ml-auto mr-auto">
                    <template #header>
                        <h2>Dijkstra or UCS for two Airports</h2>
                    </template>
                    <template #content>
                        <div class="grid">
                            <div class="col-5">
                                <div class="grid mt-2">
                                    <div class="col-8 flex">
                                        <i class="order-origin ml-1 "></i>
                                        <label class="text-xl ml-6"> Origin Country </label>
                                    </div>
                                    <div class="col-4 flex justify-content-start">
            
                                        <pv-dropdown v-model="orderOrigin" :options="countries" optionLabel="country" :filter="true" placeholder="Select a Country" v-on:change="validateOrigin()" :showClear="true">
                                            <template #value="slotProps">

                                                <div class="country-item country-item-value" v-if="slotProps.value">
                                                    <img :src="'https://countryflagsapi.com/png/'+slotProps.value.code"/>
                                                    <span>{{slotProps.value.country}}</span>
                                                </div>

                                                <span v-else>
                                                    {{slotProps.placeholder}}
                                                </span>
                                            </template>

                                            <template #option="slotProps">
                                                <div class="country-item">
                                                    <img :src="'https://countryflagsapi.com/png/'+slotProps.option.code"/>
                                                    <span>{{slotProps.option.country}}</span>
                                                </div>
                                            </template>
                                        </pv-dropdown>
                                    </div>
                                </div>
            
                                <div class="grid mt-3">
                                    <div class="col-8 flex">
                                        <i class="order-destination ml-1"></i>
                                        <label class="text-xl ml-6">Destination Country </label>
                                    </div>
                                    <div class="col-4 flex justify-content-start">
                                        <pv-dropdown v-model="orderDestination" :options="countries" optionLabel="country" :filter="true" placeholder="Select a Country" v-on:change="loadDestinationAirports()" :showClear="true">
                                            <template #value="slotProps">
                                                <div class="country-item country-item-value" v-if="slotProps.value">
                                                    <img :src="'https://countryflagsapi.com/png/'+slotProps.value.code"/>
                                                    <span>{{slotProps.value.country}}</span>
                                                </div>
                                                <span v-else>
                                                    {{slotProps.placeholder}}
                                                </span>
                                            </template>

                                            <template #option="slotProps">
                                                <div class="country-item">
                                                    <img :src="'https://countryflagsapi.com/png/'+slotProps.option.code"/>
                                                    <span>{{slotProps.option.country}}</span>
                                                </div>
                                            </template>
                                        </pv-dropdown>
                                    </div>
                                </div>
                            </div>
            
                            <div class="col-5 ml-8">
                                <div class="grid mt-2">
                                    <div class="col-8 flex ">
                                        <i class="order-origin pd-1 "></i>
                                        <label class="text-xl ml-3">Origin Airport </label>
                                    </div>

                                    <div class="col-4 flex justify-content-start">
                                        <pv-dropdown v-model="originAirportSelected" :options="originAirports" optionLabel="country" :filter="true" placeholder="Select a Country" v-on:change="validateOrigin()" :showClear="true">
                                            <template #value="slotProps">
                                                <div class="country-item country-item-value" v-if="slotProps.value">
                                                    <img :src="'https://countryflagsapi.com/png/'+slotProps.value.code"/>
                                                    <span>{{slotProps.value.airport}}</span>
                                                </div>
                                                <span v-else>
                                                    {{slotProps.placeholder}}
                                                </span>
                                            </template>
                                            <template #option="slotProps">
                                                <div class="country-item">
                                                    <img :src="'https://countryflagsapi.com/png/'+slotProps.option.code"/>
                                                    <span>{{slotProps.option.airport}}</span>
                                                </div>
                                            </template>
                                        </pv-dropdown>
                                    </div>
                                </div>

                                <div class="grid mt-3">
                                    <div class="col-8 flex ">
                                        <i class="order-destination ml-1"></i>
                                        <label class="text-xl ml-6">Destination Airport </label>
                                    </div>

                                    <div class="col-4 flex justify-content-start">
                                        <pv-dropdown v-model="destinationAirportSelected" :options="destinationAirports" optionLabel="country" :filter="true" placeholder="Select a Country" :showClear="true">
                                            <template #value="slotProps">
                                                <div class="country-item country-item-value" v-if="slotProps.value">
                                                    <img :src="'https://countryflagsapi.com/png/'+slotProps.value.code"/>
                                                    <span>{{slotProps.value.airport}}</span>
                                                </div>
                                                <span v-else>
                                                    {{slotProps.placeholder}}
                                                </span>
                                            </template>
                                            <template #option="slotProps">
                                                <div class="country-item">
                                                    <img :src="'https://countryflagsapi.com/png/'+slotProps.option.code"/>
                                                    <span>{{slotProps.option.airport}}</span>
                                                </div>
                                            </template>
                                        </pv-dropdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </Card>

                <Card class="card col-4 ml-auto mr-auto">
                    <template #header>
                        <h2>Kruskal for an Airport</h2>
                    </template>
                    <template #content>
                        <div class="grid">
                            <div class="col-10">
                                <div class="grid mt-2">
                                    <div class="col-7 flex">
                                        <i class="order-origin ml-0"></i>
                                        <label class="text-xl ml-1">Origin Country</label>
                                    </div>
                                    <div class="col-4 flex justify-content-start">
                                        <pv-dropdown v-model="orderOrigin" :options="countries" optionLabel="country" :filter="true" placeholder="Select a Country" v-on:change="validateOrigin()" :showClear="true">
                                            <template #value="slotProps">

                                                <div class="country-item country-item-value" v-if="slotProps.value">
                                                    <img :src="'https://countryflagsapi.com/png/'+slotProps.value.code"/>
                                                    <span>{{slotProps.value.country}}</span>
                                                </div>

                                                <span v-else>
                                                    {{slotProps.placeholder}}
                                                </span>
                                            </template>

                                            <template #option="slotProps">
                                                <div class="country-item">
                                                    <img :src="'https://countryflagsapi.com/png/'+slotProps.option.code"/>
                                                    <span>{{slotProps.option.country}}</span>
                                                </div>
                                            </template>
                                        </pv-dropdown>
                                    </div>
                                </div>
            
                                <div class="grid mt-3">
                                    <div class="col-8 flex">
                                        <i class="order-origin ml-1"></i>
                                        <label class="text-xl ml-0">Origin Airport </label>
                                    </div>
                                    <div class="col-4 flex justify-content-start">
                                        <pv-dropdown v-model="orderDestination" :options="countries" optionLabel="country" :filter="true" placeholder="Select a Country" v-on:change="loadDestinationAirports()" :showClear="true">
                                            <template #value="slotProps">
                                                <div class="country-item country-item-value" v-if="slotProps.value">
                                                    <img :src="'https://countryflagsapi.com/png/'+slotProps.value.code"/>
                                                    <span>{{slotProps.value.country}}</span>
                                                </div>
                                                <span v-else>
                                                    {{slotProps.placeholder}}
                                                </span>
                                            </template>

                                            <template #option="slotProps">
                                                <div class="country-item">
                                                    <img :src="'https://countryflagsapi.com/png/'+slotProps.option.code"/>
                                                    <span>{{slotProps.option.country}}</span>
                                                </div>
                                            </template>
                                        </pv-dropdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
        </template>

  
    </Card>
</template>

<script scoped>
import { UserApiService } from "../services/user-api-service";
import { isGloballyWhitelisted, stringifyStyle } from '@vue/shared';
import * as d3 from 'd3'
import { isTemplateNode } from "@vue/compiler-core";
export default {
    data() {
        return {
            loading: [false, false, false],
            loadData: {},
            h: 600,
            w: 960,
            orderOrigin: "",
            orderDestination: "",
            originAirportSelected: "",
            destinationAirportSelected: "",
            countries: [],
            originAirports: [],
            destinationAirports: [],
        };
    },
    created() {
        this.countryApiService = new UserApiService();
        this.countryApiService.getCountries().then((response) => {
            this.countries = response.data;
            console.log("🚀 ~ file: search.vue ~ line 152 ~ this.countryApiService.getCountries ~ this.countries = response.data;", this.countries = response.data);
            console.log(this.recent_orders);
        });
    },
    methods: {
        validateOrigin: function () {
            if (this.orderOrigin == "") {
                this.orderOriginError = true;
            }
            else {
                this.orderOriginError = false;
                this.loadOriginAirports();
            }
        },
        validateDestination() {
            if (this.orderDestination == "") {
                this.orderDestinationError = true;
            }
            else {
                this.orderDestinationError = false;
                this.loadDestinationAirports();
            }
        },
        load(index) {
            this.loading[index] = true;
            setTimeout(() => this.loading[index] = false, 1000);
        },
        loadOriginAirports() {
            this.countryApiService.getAirportsByCountry(this.orderOrigin.country)
                .then(response => {
                this.originAirports = response.data;
            });
            console.log(this.originAirports);
            console.log(this.orderOrigin);
        },
        loadDestinationAirports() {
            this.countryApiService.getAirportsByCountry(this.orderDestination.country)
                .then(response => {
                this.destinationAirports = response.data;
            });
        }
    },
    components: { isTemplateNode }
}

</script>

<style scoped>

.map path {
    fill: #eee;
    stroke: #fff;
    stroke-width: 2;
}

.card{ 
    border-radius: 20px;
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.356), 0 0 6px rgba(0, 0, 0, 0.05);
}

.flex {
    align-items: center;
    justify-content: center;
  }
  
  .flex .drop-down {
    margin-left: 2rem;
    width: 12rem;
  }
  
  .country-item img {
    width: 19px;
    margin-right: 0.5rem;
  }
  
  .order-origin {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='58' height='43' fill='none' viewBox='0 0 58 43'%3e%3cpath fill='%23264986' d='M56.55 37.267H1.45c-.8 0-1.45.641-1.45 1.433v2.867C0 42.359.65 43 1.45 43h55.1c.8 0 1.45-.641 1.45-1.433V38.7c0-.792-.65-1.433-1.45-1.433ZM7.3 27.706c.57.612 1.368.96 2.205.96l11.83-.017a6.004 6.004 0 0 0 2.686-.638l26.368-13.227c2.423-1.215 4.595-2.95 6.073-5.223 1.66-2.551 1.84-4.398 1.185-5.702-.654-1.305-2.242-2.264-5.28-2.46-2.704-.173-5.395.531-7.818 1.746l-8.927 4.478-19.82-7.35a1.625 1.625 0 0 0-1.631-.1L8.213 3.162a1.627 1.627 0 0 0-.469 2.556l14.157 8.788-9.353 4.692-6.557-3.267a1.629 1.629 0 0 0-1.456.002L.898 17.758a1.627 1.627 0 0 0-.504 2.515L7.3 27.706Z'/%3e%3c/svg%3e");
    width: 58px;
    height: 43px;
  
  &
  --Vector {
    background-position: 0 0;
  }
  
  }
  
  .order-destination {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='58' height='46' fill='none' viewBox='0 0 58 46'%3e%3cpath fill='%23264986' d='M56.55 40.25H1.45c-.801 0-1.45.643-1.45 1.438v2.874C0 45.358.649 46 1.45 46h55.1c.801 0 1.45-.643 1.45-1.438v-2.874c0-.795-.649-1.438-1.45-1.438ZM4.06 18.477l8.043 7.188a5.68 5.68 0 0 0 2.308 1.251l26.064 7.04c2.4.647 4.944.783 7.34.122 2.69-.743 3.937-1.906 4.283-3.209.347-1.302-.157-2.938-2.118-4.937-1.748-1.781-4.02-2.946-6.42-3.594l-8.836-2.386-9.095-17.237a1.5 1.5 0 0 0-1.057-1.07L18.673.052a1.493 1.493 0 0 0-1.877 1.477l4.343 14.753-9.262-2.5-2.5-6.1a1.494 1.494 0 0 0-.999-.892l-3.6-.973A1.495 1.495 0 0 0 2.9 7.244l.02 9.144c.018.8.547 1.558 1.14 2.09Z'/%3e%3c/svg%3e");
    width: 58px;
    height: 46px;
  
  &
  --Vector {
    background-position: 0 0;
  }
  
  }
  .inline{
    display: inline-block;
  }
  
  .order-box {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='50' height='35' fill='none' viewBox='0 0 50 35'%3e%3cpath fill='%23264986' d='M33.259 17.502a3.787 3.787 0 0 1-3.234-1.828l-5.023-8.328-5.016 8.328a3.8 3.8 0 0 1-3.242 1.836c-.351 0-.703-.047-1.039-.148L5.003 14.299v13.906c0 1.149.781 2.149 1.89 2.422l16.89 4.226a5.078 5.078 0 0 0 2.422 0l16.905-4.226A2.505 2.505 0 0 0 45 28.205V14.3l-10.702 3.055a3.595 3.595 0 0 1-1.039.148Zm16.608-8.765L45.844.706A1.276 1.276 0 0 0 44.54.011L25.002 2.503l7.163 11.882c.297.492.89.727 1.446.57l15.46-4.413a1.287 1.287 0 0 0 .796-1.805ZM4.16.706.136 8.737c-.36.719.024 1.578.79 1.797l15.46 4.414a1.284 1.284 0 0 0 1.444-.57l7.172-11.875L5.456.01A1.277 1.277 0 0 0 4.16.706Z'/%3e%3c/svg%3e");
    width: 50px;
    height: 35px;
  
  &
  --Vector {
    background-position: 0 0;
  }
  
  }
  .p-button i, .p-button span{
    color: white;
  }

  h2{
    padding-bottom: 0;
    margin-bottom: 0;
    margin-left: 10px;
    margin-left: 10px;
  }
  h1{
    margin:10px;
    padding:10px;
    padding-bottom: 0;
    margin-bottom: 0;

  }
  div.p-card-content{
    padding-top: 0;
  }
  .p-button.google {
    background: linear-gradient(to left, #213d50 50%, #213d50 50%);
    background-size: 200% 100%;
    background-position: right bottom;
    transition: background-position 0.5s ease-out;
    color: #000;
    border-color: #213d50;
}
.p-button.google:hover {
    background-position: left bottom;
}
.p-button.google i {
    background-color: #213d50;
}
.p-button.amazgoogleon:focus {
    box-shadow: 0 0 0 1px #213d50;
}

</style>
