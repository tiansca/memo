/**
 * Created by administrator on 2019/4/23.
 */
const mutations = {
  setUserSession(state, n){
    state.user = n;
    localStorage.setItem('username', n.username);
    localStorage.setItem('password', n.password);
  },
  setMemo(state, n){
    state.memoArr = n;
  }

}

export default mutations
