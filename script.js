document.addEventListener('DOMContentLoaded', (event) => {
    sessionStorage.clear(); // Clear sessionStorage when page loads
});

// document.addEventListener('paste', handlePaste);

// function handlePaste(event) {
//     // Prevent the default paste behavior
//     event.preventDefault();
    
//     const clipboardData = event.clipboardData || window.clipboardData;
//     const pastedData = clipboardData.getData('Text');


//     // Split the pasted data into rows and columns
//     const dataRows = pastedData.split('\n').map(row => row.split('\t'));

//     // Flatten the array to get a single array of cell values
//     const flattenedData = dataRows.flat();


//     const cells = Array.from({ length: 20 }, (_, i) => `cell${i + 1}`);
//     for (let i = 0; i < cells.length; i++) {
//         if (flattenedData[i]) {
//             document.getElementById(cells[i]).value = flattenedData[i];
//         }
//     }
// }

document.addEventListener('paste', handlePaste);

function handlePaste(event) {
    // Prevent the default paste behavior
    event.preventDefault();

    const clipboardData = event.clipboardData || window.clipboardData;
    let pastedData = clipboardData.getData('Text');

    // Split the pasted data into rows and columns
    const dataRows = pastedData.split('\n').map(row => row.split('\t'));

    // Flatten the array to get a single array of cell values
    const flattenedData = dataRows.flat();

    console.log('Parsed Rows and Columns:', dataRows);
    
    const cells = Array.from({ length: 20 }, (_, i) => `cell${i + 1}`);
    let cellIndex = 0;

    for (let i = 0; i < flattenedData.length; i++) {
        if (cellIndex < cells.length) {
            const cell = document.getElementById(cells[cellIndex]);
            if (cell) {
                // Remove newlines within each cell's content
                let value = flattenedData[i].replace(/\r?\n|\r/g, ' ');
                cell.value = value.trim();
            }
            cellIndex++;
        }
    }
}

function message(text, color){
    const msg = document.getElementById('msg');
    msg.innerText = text;
    msg.style.color = color;

    msg.style.opacity = 1;
    msg.style.visibility = 'visible';

    setTimeout(() => {
        msg.style.opacity = 0;
        setTimeout(() => {
            msg.style.visibility = 'hidden';
        }, 500);
    }, 1500);

}


function saveData() {
    const cells = Array.from({ length: 20 }, (_, i) => `cell${i + 1}`);
    cells.forEach(cell => {
        const value = document.getElementById(cell).value;
        sessionStorage.setItem(cell, value);
    });

   message("Saved", "blue");

    // alert("Data saved successfully!");
    
    
}

function fetchData() {
    const cells = Array.from({ length: 20 }, (_, i) => `cell${i + 1}`);
    const outputLines = [];

    for (let i = 0; i < cells.length; i += 4) {
        const dateCell = sessionStorage.getItem(cells[i]);
        const timesAndActivities = [];

        if (dateCell) {
            timesAndActivities.push(`${dateCell}\n`);
            

            const times = ["08:00 - 11:00", "11:00 - 14:00", "14:00 - 17:00"];
            for (let j = 1; j < 4; j++) {
                const activityCell = sessionStorage.getItem(cells[i + j]);
                if (activityCell) {
                    timesAndActivities.push(`${times[j - 1]} : ${activityCell}`);
                }
            }

            outputLines.push(timesAndActivities.join('\n'));
        }
    }

    const output = outputLines.join('\n\n');
    document.getElementById('output').innerText = output || 'Please insert & save data first.';

    if(output){
        message("Template printed", "blue");
    }else{
        message("No data found", "red");
    }
}

function copyToClipboard() {
    // Get the text from the <p> element
    var text = document.getElementById('output').innerText;

    // Create a temporary textarea element to hold the text
    var textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);

    // Select and copy the text
    textarea.select();
    document.execCommand('copy');

    // Clean up: Remove the temporary textarea
    document.body.removeChild(textarea);

    // Optional: Provide user feedback
    message("Copied to Clipboard", "blue");
    
}

document.querySelectorAll('.cell').forEach(input => {
    input.addEventListener('input', function() {
        // Replace newline characters with a space or remove them
        this.value = this.value.replace(/\n/g, ' ');
    
    });
});
