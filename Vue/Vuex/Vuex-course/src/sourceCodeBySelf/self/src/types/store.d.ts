// 仅支持state类型的自定义，使用S泛型
export interface StoreOptions<S> {
  state?: S | (() => S);
  getters?: GetterTree<S, S>;
  actions?: ActionTree<S, S>;
  mutations?: MutationTree<S>;
  modules?: ModuleTree<S>;
  plugins?: Plugin<S>[];
  strict?: boolean;
  devtools?: boolean;
}

// getters
interface GetterTree<S, R> {
  [key: string]: Getter<S, R>;
}
type Getter<S, R> = (
  state: S,
  getters: any,
  rootState: S,
  rootGetters: any
) => any;

// actions
interface ActionTree<S, R> {
  [key: string]: Action<S, R>;
}
type Action<S, R> = ActionHandler<S, R> | ActionObject<S, R>;
type ActionHandler<S, R> = (
  this: Store<R>,
  context: ActionContext<S, R>,
  payload?: any
) => any;
interface ActionObject<S, R> {
  root?: boolean;
  handler: ActionHandler<S, R>;
}
interface ActionContext<S, R> {
  dispatch: Dispatch;
  commit: Commit;
  state: S;
  getters: any;
  rootState: R;
  rootGetters: any;
}

// mutations
interface MutationTree<S> {
  [key: string]: Mutation<S>;
}
type Mutation<S> = (state: S, payload?: any) => any;

// modules
interface ModuleTree<R> {
  [key: string]: Module<any, R>;
}

// plugins
type Plugin<S> = (store: Store<S>) => any;

// commit
export interface CommitOptions {
  silent?: boolean;
  root?: boolean;
}

// subscribe
export type SubscribeFn = (mutation: P, state: S) => any;
export interface SubscribeOptions {
  prepend?: boolean;
}


// subscribeAction
export type SubscribeActionOptions<P = any, S = any> =
  | ActionSubscriber<P, S>
  | ActionSubscribersObject<P, S>;

type ActionSubscriber<P, S> = (action: P, state: S) => any;
interface ActionSubscribersObject<P, S> {
  before?: ActionSubscriber<P, S>;
  after?: ActionSubscriber<P, S>;
  error?: ActionErrorSubscriber<P, S>;
}
type ActionErrorSubscriber<P, S> = (action: P, state: S, error: Error) => any;


// watch
export type WatchGetter = (state: S, getters: any) => T;
export type WatchCb = (newValue: T, oldValue: T) => void;
export interface WatchOptions<Immediate = boolean> extends WatchOptionsBase {
  immediate?: Immediate;
  deep?: boolean;
}