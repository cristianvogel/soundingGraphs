<script>
    import Icon from '@iconify/svelte';
    import Hint from "svelte-hint";
    import {globStyle} from "../assets/styleDefs.js";
</script>

<nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
        <a class="navbar-item" href="https://sonify.io">
            <img class="sonify-logo" src="/graphics/branding/sonify_icon.svg" width="216" height="28">
        </a>

        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasic">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </a>
    </div>

    <div id="navbarBasic" class="navbar-menu">
        <div class="navbar-start">
            <Hint text='Home' >
                <a class="navbar-item " href="/" media="screen" aria-label="home">
                    <Icon icon="mdi-light:home" class="m-2 is-size-4" /> Home
                </a>
            </Hint>
            <Hint text='Enter app flow' >
                <a class="navbar-item" href="/twotone" media="screen" aria-label="launch app">
                    <Icon icon="mdi-card-text"  class="m-2 is-size-5"/> App
                </a>
            </Hint>
            <a class="navbar-item" href="/documentation" media="screen" aria-label="documentation">
                <Icon icon="mdi-book-open-outline" class="m-2 is-size-5" /> Documentation
            </a>

            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link" aria-label="More">
                    <Icon icon="mdi-looks" class="m-2 is-size-5"/>    More
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