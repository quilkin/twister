<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import SegmentImage from './SegmentImage.vue'
import MathSign from './mathSign.vue'
import { type image, Options, imageTypes } from '../util'

const emit = defineEmits(['clickImage','sendIncrement'])

const props =defineProps<{
  ring: number,
  started: boolean,
  letters: string[],
  centre: number,
  radius : number,
  thickness : number,
  increments : number,
  options : {[key in Options]: number | boolean},
  // index to correct image to click
  answer: number;
}>()

const increment = ref(props.increments);

onMounted(() =>{
  console.log(props.letters);
})
function submitImage(imageID : number)
{
  // just pass up through to top level
  //emit("clickImage",imageID);
  clickCircle(false);

}


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

function checkIncrements() {

  while (increment.value % 10 !== 0)
    ++increment.value;

  // ensure multiple rotations are taken care of
  if (increment.value/10 > props.letters.length)
    increment.value -= props.letters.length * 10;
  if (increment.value/10 < 0)
    increment.value += props.letters.length * 10;
  console.log(props.ring + ' increments: ' + increment.value);

  emit('sendIncrement',props.ring,increment.value);

}

let clicks = 0;
let clickTimer = -1;
function clickCircle(backwards : boolean)
{
  console.log('clicked: ' + backwards)
  if (props.started === false)
    return;
  twist(backwards);
  return;
  //console.log('clciks ' + clicks);
  ++clicks;
  if (clicks === 1) {
        
      clickTimer = window.setTimeout(function() {
        twist(true);  //perform single-click action 
     
      clicks = 0;    //after action performed, reset counter

    }, 200);
  }
  else {
      clearTimeout(clickTimer);    //prevent single-click action
      twist(false);  //perform double-click action
      clicks = 0;   //after action performed, reset counter
  }
}

function twist(backwards : boolean) {
  //console.log('twist' + backwards);
 // animate the angle of letter placement 10 times, to bring next letter into line
 let count = 11;
 let timer = window.setInterval(()=> {
    if (backwards)
      --increment.value;
    else 
      ++increment.value;
    if (--count <= 0) {
      window.clearTimeout(timer);
      window.setTimeout(()=> {
        // bounce back one tenth
        if (backwards)
          ++increment.value;
        else 
          --increment.value;
        checkIncrements();


      },50)
    }
 },50)
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
        :increment="increment"
        :answer = "index===props.answer"
        :segments="letters.length"
        @click-image=submitImage
      >
      </segment-image>
      <math-sign v-if="props.options.imageType === imageTypes.additions && props.ring==0"
        v-for="(image, index) in letters"
          :centre = "props.centre"
          :size = "size()*0.7"
          :radius = "letterPos()-props.thickness/2"
          img="+"
          :index="index"
          :increment="increment"
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
          :increment="increment"
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