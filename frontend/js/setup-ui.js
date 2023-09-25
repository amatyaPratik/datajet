const jsonProcessesURL = 'http://localhost:8080/frontend/js/processes.json';
const jsonClientsURL = 'http://localhost:8080/frontend/js/clients.json';
const jsonPipelines = 'http://localhost:8080/frontend/js/pipelines.json'
const jsonRunningPipelines = 'http://localhost:8080/frontend/js/running-pipelines.json'

let isRunningPipeline = false
let totalProcesses

const btnSave = document.querySelector('#btn-save')

let x
let y
 
function setupXxsScaleBand(data, dataKey){
    //setup the x-axis position function / scale
    x = d3.scaleBand()  
    .domain(data.map(d=>d[dataKey]))
    .range([0,WIDTH])
    .paddingInner(1.)
    .paddingOuter(.2) 
}

function recalculateXxsScale(maxOrder){
    //setup the x-axis position function / scale
    x = d3.scaleBand()  
    .domain([1,maxOrder])
    .range([0,WIDTH])
    .paddingInner(1.)
    .paddingOuter(.2) 
}
// Function to fetch and populate select options
function populateProcessSelect() { 
    const processSelectElement  = document.getElementById('process-select'); 

    if(!processSelectElement) return

    // Fetch the JSON data for processes
    fetch(jsonProcessesURL)
        .then(response => response.json())
        .then(data => {
            totalProcesses = data.length

            setupXxsScaleBand(data, 'pid')
            
            // Loop through the options array and create <option> elements
            data.forEach(optionText => {
                //debugger
                const option1 = document.createElement('option');
                option1.textContent = optionText.name;
                option1.value = optionText.code; 
                option1.setAttribute('name',optionText.name) 
                option1.setAttribute('pid',optionText.pid) 
                processSelectElement.appendChild(option1);
            }); 
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
        }); 
    
        isRunningPipeline = new URLSearchParams(window.location.search).get('running') == 'true'

        const pipelineStatus = document.getElementsByClassName('pipeline-status')[0]

        if(isRunningPipeline){  
            pipelineStatus.textContent = 'Running'
            document.body.classList.remove('stopped') 
            document.body.classList.add('running') 
            const btnRun = document.getElementById('btn-run') 
            btnRun.classList.add('hide')
        }else{ 
            pipelineStatus.textContent = 'Create'
            new URLSearchParams(window.location.search).set('running',false)
            document.body.classList.add('stopped') 
            document.body.classList.remove('running')
            const btnStop = document.getElementById('btn-stop')  
            btnStop.classList.add('d-none')
        }
}


function openDialogTab(tabind){
    const processConfigModal = document.getElementById('process-config-modal')

    const className = processConfigModal.className
    
    processConfigModal.className = className.replace(className.substring(className.length-1),tabind)
}

function populateClientList(){
    const clientsUlElement  = document.getElementById('clients-list');
    if(!clientsUlElement) return

    fetch(jsonClientsURL)
    .then(response => response.json())
    .then(data => {
        data.forEach(optionText => {
            const li = document.createElement('li');
            const a = document.createElement('a'); 
            a.textContent = optionText.clientName;
            a.href = '/frontend/pages/client.html?clientName='+optionText.clientName+'&clientId='+optionText.clientId; 
            li.appendChild(a)
            clientsUlElement.appendChild(li);
        });
    })
}

function popuplatePipelinesTable(){
    const tablePipelines = document.querySelector('#pipelines-table table tbody')
    if(!tablePipelines) return

    fetch(jsonPipelines)
    .then(response => response.json())
    .then(pipelines => {
        pipelines.forEach((p,ind)=>{
            const tr = document.createElement('tr');
            const td1 = document.createElement('td');
            td1.textContent = p.pipelineId
            tr.appendChild(td1);

            const td2 = document.createElement('td');
            const a = document.createElement('a'); 
            a.textContent = p.pipelineName;
            a.href = `/frontend/index.html?pipelineName=${p.pipelineName}&pipelineId=${p.pipelineId}`; 

            td2.appendChild(a)
            tr.appendChild(td2);

            tr.innerHTML += `<td>
                            <button class="btn-run-pipeline">
                                <a href="/frontend/index.html?pipelineName=${p.pipelineName}&pipelineId=${p.pipelineId}&running=true">
                                    <i class="fa-solid fa-play"></i>
                                </a>
                            </button>
                            </td>
                            `

            tablePipelines.appendChild(tr)
        }) 
    })
}

function yLinearBand(count){
    //setup the y-axis position function / scale
    //  y = d3.scaleLinear()
    // .domain([0,count])
    // .range([HEIGHT-rh/2, rh/2]);

    y= d3.scaleBand()
    .domain([1,count])
    .range([rh+margin.TOP, HEIGHT-rh]) // Available vertical space
    .padding(0.5); // Adjust the padding as needed (0.1 for a small gap between bands)
}

function toggleMenuPanel(){
    const menuPanel = document.getElementById('menu-panel')
    if(menuPanel.classList.contains('hide')){
        menuPanel.classList.remove('hide')
        menuPanel.classList.addProcess('display')
    }
    else{
        menuPanel.classList.addProcess('hide')
        menuPanel.classList.remove('display')
    }
} 

function hideAllProcessDialogControls(){
    const processConfigModal = document.getElementById('process-config-modal')
    const allControls = processConfigModal.querySelectorAll('[class$="-tab-prop"]')
    for(let c of allControls){  // hide all controls first
        c.classList.add('d-none')
    }
}

function openProcessModal(e){ 
    
    const processConfigModal = document.getElementById('process-config-modal')
    
    const generalControls = processConfigModal.getElementsByClassName('general-tab-prop')
    const dataloadControls = processConfigModal.getElementsByClassName('dataload-tab-prop')
    const datascrubControls = processConfigModal.getElementsByClassName('datascrub-tab-prop')
    const jirataskControls = processConfigModal.getElementsByClassName('jiratask-tab-prop')
    const emailControls = processConfigModal.getElementsByClassName('email-tab-prop')
    const scrubQcControls = processConfigModal.getElementsByClassName('scrubqc-tab-prop')

    console.log('dataloadControls: ',dataloadControls)



    switch(e.target.textContent){
        case 'Data Load':
            hideAllProcessDialogControls()
            for(c of dataloadControls){  // hide all controls first
                c.classList.remove('d-none')
            }
            break;

        case 'Data Scrub':
            hideAllProcessDialogControls()
            for(c of datascrubControls){  // hide all controls first
                c.classList.remove('d-none')
            }
            break;
        
        case 'Jira Task':
            hideAllProcessDialogControls()
            for(c of jirataskControls){  // hide all controls first
                c.classList.remove('d-none')
            }
            break;

        case 'Email Notifier':
            hideAllProcessDialogControls()
            for(c of emailControls){  // hide all controls first
                c.classList.remove('d-none')
            }
            break
        case 'Scrub QC':
            hideAllProcessDialogControls()
            for(c of scrubQcControls){  // hide all controls first
                c.classList.remove('d-none')
            }
            break
        
        case 'Schema Data Transfer':
        case 'Custom Task':
        case 'Scrub QC':
        case 'Gemini':
            hideAllProcessDialogControls()
            for(c of generalControls){  // hide all controls first
                c.classList.remove('d-none')
            }

    }
 
    processConfigModal.showModal()
}

function stopPipeline(){ 
    window.location.replace(`${window.location.href}`.replace('running=true','running=false'))
}

function runPipeline(){ 
    if(window.location.href.includes('&running='))
        window.location.replace(`${window.location.href}`.replace('running=false','running=true'))
    else
        window.location.replace(`${window.location.href}&running=true`)  //set running=true for freshly created pipeline
}

function rerunPipeline(){
    runPipeline()
}
 
function editPipeline(){
    
    const btnStop = document.getElementById('btn-stop')
    // const btnEdit = document.getElementById('btn-edit')

    btnStop.className = 'btn btn-lg btn-primary'
    // btnEdit.className = 'btn btn-lg btn-secondary' 
    
}

/**
 * Setup the D3 svg canvas
 */
const margin = {TOP:10, LEFT:10, RIGHT: 10, BOTTOM:10}
const WIDTH = 1000-margin.LEFT-margin.RIGHT
const HEIGHT = 500-margin.TOP-margin.BOTTOM

const rw = 100
const rh = 60

const svg = d3.select('#chart-area')
.append('svg')
.attr('height', HEIGHT + margin.TOP + margin.BOTTOM)  //HEIGHT + margin.TOP + margin.BOTTOM
.attr('width', WIDTH + margin.LEFT + margin.RIGHT)   //WIDTH + margin.LEFT + margin.RIGHT

const g = svg.append('g')
.attr('transform',`translate(${margin.LEFT},${margin.TOP})`) 

function clearSVG(){
        // Get a reference to the <svg> element
        const svgElement = document.querySelector('#chart-area svg');

        // Remove all child elements from the <svg> element
        while (svgElement.firstChild) {
            svgElement.removeChild(svgElement.firstChild);
        }
}

// Call the populateSelect function to populate the options
populateProcessSelect();
populateClientList();
popuplatePipelinesTable()