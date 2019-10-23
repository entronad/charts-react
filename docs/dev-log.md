library的形态：

为方便非ts项目使用，最终的library目前定位：纯js、es5、commonjs，同时代用d.ts类型文件

~~分为两个完全独立的library： charts-common 和 charts-react，charts-common完全与react无关，共享同一个repo，repo下有docs, .gitignore, LISCENSE, README~~

目前没有看出charts-common单独存在的意义，放到同一个项目中

脚手架参考：https://github.com/a-tarasyuk/webpack-typescript-babel ，加上eslint，jest，mockito

作为library的一些特殊配置参考：https://medium.com/cameron-nokes/the-30-second-guide-to-publishing-a-typescript-package-to-npm-89d93ff7bccd

eslint采用typescript-eslint, 相关依赖和eslintrc参考antd 4.0.0-alpha.7，只利用vscode的插件，不集成到编译流程中

添加依赖：

```
"@typescript-eslint/eslint-plugin": "^2.0.0",
"@typescript-eslint/parser": "^2.0.0",
"eslint": "^6.1.0",
"eslint-config-airbnb": "^18.0.0",
"eslint-config-prettier": "^6.0.0",
"eslint-plugin-babel": "^5.3.0",
"eslint-plugin-import": "^2.17.3",
"eslint-plugin-jest": "^22.6.4",
"eslint-plugin-jsx-a11y": "^6.2.1",
"eslint-plugin-markdown": "^1.0.0",
"eslint-plugin-react": "^7.14.2",
"eslint-tinker": "^0.5.0",
```



2019-10-14 google/charts 基线0.8.1



顺序：

charts_common -> common 的顺序

common文件夹中以symbol_rederer为主线



dart中自有，但js中需补充的，放在src/dart中

tsconfig根据antd 4.0.0-alpha.7修改

添加dart的license因为使用了math等内置库

为模拟dart的效果，所有文件需输出内容自己export，然后再export default一个包含这些内容的对象

为模拟编译型的dart语言，变量定义顺序无所谓，去除no-use-before-define

no-param-reassign是很好的，但很多基础的库中都有此操作，为方便移除此规则，自己写的时候注意



导出实现的效果，既可以类似没有as的时候的直接使用对象，也可以实现有as时要加命名空间

ts中类型的导出好像比较特别，现在统一采用源文件中，直接添加export，移除import/prefer-default-export规则

目标文件中有as用* as ，无as有show用{}，全部导入用*

index用export*from

src下的目录添加'package:'的方式引用，路径解析由于添加了path，不用eslint的检查了



移除lines-between-class-members，方便组合成员



命名参数及其默认值的形式参考https://mariusschulz.com/blog/typing-destructured-object-parameters-in-typescript ,

注意类型表后面的 = {}，但在抽象函数中不能加={},记得实现中要加回来

```
function toJSON(
  value: any,
  { pretty = true }: { pretty?: boolean } = {}
) {
  const indent = pretty ? 4 : 0;
  return JSON.stringify(value, null, indent);
}
```

注意命名参数如无说明都是可选的



由于dart是可以给指定类型赋null的，故取消tsconfig中的strictNullChecks



类方法尽量用箭头函数，constructor，存取器，react生命周期不用，所有成员定义（包括箭头函数）末尾加分号，方法定义（非箭头函数）不加分号



很多地方涉及位操作，移除eslint的禁止规则



添加一个assert方法



相对路径同目录下加./



CanvasBarStack中的_internal构造函数不单独剥离出来，注意其构造函数是工厂型的需进行改造 其传入字段中没有fullStackRect



abstract set 不需指明返回void



drawText实现的时候注意rotation要初始化0.0



ts中数组的定义类型和初始化不好合成在一起，需单独指定，特别是数组要记得指定



ts/js中目前没有注解，没有@overrides



不能在静态属性初始化表达式中引用 "this"

目前包括this.constructor都不太好用，只能老老实实写类名

移除class-methods-use-this



material-palette的懒加载要根据ts的特点处理一下



添加并配置"@babel/plugin-proposal-optional-chaining": "^7.6.0",



dart的optional chaining具有函数安全的功能，由于类型，不可能出现取出来是不可调用但有执行操作符()的情况

为处理函数的问题，并且现在ts也不太支持optional chaining，不采用@babel/plugin-proposal-optional-chaining，

采用lodash并增加函数的功能，添加在dependence中

在get中通过判断是否显式传入参数来决定是获取还是执行函数(有剩余运算符的)，有可能出现取出来是‘somestr'但传入参数的情况，

?. 主要是来解决控制的问题，类型不匹配应该报错，处理不了没参数的情况，参数用数组装



Non-null assertion operator : ! 的作用是告诉编译期它不为null，不是optional chaining