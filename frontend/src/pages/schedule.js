// Helper function to convert int to standard hour string
function intToHour(hourNum)
{
    return `${hourNum % 12 + 1} ${hourNum < 12 ? "A.M" : "P.M"}`;
}



// Create 96 x 7 matrix of booleans to represent schedule entries
let scheduleEntries = Array(96);
for(let i = 0; i < 96; i++)
{
    let boolRow = Array(7).fill(false);
    scheduleEntries[i] = boolRow;
}



// Get handle for schedule table element
let table = document.querySelector("table.schedule");
table.setAttribute("draggable", "false");

// Creates a schedule table based on a starting and ending hour
function generateSchedule(startHour, endHour)
{
    // Typecast to numeric value
    startHour = Number(startHour);
    endHour = Number(endHour);
    
    // Generate table
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    while(table.firstChild)
    {
        table.removeChild(table.firstChild);
    }

    // Generate colgroup
    let colGroup = document.createElement("colgroup");
    colGroup.appendChild(document.createElement("col"));
    for(let i = 0; i < 7; i++)
    {
        let column = document.createElement("col");
        column.setAttribute("background-color", i % 2 == 0 ? "gray" : "lightgray");
        colGroup.appendChild(column);
    }

    // Generate header row of days
    let thead = document.createElement("thead");
    let topRow = document.createElement("tr");
    topRow.appendChild(document.createElement("th"));
    for(let day of days)
    {
        let dayCell = document.createElement("th");
        dayCell.textContent = day;
        topRow.appendChild(dayCell);
    }
    thead.appendChild(topRow);

    // Generate bulk of schedule table
    let tbody = document.createElement("tbody");
    for(let i = startHour; i <= endHour; i++)
    {
        // Create hour row header
        let tRow = document.createElement("tr");
        let hourHeader = document.createElement("th");
        hourHeader.setAttribute("rowspan", 4);
        hourHeader.textContent = intToHour(i);
        tRow.appendChild(hourHeader);
        
    
        // Generate 4 sub-rows for 15-minute blocks
        for(let j = 0; j < 4; j++)
        {
            if(j !== 0)
            {
                tRow = document.createElement("tr");
            }

            for(let k = 0; k < 7; k++)
            {
                // Give each cell a click EventListener
                let cell = document.createElement("td");
                cell.setAttribute("draggable", "false");
                cell.row = i * 4 + j;
                cell.column = k;
                cell.addEventListener('dragstart', (e) => { e.preventDefault() });
                cell.onclick = cellClick;

                // If the corresponding entry of the schedule boolean matrix is true, set the cell as selected
                if(scheduleEntries[i * 4 + j][k])
                {
                    cell.setAttribute("class", "selected");
                }

                tRow.appendChild(cell);
            }
            tbody.appendChild(tRow);
        }
    }

    // Add elements to table
    table.appendChild(colGroup);
    table.appendChild(thead);
    table.appendChild(tbody);
}


// Get handles for selector elements
let startSelector = document.querySelector("select.start-hour-select");
let endSelector = document.querySelector("select.end-hour-select");
let startHour = 8;
let endHour = 16;

// Fill start and end selector elements with hour options based on each others' value
function populateHours()
{
    // Clear old options
    while(startSelector.firstChild)
        startSelector.removeChild(startSelector.firstChild);

    while(endSelector.firstChild)
        endSelector.removeChild(endSelector.firstChild);

    // Fill start selector from 1 AM to ending hour
    for(let i = 0; i < Number(endHour); i++)
    {
        let hour = document.createElement("option");
        hour.setAttribute("value", i.toString());
        hour.textContent = intToHour(i);
        startSelector.appendChild(hour);
    }

    // Fill end selector from starting hour to 12 AA
    for(let i = Number(startHour) + 1; i < 24; i++)
    {
        let hour = document.createElement("option");
        hour.setAttribute("value", i.toString());
        hour.textContent = intToHour(i);
        endSelector.appendChild(hour);
    }
    
    // Set initial values
    startSelector.value = startHour;
    endSelector.value = endHour;
}



// Keeps track of when to fill the matrix
let startClick = true;
let startCell;

// Cell filling behavior for schedule table
function cellClick()
{
    // If this is the initial click, set the clicked cell as the starting point, 
    // otherwise invert all cells from the old starting point to this cell
    if(startClick)
    {
        // Toggle selection of the current cell
        startCell = this;
        if(!scheduleEntries[startCell.row][startCell.column])
            startCell.setAttribute("class", "selected");
        else
            startCell.removeAttribute("class");
    }
    else if(startCell.column === this.column)
    {
        startCell.removeAttribute("class");

        // Select Set of rows to toggle
        let rows = table.querySelector("tbody").childNodes;

        // Set variables according to click order
        let startRow = Math.min(startCell.row, this.row);
        let endRow = Math.max(startCell.row, this.row);
        
        // Invert schedule matrix value and selection of selected area
        for(let i = startRow; i <= endRow; i++)
        {
            scheduleEntries[i][startCell.column] = !scheduleEntries[i][startCell.column];

            // Array of td elements
            let cells = rows[i - startHour * 4].childNodes;

            // Accounts for extra occasional <th> elements
            let selectedCol = i % 4 !== 0 ? startCell.column : startCell.column + 1;
            let cell = cells[selectedCol];

            // Invert selection
            if(scheduleEntries[i][startCell.column])
                cell.setAttribute("class", "selected");
            else
                cell.removeAttribute("class");
        }
    }
    else
    {
        // Don't make a selection if both clicks are not on the same column
        console.log("Clicked outside of selected column");
        startCell.removeAttribute("class");
    }
    startClick = !startClick;
}



// Populate elements
generateSchedule(startHour, endHour);
populateHours();

startSelector.addEventListener('change', () => { startHour = startSelector.value; populateHours(); generateSchedule(startHour, endHour);});
endSelector.addEventListener('change', () => { endHour = endSelector.value; populateHours(); generateSchedule(startHour, endHour); });



// Evaluates schedule matrix similarity on number of hours overlapping
function getCompatability(mat0, mat1)
{
    let score = 0;

    for(let i = 0; i < mat0.length; i++)
    {
        for(let j = 0; j < mat0[i].length; j++)
        {
            score += mat0[i][j] && mat1[i][j] ? 0.25 : 0;
        }
    }
    return score;
}

// Comparison matrix for test case (contains true for 9-5 on weekdays)
let scheduleComp = Array(96);
for(let i = 0; i < 96; i++)
{
    let boolRow = (i > 31 && i < 68) ? [false, true, true, true, true, true, false] : Array(7).fill(false);
    scheduleComp[i] = boolRow;
}



// Gives behavior to edit/finalize schedule button
function toggleEdit()
{
    // Toggle button boolean and text content
    this.editToggle = !this.editToggle;
    this.textContent = this.editToggle ? "Finalize Schedule" : "Edit Schedule";

    // Disable/enable selector elements accordingly
    if(!this.editToggle)
    {
        startSelector.setAttribute("disabled", true);
        endSelector.setAttribute("disabled", true);
        table.style.display = "none";

        // TEST CASE: displays user input compatability with a 9-to-5 schedule
        console.log(`Compatability with a 9-to-5 schedule: ${getCompatability(scheduleEntries, scheduleComp)}`);
    }
    else
    {
        startSelector.removeAttribute("disabled");
        endSelector.removeAttribute("disabled");
        table.style.display = "revert";
    }
}

// Add functionality to button
let editButton = document.querySelector("button.edit");
editButton.editToggle = true;
editButton.textContent = "Finalize Schedule";
editButton.addEventListener("click", toggleEdit);


