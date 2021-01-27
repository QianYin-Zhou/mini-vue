class Watcher {
	constructor(vm, key, cb) {
		this.vm = vm;
		this.key = key;
		this.cb = cb;
		// 把watch对象记录到dep类的静态属性target中
		Dep.target = this;
		this.oldValue = vm[key];
		Dep.target = null;
	}

	update() {
		let newValue = this.vm[this.key];
		if(this.oldValue === newValue) {
			return
		}
		this.cb(newValue);
	}
}