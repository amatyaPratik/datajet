function cancelPipeline(){
    const panel = document.getElementById('panel')
    const btnStop = document.getElementById('btn-stop')
    const btnEdit = document.getElementById('btn-edit')
    

    btnEdit.className = 'btn btn-lg btn-primary'
    btnStop.className = 'btn btn-lg btn-secondary disabled'
    panel.style.display = 'block'
}

// function runPipeline(){
//     const panel = document.getElementById('panel')
//     panel.style.display = 'none'
// }

function editPipeline(){
    const panel = document.getElementById('panel')
    const btnStop = document.getElementById('btn-stop')
    const btnEdit = document.getElementById('btn-edit')

    btnStop.className = 'btn btn-primary'
    btnEdit.className = 'btn btn-secondary disabled'
    panel.style.display = 'none'
}