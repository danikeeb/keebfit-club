// iPhone plays <video> only from servers that answer byte-range requests; the artifact host sends whole files.
// So every video is downloaded once with fetch and played from a blob: URL. A video is fetched when it scrolls
// into view; its intended time and play state are restored after the swap. VFIX.prefetch(url) warms the cache.
(function(){
  var cache={};
  function get(url){
    if(!cache[url])cache[url]=fetch(url).then(function(r){if(!r.ok)throw new Error(r.status);return r.blob()})
      .then(function(b){return URL.createObjectURL(b)});
    return cache[url];
  }
  function abs(s){return new URL(s,location.href).href}
  function fix(v){
    var s=v.getAttribute('src');
    if(!s||/^(blob|data):/.test(s)||v.dataset.vfix===s)return;
    v.dataset.vfix=s;
    function go(){
      get(abs(s)).then(function(u){
        if(v.dataset.vfix!==s)return;  // the page switched this player to another video meanwhile
        var t=v.currentTime,play=!v.paused||v.autoplay;
        v.addEventListener('loadedmetadata',function(){
          if(t)try{v.currentTime=t}catch(e){}
          if(play){var p=v.play();if(p&&p.catch)p.catch(function(){})}
        },{once:true});
        v.src=u;
      }).catch(function(){});
    }
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){if(es.some(function(e){return e.isIntersecting})){io.disconnect();go()}});
      io.observe(v);
    }else go();
  }
  function scan(root){(root.querySelectorAll?root.querySelectorAll('video'):[]).forEach(fix);if(root.tagName==='VIDEO')fix(root)}
  new MutationObserver(function(ms){ms.forEach(function(m){
    if(m.type==='attributes')fix(m.target);else m.addedNodes.forEach(function(n){if(n.nodeType===1)scan(n)});
  })}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});
  scan(document);
  window.VFIX={prefetch:function(u){get(abs(u)).catch(function(){})}};
})();
