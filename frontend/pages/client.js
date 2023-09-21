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
                console.log("Hello");
                openProcessModal(e)
            });
            drawLineFromPreviousProcess(process.pid)
        }) 
        
        console.log('currentPipeline: ',currentPipeline);
    })
}

function toggleAddNewPipelineModal(){
    // debugger;
    const newPipelineForm = document.getElementById('add-new-pipeline-modal')

    if(newPipelineForm.getAttribute('open')===''){
        newPipelineForm.close()
        return    
    }
    newPipelineForm.showModal()
}

function addPipeline(){
    const newPipelineForm = document.getElementById('add-new-pipeline-modal')
    const newPipeLineName = newPipelineForm.getElementsByTagName('input')[0].value
    const pipelinesTableBody = document.querySelector('#pipelines-table tbody')
    const trCount = pipelinesTableBody.querySelectorAll('tr').length
    pipelinesTableBody.innerHTML += `
                                    <tr>
                                        <td>${trCount+1}</td>
                                        <td><a href="/frontend/index.html?pipelineName=${newPipeLineName}&pipelineId=${trCount+1}">${newPipeLineName}</a></td>
                                        <td>
                                            <button class="btn-run-pipeline" disabled>
                                                <a href="/frontend/index.html?pipelineName=${newPipeLineName}&pipelineId=${trCount+1}&running=true" style="pointer-events:none;">
                                                    <i class="fa-solid fa-play"></i>
                                                </a>
                                            </button>
                                        </td>
                                    </tr>
                                    `
    console.log('newPipeLineName: ',newPipeLineName);
    toggleAddNewPipelineModal()
}

function openLogModal(){
    const logModal = document.getElementById('process-logs-modal') 
    logModal.showModal()
}

function closeLogs(){
    const logModal = document.getElementById('process-logs-modal') 
    logModal.close()
}