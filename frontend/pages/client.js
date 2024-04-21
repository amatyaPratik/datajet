// Function to parse query string
function parseQueryString(url) {
    var queryString = url.split('?')[1];
    var params = {};
    if (queryString) {
      var pairs = queryString.split('&');
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
      }
    }
    return params;
}

function displayPipelinesPage(){
    const pipelinesTable = document.getElementById('pipelines-table')
    const logsTable = document.getElementById('logs-table')
    const btnPipelines = document.getElementById('btn-pipelines')
    const btnLogs = document.getElementById('btn-logs')
    const clientNameSpan = document.getElementById('client-name')
    const clientIdSpan = document.getElementById('client-id')

    logsTable.className='hide'
    pipelinesTable.className='show'
    btnPipelines.className = 'btn btn-primary'
    btnLogs.className = 'btn btn-secondary'

    const currentURL = window.location.href

    // Parse the query string
    var queryParams = parseQueryString(currentURL);

    // Extract the values of clientName and clientId
    const clientName = queryParams['clientName'];
    var clientId = queryParams['clientId'];

    clientNameSpan.textContent = clientName
    clientIdSpan.textContent = clientId
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

        currentPipeline = data.filter(d=>{
            return d.pipelineId == pipelineId
        }) 

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
                openProcessModal(e)
            });
            drawLineFromPreviousProcess(process.pid)
        })
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
                                        <td><a href="/index.html?pipelineName=${newPipeLineName}&pipelineId=${trCount+1}">${newPipeLineName}</a></td>
                                        <td>
                                            <button class="btn-run-pipeline" disabled>
                                                <a href="/index.html?pipelineName=${newPipeLineName}&pipelineId=${trCount+1}&running=true" style="pointer-events:none;">
                                                    <i class="fa-solid fa-play"></i>
                                                </a>
                                            </button>
                                        </td>
                                    </tr>
                                    `
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