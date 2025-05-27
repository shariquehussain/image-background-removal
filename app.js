const uploadArea = document.getElementById('upload-area');
const imageInput = document.getElementById('imageInput');
const removeBackgroundButton = document.getElementById('removeBackgroundBtn');
const resetBtn = document.getElementById('resetBtn');
const result = document.getElementById('result');

let selectedFile = null;

uploadArea.addEventListener("click", () => imageInput.click());

uploadArea.addEventListener("dragover", (e) => e.preventDefault());

uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
});

imageInput.addEventListener("change", (e) => handleFile(e.target.files[0]));


function handleFile(file) {
    if (file && file.type.startsWith("image/")) {
        selectedFile = file;
        const reader = new FileReader();
        reader.onload = () => displayImage(reader.result);
        reader.readAsDataURL(file);
    } else {
        alert('Please upload a valid image file');
    }
}

function displayImage(imageSrc) {
    result.innerHTML = `<img src="${imageSrc}" alt="originalImage">`;
}

removeBackgroundButton.addEventListener("click", () => {
    if (selectedFile) {
        removeBackground(selectedFile);
    } else {
        alert("Please upload an image.");
    }
});


async function removeBackground(file) {
    const apikey = "fU7a3RN519ffE5AXthqKthSw";

    const formData = new FormData();
    formData.append("size", "auto");
    formData.append("image_file", file);

    result.innerHTML = "<p>Removing Background...</p>"

    try {
        const response = await fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: { "X-Api-Key": apikey },
            body: formData,
        });

        if(!response.ok) throw new error("Failed to remove background!");

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        result.innerHTML = `<img src="${imageUrl}" alt="Background Remove">`;

        const downloadBtn = document.createElement("button");
        downloadBtn.innerText = "Download Image";
        downloadBtn.classList.add("download-btn");
        downloadBtn.addEventListener("click", () => {
            const link = document.createElement("a");
            link.href = imageUrl;
            link.download = "background_removed.png";
            link.click();
        });

        result.appendChild(downloadBtn);
    }

    catch(error){
        console.error(error);
        result.innerHTML = "<p>Error removing background. Please try again!</p>";
    }
}

resetBtn.addEventListener("click", () => {
    selectedFile = null;
    result.innerHTML = "<p>no image processed yet!</p>";
    imageInput.value = "";
});