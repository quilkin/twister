<script setup lang="ts">
import { computed, onMounted } from 'vue'
import {  valueToPoint, Symbols} from '../util'

const props = defineProps<{
  img: string,
  size: number,
  radius: number
  centre: number,
  increment: number;
  index: number,
  segments: number,
}>()


onMounted(() =>{
})



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
  p.x -= props.size/3;    // size being approx height of one char
  p.y += props.size/3;

  // adjust to center of letter
  if (props.img===Symbols.minus) {
 
    p.y -= props.size/2;
  }  
  if (props.img===Symbols.times) {
    //p.x += props.size/5; 
    p.y -= props.size/5;
  }  
  // if (props.img==='+') {
  //   p.y -= props.size/5;
  // }  

  return p;
})


</script>

<template>

    <text 
      :font-size="props.size"
      fill= 'black'
      :x="point.x"
      :y="point.y">
     {{ props.img }}
  </text>
</template>

<style scoped>

</style>