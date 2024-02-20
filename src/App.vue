<script setup lang="ts">
import { ref, type Ref, computed, onMounted, onBeforeMount, watch } from 'vue'
import LetterRing from './components/Ring.vue';
import { randInteger, Options, imageTypes, Symbols } from './util'
import { words2, words3, words4, sumsPlus, sumsVarious} from './assets/words'
import GameOptions from './components/GameOptions.vue'
import GameScore from './components/Timer.vue'
import ModalAlert from './components/ModalAlert.vue';
import ModalQuestion from './components/ModalQuestion.vue';
import JSConfetti from 'js-confetti'

let imageSize = 230

if (window.innerWidth > 1000)
  imageSize = 320;
  if (window.innerWidth < 400) // iphone se
  imageSize = 180;


let wordArray = [''];
let symbolArray = [['']];
let symbolArrayCopy = [['']];
let mathsArray = [''];
//let success = false;

const increments = ref([0,0,0,0]);

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
let allWords: string | any[];

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
  increments.value  = [0,0,0,0];

  if (options.value.imageType === imageTypes.additions) {
    options.value.numberOfRings = 3;
    allWords = sumsPlus;
  }
  else if (options.value.imageType === imageTypes.sums) {
    options.value.numberOfRings = 3;
    allWords = sumsVarious;
  }

  else if (options.value.imageType === imageTypes.words) {
  
    if (options.value.numberOfRings===2)
          allWords = words2;
    else  if (options.value.numberOfRings===3)
          allWords = words3;
    else
          allWords = words4;
  }

    

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

  if (options.value.imageType !== imageTypes.words) {
    for (let r=0; r < options.value.numberOfRings; r++)
     symbolArrayCopy[r] = symbolArray[r].slice();
  }
  ++changedOptions.value;
  mathsArray =  symbolArray[3];

}
function showSuccess() {
  jsConfetti.addConfetti({  emojis: [ '😎', '😇', '😮', '🙂','😃']})    
  gameStarted.value = false;

}

function normaliseIncrements(ring: number) {

  increments.value[ring] = Math.round(increments.value[ring] );

  let itemsPerRing = options.value.numberOfWords;
  // ensure multiple rotations are taken care of
  if (increments.value[ring] >= itemsPerRing)
    increments.value[ring] -= itemsPerRing;
  if (increments.value[ring] < 0)
    increments.value[ring] += itemsPerRing;
  //console.log('ring: ' + ring + ' incs: ' + increments.value[ring])


}
function twistRing(ring: number, backwards : boolean, bounce: boolean) {
 // animate the angle of letter placement in 10 mini-increments, to bring next letter into line
 centreEmoji.value = '❓';
 let count = bounce? 11:10;
 let timer = window.setInterval(()=> {
    increments.value[ring] += backwards? -0.1 : 0.1;
    if (--count < 0) {
      window.clearTimeout(timer);
      if (bounce) {
        window.setTimeout(()=> {
          // bounce back one tenth
          increments.value[ring] += backwards? 0.1 : -0.1;
          normaliseIncrements(ring);
        },50)
      }
      else {
        normaliseIncrements(ring);
      }
    }
  },50)
}

function twist(speed: number,ring: number, incs: number) {
  if (incs == 0)
    return;
  if (ring >= options.value.numberOfRings)
    return;
  let timer = window.setInterval(()=> {
    twistRing(ring,false,false);
    if (incs === undefined ||--incs <= 0) {
      window.clearTimeout(timer);
    }
  },speed*10);
}

let incs = [0];

function showResult(giveup: boolean)
{
  isQuestionVisible.value = false;
  
  if (giveup) {
      isAnswerInProgress.value = true;

    // animate to bring all rings back to zero increments
      incs = increments.value.slice();
      console.log('incs now: ' +incs);
      for (let r=0; r < 4; r++) {
        if (incs[r] !== 0) 
      // e.g. if incs at 9, and there are 12 words in the game, need to do (12-9) twists to bring to zero
          incs[r] = options.value.numberOfWords  - incs[r];
      }
      console.log('incs reqd: ' +incs);
      doTwists(70,()=> {
        gameStarted.value = false;
        isAnswerInProgress.value = false;
      });
    }
  }

  function setUpIncrements() {

    for (let r=0; r < options.value.numberOfRings; r++) {
           incs[r] = randInteger(symbolArray.length);
      }
    console.log('start incs: ' + incs)
    doTwists(30,()=> {
        console.log('ready')

      });

  }

  function doTwists(speed: number, andThen: { (): void; (): void; })
  {
    console.log(incs);

      let twistTime = incs[3] * speed;
      twist(speed,3,incs[3]);
      // twist each ring when ready
      window.setTimeout(()=> {

          let twistTime = incs[2] * speed;
          twist(speed,2,incs[2]);
          window.setTimeout(()=> {

              let twistTime = incs[1] * speed;
              twist(speed,1,incs[1]);
              window.setTimeout(()=> {

                  let twistTime = incs[0] * speed;
                  twist(speed,0,incs[0]);
                  window.setTimeout(()=> {
                      // all twists done
                    andThen();

                  },twistTime)
              },twistTime)
          },twistTime)
      },twistTime)

  }

  /**
 * check to see if all (word) rings are aligned correctly
 */
function checkAnswer() {
  let success = true;

    success = checkIncrements();

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
  setRingImages();
  setUpIncrements();
 
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




function checkIncrements() {

  for (let r=0; r < options.value.numberOfRings; r++) {
    symbolArrayCopy[r] = symbolArray[r].slice();
    // 'rotate' copy so that it represents what's shown
    let incs = increments.value[r];
    while (incs-- > 0)
    {
      let last = symbolArrayCopy[r].pop();
      if (last)
        symbolArrayCopy[r].unshift(last);
    
    }
  }
  let success = true;
  // if (options.value.imageType === imageTypes.additions) {
  //   // check to see if the sums work

  //   for (let n=0; n< options.value.numberOfWords; n++) {
  //     {
  //       let num1 = Number(symbolArrayCopy[0][n]);
  //       let num2 = Number(symbolArrayCopy[1][n]);
  //       let num3 = Number(symbolArrayCopy[2][n]);
  //       let symbol = mathsArray[n];
  //       if (num1 + num2 !== num3) {
  //         success = false;
  //         break
  //       }
  //     }
  //   }

  // }

  if (options.value.imageType === imageTypes.words) {
    // check to see if all words are in the list
    for (let n=0; n< options.value.numberOfWords; n++) {
      {
        let word = '';
        for (let r=0; r< options.value.numberOfRings; r++) {
            word += symbolArrayCopy[r][n]
        }
        if (allWords.includes(word)===false)
        {
          success = false;
          break
        }
      }
    }

  }
  else {
    // check to see if the sums work

    for (let n=0; n< options.value.numberOfWords; n++) {
      {
        let num1 = Number(symbolArrayCopy[0][n]);
        let num2 = Number(symbolArrayCopy[1][n]);
        let num3 = Number(symbolArrayCopy[2][n]);
        let symbol = mathsArray[n];
        switch (symbol) {
          case Symbols.plus:  if (num1 + num2 !== num3)  success = false;  break;
          case Symbols.minus:  if (num1 - num2 !== num3) success = false;  break;
          case Symbols.times:  if (num1 * num2 !== num3) success = false;  break;
          case Symbols.divide:  if (num1 / num2 !== num3) success = false;  break;
        }
  
      }
    }

  }
  
  return success;
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
                  <LetterRing  v-for="n in numRings()"
                    ref="ringRef"
                    :index = "changedOptions"
                    :started = "gameStarted"
                    :options = "options"
                    :ring = "n-1"
                    :letters="symbolArray[n-1]"
                    :maths="mathsArray"
                    :centre="imageSize"
                    :radius="radius(n-1)"
                    :thickness="thickness(n-1)"
                    :increments="increments[n-1]"
                    @twist="twistRing"
                    @send-increment="checkIncrements"
                  ></LetterRing>
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
              <v-btn color="blue" variant="outlined" @click="isQuestionVisible=true">Show Answer?</v-btn>
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