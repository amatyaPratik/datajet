let processes
// let executionOrder = 0
let parallelCounter

const takenExecutionOrders = new Set()

function queueProcess(pName, pOrder, parallels = 0){
    console.log('log', pOrder); 
 
    addNode(pName, pOrder, parallels)
} 

function multiProcessesSelectCheck(){

    let selectedProcessNames  

    selectedProcessNames =  Array.from(document.getElementById("process-select").selectedOptions).map(opt=>opt.value) 
    console.log('selectedProcessNames: ',selectedProcessNames);
    
    const runBtn = document.getElementById('btn-run')
    const runParallel = document.getElementById('run-in-parallel')
    // console.log('executionOrder: ',executionOrder);

    processes = selectedProcessNames

    if(selectedProcessNames.length>1 && !selectedProcessNames.includes('-1')){
        runParallel.removeAttribute('disabled')
        runBtn.removeAttribute('disabled')
    }
    else if(selectedProcessNames.length===1 && !selectedProcessNames.includes('-1')){
        runParallel.checked=false
        runParallel.setAttribute('disabled',true)
        runBtn.removeAttribute('disabled')
    }
    else{
        runParallel.setAttribute('disabled',true)
        runBtn.setAttribute('disabled',true)
    }
}

function addNode(pName, pOrder, parallels, xx=20, yy=(HEIGHT/2-rh/2)){
    
    takenExecutionOrders.add(pOrder) 

    if(parallels===0){
       // Create a group (g) element to make both the rectangle and text clickable
      let group = svg.append("g")
      .attr('id',(pName.replace(' ','-').toLowerCase()+'-'+pOrder))
      .attr('class','process-node')
    //   .attr('class','running')
      .attr("transform", "translate(" + (x(pOrder))+ "," + yy + ")") 
      .style("cursor", "pointer")

      setTimeout(()=>{
        const task = document.getElementById((pName.replace(' ','-').toLowerCase()+'-'+pOrder))
        task.classList.remove('running')
        task.classList.add('completed')
      },8000)

      
      group.append("rect")
          .attr("width", rw) 
          .attr("height", rh) 
          .attr("fill", "lightgray") 
          .attr("stroke", "black")
          .attr('rx',4)
          .attr('ry',4) 
          .attr("stroke-width", 1.2); 

      // Add the processValue as a label text within the group
      group.append("text")
          .attr("x", 10) 
          .attr("y", 30)  
          .attr('width',rw)
          .style('color','red')
          .text(pName)

      // Add a click event listener to the group
      group.on("click", function(e) {
          openProcessModal(e)
      });

      if(pOrder>1)
        drawLine(pOrder) 
    }else{ 
        //debugger; 
        console.log('parallelCounter-1: ',y(2));
        // console.log('here parallelCounter: ',parallelCounter+ ' '+y(parallelCounter-1));
        // Create a group (g) element to make both the rectangle and text clickable
      var group = svg.append("g")
      .attr('id',(pName.replace(' ','-').toLowerCase()+'-'+pOrder))
      .attr('class','process-node process-node-parallel')
      .attr("transform", "translate(" + (x(pOrder))+ "," + y(parallelCounter--) + ")") 
      .style("cursor", "pointer")

      
      group.append("rect")
          .attr("width", rw) 
          .attr("height", rh) 
          .attr("fill", "lightgray") 
          .attr("stroke", "black")
          .attr('rx',4)
          .attr('ry',4) 
          .attr("stroke-width", 1.2); 

      // Add the processValue as a label text within the group
      group.append("text")
          .attr("x", 10) 
          .attr("y", 30)  
          .text(pName)

    parallelCounter = parallelCounter -1;

      // Add a click event listener to the group
      group.on("click", function(e) {
          openProcessModal(e)
      });
    }
}

function fetchConfigOfCurrentPipeline(){
    const url = window.location.href
    parallelCounter = 0
    
    const pipelineId = +url.substring(url.indexOf('?pid=')+5,url.length)

    fetch(jsonPipelines)
    .then(response=>response.json())
    .then(data => {
        clearSVG()
 
        console.log('setUpPipeline data: ',data);
        currentPipeline = data.filter(d=>{
            return d.pipelineId == pipelineId
        }) 
         
        // console.log('currentPipeline.processes: ',currentPipeline[0].processes);
        
        // currentPipeline[0].processes.forEach(p=>{
        //     processes = [currentPipeline[0].processes[0]]
        //     add()
        // })
        
    })}

function add() {  
    // Get the selected values from the form
    let processCount = processes.length
    let totalProcesses = document.getElementsByClassName('process-node').length
    let parallelProcesses = document.getElementsByClassName('process-node-parallel').length

    let executionOrder = 0

    console.log('totalProcesses, parallelProcesses: '+totalProcesses+', '+parallelProcesses);
    if(parallelProcesses)
        executionOrder = (totalProcesses - parallelProcesses) + 2
    else    
        executionOrder = totalProcesses + 1
    console.log('executionOrder: ',executionOrder);
    //debugger;
    if(processes.length>1){
        parallelCounter = processCount
        yLinearBand(processCount)
        setupXxsScaleBand((currentPipeline[0])?currentPipeline[0].processes: processes, 'pid') // scale setup
        processes.forEach(p => {
            (()=>queueProcess((p.name?p.name:p),executionOrder, processCount),0)
        });    
        executionOrder++
    }
    else{
        queueProcess(processes[0],executionOrder)
    }
} 

function run(){

}

function save(){
}

function drawLine(pOrder){ 
 // Coordinates of the source and target nodes
 var sourceX = x(pOrder-1)+rw;
 var sourceY = HEIGHT/2 //+ rh/2; // Adjusted for node height
 var targetX = x(pOrder);
 var targetY = HEIGHT/2 //+ rh/2; // Adjusted for node height

 // Draw the line with an arrowhead
 svg.append("line")
     .attr("x1", sourceX)
     .attr("y1", sourceY)
     .attr("x2", targetX)
     .attr("y2", targetY)
     .attr("stroke", "black")
     .attr("stroke-width", 2);

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