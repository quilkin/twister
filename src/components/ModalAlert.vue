<script setup lang="ts">

const emit = defineEmits(['closeModal'])

  function close(yes : boolean) {
        emit('closeModal',yes)
  }



</script>

<template>
  <!-- <Transition  name="fade-in"  mode="out-in"> -->
    <div class="modal-backdrop">
      <div class="modal">
  
        <section class="modal-body">
          <slot name="body">
            This is the default body!
          </slot>
         </section>
  
        <footer class="modal-footer">
          <v-btn
            rounded="pill"  variant="outlined" color="green"
            @click="close(true)"
          >
          <slot name="btnYes">
            😀
          </slot>
        </v-btn>
          
        </footer>
      </div>
    </div>
  <!-- </Transition> -->
</template>

<style scoped>
.fade-in-enter-active,
  .fade-in-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-in-enter-from,
  .fade-in-leave-to {
    opacity: 0;
  }
.modal-backdrop {
  z-index: 2;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #FFFFFF;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  border: 5px solid darkgreen;
  border-radius: 15px;
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
  font-weight: bold;

}


.modal-footer {
  border-top: 1px solid #eeeeee;
  flex-direction: column;
  justify-content: flex-end;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
  color: darkgreen;
}

</style>

  
  