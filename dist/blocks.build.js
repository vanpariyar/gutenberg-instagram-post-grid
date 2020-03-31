!function(e){function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var r={};t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});r(1)},function(e,t,r){"use strict";function n(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,r){function n(o,i){try{var a=t[o](i),u=a.value}catch(e){return void r(e)}if(!a.done)return Promise.resolve(u).then(function(e){n("next",e)},function(e){n("throw",e)});e(u)}return n("next")})}}var o=r(2),i=r.n(o),a=r(5),u=(r.n(a),r(6)),l=(r.n(u),this),__=wp.i18n.__,c=wp.blocks.registerBlockType,s=wp.element,p=(s.useState,s.Fragment),f=wp.components,h=f.TextControl,m=(f.CheckboxControl,f.RadioControl,f.SelectControl,f.TextareaControl,f.ToggleControl),d=f.RangeControl,g=(f.Panel,f.PanelBody),w=f.PanelRow,y=(f.Spinner,f.Button),v=wp.blockEditor.InspectorControls,b=function(e){return isNaN(e)?e:e<9999?e:e<1e6?Math.round(e/1e3)+"K":e<1e7?(e/1e6).toFixed(2)+"M":e<1e9?Math.round(e/1e6)+"M":e<1e12?Math.round(e/1e9)+"B":"1T+"},E=function(e){var t=e.props,r=e.getUserInfo;return wp.element.createElement(g,{title:"My Block Settings",initialOpen:!0},wp.element.createElement(w,null,wp.element.createElement("strong",null,"Note: This Will only works For instagram Public Acoount.")),wp.element.createElement(w,null,wp.element.createElement(m,{checked:t.attributes.showFollowers,label:"show Your Followers",onChange:function(){return t.setAttributes({showFollowers:!t.attributes.showFollowers})}})),wp.element.createElement(w,null,wp.element.createElement(m,{checked:t.attributes.isCroped,label:"Image Crop ?",onChange:function(){return t.setAttributes({isCroped:!t.attributes.isCroped})}})),wp.element.createElement(w,null,wp.element.createElement("p",null,"Column Settings:"),wp.element.createElement(d,{value:t.attributes.column,onChange:function(e){return t.setAttributes({column:e})},min:1,max:8})),wp.element.createElement(w,null,wp.element.createElement("p",null,"Post Count:"),wp.element.createElement(d,{value:t.attributes.postCount,onChange:function(e){return t.setAttributes({postCount:e})},min:1,max:12})),wp.element.createElement(w,null,wp.element.createElement(h,{value:t.attributes.userName,label:"Enter Your Instagram username",onChange:function(e){return t.setAttributes({userName:e})}})),t.attributes.userName?wp.element.createElement(w,null,wp.element.createElement(y,{isPrimary:!0,onClick:function(){return r()}}," Fetch My Details ")):"")},x=function(e){var t=e.props,r=e.getUserInfo;return wp.element.createElement(v,null,wp.element.createElement(E,{props:t,getUserInfo:r}))},O=function(e){var t=e.props,r=e.getUserInfo;return t.attributes.userObject.userObjectLoaded?wp.element.createElement(p,null,wp.element.createElement(j,{count:"undefined"!=typeof t.attributes.userObject.userObject.graphql?b(t.attributes.userObject.userObject.graphql.user.edge_followed_by.count):"",showFollowers:t.attributes.showFollowers}),wp.element.createElement("figure",{className:"wp-block-gallery columns-"+t.attributes.column+" "+(t.attributes.isCroped?"is-cropped":"")},wp.element.createElement("ul",{className:"blocks-gallery-grid"},t.attributes.userObject.userObject.graphql.user.edge_owner_to_timeline_media.edges.slice(0,t.attributes.postCount).map(function(e,t){return wp.element.createElement("li",{key:t,className:"blocks-gallery-item"},wp.element.createElement("figure",{className:""},wp.element.createElement("img",{src:e.node.display_url,alt:"","data-id":"130",tabindex:"0","aria-label":"image 1 of 8 in gallery"})))})))):wp.element.createElement("div",null,wp.element.createElement(E,{props:t,getUserInfo:r}))},j=function(e){var t=e.count,r=e.showFollowers;return wp.element.createElement(p,null,r?"Followers Count - "+t:"")};c("vanpariyar/instagram-post-grid",{title:__("Instagram Post Grid"),icon:"instagram",category:"common",keywords:[__("Instagram Post Grid"),__("vanpariyar"),__("create-guten-block")],attributes:{userName:{type:"string"},column:{type:"integer",default:4},postCount:{type:"integer",default:12},isCroped:{type:"integer",default:1},showFollowers:{type:"boolean",default:0},showProfilePic:{type:"boolean"},userObject:{type:"object",default:{userObjectLoaded:0,userObject:{}}},userObjectLoaded:{type:"boolean",default:0}},edit:function(e){var t=function(){var t=n(i.a.mark(function t(){var r,n,o;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.attributes.userName,r="undefined"!==typeof r?r:"instagram",t.next=4,fetch("https://www.instagram.com/"+r+"?__a=1").then(function(e){if(e.ok)return e;throw new Error("Problem With Network")}).then(function(e){return e.json()});case 4:n=t.sent,o="undefined"==typeof n.captcha?1:0,e.setAttributes({userObject:{userObject:n,userObjectLoaded:o}});case 7:case"end":return t.stop()}},t,l)}));return function(){return t.apply(this,arguments)}}();return wp.element.createElement("div",null,wp.element.createElement(x,{props:e,getUserInfo:t}),wp.element.createElement(O,{props:e,getUserInfo:t}))},save:function(e){return wp.element.createElement("div",null,wp.element.createElement(x,{props:e}),wp.element.createElement(O,{props:e}))}})},function(e,t,r){e.exports=r(3)},function(e,t,r){var n=function(){return this}()||Function("return this")(),o=n.regeneratorRuntime&&Object.getOwnPropertyNames(n).indexOf("regeneratorRuntime")>=0,i=o&&n.regeneratorRuntime;if(n.regeneratorRuntime=void 0,e.exports=r(4),o)n.regeneratorRuntime=i;else try{delete n.regeneratorRuntime}catch(e){n.regeneratorRuntime=void 0}},function(e,t){!function(t){"use strict";function r(e,t,r,n){var i=t&&t.prototype instanceof o?t:o,a=Object.create(i.prototype),u=new h(n||[]);return a._invoke=c(e,r,u),a}function n(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}function o(){}function i(){}function a(){}function u(e){["next","throw","return"].forEach(function(t){e[t]=function(e){return this._invoke(t,e)}})}function l(e){function t(r,o,i,a){var u=n(e[r],e,o);if("throw"!==u.type){var l=u.arg,c=l.value;return c&&"object"===typeof c&&y.call(c,"__await")?Promise.resolve(c.__await).then(function(e){t("next",e,i,a)},function(e){t("throw",e,i,a)}):Promise.resolve(c).then(function(e){l.value=e,i(l)},a)}a(u.arg)}function r(e,r){function n(){return new Promise(function(n,o){t(e,r,n,o)})}return o=o?o.then(n,n):n()}var o;this._invoke=r}function c(e,t,r){var o=L;return function(i,a){if(o===C)throw new Error("Generator is already running");if(o===k){if("throw"===i)throw a;return d()}for(r.method=i,r.arg=a;;){var u=r.delegate;if(u){var l=s(u,r);if(l){if(l===P)continue;return l}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(o===L)throw o=k,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);o=C;var c=n(e,t,r);if("normal"===c.type){if(o=r.done?k:_,c.arg===P)continue;return{value:c.arg,done:r.done}}"throw"===c.type&&(o=k,r.method="throw",r.arg=c.arg)}}}function s(e,t){var r=e.iterator[t.method];if(r===g){if(t.delegate=null,"throw"===t.method){if(e.iterator.return&&(t.method="return",t.arg=g,s(e,t),"throw"===t.method))return P;t.method="throw",t.arg=new TypeError("The iterator does not provide a 'throw' method")}return P}var o=n(r,e.iterator,t.arg);if("throw"===o.type)return t.method="throw",t.arg=o.arg,t.delegate=null,P;var i=o.arg;return i?i.done?(t[e.resultName]=i.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=g),t.delegate=null,P):i:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,P)}function p(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function f(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function h(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(p,this),this.reset(!0)}function m(e){if(e){var t=e[b];if(t)return t.call(e);if("function"===typeof e.next)return e;if(!isNaN(e.length)){var r=-1,n=function t(){for(;++r<e.length;)if(y.call(e,r))return t.value=e[r],t.done=!1,t;return t.value=g,t.done=!0,t};return n.next=n}}return{next:d}}function d(){return{value:g,done:!0}}var g,w=Object.prototype,y=w.hasOwnProperty,v="function"===typeof Symbol?Symbol:{},b=v.iterator||"@@iterator",E=v.asyncIterator||"@@asyncIterator",x=v.toStringTag||"@@toStringTag",O="object"===typeof e,j=t.regeneratorRuntime;if(j)return void(O&&(e.exports=j));j=t.regeneratorRuntime=O?e.exports:{},j.wrap=r;var L="suspendedStart",_="suspendedYield",C="executing",k="completed",P={},N={};N[b]=function(){return this};var F=Object.getPrototypeOf,I=F&&F(F(m([])));I&&I!==w&&y.call(I,b)&&(N=I);var R=a.prototype=o.prototype=Object.create(N);i.prototype=R.constructor=a,a.constructor=i,a[x]=i.displayName="GeneratorFunction",j.isGeneratorFunction=function(e){var t="function"===typeof e&&e.constructor;return!!t&&(t===i||"GeneratorFunction"===(t.displayName||t.name))},j.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,a):(e.__proto__=a,x in e||(e[x]="GeneratorFunction")),e.prototype=Object.create(R),e},j.awrap=function(e){return{__await:e}},u(l.prototype),l.prototype[E]=function(){return this},j.AsyncIterator=l,j.async=function(e,t,n,o){var i=new l(r(e,t,n,o));return j.isGeneratorFunction(t)?i:i.next().then(function(e){return e.done?e.value:i.next()})},u(R),R[x]="Generator",R[b]=function(){return this},R.toString=function(){return"[object Generator]"},j.keys=function(e){var t=[];for(var r in e)t.push(r);return t.reverse(),function r(){for(;t.length;){var n=t.pop();if(n in e)return r.value=n,r.done=!1,r}return r.done=!0,r}},j.values=m,h.prototype={constructor:h,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=g,this.done=!1,this.delegate=null,this.method="next",this.arg=g,this.tryEntries.forEach(f),!e)for(var t in this)"t"===t.charAt(0)&&y.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=g)},stop:function(){this.done=!0;var e=this.tryEntries[0],t=e.completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){function t(t,n){return i.type="throw",i.arg=e,r.next=t,n&&(r.method="next",r.arg=g),!!n}if(this.done)throw e;for(var r=this,n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n],i=o.completion;if("root"===o.tryLoc)return t("end");if(o.tryLoc<=this.prev){var a=y.call(o,"catchLoc"),u=y.call(o,"finallyLoc");if(a&&u){if(this.prev<o.catchLoc)return t(o.catchLoc,!0);if(this.prev<o.finallyLoc)return t(o.finallyLoc)}else if(a){if(this.prev<o.catchLoc)return t(o.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return t(o.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&y.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===e||"continue"===e)&&o.tryLoc<=t&&t<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=e,i.arg=t,o?(this.method="next",this.next=o.finallyLoc,P):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),P},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),f(r),P}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;f(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,r){return this.delegate={iterator:m(e),resultName:t,nextLoc:r},"next"===this.method&&(this.arg=g),P}}}(function(){return this}()||Function("return this")())},function(e,t){},function(e,t){}]);