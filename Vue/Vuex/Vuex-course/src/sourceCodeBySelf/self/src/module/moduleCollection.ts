// 用于收集根store的多个子模块,并为这些子模块添加一些方法
class ModuleCollection {
  // rawRootModule 根store模块（createStore(options)时传入的options对象）
  constructor(rawRootModule) {
    this.register([], rawRootModule, false);
    }
    
    getNamespace(path) {
        let module = this.root;
        return path.reduce((namespace, key) => {
            module = module.getChild(key);
            return namespace + (module.namespaced ? key + "/" : "");
        }, "");
    }
}

export default ModuleCollection;
