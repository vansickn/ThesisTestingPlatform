<template>
  <div class="w-11/12 max-w-3xl mx-auto">
    <vue3-chart-js v-if="barObject != null" :id="barChart.id" :type="barChart.type" :data="barObject.dataForBar"/>
  </div>
</template>

<script>
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import firebase from 'firebase';
const db = firebase.firestore();

export default {
  name: "App",
  props: ['id'],
  components: {
    Vue3ChartJs,
  },
  setup() {
    const barChart = {
      id: 'barchart',
      type: "bar",
      options: {
        min: 0,
        max: 100,
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
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
      },
      data: {
        labels: ["VueJs", "EmberJs"],
        datasets: [
          {
            label: "My First Dataset",
            backgroundColor: ["#1abc9c", "#f1c40f", "#2980b9", "#34495e"],
            data: [40, 20],
          },
        ],
      },
    };

    return {
      barChart,
    };
  },
  methods: {
      async generateBarObject(){
            db.collection('CreatedTests').doc(this.id).onSnapshot((doc) => {
                this.barObject = this.createBarObject(doc.data());
                console.log(this.barObject)
            })
        },
        createBarObject(docdata){
            // console.log(docdata)
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
            return (first/(first+second));
        }
  },
  data(){
      return {
          barObject: null,
      }
  },
  created(){
      console.log("Created");
      console.log(this.id)
      console.log(this.loaded)
      this.generateBarObject();
  }
}
</script>
