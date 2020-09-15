/* eslint-disable no-unused-expressions */
import * as React from 'react'

export function useLazyFetch<AllMethods>(allMethods?: AllMethods) {
  const [state, setState] = React.useState({
    isLoading: false,
    isError: null,
    isRefetch: false
  } as any)

  const refetch = () => {
    setState((prevState: typeof state) => ({
      ...prevState,
      isRefetch: Math.random()
    }))
  }

  const setLoading = (loadingState: boolean) => {
    setState((prevState: typeof state) => ({
      ...prevState,
      isLoading: loadingState
    }))
  }

  const dataKeyLength = Object.keys(state).length

  const IS_SERVER = typeof window === 'undefined'
  const useIsomorphicLayoutEffect = IS_SERVER
    ? React.useEffect
    : React.useLayoutEffect

  type MethodKeys = keyof AllMethods

  function query<RequestResponse>(
    keyOrMethod: MethodKeys | Function,
    methodParams = [],
    options: {
      dataAlias?: string
      withEffect?: boolean
      hookDeps?: unknown[]
    } = {
      withEffect: false,
      hookDeps: []
    }
  ): RequestResponse & {
    refetch?: () => void
    [key: string]: unknown
    mutate?: (value: unknown) => void
  } {
    const keyString = String(keyOrMethod)
    const effectHooksDeps = options && options.hookDeps ? options.hookDeps : []
    // Use serviceFnParams to pass service method parameter

    const serviceFnParams = Array.isArray(methodParams) ? [...methodParams] : []

    if (!allMethods && keyOrMethod instanceof Function) {
      const effectHooksDeps =
        options && options.hookDeps ? options.hookDeps : []
      // Use serviceFnParams to pass service method parameter

      const serviceFnParams = Array.isArray(methodParams)
        ? [...methodParams]
        : []
      if (options && options.withEffect) {
        if (options.dataAlias) {
          // Using dataAlias for aliasing return object

          useIsomorphicLayoutEffect(() => {
            setLoading(true)
            keyOrMethod(...serviceFnParams)
              .then((response: unknown) => {
                setState((prevState: typeof state) => ({
                  ...prevState,
                  [options.dataAlias as string]: response
                }))
                setLoading(false)
                return Promise.resolve(response)
              })
              .catch((error: unknown) => {
                setState((prevState: typeof state) => ({
                  ...prevState,
                  isError: error
                }))
                setLoading(false)
                return Promise.reject(error)
              }) as any
          }, [...effectHooksDeps, state.isRefetch])

          const dataAliasValue = state[options.dataAlias]
          type StateAliasValue = typeof dataAliasValue
          return ({
            [options.dataAlias]: state[options.dataAlias],
            refetch,
            mutate(newValue: unknown) {
              return setState((prevState: typeof state) => ({
                ...prevState,
                [options.dataAlias as string]: newValue
              }))
            }
          } as unknown) as RequestResponse & {
            [key: string]: StateAliasValue
            refetch?: () => void
            mutate?: (value: unknown) => void
          }
        } else {
          const dataStateKey = `data${dataKeyLength}`

          useIsomorphicLayoutEffect(() => {
            setLoading(true)
            keyOrMethod(...serviceFnParams)
              .then((response: unknown) => {
                setState((prevState: typeof state) => ({
                  ...prevState,
                  [dataStateKey]: response
                }))
                setLoading(false)
                return Promise.resolve(response)
              })
              .catch((error: unknown) => {
                setState((prevState: typeof state) => ({
                  ...prevState,
                  isError: error
                }))
                setLoading(false)
                return Promise.reject(error)
              })
          }, [...effectHooksDeps, state.isRefetch])
          return ({
            data: state[`data${dataKeyLength - 1}`],
            refetch,
            mutate: (value: unknown) => {
              return setState((prevState: typeof state) => ({
                ...prevState,
                [`data${dataKeyLength - 1}`]: value
              }))
            }
          } as unknown) as RequestResponse & {
            refetch?: () => void
            mutate?: (value: unknown) => void
          }
        }
        // eslint-disable-next-line no-else-return
      } else {
        setLoading(true)
        return (keyOrMethod(...serviceFnParams)
          .then((response: unknown) => {
            setLoading(false)
            return Promise.resolve(response)
          })
          .catch((error: unknown) => {
            setState({
              ...state,
              isError: error
            })
            setLoading(false)
            return Promise.reject(error)
          }) as unknown) as RequestResponse & { refetch: () => void }
      }
    }

    if (options && options.withEffect) {
      if (options.dataAlias) {
        // Using dataAlias for aliasing return object

        useIsomorphicLayoutEffect(() => {
          setLoading(true)
          allMethods &&
            allMethods[keyString](...serviceFnParams)
              .then((response: unknown) => {
                setState((prevState: typeof state) => ({
                  ...prevState,
                  [options.dataAlias as string]: response
                }))
                setLoading(false)
              })
              .catch((error: unknown) => {
                setState((prevState: typeof state) => ({
                  ...prevState,
                  isError: error
                }))
                setLoading(false)
                return Promise.reject(error)
              })
        }, [...effectHooksDeps, state.isRefetch])

        const dataAliasValue = state[options.dataAlias]
        type StateAliasValue = typeof dataAliasValue

        return ({
          [options.dataAlias]: state[options.dataAlias],
          refetch,
          mutate(newValue: unknown) {
            return setState((prevState: typeof state) => ({
              ...prevState,
              [options.dataAlias as string]: newValue
            }))
          }
        } as unknown) as RequestResponse & {
          [key: string]: StateAliasValue
          refetch?: () => void
          mutate?: (value: unknown) => void
        }
      } else {
        const dataStateKey = `data${dataKeyLength}`

        useIsomorphicLayoutEffect(() => {
          setLoading(true)
          allMethods &&
            allMethods[keyString](...serviceFnParams)
              .then((response: unknown) => {
                setState((prevState: typeof state) => ({
                  ...prevState,
                  [dataStateKey]: response
                }))
                setLoading(false)
              })
              .catch((error: unknown) => {
                setState((prevState: typeof state) => ({
                  ...prevState,
                  isError: error
                }))
                setLoading(false)
                return Promise.reject(error)
              })
        }, [...effectHooksDeps, state.isRefetch])
        return ({
          data: state[`data${dataKeyLength - 1}`],
          refetch,
          mutate: (value: unknown) => {
            return setState((prevState: typeof state) => ({
              ...prevState,
              [`data${dataKeyLength - 1}`]: value
            }))
          }
        } as unknown) as RequestResponse & {
          refetch?: () => void
          mutate?: (value: unknown) => void
        }
      }
      // eslint-disable-next-line no-else-return
    } else {
      setLoading(true)
      return (
        allMethods &&
        ((allMethods[keyString](...serviceFnParams)
          .then((response: unknown) => {
            setLoading(false)
            return Promise.resolve(response)
          })
          .catch((error: unknown) => {
            setState({
              ...state,
              isError: error
            })
            setLoading(false)
            return Promise.reject(error)
          }) as RequestResponse & { refetch: () => void }) as any)
      )
    }
  }

  return {
    query,
    isLoading: state.isLoading,
    state,
    setServiceState: (key: string, value: unknown) => {
      return setState((prevState: typeof state) => ({
        ...prevState,
        [key]: value
      }))
    }
  }
}
