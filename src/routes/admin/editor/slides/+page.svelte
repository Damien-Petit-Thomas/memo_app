<script>
    import ImageGallery from '@react2svelte/image-gallery';
  import Sidemenu from "$lib/components/editor/SlideSidebar.svelte";
  let slideHeight = 0;
  let slideWidth = 0;
  let shoGallery = false;
  let slideMargin = 0;
  $: if ((slideWidth /  slideHeight) > 1.6 || (slideWidth /  slideHeight) < 1.59) {
    if (slideWidth / slideHeight > 1.6) {
      slideMargin -= 1;
    } else {
      slideMargin += 1;
    }
  }

  function handleShowGalery() {
    shoGallery = !shoGallery;
  }


  const images= [
    {
      original: 'https://cdn.pixabay.com/photo/2012/03/03/23/06/wall-21534_960_720.jpg',
      thumbnail: 'https://cdn.pixabay.com/photo/2012/03/03/23/06/wall-21534_960_720.jpg',
    },
    {
      original: 'https://cdn.pixabay.com/photo/2016/11/21/13/28/wood-1845389_960_720.jpg',
      thumbnail: 'https://cdn.pixabay.com/photo/2016/11/21/13/28/wood-1845389_960_720.jpg',
    },
    {
      original: 'https://cdn.pixabay.com/photo/2022/11/08/01/34/background-7577472_960_720.jpg',
      thumbnail: 'https://cdn.pixabay.com/photo/2022/11/08/01/34/background-7577472_960_720.jpg',
    },
    {
      original: 'https://cdn.pixabay.com/photo/2016/08/03/09/48/banners-1566213_960_720.jpg',
      thumbnail: 'https://cdn.pixabay.com/photo/2016/08/03/09/48/banners-1566213_960_720.jpg',
    },
    {
      original:'https://cdn.pixabay.com/photo/2019/04/10/11/56/watercolor-4116932_960_720.png', 
      thumbnail: 'https://cdn.pixabay.com/photo/2019/04/10/11/56/watercolor-4116932_960_720.png'
    },
    {
      original:'https://cdn.pixabay.com/photo/2021/10/29/13/41/template-6751973_960_720.png',
      thumbnail: 'https://cdn.pixabay.com/photo/2021/10/29/13/41/template-6751973_960_720.png'
    }, 
    {
      original:'https://cdn.pixabay.com/photo/2016/07/03/07/03/presentation-1494380_640.jpg',
      thumbnail: 'https://cdn.pixabay.com/photo/2016/07/03/07/03/presentation-1494380_640.jpg'
    },
    {
      original:'https://cdn.pixabay.com/photo/2016/07/03/07/10/background-1494381_640.jpg',
      thumbnail: 'https://cdn.pixabay.com/photo/2016/07/03/07/10/background-1494381_640.jpg'
    },
    {
      original:'https://cdn.pixabay.com/photo/2021/10/29/07/19/background-6751263_640.jpg',
      thumbnail: 'https://cdn.pixabay.com/photo/2021/10/29/07/19/background-6751263_640.jpg'
    }
  ];





</script>

<div class="container"

>
  <div class="menu menu-left">
    <Sidemenu   on:showGalery={handleShowGalery} />
  </div>
  <div
    class="slide"
    style='margin: {slideMargin}px 0;'
    bind:offsetHeight={slideHeight}
    bind:offsetWidth={slideWidth}
  >
  {#if shoGallery}
  <ImageGallery items="{images}" />
  {/if}
  </div>
  <div class="menu menu-right"></div>
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    height: 100vh;
    max-width: 100vw;
  }

  .slide {
    background-attachment: fixed;
    background: url('/src/lib/assets/background/presentation.jpg') no-repeat center center;
    color: black;
    background-color: #fff;
  }

  .menu {
    background-color: #000;
  }
</style>
