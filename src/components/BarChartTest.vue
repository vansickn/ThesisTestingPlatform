<template>
<!-- make div resize -->
<div class="mx-auto w-full h-full">
  <BarChart v-if="barObject != null" :chartData="barObject.dataForBar" :options="options"/>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BarChart } from 'vue-chart-3';
import firebase from 'firebase';

const db = firebase.firestore();

const red_inside = "#FEE2E2"
const red_outside = "#EF4444"
const blue_inside = "#DBEAFE"
const blue_outside = "#3B82F6"

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
          label: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function(context){
                var percentage = context.formattedValue || '';
                return percentage + '%';
              }
            }
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
              font:{
                size: 9,
                family: 'Helvetica' //figure out the same font
              }
            },
          },
          x: {
            display: false,
          }
        },
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
                            backgroundColor: [red_inside, blue_inside], // pick better colors and border colors
                            data: [this.convertToPercentage(docdata.img1votes,docdata.img2votes), this.convertToPercentage(docdata.img2votes,docdata.img1votes)], 
                            borderColor: [red_outside,blue_outside],
                            borderWidth: 2,
                            borderRadius: 10,
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
      console.log(BarChart)
      // BarChart.plugins.default = {
      //   global: {
      //     defaultFont:'Georigia'
      //   }
      // }
  },
});
</script>