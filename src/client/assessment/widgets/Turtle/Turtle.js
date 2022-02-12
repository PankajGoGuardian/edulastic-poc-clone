import React, { useRef, useImperativeHandle, forwardRef, useEffect, useState  } from 'react';
import { notification as Notification } from 'antd';
import { notification } from '@edulastic/common';
import { CodeEditorSimple } from '../../../assessment/components/CodeEditor/CodeEditor';
import styled from 'styled-components';

const iframeTemplate = (programLines, instant=false) => {

    const getScriptContent = () => `
            from browser import document,window
            import sys
            from turtle import *
            reset()
            
            ${ instant? `speed(0)`:``}
            ${ instant? `hideturtle()`:`shape("turtle")` }
            # screen function
            bgcolor("rgb(0, 0, 0)")

            color("green", "white")

            ${programLines.join(`\n${Array(12).fill(' ').join('')}`)} 

            done()
    `;

    return `
    <html>
        <head>
            <script>
            var _console={...console}
            console.error = function(...args) {
                const errMsg = args[0];
               if(errMsg.includes("Traceback")){
                    window.parent.postMessage({errorMsg:errMsg},"*")
               } else {
                   console.warn(...args);
               }
            }
            </script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.10.4/brython.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.10.4/brython_stdlib.min.js"></script>
            <script>
                __instant = ${instant?"true":"false"};
               

                function sendSvg(){

                    let svg = "";
                    const svgElement = document.querySelector('#turtle-canvas');
                    if(svgElement){
                        svg = svgElement.outerHTML;
                        window.parent.postMessage({svg},"*");
                    }

                    
                }

                function __runMainCode(){
                    window.brython();
                }
            </script>
        </head>
        <body onLoad="__runMainCode();${instant?'setTimeout(()=>sendSvg(),1500)':''}">
            <script type="text/python">
            from browser import window
            import sys
            class OutputDebug:
                def write(self, text):
                    window.parent.postMessage({"errorMsg":text})
            
            sys.stderr = OutputDebug();
            </script>
            <script type="text/python">
                ${getScriptContent()}
            </script>
            <script type="text/javascript">
                
            </script>
        </body>
    
    </html>
    
    `;
}

function formatCodeIntoLines(code){
    return code.split(/\r?\n/);
}


function specialPromise(){
    let resolve,reject;
    const pr = new Promise((res,rej)=>{
        resolve = res;
        reject = rej;
    });

    return {resolve,reject,promise:pr};
    
}

function BrythonExecution_({}, ref){

    const iframeContainerRef = useRef();
    const instantIframeContainerRef = useRef();
    const iframeRef = useRef();
    const iframe2Ref = useRef();

    useEffect(()=>{
        const iframe = document.createElement('iframe');
        iframe.sandbox="allow-scripts allow-same-origin";
        const iframe2 = document.createElement('iframe');
        iframe2.sandbox="allow-scripts allow-same-origin";

        iframeRef.current = iframe;
        iframe2Ref.current = iframe2;
        
        iframeContainerRef.current.appendChild(iframe);
        instantIframeContainerRef.current.appendChild(iframe2);

        return () => {
            try{
                iframeContainerRef.current.removeChild(iframe);
            } catch(e){

            }

            try {
                instantIframeContainerRef.current.removeChild(iframe2);
            } catch(e){

            }
        }

    },[])


    useImperativeHandle(ref,()=> ({
        execute: (prog,auto=false)=>{
            const codeLines = formatCodeIntoLines(prog);
            var html = iframeTemplate(codeLines);
            var html2 = iframeTemplate(codeLines,true);
            if(!auto){
                //console.log(html);
                iframeRef.current.contentWindow.__BRYTHON__ = undefined;
                iframeRef.current.contentWindow.document.open();
                iframeRef.current.contentWindow.document.write("");
                iframeRef.current.contentWindow.document.write(html);
                iframeRef.current.contentWindow.document.close();
            }
            

            let {resolve,promise,reject} = specialPromise();
            window.onmessage = (msg)=>{
                if(msg.data.svg){
                    resolve(msg.data.svg);
                } else if(msg.data.errorMsg){
                    reject(msg.data.errorMsg);
                }
            }
            
            iframe2Ref.current.contentWindow.__BRYTHON__ = undefined;
            iframe2Ref.current.contentWindow.document.open();
            iframe2Ref.current.contentWindow.document.write("");
            iframe2Ref.current.contentWindow.document.write(html2);
            iframe2Ref.current.contentWindow.document.close();
        
            return promise;


        }
    }))

    return (<>
        <IframeContainer ref={iframeContainerRef}></IframeContainer>
        <IframeContainerHidden ref={instantIframeContainerRef}></IframeContainerHidden>
    </>)
}

const BrythonExecution = forwardRef(BrythonExecution_);

const code = `

forward(100)
right(90)
forward(100)
right(90)
forward(100)
right(90)
forward(100)
`
const code2 = `

color('red', 'yellow')
begin_fill()


while True:
    forward(200)
    left(170)
    x,y = pos()
    if abs(x) < 1 and abs(y) < 1:
        break
end_fill()
done()
`;

function parsePythonErrorMsg(e){
    const errorParts = e.split('\n').filter(x => x.trim() != "^");
    const partsLen = errorParts.length;
    const lastLine = errorParts[partsLen-1];
    const lineNumberLine = errorParts[partsLen-3];
    const lineNumPosition = lineNumberLine.indexOf(' line ');
    const [lineNumber,module] = lineNumberLine.substr(lineNumPosition+6).split(', in ');
    return {lineNumber,module,errorMsg:lastLine}
}

function showError({lineNumber,module,errorMsg}){
    const key = "turtleError";
    const msg = `Error found in Program: ${errorMsg}
    At line number: ${parseInt(lineNumber)-13}${module?`, In ${module}`:''}`;
    Notification.close(key);
    notification({type:"warning",key,msg,duration:0});
}

export  function TurtleRunner({}){
    const [codeStr,setCodeStr] = useState(code);
    const [executing,setExecuting] = useState(false);
    const [_error,setError] = useState();
    const exRef = useRef();


    return (<div>
        <h1>TurtleRunner</h1>
        <FlexRow>
            <div className="editor">
                <CodeEditorSimple value={codeStr} executing={executing} onChange={(v)=>{
                    setCodeStr(v);
                    //console.log('code change',v);
                }} onRun={()=> {
                    setExecuting(true);
                    setTimeout(()=>{
                        exRef.current.execute(codeStr).then((res)=>{
                            console.log('res svg');
                        }).catch((e)=>{
                            const parsedError = parsePythonErrorMsg(e);
                            showError(parsedError);
                        }).finally(()=>{
                            setExecuting(false);
                        })
                    },0);
                }} defaultFontSize={16} />
            </div>
            <div className="preview">
                <BrythonExecution ref={exRef} />
            </div>
        </FlexRow>
    </div>)
}


const IframeContainer = styled.div`
    iframe {
        width:500px;
        height:500px;
        border:0;
        outline:0;
    }
`;

const IframeContainerHidden = styled.div`
    iframe {
        display: none;
    }
`;

const FlexRow = styled.div`
    display: flex;
    flex-row: row nowrap;
    justify-content: flex-start;
    align-content: center;
    align-items:flex-start;

    .editor,.preview{
        flex: 0 1 auto;
        align-self: auto;
        min-height: auto;
        min-width:500px;
    }
`

const ErrorDisplay = styled.pre`
    color: red;
    font-weight: bold;
`;