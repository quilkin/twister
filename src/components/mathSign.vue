<script setup lang="ts">
import { computed, onMounted , onBeforeUnmount, onUpdated, ref} from 'vue'
import {  randInteger,type image , Options, imageTypes} from '../util'

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


function valueToPoint(size: number,  index:number, total: number, letterPos: number, increment: number) {
  
  const x = 0
  const y = -letterPos;

  // find angle to centre of segment
  const angle = ((Math.PI * 2) / total) * (index - increment/10)
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  var tx = x * cos - y * sin + size;
  var ty = x * sin + y * cos + size;

  ty += 5;

  return {
    x: tx,
    y: ty
  }
}
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

  return p;
})

/**
 * find position to rotate around - i.e. centre of image. 
 */
// const centrePoint = computed(() =>
// {
//   let p;

//     // calculate depending on segment it's in
//     p = valueToPoint(props.centre, props.index, props.segments, props.radius, props.increment);
 
//   return p;

// })


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