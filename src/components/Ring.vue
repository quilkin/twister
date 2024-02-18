<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SegmentImage from './SegmentImage.vue'
import MathSign from './mathSign.vue'
import { Options, imageTypes } from '../util'

const emit = defineEmits(['clickImage','twist']);

const props =defineProps<{
  ring: number,
  started: boolean,
  letters: string[],
  centre: number,
  radius : number,
  thickness : number,
  increments : number,
  options : {[key in Options]: number | boolean},

}>()


onMounted(() =>{

  console.log(props.letters);
  console.log('onMounted 1: ring: ' + props.ring + ' incs: ' + props.increments)
})


function letterPos()
{
  return props.radius;
}
function size() {
  switch(props.options.numberOfRings) {
    case 2: return props.thickness  * 0.7;
    case 4: return props.thickness  * 0.9;
    default: return props.thickness  * 0.9;
  }
  
  
}


function clickCircle(backwards : boolean)
{
  console.log('clicked: ' + backwards)
  if (props.started === false)
    return;
  emit('twist',props.ring,backwards,true);
  return;
  
}

</script>

<template>
  <g>
    <circle id="outer" :cx="props.centre" :cy="props.centre" :r="props.radius" 
      
  
      @click="clickCircle(true)"

      :stroke-width="$props.thickness"
        stroke="green"  fill="transparent"/>

      <segment-image  
        v-for="(image, index) in letters"
        :options = "options"
        :centre = "props.centre"
        :size = "size()"
        :radius = "letterPos()"
        :img="image"
        :index="index"
        :increment="props.increments"
        :segments="letters.length"
        @click-image="clickCircle(false)"
      >
      </segment-image>
      <math-sign v-if="props.options.imageType === imageTypes.additions && props.ring==0"
        v-for="(image, index) in letters"
          :centre = "props.centre"
          :size = "size()*0.7"
          :radius = "letterPos()-props.thickness/2"
          img="+"
          :index="index"
          :increment="props.increments"
          :segments="letters.length"
        >
      </math-sign>
      <math-sign v-if="props.options.imageType === imageTypes.additions && props.ring==1"
        v-for="(image, index) in letters"
          :centre = "props.centre"
          :size = "size()*0.7"
          :radius = "letterPos()-props.thickness/2"
          img="="
          :index="index"
          :increment="props.increments"
          :segments="letters.length"
        >
      </math-sign>


  </g>

   
</template>

<style>

  #outer {
     stroke-opacity: 0.12;

  }  
  #outer:hover { 
      stroke-opacity: 0.24;
      cursor:grab
      
  }

</style>