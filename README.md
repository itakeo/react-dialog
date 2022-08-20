# react-dialog

```
import Dialog from './utils/dialog/';  

let demo = Dialog('这里是内容'); //默认一个参数提示内容
demo.close(()=>{
  //默认有个返回值，可以在其他地方关闭这个Dialog
})
Dialog('这里是内容',1500); //第二个参数消失时间
Dialog('这里是内容',{ //全部参数如下
    mask : false, //遮罩
    zIndex : 10, //设置层级
    maskClick : false, //遮罩点击关闭
    time : 1000, //自动消失时间
    title : '标题', //是否有标题
    content : '', //设置内容，覆盖第一个参数
    content : (<div>
       <Test age={this.state.age} /> //可以是jsx语法
    </div>),
    button : { //按钮对象形式
        yes : (e)=>{
            e.close()
        },
        no  : (e)=>{
            e.close()
        }
    },
    button : [
        { //按钮数组形式
           title : 'cancel',
           onclick : ()=>{
             
           }
        },
        {
           title : 'ok',
           onclick : ()=>{
              
           }
        },
    ],
    ui(e){  //自定义显示内容，权限最高，会覆盖其他设置
        return (
            <button onClick={()=>{
                e.close()
            }}>点击</button>
        )
    },
    onLoad()=>null,
    onClose()=>null
});

```


#注意，对于指令式创建出来的Dialog，并不会感知父组件中state的更新，需要使用声明式创建。

##声明式参数同指令式一致，其中取消了【time，ui，maskClick】这三个参数设置，增加了visible参数，用来控制显示和隐藏。


```
<Dialog 
  visible={this.state.show} 
  title ={this.state.title}
  content={this.state.content}
/>

<Dialog visible={this.state.show} title ={this.state.title}>
   <p>内容</p>
</Dialog>
```
