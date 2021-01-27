class Compiler {
	constructor(vm) {
		this.el = vm.$el;
		this.vm = vm;
		this.compile(this.el);
	}

	// 编译模板，处理文本节点和元素节点
	compile(el) {
		let childNodes = el.childNodes;
		Array.from(childNodes).forEach(node => {
			// 1.处理文本节点
			if(this.isTextNode(node)) {
				this.compileText(node);
			} else if(this.isElementNode(node)) {  // 2.处理元素节点
				this.compileElement(node);
			}

			// 3.递归调用compiler处理孙节点
			if(node.childNodes && node.childNodes.length) {
				this.compile(node);
			}
		});
	}
	// 编译元素节点，处理指令
	compileElement(node) {
		// 1.遍历属性节点
		Array.from(node.attributes).forEach(attr => {
			// 2.判断是否指令
			let attrName = attr.name;
			if(this.isDirective(attrName)) {
				attrName = attrName.substr(2);  // v-text --> text
				let key = attr.value;
				this.update(node, key, attrName)
			}
		})
	}
	// 最牛的方法
	update(node, key, attrName) {
		let updateFn = this[`${attrName}Updater`];
		if(!updateFn) {
			throw new Error(`not exist this directive, v-${attrName}`);
		}
		updateFn.call(this, node, this.vm[key], key);  // 绑定bind
	}
	// v-text
	textUpdater(node, value, key) {
		node.textContent = value;
		// 创建watch对象，当数据改变视图改变
		new Watcher(this.vm, key, (newValue) => {
			node.textContent = newValue;
		});
	}
	// v-model
	modelUpdater(node, value, key) {
		node.value = value;
		// 创建watch对象，当数据改变视图改变
		new Watcher(this.vm, key, (newValue) => {
			node.value = newValue;
		});
		// 双向绑定
		node.addEventListener('input', ()=> {
			this.vm[key] = node.value;
		})
	}
	// 编译文本节点，处理插值表达式
	compileText(node) {
		let reg = /\{\{(.+?)\}\}/; // 匹配
		let value = node.textContent;

		if(reg.test(value)) {
			let key = RegExp.$1.trim();
			node.textContent = value.replace(reg, this.vm[key]);

			// 创建watch对象，当数据改变视图改变
			new Watcher(this.vm, key, (newValue) => {
				node.textContent = newValue;
			});
		}
	}
	// 判断元素属性是否是指令
	isDirective(attrName) {
		return attrName.startsWith('v-');
	}
	// 判断节点是否是文本节点
	isTextNode(node) {
		return node.nodeType === 3;
	}
	// 判断节点是否是元素节点
	isElementNode(node) {
		return node.nodeType === 1;
	}
}