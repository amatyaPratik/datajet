let selectedProcesses 
let parallelCounter
let tempProcessesModel = []
const db_key_pipelines = 'local_pipeline-'
let chooseToRerunProcess = false

const currentPipeline = {
    pipelineName: '',
    pipelineId: '',
    executions:[]
}

function getProcessInfoFromProcessName(pName){
    const options = document.querySelectorAll('#process-select option')

    for(opt of options){
        if(opt.getAttribute('value')==-1) continue;

        if(opt.getAttribute('name')==pName)
            return {'code': opt.getAttribute('value'), 'pid': opt.getAttribute('pid')}
    }
    return 
}

// const takenExecutionOrders = new Set()
function isCurrentOrderAlreadyInPipeline(currentOrder){
    let yes = false
    currentPipeline.executions.forEach(p=>{
        console.log('p: ',p);
        if(p.order===currentOrder) yes = true
    })
    return yes
}

function queueProcess(pName, pOrder, parallels = 0){
    //debugger;
    console.log('qOrder', pOrder);
    console.log('pName: ',pName); 
  
    addNode(pName, pOrder, parallels)
} 

function multiProcessesSelectCheck(){

    let selectedProcessNames  
  //  debugger

    // selectedProcessNames =  Array.from(document.getElementById("process-select").selectedOptions).map(opt=>opt.value) 
    console.log('selectedProcessNames: ',selectedProcessNames);

    selectedProcesses = Array.from(document.getElementById("process-select").selectedOptions)
            .map(opt=>{ return { 
                                    code: opt.value, 
                                    name: opt.getAttribute('name'), 
                                    pid: +opt.getAttribute('pid') 
                                }
                        }
                )
                
    const addBtn = document.getElementById('btn-add')
    const runParallel = document.getElementById('run-in-parallel')
  
    console.log('selectedProcesses: ',selectedProcesses);

    if(selectedProcesses.length>1 && !selectedProcesses.includes('-1')){
        runParallel.removeAttribute('disabled')    
        if(runParallel.checked)
            addBtn.removeAttribute('disabled')
        else
            addBtn.setAttribute('disabled',true)
    }

    else if(selectedProcesses.length===1 && selectedProcesses[0].code!=='-1'){
        runParallel.checked=false
        runParallel.setAttribute('disabled',true)
        addBtn.removeAttribute('disabled')
    }
    else{
        runParallel.setAttribute('disabled',true)
        addBtn.setAttribute('disabled',true)
    }
}

function drawLine(srcX, srcY, tarX, tarY){  
    //to rotate the arrowhead accordingly
    // const radians = Math.atan2((HEIGHT/2 - targetY)<0?(HEIGHT/2 - targetY)*-1:(HEIGHT/2 - targetY),(targetX - sourceX)<0? -1*(targetX - sourceX):targetX - sourceX); 
    // const degrees = radians * (180 / Math.PI);
   
    // Draw the line with an arrowhead
    svg.append("line")
        .attr("x1", srcX)
        .attr("y1", srcY)
        .attr("x2", tarX)
        .attr("y2", tarY)
        .attr("stroke", "black")
        .attr("stroke-width", 2); 
   }

function drawArrowHead(){
     // Add an arrowhead marker
    svg.append("defs").append("marker")
     .attr("id", "arrow")
     .attr("markerWidth", 10)
     .attr("markerHeight", 10)
     .attr("refX", 9)
     .attr("refY", 3)
     .append("path")
     .attr("d", "M0,0 L0,6 L9,3 z")
     .attr("fill", "black");

      // Apply the arrowhead to the line
    svg.selectAll("line")
    .attr("marker-end", "url(#arrow)");
}

function drawObliqueLine(pOrder, tarX, tarY){ 
    // Coordinates of the source and target nodes
    let sourceX = x(pOrder-1)+rw;
    let sourceY = HEIGHT/2 //+ rh/2; // Adjusted for node height
    let targetX = tarX;
    let targetY = tarY //+ rh/2; // Adjusted for node height
 
    //to rotate the arrowhead accordingly
    // const radians = Math.atan2((HEIGHT/2 - targetY)<0?(HEIGHT/2 - targetY)*-1:(HEIGHT/2 - targetY),(targetX - sourceX)<0? -1*(targetX - sourceX):targetX - sourceX); 
    // const degrees = radians * (180 / Math.PI);
   
    // Draw the line with an arrowhead
    svg.append("line")
        .attr("x1", sourceX)
        .attr("y1", sourceY)
        .attr("x2", targetX)
        .attr("y2", targetY)
        .attr("stroke", "black")
        .attr("stroke-width", 2); 
   }
 
function drawLineFromPreviousProcesses(pOrder){  
    const previousOrderProcesses = document.querySelectorAll(`[process-order="${pOrder-1}"]`)
    let previousOrderProcessesCount = previousOrderProcesses.length
 
    for(const node of previousOrderProcesses){  
        if(node.classList.contains('process-node-parallel-'+(pOrder-1))){
            drawLine(
                x(pOrder-1)+rw, 
                y(previousOrderProcessesCount--)+rh/2,
                x(pOrder), 
                HEIGHT/2
            ) 
        }
        else
            drawLine(
                x(pOrder-1)+rw, 
                HEIGHT/2,
                x(pOrder), 
                HEIGHT/2
            ) 
            drawArrowHead()
    } 
}


function addNode(pName, pOrder, parallels, xx=20, yy=(HEIGHT/2-rh/2)){  
    if(parallels===0){
       // Create a group (g) element to make both the rectangle and text clickable
      let group = svg.append("g")
      .attr('id',(pName.replace(' ','-').toLowerCase()+'-'+pOrder))
      .attr('class','process-node')
      .attr('process-order',pOrder) 
      .attr("transform", "translate(" + (x(pOrder))+ "," + yy + ")") 
      .style("cursor", "pointer") 

      group.append("rect")
          .attr("width", rw) 
          .attr("height", rh) 
          .attr("fill", "lightgray") 
          .attr("stroke", "black")
          .attr('rx',4)
          .attr('ry',4) 
          .attr("stroke-width", 2); 

    // Create a foreignObject to hold the text with wrapping
    const foreignObject = group.append("foreignObject")
    .attr("width", rw) // Set the same width n height as the rect
    .attr("height", rh)

    // Create a nested div element for the text
    foreignObject.append("xhtml:div")
    .style("width", rw + "px") // Set the width to match the rect
    .style("height", rh + "px") // Set the height to match the rect
    .style("overflow-wrap", "break-word") // Enable word wrapping
    .style("line-height",".9")
    .style("display","flex")
    .style("justify-content","center")
    .style("align-items","center")
    .text(pName);

      // Add a click event listener to the group
      group.on("click", function(e) {
          openProcessModal(e)
      });

      if(pOrder>1)
        drawLineFromPreviousProcesses(pOrder) 
    }else{ 
        ////debugger;   
        // Create a group (g) element to make both the rectangle and text clickable
      let group = svg.append("g")
      .attr('id',(pName.replace(' ','-').toLowerCase()+'-'+pOrder))
      .attr('class','process-node process-node-parallel-'+pOrder)
      .attr('process-order',pOrder)
      .attr("transform", "translate(" + (x(pOrder))+ "," + y(parallels) + ")") 
      .style("cursor", "pointer")

      
      group.append("rect")
          .attr("width", rw) 
          .attr("height", rh) 
          .attr("fill", "lightgray") 
          .attr("stroke", "black")
          .attr('rx',4)
          .attr('ry',4) 
          .attr("stroke-width", 2); 

        // Create a foreignObject to hold the text with wrapping
        const foreignObject = group.append("foreignObject")
        .attr("width", rw) // Set the same width n height as the rect
        .attr("height", rh)

        // Create a nested div element for the text
        foreignObject.append("xhtml:div")
        .style("width", rw + "px") // Set the width to match the rect
        .style("height", rh + "px") // Set the height to match the rect
        .style("overflow-wrap", "break-word") // Enable word wrapping
        .style("line-height",".9")
        .style("display","flex")
        .style("justify-content","center")
        .style("align-items","center")
        .text(pName);

      // Add a click event listener to the group
      group.on("click", function(e) {
          openProcessModal(e)
      });
 
      drawObliqueLine(pOrder, x(pOrder), y(parallels)+rh/2) 
    }
}

function getMaxProcessOrder(){
    let maxProcessOrder = 0
    const allProcesses = document.querySelectorAll(`[process-order]`)
    allProcesses.forEach(p=>{
        if(maxProcessOrder < p.getAttribute('process-order'))
            maxProcessOrder = p.getAttribute('process-order')
    })
    return maxProcessOrder
}

function areAllProcessesInCurrentOrderDone(order){
    const allProcessesInCurrentOrder = document.querySelectorAll(`[process-order='${order}']`);
    let yes = true
    allProcessesInCurrentOrder.forEach(p=>{
        if(p.querySelector('rect').getAttribute('style') !== 'stroke: green;')
            yes = false
    })
return yes
}

function runSequentially(ind=1){
    const pipelineStatus = document.getElementsByClassName('pipeline-status')[0]
    const btnStop = document.getElementById('btn-stop')  

    if(getMaxProcessOrder() < ind){
        console.log('all done')
        const pipelineStatus = document.getElementsByClassName('pipeline-status')[0]
        pipelineStatus.textContent = 'COMPLETE'
        const btnStop = document.getElementById('btn-stop')  
        btnStop.classList.add('d-none')
        const btnRerun = document.getElementById('btn-rerun')  
        btnRerun.classList.remove('d-none') 
        return
    }
    
    console.log('hrhr');
    const allProcesses = document.querySelectorAll(`[process-order]`); //get all alloted orders that can have multiple processes running in them parallelly
    const processesInCurrentSlot = []
    allProcesses.forEach(p=>{
        if(p.getAttribute('process-order')==(ind))
            processesInCurrentSlot.push(p)
    })
    debugger 

        for(const p of processesInCurrentSlot){
            console.log('p: ',p)
            p.querySelector('rect').style.setProperty('stroke', 'orange', 'important')
        } 
 
        for(const p of processesInCurrentSlot){
            setTimeout(()=>{
                if(currentPipeline.pipelineId===2 && ind===2 && !chooseToRerunProcess){
                    p.querySelector('rect').style.stroke = 'red' 
                    pipelineStatus.textContent = 'ERROR' 
                    btnStop.classList.add('d-none')
                }
                else{
                    p.querySelector('rect').style.stroke = 'green' 
                    if(areAllProcessesInCurrentOrderDone(ind)){ 
                        runSequentially(ind+1)
                    }
                }
            },(2000+Math.random()*3000)) 
        }    
}

function rerunProcess(){
    const pipelineStatus = document.getElementsByClassName('pipeline-status')[0]
    const btnStop = document.getElementById('btn-stop')  
    pipelineStatus.textContent = 'RUNNING'
    btnStop.classList.remove('d-none')

    const processConfigModal = document.getElementById('process-config-modal')
    processConfigModal.close()  //close/hide the dialog popup upon rerun
    chooseToRerunProcess = true
    runSequentially(2)
}
  
function save(){
    // const jsonData = JSON.parse(JSON.stringify(currentPipeline))  //clone currentPipeline

    console.log();
    localStorage.setItem(db_key_pipelines+currentPipeline.pipelineId,JSON.stringify(currentPipeline))
      
    //   fetch('http://localhost:3000/save-pipeline', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(jsonData),
    //   })
    //     .then((response) => response.text())
    //     .then((message) => {
    //       console.log(message);
    //     })
    //     .catch((error) => {
    //       console.error('Error:', error);
    //     });
}


function fetchConfigOfCurrentPipeline(){
    const url = window.location.search
    parallelCounter = 0
    
    const pipeName = document.getElementById('pipeline-name') 

    currentPipeline.pipelineId = +new URLSearchParams(url).get('pipelineId')
    currentPipeline.pipelineName = new URLSearchParams(url).get('pipelineName');

    pipeName.textContent = currentPipeline.pipelineName

    if(currentPipeline.pipelineId>3) 
    {
        currentPipeline.executions =  localStorage.getItem(db_key_pipelines+currentPipeline.pipelineId)?JSON.parse(localStorage.getItem(db_key_pipelines+currentPipeline.pipelineId)).executions  : []
        
        // currentPipeline.executions = localPipeline.executions
        console.log('currentPipeline: ',currentPipeline);
        
        setTimeout(()=>{       
            currentPipeline.executions.forEach(exec=>{
            console.log('exec: ',exec);
            selectedProcesses =  exec
            addProcess()
        })
        if(new URLSearchParams(url).get('running')=='true')
            runSequentially()
        },500)
    return
    }

    fetch(jsonPipelines)
    .then(response=>response.json())
    .then(pipeline => {
        clearSVG()
 
       // debugger
        console.log('setUpPipeline : ',pipeline);
        const filteredData = pipeline.filter(d=>{
            return d.pipelineId == currentPipeline.pipelineId
        })

        currentPipeline.executions = filteredData[0]['executions']?filteredData[0]['executions']: []
         
        console.log('currentPipeline: ',currentPipeline);
        
        currentPipeline.executions.forEach(exec=>{
            selectedProcesses =  exec
            addProcess()
        })
        if(new URLSearchParams(url).get('running')=='true')
            runSequentially()
    })}

function getLastProcessOrder(){
    const currentProcesses = document.getElementsByClassName('process-node')

    let maxProcessOrder = 0

    for(const p of currentProcesses){
        if(p.getAttribute('process-order')>maxProcessOrder)
            maxProcessOrder = Number(p.getAttribute('process-order'))
    }

    return maxProcessOrder
}

function addProcess() {      
    let executionOrder = getLastProcessOrder()+1
    
        if(selectedProcesses.order){
            executionOrder = selectedProcesses.order
        }else{  //if no order / is new node addition, add the order property based on already present process-node count
            selectedProcesses = {order: executionOrder, process: [...selectedProcesses]}
            // currentPipeline
            // console.log('selectedProcesses: ',selectedProcesses); 
            currentPipeline.executions.push(selectedProcesses)
            console.log('currentPipeline.executions: ',currentPipeline.executions);
        } 
    //debugger;
    if(selectedProcesses.process && selectedProcesses.process.length>1){ 
        parallelCounter = selectedProcesses.process.length  //global parallel process iterator
        const processCount = parallelCounter
        yLinearBand(processCount)
         selectedProcesses.process.forEach((p,i) => {
            console.log('p: ',p);
            queueProcess(p.name, executionOrder, parallelCounter--)
        });     
    }
    else{ 
        queueProcess(selectedProcesses.process[0].name,executionOrder)
    }
} 
 