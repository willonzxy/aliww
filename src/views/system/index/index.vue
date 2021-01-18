<template lang="pug">
    div(style="background-color:#fff;height:100%")
        router-view(:key="$route.path")
        div(class="anbu-index-logo")
            img(class="page-login--logo" src="../login/image/anbu.png")
</template>
<style scope>
    .anbu-index-logo{
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

    }
</style>