module.exports = {
    vueTemplate: componentName => 
`<template>
    <div class='${componentName}'>
        ${componentName}组件
    </div>
</template>
<script>
    export default{
        name: '${componentName}'
    }
</script>
<style lang="scss" scoped>

</style>`,
    entryTemplate: 
    `import Main from './main.vue';
     export default Main;`
}