<script>
let signError = false;
  let data = {
    email: '',
    password: '',
  };
  const handleSubmit = async() => {
try {
  const response = await fetch ('/api/user/auth/getOne', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({data}),
  });
  console.log('response: ', response);
  if (response.ok) {
    console.log('response: ', response);
    window.location.href = '/';
  }
} catch (error) {
  signError = error;
  console.error('error: ', error);
}
  };

</script>


<svelte:head>

  <title>Memo login</title>

</svelte:head>

 


<div class="wrapper">
  <div class="container">
   

      <label
      for="email"
      >Email:</label>
      <input bind:value="{data.email}" type="text" />
      <label
      for="password"
      >Password:</label>
      <input bind:value="{data.password}" type="password" />
      <button on:click={handleSubmit}>
        Envoyer
      </button>
 
  </div>
</div>



<style>
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
  }
  button:hover {
    background-color: #0056b3;
  }
</style>
