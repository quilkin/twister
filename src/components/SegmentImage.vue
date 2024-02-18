<script setup lang="ts">
import { computed, onMounted , onBeforeUnmount, onUpdated, ref} from 'vue'
import {  randInteger,type image , Options, valueToPoint} from '../util'

const emit = defineEmits(['clickImage'])

const props = defineProps<{
  img: string,
  size: number,
  radius: number
  centre: number,
  increment: number;
  index: number,
  segments: number,
  options : {[key in Options]: number | boolean}
}>()

let timer:  number;
const doesWiggle = ref(false);


onMounted(() =>{

    window.clearInterval(timer);
    if (props.options.wiggles) {
      // each item wiggles every 10 secs but starting at different times
      window.setTimeout( ()=>{
        timer = window.setInterval(wiggle, 10000);
      },randInteger(10000));
    }
  }
)

onBeforeUnmount(() =>{
    window.clearInterval(timer);
})


function wiggle() {
  doesWiggle.value = true;
  window.setTimeout( ()=>{
    doesWiggle.value = false;
  },1000);
}

const colours = ['blue','black','red','orange','green','purple', 'brown']

/**
 * find position of origin of image (svg letter, word or image)
 * 
 */
const point = computed(() =>
{
  let p ;

    // calculate depending on segment it's in
    p = valueToPoint(props.centre, props.index, props.segments, props.radius, props.increment);

  // given position is bottom LH corner of image
  // adjust to center of letter
  if (props.img==='l')
    p.x -= props.size/5;   
  else 
    p.x -= props.size/3;    // size being approx height of one char
  p.y += props.size/3;

  return p;
})

/**
 * find position to rotate around - i.e. centre of image. 
 */
const centrePoint = computed(() =>
{
  let p;

    // calculate depending on segment it's in
    p = valueToPoint(props.centre, props.index, props.segments, props.radius, props.increment);
 
  return p;

})


function rotate() {
  //if (props.options.randomAngle && props.index > 0) // don't rotate centre letter
  // if (props.options.randomAngle ) 
  //   return randInteger(360);
  return 0;
}
function transform(point: { x: number; y: number; }) {
  return `rotate(${rotate()},${point.x},${point.y})`
  //return `rotate(${rotate()})`
}


function colour() {
  let index = 0;
  if (props.options.multiColour)
    index = randInteger(colours.length);
  return colours[index];
}


</script>

<template>

    <text 
      
      :font-size="props.size"
      :transform="transform(centrePoint)"
      :fill= "colour()"
      style = "background-color: aquamarine;"
      @click="emit('clickImage',props.img)"
      class="wheeltext"
      :x="point.x"
      :y="point.y">
     {{ props.img }}
  </text>
</template>

<style scoped>


.wiggle {
    animation: wiggle .1s alternate 6 ease-in-out;
  }
@keyframes wiggle {
  from {
    translate: -10px 0;
  }
  to {
    translate: 10px 0;
  }
}
.highlight{
    animation: hl .4s infinite alternate ease-in-out;
  }
@keyframes hl {
  0% {
        transform: scale(1.2,0.8);
    }
  100% {
        transform: scale(0.8,1.2);
    }
}

.wheeltext {

    font-weight: bold;
    font-family: Arial, Helvetica, sans-serif;
    cursor: pointer;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
    
}
.wheelImage {
  cursor: pointer;
  -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
}
.wheeltext:hover {
     cursor: grabbing;
    
}
</style>