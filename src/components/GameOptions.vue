<script setup lang="ts">
import { onMounted } from 'vue';
import { Options, imageTypes} from '../util'

const emit = defineEmits(['doneSetup','changeImages'])
const options = defineModel<{[key in Options]: any}>()


function info() { 
    let words = 'Turn the circles by clicking on them (click letters to go backwards). ';
    if (options.value === undefined)
        return '';
    if (options.value.imageType === imageTypes.words) {
        words += 'Line up the letters to form a set of words which read from the outer ring to the inner.';
        words += ' Maybe choose 2-letters words to start, to get the idea.';
    }
    else {
        words += 'Line up the digits to form a set of sums ';
        words += 'so that all of the answers are correct';
    }
    
    return words + '\n\r';
}

function sets() {
    if (options.value === undefined)
        return '';
    if (options.value.imageType === imageTypes.words) 
        return 'No. of words: '
    else
        return 'No. of sums: '
}
</script>

<template>
    <v-container class="pa-0" v-if="options"
       style="width: 350px; height: 400px; padding: 0px;  position: relative;">
        <v-card-title>How to play</v-card-title>
        <v-card-text class="pa-1">
            {{ info() }}
        </v-card-text>
        <v-card-text class="pa-1">
            Use the central button to check your answer
        </v-card-text>
        <v-form   @submit = "emit('doneSetup')" >
  
            <label >Game: </label>
            <input type="radio" id="one" :value="imageTypes.words" v-model="options.imageType"  @change="emit('changeImages')"/>
            <label for="one">&nbsp;Words</label>
            &nbsp;
            <input type="radio" id="two" :value="imageTypes.additions" v-model="options.imageType"  @change="emit('changeImages')"/>
            <label for="two">&nbsp;2+3=5</label>
            &nbsp;
            <input  type="radio" id="three" :value="imageTypes.sums" v-model="options.imageType"  @change="emit('changeImages')"/>
            <label for="two">&nbsp;7?5=2</label> 
            <p></p>

          <div v-if="options.imageType===imageTypes.words">
            <label >Number of letters: </label>
            <input type="radio" id="two" :value="2" v-model="options.numberOfRings"  @change="emit('changeImages')"/>
            <label for="two">two</label>
            &nbsp;
            <input type="radio" id="three" :value="3" v-model="options.numberOfRings"  @change="emit('changeImages')"/>
            <label for="three">three</label>
            &nbsp;
            <input type="radio" id="four" :value="4" v-model="options.numberOfRings"  @change="emit('changeImages')"/>
            <label for="four">four</label>
          </div>
            <p></p>

            
             <v-spacer></v-spacer>
            <label for="numImagesSlider">{{ sets() }}</label>
            <input type="range"  style="width:175px;" id="numImagesSlider"
             v-model.number="options.numberOfWords"
             @change="emit('changeImages')"
             min="8" max="16" step="1"
             >
             <label>&nbsp;{{ options.numberOfWords }}</label>

            <v-btn  type="submit" variant="tonal"  color="blue" block class="mt-2">Start Game</v-btn>
        </v-form>
    </v-container>
</template>

