<template>
<!-- make div resize -->
<div class="mx-auto w-full h-full">
  <BarChart v-if="barObject != null" :chartData="barObject.dataForBar" :options="options" class="h-52"/>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BarChart } from 'vue-chart-3';
import firebase from 'firebase';

const db = firebase.firestore();

const red_inside = "#FEE2E2";
const red_outside = "#EF4444";
const blue_inside = "#DBEAFE";
const blue_outside = "#3B82F6";
const yellow_inside = "#FEF3C7";
const yellow_outside = "#FCD34D";
const purple_inside = "#E0E7FF";
const purple_outside = "#8B5CF6";

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
        maintainAspectRatio: false,
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
            console.log(docdata);
            console.log(docdata.imgVotesArray);
            // var votesArray = this.convertToPercentage(docdata.imgVotesArray);
            var votesArray = []
            // Very ugly function but works
            for (let i = 0; i < docdata.title_array.length; i++) {
              console.log(docdata.title_array[i])
              if(i==0){votesArray.push(docdata.img_1_votes)};
              if(i==1){votesArray.push(docdata.img_2_votes)};
              if(i==2){votesArray.push(docdata.img_3_votes)};
              if(i==3){votesArray.push(docdata.img_4_votes)};
            }
            console.log(votesArray)
            votesArray = this.convertToPercentage(votesArray)
            return {
                dataForBar: {
                    labels: docdata.title_array,
                    datasets: [
                        {
                            label: "Sample Test",
                            backgroundColor: [red_inside, blue_inside,yellow_inside,purple_inside], // pick better colors and border colors
                            data: votesArray, 
                            borderColor: [red_outside,blue_outside,yellow_outside,purple_outside],
                            borderWidth: 2,
                            borderRadius: 10,
                        }
                    ]
                }
            }
        },
        convertToPercentage(votesArray){
          var total = 0
          for (let i = 0; i < votesArray.length; i++) {
              total += votesArray[i]
          };
          var returnable = []
          for (let i = 0; i < votesArray.length; i++) {
            returnable[i] = (votesArray[i]/total)*100;
          }
          console.log(returnable)
          return returnable;
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