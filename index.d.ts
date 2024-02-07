import { ActionContext as BaseActionContext, Store } from 'vuex'

import './helpers'

interface BasePayload {
  type: string
}

interface RootOption {
  root: true
}

type PayloadArgs<T> = [T] extends [void] ? [] : [T]
type PayloadForWithType<T> = T extends void ? {} : T

interface Dispatch<P> {
  <K extends keyof P>(type: K, ...payloadArgs: PayloadArgs<P[K]>): Promise<any>
  <K extends keyof P>(payloadWithType: { type: K } & PayloadForWithType<P[K]>): Promise<any>

  // Fallback for root actions
  (type: string, payload: any, options: RootOption): Promise<any>
  <P extends BasePayload>(payloadWithType: P, options: RootOption): Promise<any>
}

interface Commit<P> {
  <K extends keyof P>(type: K, ...payloadArgs: PayloadArgs<P[K]>): void
  <K extends keyof P>(payloadWithType: { type: K } & PayloadForWithType<P[K]>): void

  // Fallback for root mutations
  (type: string, payload: any, options: RootOption): void
  <P extends BasePayload>(payloadWithType: P, options: RootOption): void
}

interface ActionContext<State, Getters, Actions, Mutations, RootState = any, RootGetters = any>
  extends BaseActionContext<State, RootState> {
  getters: Getters
  dispatch: Dispatch<Actions>
  commit: Commit<Mutations>
  rootGetters: RootGetters
}

export type DefineGetters<Getters, State, ExtraGetters = {}, RootGetters = any, RootState = any> = {
  [K in keyof Getters]: (
    state: State,
    getters: Getters & ExtraGetters,
    rootState: RootState,
    rootGetters: RootGetters
  ) => Getters[K]
}

export type DefineActions<
  Actions,
  State,
  Mutations,
  Getters = {},
  ExtraActions = {},
  RootState = any,
  RootGetters = any
> = {
  [K in keyof Actions]: (
    this: Store<State>,
    ctx: ActionContext<State, Getters, Actions & ExtraActions, Mutations, RootState, RootGetters>,
    payload: Actions[K]
  ) => void | Promise<any>
}

export type DefineMutations<Mutations, State> = {
  [K in keyof Mutations]: (state: State, payload: Mutations[K]) => void
}

type Mapper<P> = { [K in keyof P]: { type: K } & PayloadForWithType<P[K]> }

export type Dispatcher<
  Actions,
  M extends Mapper<Actions> = Mapper<Actions>,
  K extends keyof M = keyof M
> = M[K]

export type Committer<
  Mutations,
  M extends Mapper<Mutations> = Mapper<Mutations>,
  K extends keyof M = keyof M
> = M[K]
