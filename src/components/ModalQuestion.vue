<script setup  lang="ts">
  //import { defineEmits } from "vue";

  const emit = defineEmits(['closeModal'])

  function close(yes : boolean) {
        emit('closeModal',yes)
  }

     
</script>

<template>
    <div class="modal-backdrop">
      <div class="modal">
        <header class="modal-header">
          <slot name="header">
            This is the default title!
          </slot>
        </header>
  
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
            <slot name="btnYes">  Yes  </slot>
          </v-btn>
          <p><span style="font-size:0.5em">&nbsp;</span></p>
          <v-btn
          rounded="pill"  variant="outlined" color="lightgreen"
            type="button"
            class="btn-palegrn"
            @click="close(false)"
          >
            <slot name="btnNo">  No  </slot>
        </v-btn>
        </footer>
      </div>
    </div>
  </template>

<style scoped>
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

.modal-header {
  position: relative;
  border-bottom: 1px solid #eeeeee;
  color: #693;
  justify-content: space-between;
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

  
  