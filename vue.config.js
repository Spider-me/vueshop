// 是否是生产环境
const isProduction = process.env.NODE_ENV !== 'development';
// 是否需要使用cdn
const isNeedCdn = false
const assetsCDN = {
	/**
		externals对象的属性名为package.json中，对应的库的名称（固定写法）,属性值为引入时你自定义的名称
	*/
	externals: {
		vue: 'Vue',
		'vue-router': 'VueRouter',
		axios: 'axios',
		lodash: '_',
		echarts: 'echarts',
		nprogress: 'NProgress',
		'vue-quill-editor': 'VueQuillEditor'
	},
	css: ["https://cdn.staticfile.org/nprogress/0.2.0/nprogress.min.css",
		"https://cdn.staticfile.org/quill/1.3.6/quill.core.min.css",
		"https://cdn.staticfile.org/quill/1.3.6/quill.snow.min.css",
		"https://cdn.staticfile.org/quill/1.3.6/quill.bubble.min.css",
		"https://cdn.staticfile.org/element-ui/2.15.9/theme-chalk/index.css"
	],
	js: [
		'https://cdn.staticfile.org/vue/2.6.14/vue.min.js',
		'https://cdn.staticfile.org/vue-router/3.5.1/vue-router.min.js',
		'https://cdn.staticfile.org/axios/0.27.2/axios.min.js',
		'https://cdn.staticfile.org/lodash.js/4.17.21/lodash.min.js',
		"https://cdn.staticfile.org/echarts/5.3.3/echarts.common.js",
		"https://cdn.staticfile.org/nprogress/0.2.0/nprogress.min.js",
		"https://cdn.staticfile.org/quill/1.3.6/quill.min.js",
		"https://cdn.jsdelivr.net/npm/vue-quill-editor@3.0.6/dist/vue-quill-editor.js",
		"https://cdn.staticfile.org/element-ui/2.15.9/index.js"
	]
}
const {
	defineConfig
} = require('@vue/cli-service')
module.exports = defineConfig({
	transpileDependencies: true,
	lintOnSave: false,
	publicPath: "./",
	assetsDir: "static",
	chainWebpack: config => {
		if (process.env.NODE_ENV === 'production') {
			// 为生产环境修改配置...
			console.log(11111111111111111111111111111111111111111111111111);
			console.log(process.env.NODE_ENV);
			config.entry("app").clear().add("./src/main-prod.js")
			config.plugin('html').tap(args => {
				args[0].cdn = assetsCDN;
				args[0].title = 'prod-title名称';
				return args
			})
		} else {
			// 为开发环境修改配置...
			console.log(22222222222222222222222222222222222);
			console.log(process.env.NODE_ENV);
			config.entry("app").clear().add("./src/main-dev.js")
			config.plugin('html').tap(args => {
				args[0].cdn = {
					externals: {
						echarts: 'echarts',
					},
					css: [],
					js: [
						"https://cdn.staticfile.org/echarts/5.3.3/echarts.common.js",
					]
				};
				args[0].title = 'dev-title名称';
				return args
			})
		}
	},
	configureWebpack: {
		// 生产环境，则添加不参与打包的包名和依赖包的名称
		externals: (isProduction || isNeedCdn) ? assetsCDN.externals : {
			echarts: 'echarts'
		}
	}
})
