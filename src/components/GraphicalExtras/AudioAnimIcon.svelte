<script>
// Animated Audio Icon
// adapted from https://codepen.io/joshbader/pen/LpvWZx
</script>

<div class="bars audio"><i></i></div>

<style lang="scss">
    .bars {
        position: relative;
        top: 0%;
        left: 0%;
        height: 90%;
        transform: scaleX(40%) scaleY(40%);;
    }

    .audio { color: $primary; }

    .audio::after,
    .audio i,
    .audio i::before,
    .audio i::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 100%;
        display: flex;
        width: 0.6em;
        height: 0.5em;
        transform: translate( 20%, -50%) ;
        background-image: linear-gradient(45deg,#910AE3,#6B1DF6,#4739FE,#285BFB,#1181ED,#03A6D5);
    }

    .audio::after { animation: audio4 $vumeter-timing infinite; }

    .audio i::before {
        left: -0.8125em;
        animation: audio1 $vumeter-timing infinite;
    }
    .audio i::after {
        left: 1.0625em;
        animation: audio3 $vumeter-timing  infinite;
    }

    .audio i:first-child {
        margin-left: -1.875em;
        animation: audio2 $vumeter-timing  infinite;
    }

    .audio i:last-child {
        margin-left: 1.875em;
        animation: audio6 $vumeter-timing  infinite;
    }

    .audio i:last-child::before { animation: audio5 $vumeter-timing infinite; }

    .audio i:last-child::after { animation: audio7 $vumeter-timing infinite; }

    @keyframes audio1 {
        9% { height: 1.75em; }
        36% { height: 0.5em; }
        42% { height: 2.375em; }
        69% { height: 0.5em; }
        76% { height: 3.625em; }
        100% { height: 1em; }
    }

    @keyframes audio2 {
        9% { height: 5.5em; }
        36% { height: 0.5em; }
        42% { height: 5.5em; }
        69% { height: 0.5em; }
        76% { height: 6.75em; }
        100% { height: 1em; }
    }

    @keyframes audio3 {
        9% { height: 6.5em; }
        36% { height: 0.5em; }
        42% { height: 3.5em; }
        69% { height: 0.5em; }
        76% { height: 3.5em; }
        100% { height: 1em; }
    }

    @keyframes audio4 {
        9% { height: 1.875em; }
        36% { height: 0.5em; }
        42% { height: 3.75em; }
        69% { height: 0.5em; }
        76% { height: 5.625em; }
        100% { height: 1em; }
    }

    @keyframes audio5 {
        9% { height: 5em; }
        36% { height: 0.5em; }
        42% { height: 1.25em; }
        69% { height: 0.5em; }
        76% { height: 3.75em; }
        100% { height: 1em; }
    }

    @keyframes audio6 {
        9% { height: 6.125em; }
        36% { height: 0.5em; }
        42% { height: 6.875em; }
        69% { height: 0.5em; }
        76% { height: 2.5em; }
        100% { height: 1em; }
    }

    @keyframes audio7 {
        9% { height: 3.125em; }
        36% { height: 0.5em; }
        42% { height: 1.875em; }
        69% { height: 0.5em; }
        76% { height: 3.75em; }
        100% { height: 1em; }
    }

</style>
