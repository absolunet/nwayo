<template>
    <p>Hello {world}</p>
</template>

<style lang="stylus">
    body-color = #ba0bab;

    body {
        color: body-color;
    }
</style>

<script>
export default {
	data: () => {
		return {
			world: 'world'
		};
	}
};
</script>
