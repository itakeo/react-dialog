import React from 'react';
import ReactDOM from 'react-dom/client';
import './dialog.css'
let __dialog_index_num = 0;
class DialogCom extends React.Component {
    state = {
        content : '',
        time : null,
        maskClick : true,
        mask : true,
        title : '',
        index : 1,
        button : {},
        buttonArr : [],
        ui :null,
        onLoad : ()=>null,
        onClose : ()=>null
    }

    componentDidMount(){
        let _button = this.props.button,_buttonArr = [];
        _button && Object.keys(_button).forEach(key=>{
            _buttonArr.push({
                title : key,
                fn : _button[key]
            });
        });
        this.setState({
            buttonArr : _buttonArr,
            content : this.props.content,
            ...this.props
        },()=>{
            this.state.onLoad(this);
            if(this.state.time){
                setTimeout(()=>{
                    this.close(this.state.index,this,this.state.onClose,this.state.root);
                },this.state.time)
            }
        });
    }


    close = (a = this.state.index,b = this,c=this.state.onClose,d=this.state.root)=>{
        removeDialogElement(a,b,c,d);
    }
    render(){
        let {content,mask,title,buttonArr,ui,maskClick} = this.state
        return (
            <>
                {
                    ui ? ui(this) : 
                    <div className={`c_alert_wrap ${ (title || buttonArr.length) ? 'c_alert_width' : ''}`}>
                        {title ? <div className="c_alert_title">{title}</div> : ''}
                        <div className="c_alert_con">
                            {content}
                        </div>
                        {
                            buttonArr.length ? (
                                <div className="c_alert_btn">
                                {
                                    buttonArr.map((res,index)=> <span key={index} onClick={()=>{
                                        res.fn(this)
                                    }}>{res.title}</span>)
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
    _dialogElement.style.zIndex = _props.zIndex;
    let _index = _props.index ? _props.index : __dialog_index_num;
    _dialogElement.dataset.index = _index;
    document.body.appendChild(_dialogElement);
    let root = ReactDOM.createRoot(_dialogElement);
    root.render( <DialogCom content={_content} time={_time} root={root} index={_index} {..._props} />);
    return {close : (fn)=>{
        return removeDialogElement(_index,'',fn ? fn : _props.onClose,root)
    }}
}

export default function Dialog(a,b){
   return createDialogElement(a,b)
}
