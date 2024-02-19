<!-- CustomAlert.svelte -->
<script>
  import { fly } from "svelte/transition";
  export let message = "";
  export let type = "Success";
  export let title = "";



 
</script>

<div transition:fly={{ y: -50, duration: 200 }} class="custom-alert {type}">
  <div class="alert-content">
    <h3>{title}</h3>
    <p>{message}</p>
  </div>
</div>

<style>
  .custom-alert {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: rgba(255, 0, 0, 0.8); 
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .success{
    background: rgb(0, 161, 0);
  }

  .alert{
    background: rgba(255, 0, 0);
  
  }
  .warn{
    background: rgb(172, 112, 0);
    
  }

  .alert-content {
    display: flex;
    padding: .5rem;
    border-radius: 8px;
    align-items: center;
    gap: .5rem;
  }
</style>
