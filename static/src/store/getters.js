/**
 * Created by administrator on 2019/4/24.
 */
const getters = {
  usableNote(state){
    return state.noteArr.filter(note=>note.status==1 && note.islock == 0)
  },
  getMemoByid:(state)=>(n)=>{
    if(n){
      return state.memoArr.filter((memo)=>{
        return memo._id == n;
      })
    }else {
      return []
    }
  },
}

export default getters
