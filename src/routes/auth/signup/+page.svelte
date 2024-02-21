<script>
  import {goto} from '$app/navigation';
  let signError = false;
  let data = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
let InscriptionSuccess = false;
  const handleSubmit = async() => {
    if(data.password !== data.confirmPassword){
      signError = "Les mots de passe ne correspondent pas";
      return;
    }
try {
  const response = await fetch ('/api/user/auth/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({data}),
  });
  if (response.ok) {
    // on redirige vers la page de connexion
    InscriptionSuccess = true;
    goto('/auth/login');
  }
  else{
    signError = await response.text();
  }
} catch (error) {
  signError = error;
}
  };

</script>

<div class="wrapper">
  <div class="container">
      <label
      for="username"
      >Username:</label>
      <input name="username" id="username" bind:value="{data.name}" type="text" />
      <label
      for="email"
      >Email:</label>
      <input bind:value="{data.email}" type="text" />
      <label
      for="password"
      >Password:</label>
      <input bind:value="{data.password}" type="password" />
      <label
      for="confirmPassword"
      >Confirm password:</label>
      <input bind:value="{data.confirmPassword}" type="password" />
      <button on:click={handleSubmit}>
        Envoyer
      </button>
      {#if signError}
      <p>{signError}</p>
      {/if}
      <p>déjà inscrit? <a style="text-decoration: underline;" href="/auth/login">Connection</a></p>
  </div>
</div>



<style>


p{
    padding: 1rem;
    font-size: .7rem;
  }



  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

.container{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
  padding: 2rem;
  border-radius: 0.3rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  background-color: #1F2937;
  max-width: 100%;
  margin: 0 1rem;
}

  label {
    display: block;
    margin-bottom: 0.5rem;
  }
  input {
    margin-bottom: 1rem;
    padding: 0.5rem 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 0.3rem;
    background-color: #374151;
  }
  button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 0.3rem;
    cursor: pointer;
    margin-bottom: 1rem;
  }
  button:hover {
    background-color: #0056b3;
  }
</style>
