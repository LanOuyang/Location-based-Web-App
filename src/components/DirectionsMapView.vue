<template>
    <section class="map" ref="map"></section>
</template>

<script>
import { EventBus } from '../EventBus';
export default {
    data(){
        return {
            map:null,
        }
    },
    mounted(){
        // Show the map at the beginning
        this.map = new google.maps.Map(this.$refs["map"], {
            center: new google.maps.LatLng(48.137154, 11.576124),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        
        const directionsService = new google.maps.DirectionsService();
        // const directionsRenderer = new google.maps.DirectionsRenderer();

        EventBus.$on("routes-data", routes => {
            this.map = new google.maps.Map(this.$refs["map"], {
                center: new google.maps.LatLng(48.137154, 11.576124),
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            routes.forEach(({origin, destination, distance, duration, color}) => {
                directionsService.route({
                    origin: origin.address,
                    destination: destination.address,
                    travelMode: "DRIVING"
                }, 
                (response, status) => {
                    if(status === "OK"){
                        const directionsRenderer = new google.maps.DirectionsRenderer({
                            suppressMarkers: true,
                            polylineOptions: {
                                strokeColor: color,
                                strokeWeight: 8,
                            }
                            // directions: response,
                            // map: this.map,
                        });

                        this.createInfoWindow(origin, "marker alternate", color);

                        this.createInfoWindow(destination, "flag checkered", color);

                        const overviewPath = response.routes[0].overview_path;
                        const middleIndex = parseInt(overviewPath.length / 2);
                        const middleLoc = overviewPath[middleIndex];

                        const distanceDurationLabel = new google.maps.InfoWindow({
                            content: `<div style="background-color:${color};padding:5px"><i class="icon car"></i> ${distance.text} - ${duration.text}</div>`,
                            position: new google.maps.LatLng(middleLoc.lat(), middleLoc.lng()),
                        });

                        distanceDurationLabel.open(this.map, null);

                        directionsRenderer.setDirections(response);
                        directionsRenderer.setMap(this.map);

                        this.createPolyline([
                                {lat: origin.lat,lng: origin.lng,},
                                {lat: overviewPath[0].lat(),lng: overviewPath[0].lng(),}
                            ], color);
                        this.createPolyline([
                                {lat: destination.lat,lng: destination.lng,},
                                {lat: overviewPath[overviewPath.length-1].lat(),lng: overviewPath[overviewPath.length-1].lng(),}
                            ], color);
                    }
                });
            })
        })
    },
    methods: {
        createInfoWindow(location, icon, color){
            const label = new google.maps.InfoWindow({
                content: `<div style="background-color:${color};padding:5px"><i class="${icon} icon"></i> ${location.address}</div>`,
                position: new google.maps.LatLng(location.lat, location.lng),
            });

            label.open(this.map, null);
        },
        createPolyline(path, color){
            new google.maps.Polyline({
                path,
                strokeColor: color,
                strokeCapacity: 1,
                strokeWeight: 8,
                map:this.map,
            });
        }
    }
}
</script>

<style> 
/* scoped : style only applied to this component */
.map {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: red;
}
.gm-style-iw button{
    display: none!important;
}
.gm-style .gm-style-iw-c {
    padding: 0px!important;
}
.gm-style-iw-d {
    overflow: hidden!important;
}
</style>