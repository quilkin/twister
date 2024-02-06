<script setup lang="ts">
import { computed } from 'vue'
import { valueToPoint } from '../util'
const emit = defineEmits(['clickImage'])

const props = defineProps<{
  img: string,
  size: number,
  index: number,
  segments: number
}>()

// draw a 'tetrahedron' for each of the segments (actually 5 sides, to better match the circle curve)
// click in each tetrahedron to choose the corresponding letter


function point(posOffset:number,indexOffset:number) {
    //let size = props.index === 0? 0: props.size;
    let size =  props.size;
    const { x, y } =  valueToPoint(size + posOffset, props.index +indexOffset, props.segments,posOffset)
    //const { x, y } =  valueToPoint(size,  props.index +indexOffset, props.segments)
    return `${x},${y}`
} 

const points = computed(() => {
    const ps = [point(35,1),point(-60,1),point(-60,0),point(35,0),point(35,0.5)]
    return ps.join(' ')
 })
</script>

<template>
    <polygon :points=points @click="emit('clickImage',props.img)"></polygon>  
</template>

<style  scoped>

  polygon {
      stroke: rgb(74, 109, 38);
      fill: transparent;
      cursor: pointer
    }
    polygon:hover { 
      fill: rgb(74, 109, 38);
      fill-opacity: 0.2;
      cursor: pointer;
      
  }

</style>