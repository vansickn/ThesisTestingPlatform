<template>
    <div class="w-10/12 mx-auto container flex flex-col">
        <h1 class="text-2xl md:text-4xl text-center mx-auto mb-10 mt-5">Consent Form</h1>

        <span class="text-lg">
            I, the signed, hereby give the interviewer and associated parties consent to use my experimental data in this study. I give my 
            consent for the recording of the zoom session associated with this interview. The experimenter will not use my data in any form
            other than for analysis, and will not share data to any other party. Additionally, if at any time I want to retract my data, I can
            do so by emailing the interviewer at <a class="font-bold">vansickn@union.edu</a>. At the end of the experiment, I consent to be 
            sent a post-experiment debrief, explaining the purpose of the study and its findings. The experimenter thanks you for your
            participation!
        </span>

        <button @click="sendToStartSurvey" class="bg-red-500 text-white p-5 mt-10 w-40 rounded-xl shadow-lg mx-auto">I consent</button>

    </div>
</template>

<script>
export default {
    methods: {
        sendToStartSurvey(){
            this.$router.push('/startsurvey');
        }
    }
}
</script>

<style>

</style>