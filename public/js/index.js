
//上传文件
function uploadFile() {
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];
    const maxFileSize = 20 * 1024 * 1024; //20MB
        if(file){
        if (file.size > maxFileSize) {
            alert('文件大小超过限制,你只能上传小于' + (maxFileSize / 1024 / 1024).toFixed(2) + 'MB。');
            event.target.value = '';
            return;
        }
        var formData = new FormData();
        formData.append('file', file);
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if(!response.ok){
                    return response.json().then(json => {throw new Error(`${json.message}`)});
                }
                return response.json()}
            )
            .then(data => {
                window.location.href = 'upload-success.html';
                // 更新文件列表
                updateFileList();
            })
            .catch(error => {
                if (error.message === 'File too large') {
                    alert('文件大小超过限制');
                }
                else alert(error.message);
            })
        }
        else alert('请选择文件');
    
}
//获取文件列表

function updateFileList() {
    fetch('/api/files')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // 转换为JSON
        })

        .then(fileList => {
            const fileListElement = document.getElementById('fileList');
            // 你可以在这里将文件列表渲染到页面上
            fileList.forEach(fileName => {
                const listItem = document.createElement('li');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox'; // 设置类型为复选框
                checkbox.className = 'checked-file';
                checkbox.value = fileName;
                // 将复选框添加到 <li> 中
                listItem.appendChild(checkbox);
                listItem.className = 'file-list';

                // 设置 <li> 的文本内容为文件名，并确保文本紧跟复选框之后
                listItem.appendChild(document.createTextNode(fileName));

                // 将 <li> 添加到 <ul> 中
                document.getElementById('fileList').appendChild(listItem);
            });
        })

        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

// 下载文件
function downloadFile() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    // 获取要下载的文件名，存入数组
    const selectedFiles = Array.from(checkboxes).map(checkbox => checkbox.value);
    if (selectedFiles.length === 0) {
        alert('请选择要下载的文件');
        return;
    }
    selectedFiles.forEach((file) => {
        fetch(`/download/${file}`)
            .then(response => response.blob())
            .then(blob => {
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', file);
                document.body.appendChild(link);
                link.click();
                link.remove();

            })
            .catch(error => console.error('Error downloading file:', error));
    });

}

// 初始化文件列表
updateFileList();