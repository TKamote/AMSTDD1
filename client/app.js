document.getElementById("amsForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Get form values
    var image = document.getElementById("image").value;
    var text = document.getElementById("text").value;
    var severity = Array.from(document.getElementById("severity").selectedOptions).map(option => option.value);
    var intensity = Array.from(document.getElementById("intensity").selectedOptions).map(option => option.value);
    var extent = Array.from(document.getElementById("extent").selectedOptions).map(option => option.value);

    // Create an object with the form data
    var formData = {
        image: image,
        text: text,
        severity: severity,
        intensity: intensity,
        extent: extent
    };

    // Send the form data to the server
    fetch("/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (response.ok) {
                console.log("Form submitted successfully");
                return response.json();
            } else {
                throw new Error("Form submission failed");
            }
        })
        .then(data => {
            // Handle the server response if needed
        })
        .catch(error => {
            console.error("Error:", error);
        });
});

document.getElementById("uploadBtn").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent button click submission

    // Request the server to upload the submissions to Excel
    fetch("/submissions")
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to retrieve submissions");
            }
        })
        .then(data => {
            // Create a CSV string with the submissions data
            var csv = "Image,Text,Severity,Intensity,Extent\n";
            data.forEach(submission => {
                csv += `${submission.image},"${submission.text}","${submission.severity.join(",")}","${submission.intensity.join(",")}","${submission.extent.join(",")}"\n`;
            });

            // Create a temporary download link and trigger the download
            var link = document.createElement("a");
            link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
            link.download = "submissions.csv";
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(error => {
            console.error("Error:", error);
        });
});
