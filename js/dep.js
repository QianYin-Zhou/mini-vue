class Dep {
	constructor() {
		this.subs = []
	}

	addSub(sub) {  // 添加观察者
		if(sub && sub.update) {
			this.subs.push(sub);
		}
	}

	notify() {  // 发布通知
		this.subs.forEach(sub => {
			sub.update();
		})
	}
}