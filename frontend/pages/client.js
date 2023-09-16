function displayPipelinesPage(){
    const pipelinesTable = document.getElementById('pipelines-table')
    const logsTable = document.getElementById('logs-table')
    const btnPipelines = document.getElementById('btn-pipelines')
    const btnLogs = document.getElementById('btn-logs')

    logsTable.className='hide'
    pipelinesTable.className='show'
    btnPipelines.className = 'btn btn-primary'
    btnLogs.className = 'btn btn-secondary'
}

function displayLogsPage(){
    const pipelinesTable = document.getElementById('pipelines-table')
    const logsTable = document.getElementById('logs-table')
    const btnPipelines = document.getElementById('btn-pipelines')
    const btnLogs = document.getElementById('btn-logs')

    pipelinesTable.className='hide'
    logsTable.className='show'
    btnLogs.className = 'btn btn-primary'
    btnPipelines.className = 'btn btn-secondary'
}

function setUpPipeline(pipelineId){
    let currentPipeline 
    const pipelinesJsonFileUrl = '../js/pipelines.json'
    fetch(pipelinesJsonFileUrl)
    .then(response=>response.json())
    .then(data => {
        clearSVG()

        console.log('setUpPipeline data: ',data);
        currentPipeline = data.filter(d=>{
            return d.pipelineId == pipelineId
        }) 

        console.log('currentPipeline.processes: ',currentPipeline[0].processes);
        setupXxsScaleBand(currentPipeline[0].processes, 'pid') // scale setup
 
        currentPipeline[0].processes.forEach(process=>{
            var group = svg.append("g")
            .attr('id',(process.code+'-'+process.pid))
            .attr('class',process.status)
            .attr("transform", "translate(" + (x(process.pid))+ "," + HEIGHT/2 + ")") 
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
                .attr('width',rw)
                .style('color','red')
                .text(process.name)
    
            // Add a click event listener to the group
            group.on("click", function(e) {
                console.log("Hello");
                openProcessModal(e)
            });
            drawLine(process.pid)
        }) 
        
        console.log('currentPipeline: ',currentPipeline);
    })
}

function openLogModal(){
    const logModal = document.getElementById('process-logs-modal') 
    logModal.showModal() 
}

function closeLogs(){
    const logModal = document.getElementById('process-logs-modal') 
    logModal.close() 
}