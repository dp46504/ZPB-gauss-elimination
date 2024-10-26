let m
let x=1
let y=1
selected={
    active:false,
    x:0,
    y:0,
    horizontalSelection: false
}

let horizontalSelection=false

matrixData = [
    ['a', 'b', 'c', 'd'],
    ['d', 'b', '-a', '-c'],
    ['b', 'e', '-b', 'b'],
    ['c', '-b', 'd', '-a']
]



class Matrix{
    m
    table = document.getElementById('table')
    cellSizeInPixels = 60

    constructor(rows, cols, matrixData) {
        console.log('constructor')
        this.m=matrixData
        // this.m = new Array(rows);
        // for(let i=0; i<rows; i++){
        //     let columns = new Array(cols);
        //     for(let j=0; j<cols; j++){
        //         columns[j] = new Array(cols);
        //     }
        //     this.m[i]=columns
        // }
    }

    loadData(data){
        this.m = data
        this.repaint()
    }

    clearTable(){
        console.log('clearTable')
        this.table.innerHTML=""
    }

    changePivot(){
        console.log('changePivot')
        if(x<0){
            console.log('x too small')
            x=0
        }
        if(x>=this.m[0].length) {
            console.log('x too big')
            x = this.m[0].length - 1
        }

        if(y<0) {
            console.log('y too small')
            y = 0
        }
        if(y>=this.m.length) {
            console.log('y too big')
            y = this.m.length - 1
        }
        console.log(`x:${x}, y:${y}`)
    }

    changePlaces(xNew, yNew, horizontalSelection, selected){
        console.log('changePlaces')
        if(horizontalSelection){
        //     Zamiana wierszy
            let tmpRow1 = this.m[selected.y]
            let tmpRow2 = this.m[yNew]
            this.m[selected.y]=tmpRow2
            this.m[yNew]=tmpRow1
            this.log(`Row ${selected.y+1} with ${yNew+1}`)
        }else{
        //     Zamiana kolumn
            let tmpCol1 = []
            let tmpCol2 = []
            for(let i=0; i<this.m.length; i++){
                tmpCol1.push(this.m[i][xNew])
                tmpCol2.push(this.m[i][selected.x])
            }
            for(let i=0; i<this.m.length; i++){
                this.m[i][selected.x]=tmpCol1[i]
                this.m[i][xNew]=tmpCol2[i]
            }
            this.log(`Col ${selected.x+1} with ${xNew+1}`)
        }

        this.clearSelection()
    }

    log(data){
        let l = document.createElement("li")
        l.innerText = data
        document.getElementById("ledger").appendChild(l)
    }

    clearSelection(){
        console.log('clearSelection')
        selected.active=false
    }

    resize(){
        console.log('resize')
        this.table.style.width=`${(this.m[0].length)*this.cellSizeInPixels}px`
    }

    repaint(){
        console.log('repaint')
        this.changePivot()
        this.clearTable()
        this.paint()
    }

    paint(){
        console.log('paint')
        this.resize()
        for(let rowIndex=0; rowIndex<this.m.length; rowIndex++){
            let row = this.createRow(this.m[rowIndex],rowIndex);
            this.table.appendChild(row)
        }
    }

    createRow(data, rowIndex){
        let row = document.createElement("div")
        row.className="row"
        row.id=`r${rowIndex}`
        for(let cellIndex=0; cellIndex<data.length; cellIndex++){
            let cell = this.createCell(data[cellIndex],rowIndex, cellIndex)
            row.appendChild(cell)
        }
        return row
    }

    createCell(data, rowIndex, cellIndex){
        let cell = document.createElement("div")
        cell.classList.add("cell")

        cell.id=`c${cellIndex}`
        cell.innerText=data
        cell.classList.add(this.getClassForACell(data))
        if(horizontalSelection && rowIndex===y) cell.classList.add('activeMultipleRow')
        if(!horizontalSelection && cellIndex===x) cell.classList.add('activeMultipleColumn')
        if(rowIndex===y && cellIndex===x) cell.classList.add('activeOne')
        if(selected.active && selected.horizontalSelection && rowIndex===selected.y) cell.classList.add('selected')
        if(selected.active && !selected.horizontalSelection && cellIndex===selected.x) cell.classList.add('selected')
        return cell
    }

    getClassForACell(cellText){
        console.log(cellText)
        let text = cellText
        if(text.includes('-')) text=text.slice(1)
        return text
    }
}



function createMatrix(matrixD){
    m = new Matrix(
        document.getElementById('rowNumber').value,
        document.getElementById('colNumber').value,
        matrixD
    )
    m.clearTable()
    m.paint()
}

function navigate(e){
    e = e || window.event;
    e.preventDefault()

    if (e.keyCode == '38') {
        // up arrow
        y-=1
    }
    else if (e.keyCode == '40') {
        // down arrow
        y=y+1
    }
    else if (e.keyCode == '37') {
        // left arrow
        x-=1
    }
    else if (e.keyCode == '39') {
        // right arrow
        x+=1
    }
    else if (e.keyCode == '32') {
        // space
        if(!selected.active){
            horizontalSelection=!horizontalSelection
        }
    }
    else if (e.keyCode == '13') {
        // enter
        if(!selected.active){
            selected.horizontalSelection=horizontalSelection;
            selected.y=y
            selected.x=x
            selected.active=true
        }else{
            // Zamiana
            m.changePlaces(x, y, horizontalSelection, selected)
        }

    }
    m.repaint()
}

createMatrix(matrixData)
// m.loadData(matrixData)
document.onkeydown = navigate