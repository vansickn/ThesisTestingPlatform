<template>
  <div
    @dragenter.prevent="toggleActive"
    @dragleave.prevent="toggleActive"
    @dragover.prevent
    @drop.prevent="toggleActive"
    :class="{ 'active-dropzone': active }"
    class="container flex flex-col gap-10 bg-gray-200 justify-center items-center border-4 border-dashed border-red-500 md:w-640 md:h-360 sm:w-426 sm:h-240 xs:w-9/12 xs:h-240 mb-5"
  >
    <span class="text-red-500 font-bold text-xl sm:hidden xs:hidden md:inline">Drag and Drop Thumbnail</span>
    <span class="text-bold text-3xl sm:hidden xs:hidden md:inline">OR</span>
    <label for="dropzoneFile" class="bg-red-500 rounded-lg px-10 py-6 transition duration-500 transform hover:scale-110 text-white">Select Thumbnail from files</label>
    <input type="file" name="dropzoneFile" id="dropzoneFile" class="dropzoneFile hidden"/>
    <!-- <label for="dropzoneFile" class="bg-black">Select File</label>
    <input type="file" name="dropzoneFile" id="dropzoneFile" class=""> -->
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "DropZone",
  setup() {
    const active = ref(false);
    const toggleActive = () => {
      active.value = !active.value;
    };
    return { active, toggleActive };
  },
};
</script>

<style scoped lang="scss">
// .dropzone {
//   // need to figure out how to retain scale when the screen is resized for the dropzone, same actions as the img

//   width: 640px;
//   height: 360px;

//   position: relative;

//   // max-width: 640px;
//   // max-height: 360px;

//   // min-width: 256px;
//   // min-width: 144px;

//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   row-gap: 16px;
//   border: 2px dashed red;
//   background-color: #fff;
//   transition: 0.3s ease all;

//   label {
//     padding: 8px 12px;
//     color: #fff;
//     background-color: red;
//     transition: 0.3s ease all;
//   }
//   input {
//     display: none;
//   }
// }
// .active-dropzone {
//   color: #fff;
//   border-color: #fff;
//   background-color: red;
//   label {
//     background-color: #fff;
//     color: red;
//   }
// }
</style>