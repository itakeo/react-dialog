import React from 'react';
import ReactDOM from 'react-dom/client';
import './dialog.css'
let __dialog_index_num = 0;
class DialogCom extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        content : '',
        time : null,
        maskClick : true,
        mask : true,
        title : '',
        index : 1,
        zIndex : null,
        button : {},
        buttonArr : [],
        ui :null,
        onLoad : ()=>null,
        onClose : ()=>null
    }
    componentDidMount(){
        let _button = this.props.button,_buttonArr = [];
        if(_button && (_button instanceof Array)){
            _button.map((o,i)=>{
                _buttonArr.push({
                    title : o.title,
                    fn : o.onClick || o.onclick
                });
            });
        }else{
            _button && Object.keys(_button).forEach(key=>{
                _buttonArr.push({
                    title : key,
                    fn : _button[key]
                });
            });
        }
        this.setState({
            buttonArr : _buttonArr,
            ...this.props
        },()=>{
            if(this.props.visible === undefined){//判断是否是指令式调用
                this.state.onLoad(this);
                if(this.state.time){
                    setTimeout(()=>{
                        this.close(this.state.index,this,this.state.onClose,this.state.root);
                    },this.state.time)
                }
            }
        });
    }


    close = (a = this.state.index,b = this,c=this.state.onClose,d=this.state.root)=>{
        removeDialogElement(a,b,c,d);
    }
    render(){
        let {buttonArr} = this.state
        let {content,mask=true,title,ui,maskClick=true} = this.props
        return (
            <>
                {
                    ui && this.props.visible=== undefined ? ui(this) : 
                    <div className={`c_alert_wrap ${ (title || buttonArr.length) ? 'c_alert_width' : ''}`} style={{zIndex : this.state.zIndex ? +this.state.zIndex+1 : ''}}>
                        {title ? <div className="c_alert_title">{title}</div> : ''}
                        <div className="c_alert_con">
                            {content}
                            {this.props.children && this.props.children}
                        </div>
                        {
                            buttonArr.length ? (
                                <div className="c_alert_btn">
                                {
                                    buttonArr.map((res,index)=> <div className="c_alert_btn_cel" key={index} onClick={()=>{
                                        res.fn(this)
                                    }}>{res.title}</div>)
                                }
                                </div>
                            )
                            : ''
                        }
                    </div>
                }
                {
                    mask ? <div 
                    className="c_alert_mask" 
                    style={{zIndex : this.state.zIndex}}
                    onClick = {()=>{
                        maskClick && this.close(this.state.index,this,this.state.onClose,this.state.root)
                    }}
                    onTouchMove={()=>{return false}}></div> : ''
                }
            </>
        )
    }
    
}

function removeDialogElement(a,b,fn,root){
    let _target = document.querySelectorAll('.c_alert_dialog');
    _target.forEach(o=>{
        if(o.dataset.index*1 === a){
            o.classList.remove('dialog_open')
            o.classList.add('dialog_close');
            o.addEventListener('animationend', function(){
                root && root.unmount(o)
                o.remove();
                fn && fn(b)
            });
        } 
    });
}

function createDialogElement(a,b){
    __dialog_index_num++;
    let _dialogElement = document.createElement('div'),
        _time = null,
        _content = typeof a === 'object' ? '' : a,
        _props = typeof a === 'object' ? a : (b || {});

    _dialogElement.className =" c_alert_dialog ";
    setTimeout(()=>{
        _dialogElement.classList.add('dialog_open')
    },10);
    if(typeof _props === 'object'){
        if(!(_props.ui || _props.title || _props.button) ) {
            _dialogElement.classList.add('c_alert_inner');
        } 
    }else{    
        if(_props) _time = _props;
        _dialogElement.classList.add('c_alert_inner');
    }
    _props.addClass && _dialogElement.classList.add(_props.addClass);
    let _index = _props.index ? _props.index : __dialog_index_num;
    _dialogElement.dataset.index = _index;
    document.body.appendChild(_dialogElement);
    //判断是否是指令式调用
    if(_dialogElement.parentNode !== document.body && !_props.visible) return
    let root = ReactDOM.createRoot(_dialogElement);
    root.render( <DialogCom content={_content} time={_time} root={root} index={_index} {..._props} />);
    return {close : (fn)=>{
        return removeDialogElement(_index,'',fn ? fn : _props.onClose,root)
    }}
}


class StatementDialog extends React.Component {
    constructor(props) {
        super(props);
        this.target = React.createRef();
    }
    render(){
        if(this.target.current){
            if(!this.props.visible){
                this.props.onclose && this.props.onclose();
                this.props.onClose && this.props.onClose();
            } else{
                this.props.onload && this.props.onload()
                this.props.onLoad && this.props.onLoad()
            };
        };
        return <div ref={this.target} className={"c_alert_dialog  " + (this.props.addClass || '')+ (this.props.visible ? ' dialog_open ' :' ') + (!(this.props.ui || this.props.title || this.props.button) ? 'c_alert_inner' : '')}>
            <DialogCom {...this.props} />
        </div>
    }

}

export default function Dialog(props,b){
    if(!(props.visible === undefined)){
        return <StatementDialog {...props}/>
    }else  return createDialogElement(props,b)
}
