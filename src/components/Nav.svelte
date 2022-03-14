<script lang="ts">
    /**
     * Component holds the site wide navbar with Icon and text UI elements
     * connecting to routes and other parts of the program
     * Built on Bulma NavBar generic template with additional
     * tooltips provided by Svelte-Hint package
     */

    import Icon from '@iconify/svelte';
    import Hint from "svelte-hint";
    import GraphBasket from "./DataSetOverview/GraphBasket.svelte";
    import VerticalDots from "./GraphicalExtras/VerticalDots.svelte";
    import InitialiseSound from "./Sound/InitialiseSound.svelte";
    import {Sound} from "../lib/Globals";
    let soundPlaying: boolean;

    function audioEngineStatusChange( event ) {
        soundPlaying = event.detail.text === Sound.PLAYING || false
     }

</script>
<nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
        <a class="navbar-item" href="https://sonify.io">
<!--            <img class="sonify-logo" src="/graphics/branding/sonify_icon.svg" width="216" height="28">-->
            <Hint text='Show all the graphs you have selected' >
                    <GraphBasket/>
            </Hint>
        </a>

        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasic">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </a>
    </div>
    <VerticalDots/>
    <div id="navbarBasic" class="navbar-menu">
        <div class="navbar-start">
            <Hint text='Home' >
                <a class="navbar-item " href="/" media="screen" aria-label="home">
                    <Icon icon="mdi-light:home" class="m-2 is-size-4" /> Home
                </a>
            </Hint>
            <Hint text='Recent Projects' >
                <a class="navbar-item" href="/recentProjects" media="screen" aria-label="recent projects">
                    <Icon icon="mdi-card-text"  class="m-2 is-size-4"/> Recent
                </a>
            </Hint>
            <Hint text="Documentation">
            <a class="navbar-item" href="/documentation" media="screen" aria-label="documentation">
                <Icon icon="mdi-book-open-outline" class="m-2 is-size-5" /> Docs
            </a>
            </Hint>
            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link" aria-label="More">
                    <Icon icon="mdi-looks" class="m-2 is-size-5"/> More
                </a>
                <div class="navbar-dropdown">
                    <Hint text="an interactive tutorial" placement="right" middleware = "[
                          offset(100)">
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
            <div class="navbar-item">
                <InitialiseSound on:sound.status={audioEngineStatusChange}/>
            </div>
        </div>
        <div class="navbar-end">

            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-primary">
                        <strong>Sign up</strong>
                    </a>
                    <a class="button is-light">
                        Log in
                    </a>
                </div>
            </div>
        </div>
    </div>
</nav>
<style>
    .sonify-logo
    {
        height: auto;
        max-width: 4rem;
    }
</style>
