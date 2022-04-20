<script lang="ts">
    /**
     * Component holds the site wide navbar with Icon and text UI elements
     * connecting to routes and other parts of the program
     * also contains sound related UI features
     * Built on Bulma NavBar generic template with additional
     * tooltips provided by Svelte-Hint package
     */
    import Icon from '@iconify/svelte';
    import Hint from "svelte-hint";
    import GraphBasket from "./DataSetOverview/GraphBasket.svelte";
    import InitialiseSound from "./Sound/InitialiseSound.svelte";
    import AudioAnimIcon from "./GraphicalExtras/AudioAnimIcon.svelte";
    import SoundingGraphs from "./GraphicalExtras/SoundingGraphs.svelte";
    import VerticalDots from "./GraphicalExtras/VerticalDots.svelte";
    import { selectedGraphs } from "../lib/stores/graphsViewStores";
    import { soundToggle } from "../lib/stores/fsmStoreNew";
    import Slider from '@bulatdashiev/svelte-slider';
    import { audioEngine, speechState } from "../lib/stores/audioStores";
    import { fitClamped } from "../lib/common/dataUtils";
    import AudioEngine from "../lib/audio/audioEngine";
    import { onMount } from "svelte";

    let volumeFader: number[] = [0]
    const simpleSwitch = soundToggle;
    const voicesList = audioEngine

    $: sounding = ($simpleSwitch === 'on');

    function changeSpeechVolume(e) {
        const faderValue = e.detail[0]
        if (faderValue === 0) { AudioEngine.speechSynthesis.muteVoice() }
        let v = (faderValue >= 1) ? fitClamped( faderValue, 0,5,0,0.4 ) : 0
        speechState.update( (store => ({ ...store, volume: v })))
        AudioEngine.speechSynthesis.setVolume( v )
    }

    onMount(()=> {
        speechState.update( (store => ({ ...store, volume: 0 })))
    }
    )

</script>
<nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
    <div class="navbar-brand" style="flex-basis: fit-content; flex-flow: column; width: 12.5%;">
        <a class="navbar-item" href="">
<!--        <img class="sonify-logo" src="/graphics/branding/sonify_icon.svg" width="216" height="28">-->
            <SoundingGraphs/>
            {#if sounding}
                <AudioAnimIcon/>
            {/if}
        </a>

        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasic">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </a>
    </div>

    <div id="navbarBasic" class="navbar-menu">
        <div class="navbar-start">
            <VerticalDots/>
            <Hint text='Home' >
                <a class="navbar-item " href="/" media="screen" aria-label="home">
                    <Icon icon="mdi-light:home" class="m-2 is-size-5" /> Home
                </a>
            </Hint>
            <Hint text='Recent Projects' >
                <a class="navbar-item" href="/recentProjects" media="screen" aria-label="recent projects">
                    <Icon icon="mdi-card-text"  class="m-2 is-size-5"/> Recent
                </a>
            </Hint>
            <Hint text="Documentation">
            <a class="navbar-item" href="/documentation" media="screen" aria-label="documentation">
                <Icon icon="mdi-book-open-outline" class="m-2 is-size-5" /> Docs
            </a>
            </Hint>
            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link" style="padding-top: 2px" aria-label="More" media="screen">
                    <Icon icon="mdi-looks" class="m-2 is-size-5"/> More
                </a>
                <div class="navbar-dropdown">
                    <Hint text="an interactive tutorial" placement="right" >
                        <a class="navbar-item" href="/more.sonificationTutorial" aria-label="tutorial">
                            Data as Raw Material
                        </a>
                    </Hint>
                    <a class="navbar-item" aria-label="share">
                        Share
                    </a>
                    <a class="navbar-item" aria-label="contact">
                        Contact
                    </a>
                    <hr class="navbar-divider">
                    <a class="navbar-item" aria-label='report an issue'>
                        Report an issue
                    </a>
                </div>
            </div>

        </div>

        <div class="navbar-end">
            {#if $selectedGraphs.length<1}
            <Hint text='Show all the graphs you have selected' placement='left-end' >
                <div class="navbar-item">
                    <GraphBasket/>
                </div>
            </Hint>
            {:else }
                <div class="navbar-item">
                    <GraphBasket/>
                </div>
            {/if}
            <VerticalDots/>
        </div>
    </div>
</nav>
<nav class="navbar is-fixed-bottom navbar2" role="navigation">
    <div id="navbarFooter" class="navbar-menu" >

        <div class="navbar-brand"  >
            <div class="navbar-item"><InitialiseSound /> </div>
            <div class="navbar-item pl-3 pt-0" style="width: 100%;" >
                <Hint text='Speech Volume' auto="true"  >
                <Icon icon="mdi:talk" class="m-2 pt-3 pr-3 is-size-1" />
                </Hint>
                <Slider bind:value={volumeFader} min="0" max="5" on:input={changeSpeechVolume} >
                    <span aria-label="speech volume moves left to right" slot="left" class="button is-rounded is-small" style="top: 0.4em">
                        {volumeFader}
                    </span>
                </Slider>
            </div>
        </div>
        </div>
</nav>



<style>
    .navbar2 {
        color: #0000;
        padding-bottom: 1em;
    }

    .navbar2 {
        background: linear-gradient(90deg,#80ed12,#A5D604,#C7B601,#E39209,#F66C1C,#FE4838,#FB295B,#ED1180,#D504A6,#B601C8,#910AE3,#6B1DF6,#4739FE,#285BFB,#1181ED,#03A6D5);
    }
    :root {
        --track-bg: transparent;
        --progress-bg: darkgrey;
        --thumb-bg: transparent;
    }

    .sonify-logo
    {
        height: auto;
        max-width: 4rem;
    }

</style>
