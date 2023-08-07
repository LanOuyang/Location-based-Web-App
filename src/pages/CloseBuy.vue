<template>
    <div class="ui grid">
        <div class="six wide column red">
            <form class="ui segment large form">
                <div class="ui message red" v-show="error">{{ error }}</div>
                <div class="ui segment">
                    <div class="field">
                        <div class="ui right icon input large" :class="{loading:spinner}">
                            <input 
                            type="text" 
                            placeholder="Enter your address" 
                            v-model="address"
                            id="autocomplete"/>
                            <i class="dot circle link icon" @click="locatorButtonPressed"></i>
                        </div>
                        <div class="two fields">
                            <div class="field">
                                <select v-model="type">
                                    <option value="Restaurant">
                                        Restaurant
                                    </option>
                                </select>
                            </div>
                            <div class="field">
                                <select v-model="radius">
                                    <option value="5">5KM</option>
                                    <option value="10">10KM</option>
                                    <option value="15">15KM</option>
                                    <option value="20">20KM</option>

                                </select>
                            </div>
                        </div>
                    </div>
                    <button class="ui button" @click="findCLoseBuyButtonPressed">Find CLoseBuy Places</button>
                </div>
            </form> 
            <div class="ui segment" style="max-height: 300px;overflow: auto;">
                <div class="ui divided items">
                    <div 
                        class="item" 
                        v-for="(place, index) in places" 
                        :key="place.id" 
                        @click="showInfoWindow(index)" 
                        :class="{'active' : activeIndex==index}" 
                        style="padding:10px">
                        <div class="content">
                            <div class="header">{{ place.name }}</div>
                            <div class="meta">{{ place.vicinity }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="ten wide column" ref="map">

        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data(){
        return {
            address: '',
            error: '',
            spinner: false,
            apiKey: 'AIzaSyAOnvgJLa9SBnOXHv1yYlgKrNCCmf1wGeA',
            lat: 0,
            lng: 0,
            type: '',
            radius: '',
            places: [],
            markers: [],
            activeIndex: -1
        }
    },

    mounted() {
        let autocomplete = new google.maps.places.Autocomplete(
            // this.$refs["autocomplete"],
            document.getElementById("autocomplete"),
            {
                bounds: new google.maps.LatLngBounds(
                    new google.maps.LatLng(45.4215296, -75.6971931)
                )
            }
        );

        autocomplete.addListener("place_changed", () => {
            let place = autocomplete.getPlace();
            // console.log(place);
            // this.showUserLocationOnTheMap(place.geometry.location.lat(), place.geometry.location.lng());

            this.address = place.formatted_address;
            this.lat = place.geometry.location.lat();
            this.lng = place.geometry.location.lng();
        })
    },

    methods: {
        locatorButtonPressed() {
            this.spinner = true;

            if(navigator.geolocation){
                 navigator.geolocation.getCurrentPosition(position => {
                    this.lat = position.coords.latitude;
                    this.lng = position.coords.longitude;

                    this.getAddressFrom(position.coords.latitude, position.coords.longitude)
                    // console.log(position.coords.latitude);
                    // console.log(position.coords.longitude);
                    this.spinner = false;

                    this.showUserLocationOnTheMap(position.coords.latitude, position.coords.longitude);
                 },
                 error => {
                    this.error = "Locator is unable to find your address. Please type your address manually.";
                    // console.log(error.message);

                    this.spinner = false;
                 });
            }
            else {
                this.error = "Your browser does not support geolocation API ";
                // console.log("Your browser does not support geolocation API ");

                this.spinner = false;
            }
            
        },
        getAddressFrom(lat, long){
            axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" 
                + lat 
                + ',' 
                + long 
                + "&key="
                + this.apiKey
            )
                .then(response => {
                    if(response.data.error_message){
                        this.error = response.data.error_message;
                        // console.log(response.data.error_message);
                    }
                    else{
                        this.address = response.data.results[0].formatted_address;
                        // console.log(response.data.results[0].formatted_address);
                    }
                })
                .catch(error => {
                    this.error = error.message;
                    // console.log(error.message);
                })
        },
        showUserLocationOnTheMap(latitude, longitude){
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom:15,
                center:new google.maps.LatLng(latitude, longitude),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            new google.maps.Marker({
                position: new google.maps.LatLng(latitude, longitude),
                map: map
            })
        },
        findCLoseBuyButtonPressed(){
            const proxyURL = "https://cors-anywhere.herokuapp.com/";
            const URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.lat},${this.lng}&type=${this.type}&radius=${this.radius*1000}&key=${this.apiKey}`;
            axios.get(proxyURL+URL)
            .then(response => {
                this.places = response.data.results;
                this.showPlacesOnMap();
                // console.log(response);
            })
            .catch(error => {
                this.error = error.message;
                console.log(error.message);
            })
        },

        showPlacesOnMap(){
            const map = new google.maps.Map(
                this.$refs["map"],
                {
                    zoom:15,
                    center: new google.maps.LatLng(this.lat, this.lng),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }
            )

            const infoWindow = new google.maps.InfoWindow();

            for(let i=0; i<this.places.length; i++){

                const lat = this.places[i].geometry.location.lat;
                const lng = this.places[i].geometry.location.lng;
                const placeID  = this.places[i].place_id;

                const marker = new google.maps.Marker({
                    position: new google.maps.LatLng(lat, lng),
                    map: map
                });
                this.markers.push(marker);
                new markerClusterer.MarkerClusterer({
                    map,
                    markers: this.markers
                });

                google.maps.event.addListener(
                    marker,
                    "click",
                    () => {
                        const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?key=${this.apiKey}&place_id=${placeID}`
                        axios.get(URL)
                        .then(response => {
                            if(response.data.error_message){
                                this.error = response.data.error_message;
                            }
                            else{
                                const place = response.data.result;
                                infoWindow.setContent(
                                    `<div class="ui header">${place.name}</div>
                                    ${place.formatted_address} <br>
                                    ${place.formatted_phone_number} <br>
                                    <a href="${place.website}" target="_blank">${place.website}</a>`);
                                infoWindow.open(map, marker);
                            }
                        })
                        .catch(error => {
                            this.error = error.message;
                        })
                        
                    }
                );
            }   
        },
        showInfoWindow(index){
            this.activeIndex = index;
            new google.maps.event.trigger(this.markers[index], 'click');

        }
    }
};
</script>


<style>
.ui.button, .dot.circle.icon {
    background-color: #ff5a5f;
    color: white;
}

.pac-icon {
    display:none;
}

.pac-item {
    padding:10px;
    font-size:16px;
    cursor: pointer;
}

.pac-item:hover{
    background-color: #ececec;;
}
.pac-item-query {
    font-size: 16px;
}

#map {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: red;
}

.active {
    background: #ff5a5f !important;
}
</style>