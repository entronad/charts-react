library的形态：

为方便非ts项目使用，最终的library目前定位：纯js、es5、commonjs，同时代用d.ts类型文件

~~分为两个完全独立的library： charts-common 和 charts-react，charts-common完全与react无关，共享同一个repo，repo下有docs, .gitignore, LISCENSE, README~~

目前没有看出charts-common单独存在的意义，放到同一个项目中

脚手架参考：https://github.com/a-tarasyuk/webpack-typescript-babel ，加上eslint，jest，mockito

作为library的一些特殊配置参考：https://medium.com/cameron-nokes/the-30-second-guide-to-publishing-a-typescript-package-to-npm-89d93ff7bccd

eslint采用typescript-eslint, 相关依赖和eslintrc参考antd 4.0.0-alpha.7，只利用vscode的插件，不集成到编译流程中
