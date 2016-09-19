function Slider(opt){
    this.wrap = opt.wrap;
    this._next = opt.next;
    this._prev = opt.prev;
    this.callback = opt.callback;
    this._type = opt.type;

    this.init();
    this.initDom();
    this.bindEvent();
  
}
Slider.prototype = {
    init : function(){
        this._width = $(window).width();
        this._height = $(window).height();
        this._idx = 0;
        this._lock = false;
    },
    initDom : function(){
        var self = this;
        this._item = $('.slider-wrap>div');
            for(var i = 0;i<self._item.length;i++){
                $(self._item[i]).css('-webkit-transform',"translate3d(0,"+i*self._height+"px,0)");
            }
        },
    bindEvent : function(){
        var self = this,timer;
        this._item.on('touchstart',function(e){
            // e.preventDefault();
            self.startY = e.touches[0].clientY,
            self.offsetY = 0;
        })

        this._item.on('touchmove',function(e){
            if(self._lock){
                return false;
            }
            // e.preventDefault();
            self.moveY = e.touches[0].pageY,
            self.offsetY = self.moveY - self.startY;
            var w = self._height,
              offsetY = self.offsetY;
            for(var i = 0;i<self._item.length;i++){
                if(self._item[i]){
                    $(self._item[i]).css('-webkit-transform',"translate3d(0,"+((i-self._idx)*w+offsetY)+"px,0)");
                    $(self._item[i]).css('-webkit-transition','none');
                }
            } 
        })

        this._item.on('touchend',function(e){
            var w = self._width,
                offsetY = self.offsetY;
            if(offsetY<0){
                self._start("+1",e.type);
            }else if(offsetY>0){
                self._start("-1",e.type);
            }
        })
        
        this._next && this._next.on('click',function(e){
            self._start('+1',e.type);
        })
        this._prev && this._prev.on('click',function(e){
            self._start('-1',e.type);
        })
    },    
    getIndex : function(){
        return this._idx;
    },
    _start : function(num,type){
        var index = this._idx,
            w = this._height,
            item = this._item,
            len = item.length;
        if(typeof(num)=="number"){
            nowIdx = num;
        }
        else if(typeof(num)=="string"){
            nowIdx = index+num*1;
        }
        if(nowIdx>len-1){
            nowIdx = 0;
            this.initDom();
        }
        if(nowIdx<0){
            nowIdx = 0;
        }
        
        item[nowIdx] && ($(item[nowIdx]).show().css("-webkit-transform","translate3d(0,0,0)"));
        item[nowIdx-1] && ($(item[nowIdx-1]).hide().css("-webkit-transform","translate3d(0,"+-w+"px,0)"));
        item[nowIdx+1] && ($(item[nowIdx+1]).hide().css("-webkit-transform","translate3d(0,"+w+"px,0)"));

        item[nowIdx] && ($(item[nowIdx]).css("-webkit-transition","transform 0.3s ease-in"));
        item[nowIdx-1] && ($(item[nowIdx-1]).css("-webkit-transition","transform 0.3s ease-in"));
        item[nowIdx+1] && ($(item[nowIdx+1]).css("-webkit-transition","transform 0.3s ease-in"));
        

        this._idx = nowIdx;
        if(!type) return false;
        if(type.indexOf(this._type) == 0){
            this.callback && this.callback();
        }


    }
}