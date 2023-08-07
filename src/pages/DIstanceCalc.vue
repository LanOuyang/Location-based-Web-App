<template>
    <main>
        <OriginDestinationForm />
        <RouteList />
        <DirectionsMapView />
    </main>
</template>

<script>
import OriginDestinationForm from '@/components/OriginDestinationForm.vue';
import RouteList from '@/components/RouteList.vue';
import DirectionsMapView from '@/components/DirectionsMapView.vue';

export default {
    components: {
        OriginDestinationForm, RouteList, DirectionsMapView
    }
}
</script>