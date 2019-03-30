<template>
	<text class="title">
		<slot></slot>
	</text>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style scoped>
.title{
	display: inline-block;
	margin: 15px 0;
	padding-left: 10px;
	border-left: 2px solid #DB5C5C;
}
</style>
