export default function updateAction(state, payload) {
    return {
        ...state,
        data: {
            ...state.data,
            ...payload
        }
    }
}

export function clearAction(state, payload) {
  return {
        ...state,
        data: {
            
        }
    }
}