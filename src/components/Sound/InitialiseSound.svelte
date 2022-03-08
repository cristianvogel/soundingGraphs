<script lang="ts">

    import {get} from "svelte/store";
    import stores from "../../lib/stores/Stores";
    import AudioEngine, {Sound} from "../../script/audioEngine";

    let soundStatus:boolean = false;

    function ping() {
        const actx:AudioContext = get(stores.__actx)
        const engine:AudioEngine = get(stores.__audioEngine)
        if (actx && engine.getState()!==Sound.UNMOUNTED) {
            engine.resume()
            soundStatus = true;
            engine.ping()
        }
    }

    function mute(){
        const engine:AudioEngine = get(stores.__audioEngine)
        engine.mute()
    }

</script>

    <button class="button" on:click={ping}>Sound Check</button>
    <button class={ soundStatus ? 'button' : 'button is-loading'} on:click={mute}>Stop Sound</button>

