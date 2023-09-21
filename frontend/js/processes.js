let processes
// let executionOrder = 0
let parallelCounter
let tempProcessesModel = []

const currentPipeline = {
    pipelineName: '',
    pipelineId: '',
    processes:[]
}

// const takenExecutionOrders = new Set()

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

    const selectedProcesses = Array.from(document.getElementById("process-select").selectedOptions)
            .map(opt=>{ return { 
                                    code: opt.value, 
                                    name: opt.getAttribute('name'), 
                                    pid: +opt.getAttribute('pid') 
                                }
                        }
                )
                
    const addBtn = document.getElementById('btn-add')
    const runParallel = document.getElementById('run-in-parallel')
    // console.log('executionOrder: ',executionOrder);

    processes = selectedProcesses

    console.log('processes: ',processes);

    if(processes.length>1 && !processes.includes('-1')){ 
        console.log('h>1');
        runParallel.removeAttribute('disabled')    
        if(runParallel.checked)
            addBtn.removeAttribute('disabled')
        else
            addBtn.setAttribute('disabled',true)
    }

    else if(processes.length===1 && processes[0].code!=='-1'){
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
   
    // Add an arrowhead marker
    // svg.append("defs").append("marker")
    //     .attr("id", "arrow")
    //     .attr("markerWidth", 10)
    //     .attr("markerHeight", 10)
    //     .attr("refX", 9)
    //     .attr("refY", 3)
    //     // .attr("orient", "auto") // Add the rotate property here
    //     .append("path")
    //     .attr("d", "M0,0 L0,6 L9,3 z")
    //     .attr("transform",`rotate(90 4.5 3)`)
    //     .attr("fill", "black");
   
    // Apply the arrowhead to the line
    // svg.selectAll("line")
    //     .attr("marker-end", "url(#arrow)");
   }
 
function drawLineFromPreviousProcesses(pOrder){  
    const previousOrderProcesses = document.querySelectorAll(`[process-order="${pOrder-1}"]`)
    let previousOrderProcessesCount = previousOrderProcesses.length

    const currentOrderProcesses = document.querySelector(`[process-order="${pOrder}"]`)
    console.log('previousOrderProcesses: ',previousOrderProcesses);
    debugger
    for(const node of previousOrderProcesses){ 
        debugger
        if(node.classList.contains('process-node-parallel-'+(pOrder-1))){
            // const previousNodeBoundingBox = node.getBoundingClientRect();
            // const currentNodeBoundingBox = currentOrderProcesses.getBoundingClientRect();

             console.log('gkgkgk');
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

function runSequentially(ind=0){
    console.log('hrhr');
    const processesNodes = document.querySelectorAll('.process-node rect'); 

    if(ind === processesNodes.length){
        console.log('all done')
        const pipelineStatus = document.getElementsByClassName('pipeline-status')[0]
        pipelineStatus.textContent = 'COMPLETE'
        const btnStop = document.getElementById('btn-stop')  
        btnStop.classList.add('d-none')
        const btnRerun = document.getElementById('btn-rerun')  
        btnRerun.classList.remove('d-none') 
        return
    }
    
    processesNodes[ind].style.stroke = 'orange'

    setTimeout(()=>{
        setTimeout(()=>{
            processesNodes[ind].style.stroke = 'green'
            runSequentially(ind+1)
        },3000),
    800})
}

function checkAllComplete(){

}

function save(){
}


function fetchConfigOfCurrentPipeline(){
    const url = window.location.search
    parallelCounter = 0
    
    const pipeName = document.getElementById('pipeline-name') 

    currentPipeline.pipelineId = new URLSearchParams(url).get('pipelineId')
    currentPipeline.pipelineName = new URLSearchParams(url).get('pipelineName');

    pipeName.textContent = currentPipeline.pipelineName

    fetch(jsonPipelines)
    .then(response=>response.json())
    .then(data => {
        clearSVG()
 
       // debugger
        console.log('setUpPipeline data: ',data);
        filteredData = data.filter(d=>{
            return d.pipelineId == currentPipeline.pipelineId
        })

        currentPipeline.processes = filteredData[0]['processes']?filteredData[0]['processes']: []
         
        console.log('currentPipeline.processes: ',currentPipeline.processes);
        
        currentPipeline.processes.forEach(p=>{
            processes =  p
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

function addProcess(newPipeline) {      
    let executionOrder = getLastProcessOrder()+1
    
        if(processes.order){
            executionOrder = processes.order
        }else{  //if no order / is new node addition, add the order property based on already present process-node count
            processes = {order: executionOrder, process: [...processes]}
        } 
    //debugger;
    if(processes.process && processes.process.length>1){ 
        parallelCounter = processes.process.length  //global parallel process iterator
        const processCount = parallelCounter
        yLinearBand(processCount)
         processes.process.forEach((p,i) => {
            console.log('p: ',p);
            queueProcess(p.name, executionOrder, parallelCounter--)
        });     
    }
    else{
        queueProcess(processes.process[0].name,executionOrder)
    }
} 
 