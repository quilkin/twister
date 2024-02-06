<script setup lang="ts">
import { ref, type Ref, computed, onMounted, onBeforeMount, watch } from 'vue'
import PolyGraphic from './components/PolyGraphic.vue';
import { randInteger, Options, imageTypes } from './util'
import { words2, words3, words4, sums3} from './assets/words'
import GameOptions from './components/GameOptions.vue'
import GameScore from './components/Timer.vue'
import ModalAlert from './components/ModalAlert.vue';
import JSConfetti from 'js-confetti'

let imageSize = 250
//alert(window.innerWidth);
if (window.innerWidth > 1000)
  imageSize = 3500;
  if (window.innerWidth < 400) // iphone se
  imageSize = 200;

//const sampleWords2 =
//  'of, to, in, it, be, as, so, we, he, by, or, do, if, me, my, up, an, go, no, us, am';
//const sampleWords3 =
//  'the, and, for, are, but, not, you, all, ear, any, can, had, her, was, fix, ace';
//const sampleWords4 = 
//   'that, with, have, this, will, your, from, they, know, want, been, good, much, some, time, very';



let wordArray = [''];
let symbolArray = [['']];
let symbolArrayCopy = [['']];
let success = false;

let increments : number[] | undefined[] = [undefined,undefined,undefined,undefined];
const currentMatch1 = ref(-1);
const currentMatch2 = ref(-1);

const score = ref(0);
//const cardCount = ref(0);

const gameStarted = ref(false);
const isResultVisible = ref(false);
const resultWords = ref('');

const options = ref() 
const jsConfetti = new JSConfetti()

const changedOptions = ref(0);
const centreEmoji = ref('😀');

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
function showResult() {
  jsConfetti.addConfetti({  emojis: [ '😎', '😇', '😮', '🙂','😃']})    
  gameStarted.value = false;
  // resultWords.value = `Success! ${cardCount.value} cards matched with a score of ${score.value}`;
  // isResultVisible.value = true;
  // cardCount.value = 0;

}
function closeResult()
{
  isResultVisible.value = false;
  jsConfetti.clearCanvas();
  //decideInitialScore();
}
function failed() {
  // show answer for a few seconds then stop game
  options.value.showAnswer = true;
  window.setTimeout( ()=>{
    gameStarted.value = false;
    resultWords.value = `Sorry 😢 you ran out of time!`;
    isResultVisible.value = true;

    options.value.showAnswer = false;
    //decideInitialScore();
    }, 4000)
}

function checkAnswer() {
  if (success)
  {
    centreEmoji.value = '😀'
    showResult();
  }
  else {
    centreEmoji.value = '😥'

  }

}


function startGame() {
  
  centreEmoji.value = '❓'
  gameStarted.value = true;
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
  let startInc = randInteger(symbolArray.length)*10;
  increments[ring] = startInc;
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
            <game-options v-if="!gameStarted"
                v-model = "options"
                @change-images="setRingImages();"
                @done-setup = "startGame"
              >
            </game-options>

        </v-responsive>
      </v-container>
      <ModalAlert v-show="isResultVisible" @close-modal="closeResult()" >
          <template v-slot:body>{{ resultWords }}</template>
      </ModalAlert>
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