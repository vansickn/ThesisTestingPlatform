<template>
<!-- make div resize -->
<div class="mx-auto w-full h-full">
  <BarChart v-if="barObject != null" :chartData="barObject.dataForBar" :options="options" />
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BarChart } from 'vue-chart-3';
import firebase from 'firebase';

const db = firebase.firestore();


export default defineComponent({
  name: 'Home',
  props: ['id'],
  components: { BarChart },
  setup() {
    var testData = {
      labels: ['Paris', 'Nîmes', 'Toulon', 'Perpignan', 'Autre'],
      datasets: [
        {
          data: [30, 40, 60, 70, 5],
          backgroundColor: ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED'],
        },
      ],
    };
    const options = {
        min: 0,
        max: 100,
        responsive: true,
        onResize: function(){
          console.log("resized")
        },
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        labels: {
          font: {
            size: 5
          }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: {
              callback: function (value) {
                return `${value}%`;
              },
            },
          },
        },
        font: {
          size: 20
        }
    };

    return { testData, options };
  },
  data(){
      return { 
        barObject: null
      }
  },
  methods: {
      async generateBarObject(){
            db.collection('CreatedTests').doc(this.id).onSnapshot((doc) => {
                this.barObject = this.createBarObject(doc.data());
            })
        },
        createBarObject(docdata){
            // console.log(docdata)
            console.log(docdata)
            return {
                dataForBar: {
                    labels: [docdata.title1,docdata.title2],
                    datasets: [
                        {
                            label: "Sample Test",
                            backgroundColor: ["#1abc9c", "#f1c40f", "#2980b9", "#34495e"],
                            data: [this.convertToPercentage(docdata.img1votes,docdata.img2votes), this.convertToPercentage(docdata.img2votes,docdata.img1votes)] 
                        }
                    ]
                }
            }
        },
        convertToPercentage(first,second){
            return ((first/(first+second)) * 100);
        },
  },
  created(){
      console.log("Created");
      console.log(this.id)
      this.generateBarObject();
  },
});
</script>