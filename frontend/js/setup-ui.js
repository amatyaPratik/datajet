const jsonProcessesURL = 'http://localhost:8080/frontend/js/processes.json';
const jsonClientsURL = 'http://localhost:8080/frontend/js/clients.json';
const jsonPipelines = 'http://localhost:8080/frontend/js/pipelines.json'

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
// Function to fetch and populate select options
function populateSelect() {
    // Select the <select> element
    const processSelectElement  = document.getElementById('process-select');
    // const orderSelectElement  = document.getElementById('order-select');

    if(!processSelectElement) return

    // Fetch the JSON data for processes
    fetch(jsonProcessesURL)
        .then(response => response.json())
        .then(data => {
            console.log('data:',data); 

            setupXxsScaleBand(data, 'pid')
            
            // Loop through the options array and create <option> elements
            data.forEach(optionText => {
                const option1 = document.createElement('option');
                option1.textContent = optionText.name;
                option1.value = optionText.code; 
                processSelectElement.appendChild(option1);
            });

            // data.forEach(optionText => {
            //     const option2 = document.createElement('option');
            //     option2.textContent = optionText.pid;
            //     option2.value = optionText.pid; 
            //     orderSelectElement.appendChild(option2);
            // })
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
        }); 
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
            a.href = '/frontend/pages/client.html'; 
            li.appendChild(a)
            clientsUlElement.appendChild(li);
        });
        console.log('data:',data); 
    })
}

function popuplatePipelinesTable(){
    const tablePipelines = document.querySelector('#pipelines-table table tbody')
    if(!tablePipelines) return

    console.log('tablePipelines; ',tablePipelines);

    fetch(jsonPipelines)
    .then(response => response.json())
    .then(pipelines => {
        console.log('d: ',pipelines);
        pipelines.forEach((p,ind)=>{
            const tr = document.createElement('tr');
            const td1 = document.createElement('td');
            td1.textContent = p.pipelineId
            tr.appendChild(td1);

            const td2 = document.createElement('td');
            const a = document.createElement('a'); 
            a.textContent = p.pipelineName;
            a.href = '/frontend?pid='+p.pipelineId; 

            td2.appendChild(a)
            tr.appendChild(td2);

            tr.innerHTML += '<td><button class="btn-run-pipeline"><i class="fa-solid fa-play"></i></button></td>'

            tablePipelines.appendChild(tr)
        })
        // <td>1</td>
        // <td><a href="/frontend/">pipe1</a></td>
        // <td><button class="btn-run-pipeline"><i class="fa-solid fa-play"></i></button></td>
    })
}

function yLinearBand(count){
    //setup the y-axis position function / scale
     y = d3.scaleLinear()
    .domain([0,count])
    .range([HEIGHT/2-0.25*HEIGHT+rh/2, HEIGHT/2+0.25*HEIGHT-rh/2]);

    console.log('yscale up');
    // .paddingInner(1.)
    // .paddingOuter(.2)
}

function toggleMenuPanel(){
    const menuPanel = document.getElementById('menu-panel')
    if(menuPanel.classList.contains('hide')){
        menuPanel.classList.remove('hide')
        menuPanel.classList.add('display')
    }
    else{
        menuPanel.classList.add('hide')
        menuPanel.classList.remove('display')
    }
} 

function openProcessModal(e){
    console.log('e: ',e);
    const processConfigModal = document.getElementById('process-config-modal')
    const dialogDimensions = processConfigModal.getBoundingClientRect()
    if(
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
    ) {
        processConfigModal.close(0)
    }
    processConfigModal.showModal()
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
        console.log('cleared');
}

// Call the populateSelect function to populate the options
populateSelect();
populateClientList();
popuplatePipelinesTable()