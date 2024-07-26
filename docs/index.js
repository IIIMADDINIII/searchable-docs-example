"use strict";const t=(t,...e)=>({strTag:!0,strings:t,values:e}),e=(t,e,s)=>{let i=t[0];for(let o=1;o<t.length;o++)i+=e[s?s[o-1]:o-1],i+=t[o];return i},s=t=>{return"string"!=typeof(s=t)&&"strTag"in s?e(t.strings,t.values):t;var s},i="lit-localize-status";class o{constructor(t){this.__litLocalizeEventHandler=t=>{"ready"===t.detail.status&&this.host.requestUpdate()},this.host=t}hostConnected(){window.addEventListener(i,this.__litLocalizeEventHandler)}hostDisconnected(){window.removeEventListener(i,this.__litLocalizeEventHandler)}}const n=t=>t.addController(new o(t));class r{constructor(){this.settled=!1,this.promise=new Promise(((t,e)=>{this._resolve=t,this._reject=e}))}resolve(t){this.settled=!0,this._resolve(t)}reject(t){this.settled=!0,this._reject(t)}}const a=[];for(let t=0;t<256;t++)a[t]=(t>>4&15).toString(16)+(15&t).toString(16);const l="",c="h",d="s";function h(t,e){return(e?c:d)+function(t){let e=0,s=8997,i=0,o=33826,n=0,r=40164,l=0,c=52210;for(let a=0;a<t.length;a++)s^=t.charCodeAt(a),e=435*s,i=435*o,n=435*r,l=435*c,n+=s<<8,l+=o<<8,i+=e>>>16,s=65535&e,n+=i>>>16,o=65535&i,c=l+(n>>>16)&65535,r=65535&n;return a[c>>8]+a[255&c]+a[r>>8]+a[255&r]+a[o>>8]+a[255&o]+a[s>>8]+a[255&s]}("string"==typeof t?t:t.join(l))}const u=new WeakMap,p=new Map;function f(t,i,o){if(t){const s=o?.id??function(t){const e="string"==typeof t?t:t.strings;let s=p.get(e);void 0===s&&(s=h(e,"string"!=typeof t&&!("strTag"in t)),p.set(e,s));return s}(i),n=t[s];if(n){if("string"==typeof n)return n;if("strTag"in n)return e(n.strings,i.values,n.values);{let t=u.get(n);return void 0===t&&(t=n.values,u.set(n,t)),{...n,values:t.map((t=>i.values[t]))}}}}return s(i)}function m(t){window.dispatchEvent(new CustomEvent(i,{detail:t}))}let v,g,y,$,_,b="",A=new r;A.resolve();let w=0;const S=t=>(function(t){if(P)throw new Error("lit-localize can only be configured once");C=t,P=!0}(((t,e)=>f(_,t,e))),b=g=t.sourceLocale,y=new Set(t.targetLocales),y.add(t.sourceLocale),$=t.loadLocale,{getLocale:E,setLocale:x}),E=()=>b,x=t=>{if(t===(v??b))return A.promise;if(!y||!$)throw new Error("Internal error");if(!y.has(t))throw new Error("Invalid locale code");w++;const e=w;v=t,A.settled&&(A=new r),m({status:"loading",loadingLocale:t});return(t===g?Promise.resolve({templates:void 0}):$(t)).then((s=>{w===e&&(b=t,v=void 0,_=s.templates,m({status:"ready",readyLocale:t}),A.resolve())}),(s=>{w===e&&(m({status:"error",errorLocale:t,errorMessage:s.toString()}),A.reject(s))})),A.promise};let C=s,P=!1;const L=globalThis,U=L.ShadowRoot&&(void 0===L.ShadyCSS||L.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,D=Symbol(),T=new WeakMap;let O=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==D)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(U&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=T.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&T.set(e,t))}return t}toString(){return this.cssText}};const k=(t,...e)=>{const s=1===t.length?t[0]:e.reduce(((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1]),t[0]);return new O(s,t,D)},N=U?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new O("string"==typeof t?t:t+"",void 0,D))(e)})(t):t,{is:M,defineProperty:H,getOwnPropertyDescriptor:j,getOwnPropertyNames:R,getOwnPropertySymbols:z,getPrototypeOf:I}=Object,V=globalThis,B=V.trustedTypes,W=B?B.emptyScript:"",q=V.reactiveElementPolyfillSupport,F=(t,e)=>t,G={toAttribute(t,e){switch(e){case Boolean:t=t?W:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},J=(t,e)=>!M(t,e),K={attribute:!0,type:String,converter:G,reflect:!1,hasChanged:J};Symbol.metadata??=Symbol("metadata"),V.litPropertyMetadata??=new WeakMap;class Q extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=K){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&H(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=j(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get(){return i?.call(this)},set(e){const n=i?.call(this);o.call(this,e),this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??K}static _$Ei(){if(this.hasOwnProperty(F("elementProperties")))return;const t=I(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(F("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(F("properties"))){const t=this.properties,e=[...R(t),...z(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(N(t))}else void 0!==t&&e.push(N(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{if(U)t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const s of e){const e=document.createElement("style"),i=L.litNonce;void 0!==i&&e.setAttribute("nonce",i),e.textContent=s.cssText,t.appendChild(e)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:G).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:G;this._$Em=i,this[i]=o.fromAttribute(e,t.type),this._$Em=null}}requestUpdate(t,e,s){if(void 0!==t){if(s??=this.constructor.getPropertyOptions(t),!(s.hasChanged??J)(this[t],e))return;this.P(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),!0===s.reflect&&this._$Em!==t&&(this._$Ej??=new Set).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t)!0!==s.wrapped||this._$AL.has(e)||void 0===this[e]||this.P(e,this[e],s)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EU()}catch(e){throw t=!1,this._$EU(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&=this._$Ej.forEach((t=>this._$EC(t,this[t]))),this._$EU()}updated(t){}firstUpdated(t){}}Q.elementStyles=[],Q.shadowRootOptions={mode:"open"},Q[F("elementProperties")]=new Map,Q[F("finalized")]=new Map,q?.({ReactiveElement:Q}),(V.reactiveElementVersions??=[]).push("2.0.4");const Y=globalThis,Z=Y.trustedTypes,X=Z?Z.createPolicy("lit-html",{createHTML:t=>t}):void 0,tt="$lit$",et=`lit$${Math.random().toFixed(9).slice(2)}$`,st="?"+et,it=`<${st}>`,ot=document,nt=()=>ot.createComment(""),rt=t=>null===t||"object"!=typeof t&&"function"!=typeof t,at=Array.isArray,lt=t=>at(t)||"function"==typeof t?.[Symbol.iterator],ct="[ \t\n\f\r]",dt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ht=/-->/g,ut=/>/g,pt=RegExp(`>|${ct}(?:([^\\s"'>=/]+)(${ct}*=${ct}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),ft=/'/g,mt=/"/g,vt=/^(?:script|style|textarea|title)$/i,gt=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),yt=Symbol.for("lit-noChange"),$t=Symbol.for("lit-nothing"),_t=new WeakMap,bt=ot.createTreeWalker(ot,129);function At(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==X?X.createHTML(e):e}const wt=(t,e)=>{const s=t.length-1,i=[];let o,n=2===e?"<svg>":"",r=dt;for(let e=0;e<s;e++){const s=t[e];let a,l,c=-1,d=0;for(;d<s.length&&(r.lastIndex=d,l=r.exec(s),null!==l);)d=r.lastIndex,r===dt?"!--"===l[1]?r=ht:void 0!==l[1]?r=ut:void 0!==l[2]?(vt.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=pt):void 0!==l[3]&&(r=pt):r===pt?">"===l[0]?(r=o??dt,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?pt:'"'===l[3]?mt:ft):r===mt||r===ft?r=pt:r===ht||r===ut?r=dt:(r=pt,o=void 0);const h=r===pt&&t[e+1].startsWith("/>")?" ":"";n+=r===dt?s+it:c>=0?(i.push(a),s.slice(0,c)+tt+s.slice(c)+et+h):s+et+(-2===c?e:h)}return[At(t,n+(t[s]||"<?>")+(2===e?"</svg>":"")),i]};class St{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0;const r=t.length-1,a=this.parts,[l,c]=wt(t,e);if(this.el=St.createElement(l,s),bt.currentNode=this.el.content,2===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=bt.nextNode())&&a.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(tt)){const e=c[n++],s=i.getAttribute(t).split(et),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:r[2],strings:s,ctor:"."===r[1]?Lt:"?"===r[1]?Ut:"@"===r[1]?Dt:Pt}),i.removeAttribute(t)}else t.startsWith(et)&&(a.push({type:6,index:o}),i.removeAttribute(t));if(vt.test(i.tagName)){const t=i.textContent.split(et),e=t.length-1;if(e>0){i.textContent=Z?Z.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],nt()),bt.nextNode(),a.push({type:2,index:++o});i.append(t[e],nt())}}}else if(8===i.nodeType)if(i.data===st)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(et,t+1));)a.push({type:7,index:o}),t+=et.length-1}o++}}static createElement(t,e){const s=ot.createElement("template");return s.innerHTML=t,s}}function Et(t,e,s=t,i){if(e===yt)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const n=rt(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=Et(t,o._$AS(t,e.values),o,i)),e}class xt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??ot).importNode(e,!0);bt.currentNode=i;let o=bt.nextNode(),n=0,r=0,a=s[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new Ct(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new Tt(o,this,t)),this._$AV.push(e),a=s[++r]}n!==a?.index&&(o=bt.nextNode(),n++)}return bt.currentNode=ot,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Ct{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=$t,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Et(this,t,e),rt(t)?t===$t||null==t||""===t?(this._$AH!==$t&&this._$AR(),this._$AH=$t):t!==this._$AH&&t!==yt&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):lt(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==$t&&rt(this._$AH)?this._$AA.nextSibling.data=t:this.T(ot.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=St.createElement(At(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new xt(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=_t.get(t.strings);return void 0===e&&_t.set(t.strings,e=new St(t)),e}k(t){at(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new Ct(this.S(nt()),this.S(nt()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Pt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=$t,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$t}_$AI(t,e=this,s,i){const o=this.strings;let n=!1;if(void 0===o)t=Et(this,t,e,0),n=!rt(t)||t!==this._$AH&&t!==yt,n&&(this._$AH=t);else{const i=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=Et(this,i[s+r],e,r),a===yt&&(a=this._$AH[r]),n||=!rt(a)||a!==this._$AH[r],a===$t?t=$t:t!==$t&&(t+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!i&&this.j(t)}j(t){t===$t?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Lt extends Pt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$t?void 0:t}}class Ut extends Pt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$t)}}class Dt extends Pt{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=Et(this,t,e,0)??$t)===yt)return;const s=this._$AH,i=t===$t&&s!==$t||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==$t&&(s===$t||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Tt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Et(this,t)}}const Ot={P:tt,A:et,C:st,M:1,L:wt,R:xt,D:lt,V:Et,I:Ct,H:Pt,N:Ut,U:Dt,B:Lt,F:Tt},kt=Y.litHtmlPolyfillSupport;kt?.(St,Ct),(Y.litHtmlVersions??=[]).push("3.1.4");const Nt=(t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new Ct(e.insertBefore(nt(),t),t,void 0,s??{})}return o._$AI(t),o};let Mt=class extends Q{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Nt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return yt}};Mt._$litElement$=!0,Mt.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:Mt});const Ht=globalThis.litElementPolyfillSupport;function jt(t){let e,s,i;return function(o,n){return void 0!==i&&e===o&&s===n||(i=function(e,s){let i,o;const n={locale:e,version:s,title(t,e){if(void 0!==i||void 0!==o)throw new Error("title and description was already defined previously");i=t,o=e}};if(t.call(n),void 0===i||void 0===o)throw new Error("You need to set a Title and description using this.title in the init function");return{title:i,description:o}}(o,n),e=o,s=n),i}}function Rt(t){let e;return function(){return void 0===e&&(e=function(){let e=!1;const s=[],i=new Map;let o,n,r=!1;const a=[],l=new Map;let c,d,h=!1;const u={addLocale(t){const r={id:t.id,displayName:t.displayName,translation:t.translation,default:t.default??!1};if(i.has(r.id))throw new Error("There can not be two locales with the same id");if(r.default){if(void 0!==o)throw new Error("There can only be one default locale");o=r.id}if("source"===t.translation){if(void 0!==n)throw new Error("There can only be one locale with source translations");n=r.id}s.push(r),i.set(r.id,r),e=!0},addVersion(t){const e={id:t.id,displayName:t.displayName??(()=>t.id),default:t.default??!1};if(l.has(e.id))throw new Error("There can not be two versions with the same id");if(!0===e.default){if(void 0!==c)throw new Error("There can only be one default version");c=e.id}a.push(e),l.set(e.id,e),r=!0},docs(t){if(void 0!==d)throw new Error("docs was already defined previously");d=jt(t)},debugDisableAnchorInterception(){h=!0}};if(t.call(u),void 0===o&&e)throw new Error("There must be at least one default locale");if(void 0===c&&r)throw new Error("There must be at least one default version");if(void 0===d)throw new Error("You need to set a Documentation entrypoint using this.docs in the init function");return{localesDefined:e,localesArray:s,localesMap:i,defaultLocale:o,sourceLocale:n,versionsDefined:r,versionsArray:a,versionsMap:l,defaultVersion:c,entrypoint:d,disableAnchorInterception:h}}()),e}}function zt(t,e,s,i,o,n){function r(t){if(void 0!==t&&"function"!=typeof t)throw new TypeError("Function expected");return t}for(var a,l=i.kind,c="getter"===l?"get":"setter"===l?"set":"value",d=!e&&t?i.static?t:t.prototype:null,h=e||(d?Object.getOwnPropertyDescriptor(d,i.name):{}),u=!1,p=s.length-1;p>=0;p--){var f={};for(var m in i)f[m]="access"===m?{}:i[m];for(var m in i.access)f.access[m]=i.access[m];f.addInitializer=function(t){if(u)throw new TypeError("Cannot add initializers after decoration has completed");n.push(r(t||null))};var v=(0,s[p])("accessor"===l?{get:h.get,set:h.set}:h[c],f);if("accessor"===l){if(void 0===v)continue;if(null===v||"object"!=typeof v)throw new TypeError("Object expected");(a=r(v.get))&&(h.get=a),(a=r(v.set))&&(h.set=a),(a=r(v.init))&&o.unshift(a)}else(a=r(v))&&("field"===l?o.unshift(a):h[c]=a)}d&&Object.defineProperty(d,i.name,h),u=!0}function It(t,e,s){for(var i=arguments.length>2,o=0;o<e.length;o++)s=i?e[o].call(t,s):e[o].call(t);return i?s:void 0}Ht?.({LitElement:Mt}),(globalThis.litElementVersions??=[]).push("4.0.6"),"function"==typeof SuppressedError&&SuppressedError;const Vt=t=>(e,s)=>{void 0!==s?s.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)},Bt={attribute:!0,type:String,converter:G,reflect:!1,hasChanged:J},Wt=(t=Bt,e,s)=>{const{kind:i,metadata:o}=s;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),n.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const o=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,o,t)},init(e){return void 0!==e&&this.P(i,void 0,t),e}}}if("setter"===i){const{name:i}=s;return function(s){const o=this[i];e.call(this,s),this.requestUpdate(i,o,t)}}throw Error("Unsupported decorator location: "+i)};function qt(t){return(e,s)=>"object"==typeof s?Wt(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,i?{...t,wrapped:!0}:t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}const Ft=1,Gt=2,Jt=t=>(...e)=>({_$litDirective$:t,values:e});class Kt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const Qt=Jt(class extends Kt{constructor(t){if(super(t),t.type!==Ft||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const s=t.element.classList;for(const t of this.st)t in e||(s.remove(t),this.st.delete(t));for(const t in e){const i=!!e[t];i===this.st.has(t)||this.nt?.has(t)||(i?(s.add(t),this.st.add(t)):(s.remove(t),this.st.delete(t)))}return yt}}),{I:Yt}=Ot,Zt=()=>document.createComment(""),Xt=(t,e,s)=>{const i=t._$AA.parentNode,o=void 0===e?t._$AB:e._$AA;if(void 0===s){const e=i.insertBefore(Zt(),o),n=i.insertBefore(Zt(),o);s=new Yt(e,n,t,t.options)}else{const e=s._$AB.nextSibling,n=s._$AM,r=n!==t;if(r){let e;s._$AQ?.(t),s._$AM=t,void 0!==s._$AP&&(e=t._$AU)!==n._$AU&&s._$AP(e)}if(e!==o||r){let t=s._$AA;for(;t!==e;){const e=t.nextSibling;i.insertBefore(t,o),t=e}}}return s},te=(t,e,s=t)=>(t._$AI(e,s),t),ee={},se=t=>{t._$AP?.(!1,!0);let e=t._$AA;const s=t._$AB.nextSibling;for(;e!==s;){const t=e.nextSibling;e.remove(),e=t}},ie=(t,e,s)=>{const i=new Map;for(let o=e;o<=s;o++)i.set(t[o],o);return i},oe=Jt(class extends Kt{constructor(t){if(super(t),t.type!==Gt)throw Error("repeat() can only be used in text expressions")}dt(t,e,s){let i;void 0===s?s=e:void 0!==e&&(i=e);const o=[],n=[];let r=0;for(const e of t)o[r]=i?i(e,r):r,n[r]=s(e,r),r++;return{values:n,keys:o}}render(t,e,s){return this.dt(t,e,s).values}update(t,[e,s,i]){const o=(t=>t._$AH)(t),{values:n,keys:r}=this.dt(e,s,i);if(!Array.isArray(o))return this.ut=r,n;const a=this.ut??=[],l=[];let c,d,h=0,u=o.length-1,p=0,f=n.length-1;for(;h<=u&&p<=f;)if(null===o[h])h++;else if(null===o[u])u--;else if(a[h]===r[p])l[p]=te(o[h],n[p]),h++,p++;else if(a[u]===r[f])l[f]=te(o[u],n[f]),u--,f--;else if(a[h]===r[f])l[f]=te(o[h],n[f]),Xt(t,l[f+1],o[h]),h++,f--;else if(a[u]===r[p])l[p]=te(o[u],n[p]),Xt(t,o[h],o[u]),u--,p++;else if(void 0===c&&(c=ie(r,p,f),d=ie(a,h,u)),c.has(a[h]))if(c.has(a[u])){const e=d.get(r[p]),s=void 0!==e?o[e]:null;if(null===s){const e=Xt(t,o[h]);te(e,n[p]),l[p]=e}else l[p]=te(s,n[p]),Xt(t,o[h],s),o[e]=null;p++}else se(o[u]),u--;else se(o[h]),h++;for(;p<=f;){const e=Xt(t,l[f+1]);te(e,n[p]),l[p++]=e}for(;h<=u;){const t=o[h++];null!==t&&se(t)}return this.ut=r,((t,e=ee)=>{t._$AH=e})(t,l),yt}});function ne(t){const e={};return t.searchParams.forEach(((t,s)=>e[s]=t)),e}function re(){return ne(new URL(location.href))}function ae(t,e=!1){if(e)return void window.history.replaceState(t,"",le(t));const s=new Set(Object.keys(t));for(const[e,i]of Object.entries(re()))if(s.delete(e),t[e]!==i)return void window.history.pushState({},"",le(t));0!==s.size&&window.history.pushState({},"",le(t))}function le(t){const e=new URL(location.href);return Object.entries(t).forEach((([t,s])=>void 0!==s?e.searchParams.set(t,s):void 0)),e}function ce(t,e=""){return t instanceof Error?gt`
      <div style="height: 100%; width: 100%; background-color: red; color: yellow; padding: 8px;">
        <h1 style="margin-bottom: 0px;">${e}${t.name}: ${t.message}</h1>
        ${t.stack?gt`<div style="padding: 8px; padding-left: 24px;">${function(t){let e=t.stack;if(void 0===e)return $t;const s=`${t.name}: ${t.message}`;e.startsWith(s)&&(e=e.slice(s.length));const i=e.trim().split(/\r?\n+/);return gt`${function*(t,e){const s="function"==typeof e;if(void 0!==t){let i=-1;for(const o of t)i>-1&&(yield s?e(i):e),i++,yield o}}(i.map((t=>t.trim())),(()=>gt`<br>`))}`}(t)}</div>`:$t}
        ${t.cause?t.cause instanceof Error?ce(t.cause,"Caused by: "):gt`<h1 style="margin-bottom: 0px;">Caused by: ${t.cause}</h1>`:$t}
      </div>
    `:gt`<div style="height: 100%; width: 100%; background-color: red; color: yellow"><h1>Error: ${t}</h1></div>`}(()=>{let t,e,s,i=[Vt("docs-document")],o=[],n=Mt,r=[],a=[];(class extends n{static{e=this}static{const l="function"==typeof Symbol&&Symbol.metadata?Object.create(n[Symbol.metadata]??null):void 0;s=[qt({attribute:!1})],zt(this,null,s,{kind:"accessor",name:"docsDescription",static:!1,private:!1,access:{has:t=>"docsDescription"in t,get:t=>t.docsDescription,set:(t,e)=>{t.docsDescription=e}},metadata:l},r,a),zt(null,t={value:e},i,{kind:"class",name:e.name,metadata:l},null,o),e=t.value,l&&Object.defineProperty(e,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:l})}static styles=k`
    :host {
      display: block;
    }
  `;#t=It(this,r,void 0);get docsDescription(){return this.#t}set docsDescription(t){this.#t=t}constructor(){super(...arguments),It(this,a)}static{It(e,o)}})})(),(()=>{let t,e,s,i=[Vt("docs-nav")],o=[],n=Mt,r=[],a=[];(class extends n{static{e=this}static{const l="function"==typeof Symbol&&Symbol.metadata?Object.create(n[Symbol.metadata]??null):void 0;s=[qt({attribute:!1})],zt(this,null,s,{kind:"accessor",name:"docsDescription",static:!1,private:!1,access:{has:t=>"docsDescription"in t,get:t=>t.docsDescription,set:(t,e)=>{t.docsDescription=e}},metadata:l},r,a),zt(null,t={value:e},i,{kind:"class",name:e.name,metadata:l},null,o),e=t.value,l&&Object.defineProperty(e,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:l})}static styles=k`
    :host {
      display: block;
    }
  `;#t=It(this,r,void 0);get docsDescription(){return this.#t}set docsDescription(t){this.#t=t}constructor(){super(...arguments),It(this,a)}static{It(e,o)}})})(),(()=>{let t,e,s=[Vt("docs-select")],i=[],o=Mt;(class extends o{static{e=this}static{const n="function"==typeof Symbol&&Symbol.metadata?Object.create(o[Symbol.metadata]??null):void 0;zt(null,t={value:e},s,{kind:"class",name:e.name,metadata:n},null,i),e=t.value,n&&Object.defineProperty(e,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:n})}static styles=k`
    @position-try --span-left {
      inset-area: bottom span-left;
      margin-right: 0px;
    }
    button {
      display: flex;
      padding: 8px;
      background-color: white; 
      border-radius: 8px; 
      box-shadow: 0px 0px 20px #0003;
      anchor-name: --menu;
      border: none;
      height: 100%;
      width: 100%;
      span {
        margin-left: 8px;
      }
      slot {
        flex-grow: 1;
      }
    }
    dialog {
      position: absolute;
      position-anchor: --menu;
      inset-area: bottom;
      margin: 8px;
      border-radius: 8px;
      border: none;
      box-shadow: 0px 0px 20px #0003;
      min-width: anchor-size(width);
      box-sizing: border-box;
      position-try-options: --span-left; // soon legacy
      position-try-fallbacks: --span-left;
    }
    ::slotted([slot="selected"]) {
      flex-grow: 1;
    }
    ::slotted(:not([slot="selected"])) {
      display: block;
      padding: 8px;
      background-color: white; 
      border-radius: 4px;
      text-decoration: none;
      color: inherit;
    }
    ::slotted(:not([slot="selected"]).selected) {
      background-color: #EEE;
    }
    ::slotted(:not([slot="selected"]):hover) {
      background-color: #DDD;
    }
  `;render(){return gt`
      <button popovertarget="menu"><slot name="selected"></slot><span>▼</span></button>
      <dialog popover id="menu">
        <slot></slot>
      </dialog>
    `}static{It(e,i)}})})();let de,he,ue=(()=>{let e,s,i,o=[Vt("docs-main"),(t,e)=>(t.addInitializer(n),t)],r=[],a=Mt,l=[];return class extends a{static{s=this}static{const t="function"==typeof Symbol&&Symbol.metadata?Object.create(a[Symbol.metadata]??null):void 0;i=[qt({reflect:!0})],zt(this,null,i,{kind:"setter",name:"version",static:!1,private:!1,access:{has:t=>"version"in t,set:(t,e)=>{t.version=e}},metadata:t},null,l),zt(null,e={value:s},o,{kind:"class",name:s.name,metadata:t},null,r),s=e.value,t&&Object.defineProperty(s,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:t})}static styles=k`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      header {
        display: flex;
        padding: 8px;
        border-bottom: 1px solid black;
        gap: 8px;
        docs-select {
          min-width: 80px;
        }
      }
      main {
        display: flex;
        flex-grow: 1;
        docs-document {
          flex: 0 1 1000px;
        }
      }
      .fill {
        flex-grow: 1;
      }
    }
    @media (min-width: 801px) {
      :host {
        main {
          docs-nav {
            display: block
          }
        }
      }
    }
  `;static get observedAttributes(){return["locale",...super.observedAttributes]}#e=It(this,l);#s;#i;#o=void 0;#n=void 0;#r=!1;#a=document.createElement("title");#l=document.createElement("meta");constructor(t){super(),this.#e=t,this.#c(),({setLocale:this.#s,getLocale:this.#i}=this.#d()),this.#h()}#d(){if(!this.#e.localesDefined)return{setLocale:()=>Promise.resolve(),getLocale:()=>""};let t="-en-x-dev";void 0!==this.#e.sourceLocale&&(t=this.#e.sourceLocale,this.#o=t);const e=[...this.#e.localesMap.keys()];return S({sourceLocale:t,targetLocales:e,loadLocale:this.#u.bind(this)})}async#u(e){const s=this.#p(e);if(void 0===s)throw new Error("Should never happen");const i=this.#e.localesMap.get(s);if(void 0===i)throw new Error("Should never happen");const o=i.translation;if("source"===o)throw new Error("Should never happen");return o.templates(t,gt)}#c(){document.head.appendChild(this.#a),this.#l.name="description",document.head.appendChild(this.#l);const t=document.createElement("meta");t.name="viewport",t.content="width=device-width, initial-scale=1",document.head.appendChild(t),document.addEventListener("click",this.#f.bind(this))}#h(){this.#m(),void 0!==this.locale&&this.#s(this.locale).catch(console.error),ae(this.#v(),!0),window.addEventListener("popstate",this.#m.bind(this)),this.#r=!0}set locale(t){const e=this.#p(t);if(this.#o!==e){if(void 0===e)throw new Error("Should never happen");this.#o=e,this.getAttribute("locale")!==this.#o&&this.setAttribute("locale",this.#o),this.#s(this.#o).catch(console.error),document.documentElement.setAttribute("lang",this.#o),this.#g()}}get locale(){return this.#o}#p(t){if(this.#e.localesDefined)return null==t?this.#e.defaultLocale:t}attributeChangedCallback(t,e,s){"locale"!==t?super.attributeChangedCallback(t,e,s):this.locale=s}set version(t){const e=this.#y(t);if(this.#n!==e){if(void 0===e)throw new Error("Should never happen");this.#n=e,this.#g()}}get version(){return this.#n}#y(t){if(this.#e.versionsDefined)return null==t?this.#e.defaultVersion:t}#g(){this.#r&&ae(this.#v())}#m(){this.#$(re())}#$(t){this.#r=!1;try{this.locale=t.locale,this.version=t.version}finally{this.#r=!0}}#v(){const t={};return void 0!==this.locale&&(t.locale=this.locale),void 0!==this.version&&(t.version=this.version),t}#f(t){if(this.#e.disableAnchorInterception)return;const e=t.composedPath()[0];if(i="a",!(null!=(s=e)&&s instanceof Element&&s.tagName.toLocaleUpperCase()===i.toLocaleUpperCase()))return;var s,i;const o=new URL(e.href);o.origin===location.origin&&o.pathname===location.pathname&&(t.preventDefault(),this.#$(ne(o)),this.#g())}render(){try{return gt`
        <header>
          <div class="fill"></div>
          ${this.#_()}
          ${this.#b()}
        </header>
        ${this.#A()}
      `}catch(t){return console.error(t),ce(t)}}#A(){const t=this.#e.entrypoint(this.#i(),this.version);return this.#a.innerText=t.title,this.#l.content=t.description,gt`
      <main>
        <div class="fill"></div>
        <docs-document></docs-document>
        <div class="fill"></div>
      </main>
    `}#b(){if(!this.#e.localesDefined||void 0===this.locale)return gt``;const t=this.#e.localesMap.get(this.locale);return void 0===t?gt``:gt`
      <docs-select>
        <span slot="selected">${t.displayName()}</span>
        ${oe(this.#e.localesArray,(({id:e,displayName:s})=>gt`<a class=${Qt({selected:e===t.id})} href=${le({locale:e}).href}>${s()}</a>`))}
      </docs-select>
    `}#_(){if(!this.#e.versionsDefined||void 0===this.version)return gt``;const t=this.#e.versionsMap.get(this.version);return void 0===t?gt``:gt`
      <docs-select>
        <span slot="selected">${t.displayName()}</span>
        ${oe(this.#e.versionsArray,(({id:e,displayName:s})=>gt`<a class=${Qt({selected:e===t.id})} href=${le({version:e}).href}>${s()}</a>`))}
      </docs-select>
    `}static{It(s,r)}},s})();var pe=Object.freeze({__proto__:null,templates:function(t,e){return void 0!==he||(he={templates:{s08cf0b07b5709128:"v1",s08cf0e07b5709641:"v2",s4caed5b7a7e5d89b:"Englisch",s5f43af3669b1e098:"Quelle",s63e71d20d1eaca93:"Deutsch",s595af87ad03941c2:"Searchable Docs Example",s06e67f7289d18c70:"An Example of a searchable Documentation"}}),he}});let fe;var me=Object.freeze({__proto__:null,templates:function(t,e){return void 0!==fe||(fe={templates:{s08cf0b07b5709128:"v1",s08cf0e07b5709641:"v2",s4caed5b7a7e5d89b:"English",s5f43af3669b1e098:"Source",s63e71d20d1eaca93:"German",s595af87ad03941c2:"Searchable Docs Example",s06e67f7289d18c70:"An Example of a searchable Documentation"}}),fe}});const ve=function(){this.title(C("Searchable Docs Example"),C("An Example of a searchable Documentation"))};!function(t){try{if(void 0!==de)throw new Error("init function can only be called once");const e=k`
      html, body {
        height: 100%;
        width: 100%;
        margin: 0px;
      }
    `.styleSheet;if(void 0===e)throw new Error("Error while creating Document Styles");document.adoptedStyleSheets=[...document.adoptedStyleSheets,e],de=new ue(Rt(t)()),document.body.appendChild(de)}catch(t){document.body.replaceChildren(),Nt(ce(t),document.body),console.error(t)}}((function(){this.addLocale({id:"en",displayName:()=>C("English"),translation:me}),this.addLocale({id:"de",displayName:()=>C("German"),translation:pe,default:!0}),this.addLocale({id:"src",displayName:()=>C("Source"),translation:"source"}),this.addVersion({id:"v1",displayName:()=>C("v1"),default:!0}),this.addVersion({id:"v2",displayName:()=>C("v2")}),this.docs(ve)}));
