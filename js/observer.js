class Observer {
	constructor(data) {
		this.walk(data);
	}

	walk(data) {
		// 1. 判断data是否是对象
		if (!data || typeof data !== 'object') {
			return
		}
		// 2. 遍历data对象
		Object.keys(data).forEach(key => {
			this.defineReactive(data, key, data[key]);
		})
	}

	defineReactive(obj, key, val) {
		let that = this;
		// ：dep负责收集依赖，并发送通知
		let dep = new Dep();
		this.walk(val); // 转为响应式数据
		Object.defineProperty(obj, key, {
			enumerable: true,
			configurable: true,
			get() {
				Dep.target && dep.addSub(Dep.target)
				return val;
			},
			set(newValue) {
				if (newValue === val) {
					return
				}
				val = newValue;
				that.walk(newValue); // 转为响应式数据
				dep.notify(); // 发送通知
			}
		})
	}
}