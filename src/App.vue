<script setup lang="ts">
import { ref, type Ref, computed, onMounted, onBeforeMount, watch } from 'vue'
import PolyGraphic from './components/PolyGraphic.vue';
import { randInteger, Options, imageTypes } from './util'
import { words2, words3, words4, sums3} from './assets/words'
import GameOptions from './components/GameOptions.vue'
import GameScore from './components/Timer.vue'
import ModalAlert from './components/ModalAlert.vue';
import ModalQuestion from './components/ModalQuestion.vue';
import JSConfetti from 'js-confetti'
import { is } from '@babel/types';

let imageSize = 250

if (window.innerWidth > 1000)
  imageSize = 3500;
  if (window.innerWidth < 400) // iphone se
  imageSize = 200;


let wordArray = [''];
let symbolArray = [['']];
let symbolArrayCopy = [['']];
let success = false;

let increments : number[] = [0,0,0,0];
const currentMatch1 = ref(-1);
const currentMatch2 = ref(-1);

const score = ref(0);
const gameStarted = ref(false);
const isAnswerInProgress = ref(false);
const isQuestionVisible = ref(false);
const resultWords = ref('');

const options = ref() 
const jsConfetti = new JSConfetti()

const changedOptions = ref(0);
const centreEmoji = ref('😀');
const ringRef = ref();

let firstTime = true;
onBeforeMount(() =>{
   
  const randSeed = randInteger(Date.now()/1000);
  options.value = {
    [Options.timer] : false,
    [Options.colours] : true,
    [Options.numWords] : 12,
    [Options.numRings] : 3,
    [Options.wiggles] : false,
    [Options.showAnswer] : false,
    [Options.imageType] : imageTypes.words
  }
  //rings.value = [];
  setRingImages();


})

function transpose(matrix: string | any[]) {
  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < i; j++) {
      const temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }
}
onMounted(() =>{
  setRingImages();
  score.value = 0;
  

})

async function setRingImages()
{
  if (options.value.imageType === imageTypes.additions)
    options.value.numberOfRings = 3;
   
  
  let allWords;
  increments  = [0,0,0,0];

  if (options.value.imageType === imageTypes.words) {
  
    if (options.value.numberOfRings===2)
          allWords = words2;
    else  if (options.value.numberOfRings===3)
          allWords = words3;
    else
          allWords = words4;
  }
  else
    allWords = sums3;

  // choose some at random from this list
  wordArray = [];
  while (wordArray.length < options.value.numberOfWords) {
    let rand = randInteger(allWords.length);
    let word = allWords[rand];
    if (wordArray.includes(word)===false)
      wordArray.push(word);
  }
  for (let w=0; w < wordArray.length; w++)
      wordArray[w] = wordArray[w].toLowerCase();
    
  

  symbolArray=[];
  for (let word=0; word < options.value.numberOfWords; word++) {
    symbolArray[word] = Array.from(wordArray[word])
  }
  transpose(symbolArray);

  if (options.value.imageType === imageTypes.additions) {
    for (let r=0; r < options.value.numberOfRings; r++)
     symbolArrayCopy[r] = symbolArray[r].slice();
  }
  ++changedOptions.value;

}
function showSuccess() {
  jsConfetti.addConfetti({  emojis: [ '😎', '😇', '😮', '🙂','😃']})    
  gameStarted.value = false;
  // resultWords.value = `Success! ${cardCount.value} cards matched with a score of ${score.value}`;
  // isResultVisible.value = true;
  // cardCount.value = 0;

}


function twist(ring: number, incs: number) {
  if (incs == 0)
    return;
  incs /= 10;
  let timer = window.setInterval(()=> {
    ringRef.value[ring].twist(true,false);
    if (incs === undefined ||--incs <= 0) {
      window.clearTimeout(timer);
    }
  },600);
}

let incs = [0];
function calcIncrementsReqd(ring : number) {
//console.log(ring +': '+ incs[ring]);
      if (incs[ring] !== 0) 
      // e.g. if incs at 90, and there are 12 words in the game, need to do (120-90) twists to bring to zero
        incs[ring] = options.value.numberOfWords * 10 - incs[ring];
     // console.log(ring + 'a: '+ incs[ring]);

}
function showResult(giveup: boolean)
{
  isQuestionVisible.value = false;
  
  if (giveup) {
      isAnswerInProgress.value = true;

    // animate to bring all rings back to zero increments
      incs = increments.slice();
      console.log(incs);
      for (let r=0; r < 4; r++) {
        calcIncrementsReqd(r);
      }
      console.log(incs);
      // console.log('3:'+ incs[3]);
      // if (incs[3] !== 0) 
      // // e.g. if incs at 90, and there are 12 words in the game, need to do (120-90) twists to bring to zero
      //   incs[3] = options.value.numberOfWords * 10 - incs[3];
      // console.log('3a:'+ incs[3]);
      let twistTime = incs[3] * 70 + 10;
      twist(3,incs[3]);
      // twist each ring when ready
      window.setTimeout(()=> {
         //calcIncrementsReqd(2);
          // console.log('2:'+ incs[2]);
          // if (incs[2] !== 0) incs[2] = options.value.numberOfWords * 10 - incs[2];
          // console.log('2a:'+ incs[2]);
          let twistTime = incs[2] * 70 + 10;
          twist(2,incs[2]);
          window.setTimeout(()=> {
           // calcIncrementsReqd(1);
              // console.log('1:'+ incs[1]);
              // if (incs[1] !== 0) incs[1] = options.value.numberOfWords * 10 - incs[1];
              // console.log('1a:'+ incs[1]);
              let twistTime = incs[1] * 70 + 10;
              twist(1,incs[1]);
              window.setTimeout(()=> {
                //  calcIncrementsReqd(0);
                  // console.log('0:'+ incs[0]);
                  // if (incs[0] !== 0) incs[0] = options.value.numberOfWords * 10 - incs[0];
                  // console.log('0a:'+ incs[0]);
                  let twistTime = incs[0] * 70 + 10;
                  twist(0,incs[0]);
                  window.setTimeout(()=> {
                      // all twists done
                    // todo: highlight answer in some way
                    gameStarted.value = false;
                    isAnswerInProgress.value = false;
                  },twistTime)
              },twistTime)
          },twistTime)
      },twistTime)
    }
  }


function checkAnswer() {
  if (success)
  {
    centreEmoji.value = '😀'
    showSuccess();
  }
  else {
    centreEmoji.value = '😥'
  }
}


function startGame() {
  
  centreEmoji.value = '❓'
  gameStarted.value = true;
  if (ringRef.value) 
    for (let r=0; r<4; r++)
       if (ringRef.value[r])
          ringRef.value[r].newIncrements();
  if (!firstTime)
    setRingImages();
  firstTime = false;
 
}
function clickImage(ring : number) {
}

function numRings() {
  return options.value.numberOfRings;
}
function radiusPerRing() {
  // rings take up half the diameter of the outer, split into how many rings there are
  return  imageSize * 2/ (3 * numRings());
}
function radius(ring : number)
{
  return imageSize - (ring + 0.5) *  radiusPerRing();
}
function thickness(ring : number)
{
  return radiusPerRing() * 0.9;
}

/**
 * check to see if all (word) rings are aligned correctly
 * ** Note this assumes that there is only one correct answer -
 * **** chances of an incorrect ring postion giving 8 or more new allowed words is pretty small??
 * @param ring 
 * @param incs 
 */
function checkIncrements(ring: number, incs: number) {
  // if (isAnswerInProgress.value)
  //   return;
  centreEmoji.value = '❓'
  if (options.value.imageType === imageTypes.additions) {
    checkIncrementsNums(ring, incs);
    return;
  }
  increments[ring] = incs;
  success = true;
  let rings = options.value.numberOfRings;
  for (let r=0; r< rings-1; r++) {
    if (increments[r] != increments[r+1])
    success = false;
  }

  // if (success) {
  //   console.log('********** done it! *********');

  // }
}


function checkIncrementsNums(ring: number, incs: number) {
  symbolArrayCopy[ring] = symbolArray[ring].slice();
  // 'rotate' copy so that it represents what's shown
  // console.log('before shift');
  // for (let r=0; r < options.value.numberOfRings; r++)
  //    console.log(symbolArrayCopy[r]);
  while (incs > 0)
  {
    let last = symbolArrayCopy[ring].pop();
    if (last)
      symbolArrayCopy[ring].unshift(last);
    incs -= 10;
  }
  // console.log('after shift');
  // for (let r=0; r < options.value.numberOfRings; r++)
  //    console.log(symbolArrayCopy[r]);
  // now check to see if the sums work
  success = true;
  for (let n=0; n< options.value.numberOfWords; n++) {
    {
      let num1 = Number(symbolArrayCopy[0][n]);
      let num2 = Number(symbolArrayCopy[1][n]);
      let num3 = Number(symbolArrayCopy[2][n]);
      if (num1 + num2 !== num3) {
        success = false;
        break
      }

    }
  }
  // if (success) {
  //   console.log('********** done it! *********');
  // }
}


function setIncrements(ring: number) {

    if (isAnswerInProgress.value) {
      return increments[ring];
    }
    let startInc = randInteger(symbolArray.length)*10;
    increments[ring] = startInc;
    console.log('start incs: ' + increments)

    return startInc;
  }

</script>


<template>
  <v-app>
    <v-main>
      <v-container >
        <v-responsive class="align-center">
          <v-row  >
            <v-col class="mb-0">
              <div id="topCard">
                <svg  :width="imageSize*2" :height="imageSize*2">
                  <PolyGraphic  v-for="n in numRings()"
                    ref="ringRef"
                    :index = "changedOptions"
                    :started = "gameStarted"
                    :options = "options"
                    :ring = "n-1"
                    :letters="symbolArray[n-1]"
                    :centre="imageSize"
                    :radius="radius(n-1)"
                    :thickness="thickness(n-1)"
                    :increments="setIncrements(n-1)"
                    :answer="currentMatch1"
                      @click-image="clickImage(n-1)"
                      @send-increment="checkIncrements"
                    ></PolyGraphic>
                    <circle id="answer" :cx="imageSize" :cy="imageSize" :r="imageSize/4" 
                      @dblclick.prevent
                      @click="checkAnswer()"
                      stroke-width="1"  stroke="green"  fill="green"/>
                      <text id="emoji"
                        :font-size="imageSize/8"
                        @click="checkAnswer()"
                        :x="imageSize-imageSize/13"
                        :y="imageSize+imageSize/24">
                      {{ centreEmoji }}
                    </text>
                </svg>
              </div>
            </v-col>
          </v-row>
            <div v-if="gameStarted">
              <v-btn @click="isQuestionVisible=true">Show Answer?</v-btn>
            </div>
            <game-options v-else
                v-model = "options"
                @change-images="setRingImages();"
                @done-setup = "startGame"
              >
            </game-options>

        </v-responsive>
      </v-container>
      <ModalQuestion v-show="isQuestionVisible" @close-modal="showResult" >
          <template v-slot:header>Give up and show the solution?</template>
          <template v-slot:body>Are you sure?</template>
          
      </ModalQuestion>
    </v-main>
  </v-app>
</template>


<style>

  #answer {
     fill-opacity: 0.25;

  }  
  #answer:hover { 
      fill-opacity: 0.35;
      cursor:pointer
      
  }
  #emoji:hover { 
      fill-opacity: 0.35;
      cursor:help
      
  }

</style>