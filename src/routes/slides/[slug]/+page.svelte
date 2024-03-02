<script>
  import Grid, { GridItem } from "svelte-grid-extended";
  import Code from "$lib/components/text/Code.svelte";
  import Toc from "$lib/components/sidebar/Toc.svelte";
  import Paragraphe from "$lib/components/text/Paragraph.svelte";
  import Blockquote from "$lib/components/text/Blockquote.svelte";
  import Detail from "../../../lib/components/text/Detail.svelte";
  import NoteCard from "../../../lib/components/text/NoteCard.svelte";
  import Img from "../../../lib/components/text/Img.svelte";
  import { page } from "$app/stores";
  import {
    currentMemo,
    fullmemos,
    memos,
    reloadNeeded,
  } from "$lib/stores/index.js";
  export let data;

let userId = data.user.id;


let items = [];
let copySlide;
let slide;
let pageSlug;

page.subscribe(async ($page)=> {
  if(copySlide){
    copySlide = {};
    items = [];
  }
  if($fullmemos.length === 0){
    fullmemos.get(userId);
  }
  pageSlug = $page.params.slug;
  slide = $fullmemos.find((s) => s.slug === pageSlug);
  console.log(slide)




})







</script>
