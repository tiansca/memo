/**
 * Created by administrator on 2019/4/23.
 */
const mutations = {
  setUserSession(state, n){
    if (n.id) {
      n._id = n.id
    }
    if (n.username) {
      n.name = n.username
    }
    state.user = n;
  },
  setMemo(state, n){
    state.memoArr = n;
  }

}

export default mutations
