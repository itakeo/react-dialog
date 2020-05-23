import React from 'react';
import Dialog from './utils/dialog'
function App() {
  let clickDemo1 = ()=>{
    Dialog('你刚刚点击了')
  }
  let clickDemo2 = ()=>{
    Dialog('2秒后我将自动消失',2000)
  }
  let clickDemo3 = ()=>{
    Dialog('这是一个带标题的提示',{
      title : '警告：'
    })
  }
  let clickDemo4 = ()=>{
    Dialog('这是一个带按钮的提示',{
      title : '警告：',
      onLoad(e){
        console.log('onload触发')
      },
      button : {
        yes(e){
          e.close()
          Dialog('你刚刚点击了yes',1000)
        },
        cancel(e){
          e.close()
          Dialog('你刚刚点击了cancel',1000)
        }
      }
    })
  }

  let clickDemo5 = ()=>{
    Dialog({
      ui(e){
        return(
          <div style={{background:'#fff',padding:'15px'}}>
            这里是自定义内容
            <br/><br/>
            <button onClick={()=>{
              e.close()
            }}>点击我关闭</button>
          </div>
        )
      }
    })
  }
  return (
    <div className="App">
      <button onClick={clickDemo1}>点击</button>
      <br/>
      <button onClick={clickDemo2}>2秒自动消失</button>
      <br/>
      <button onClick={clickDemo3}>设置标题</button>
      <br/>
      <button onClick={clickDemo4}>设置按钮</button>
      <br/>
      <button onClick={clickDemo5}>自定义ui</button>
    </div>
  );
}

export default App;
